// Dieu khien luc bang cach keo co: nam dau co gan vien bi, keo sang trai (lui co) cang
// xa thi luc cang manh, buong tay la danh. Thay cho thanh truot luc.
// Gia tri la LUC HIEN THI 0..100 (xem power.ts): bang dung phan tram quang keo, keo het
// hanh trinh la 100.
// Sau khi buong tay, co chuyen dong theo mo hinh trong stroke.ts: tang toc toi vien
// bi, cham bi (luc do cu danh moi bat dau), theo da roi ve vi tri nghi.
import { el } from "../app/dom"
import { vn } from "../format"
import { FORCE_MAX, forceToPower } from "./power"
import { planStroke, strokeAt, type StrokePhase } from "./stroke"

/** Keo it hon chung nay (phan cua hanh trinh) roi buong thi coi nhu huy, khong danh. */
const CANCEL_BELOW = 0.015
/** Hanh trinh keo, tinh theo phan be rong cua khung. */
const TRAVEL = 0.78
/** Keo qua het hanh trinh thi co con nhuc nhich them toi da chung nay (cam giac cang tay), luc van la 100. */
const OVERPULL = 0.05

export interface CuePull {
  el: HTMLElement
  /** Dat lai muc luc dang nho (khong danh). */
  setValue(value: number): void
  /** Vach danh dau luc cua cu vua danh tren hanh trinh keo (null de an). */
  setMark(value: number | null): void
  setEnabled(on: boolean): void
  destroy(): void
}

export interface CuePullOptions {
  value: number
  /** Dang keo: goi lien tuc voi nac luc hien tai va do lui cua co (phan hanh trinh, 0..1). */
  onPull(value: number, fraction: number): void
  /**
   * Co dang ra co hoac theo da: goi moi khung hinh voi vi tri dau co (duong = con lui
   * sau vien bi, am = da qua vi tri vien bi), de ve cay co tren ban cho khop.
   */
  onStroke(position: number, phase: StrokePhase): void
  /**
   * Vua buong tay, co bat dau lao toi: day la luc de tinh truoc cu danh (viec nang), de
   * luc cham bi khong bi khung hinh nao khung lai.
   */
  onRelease(value: number): void
  /** Dau co vua cham bi: bi bat dau chay. */
  onImpact(value: number): void
  /** Co da ve vi tri nghi (sau khi danh hoac sau khi huy). */
  onRest(): void
  /** Buong tay khi gan nhu chua keo, hoac thao tac bi ngat: khong danh, luc ve gia tri truoc khi keo. */
  onCancel(restored: number): void
}

/** Trong luc keo, con so nhay theo buoc nay cho de doc. */
const FORCE_STEP = 0.5
const snap = (value: number) => Math.round(value / FORCE_STEP) * FORCE_STEP
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const toValue = (fraction: number) => snap(FORCE_MAX * fraction)
const toFraction = (value: number) => value / FORCE_MAX

export function createCuePull(options: CuePullOptions): CuePull {
  const stick = el("div", "cue-pull__stick")
  const fill = el("div", "cue-pull__fill")
  const ball = el("div", "cue-pull__ball")
  const mark = el("div", "cue-pull__mark")
  mark.hidden = true
  const node = el("div", "cue-pull", fill, mark, stick, ball)
  node.tabIndex = 0
  node.setAttribute("role", "slider")
  node.setAttribute("aria-label", "Lực đánh. Kéo cơ sang trái rồi buông để đánh. Bàn phím: mũi tên trái phải để chỉnh, Enter để đánh.")
  node.setAttribute("aria-valuemin", "0")
  node.setAttribute("aria-valuemax", String(FORCE_MAX))
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

  let value = options.value
  let enabled = true
  let drag: { x: number; fraction: number; before: number } | null = null
  let raf = 0
  /** Dang ra co / theo da: khong nhan thao tac moi. */
  let busy = false
  /** Ket thuc ngay cu ra co dang chay (dung khi roi man hinh). */
  let cancelStroke: (() => void) | null = null

  /** Ve dau co o vi tri `position` (phan hanh trinh; am = da qua cho vien bi). */
  function draw(position: number) {
    const travel = node.clientWidth * TRAVEL
    stick.style.transform = `translateX(${-position * travel}px)`
    fill.style.width = `${Math.max(0, position) * travel}px`
  }

  function announce() {
    node.setAttribute("aria-valuenow", String(Math.round(value * 10) / 10))
    node.setAttribute("aria-valuetext", `${vn(value)} trên 100`)
  }

  /** Vien bi trong khung bi day di luc cham, roi hien lai khi co ve vi tri nghi. */
  function knockBall(power: number) {
    ball.style.transition = `transform ${Math.round(260 - 150 * power)}ms linear, opacity 160ms linear 60ms`
    ball.style.transform = "translateX(90px)"
    ball.style.opacity = "0"
  }

  function restoreBall() {
    ball.style.transition = "opacity 180ms linear"
    ball.style.transform = ""
    ball.style.opacity = ""
  }

  /** Ra co tu do lui `fraction` voi nac luc `strike`. */
  function strikeFrom(fraction: number, strike: number) {
    const power = forceToPower(strike)
    options.onRelease(strike)
    if (reducedMotion.matches) {
      draw(0)
      options.onImpact(strike)
      options.onRest()
      return
    }
    const plan = planStroke(fraction, power)
    // Thoi gian tinh theo dong ho that tu luc buong tay, khong theo khung hinh dau tien.
    const start = performance.now()
    let hit = false
    let finished = false
    node.classList.add("cue-pull--busy")

    const impact = () => {
      if (hit) return
      hit = true
      knockBall(power)
      // Rung nhe tren dien thoai, manh hon voi cu manh hon. Trinh duyet khong ho tro thi bo qua.
      navigator.vibrate?.(Math.round(8 + 22 * fraction))
      options.onImpact(strike)
    }
    const finish = () => {
      if (finished) return
      finished = true
      impact()
      cancelAnimationFrame(raf)
      window.clearTimeout(impactTimer)
      window.clearTimeout(finishTimer)
      raf = 0
      busy = false
      draw(0)
      node.classList.remove("cue-pull--busy")
      // Trong luc ra co khung khong bi lam mo; gio moi ap trang thai khoa (bi dang lan).
      node.classList.toggle("cue-pull--disabled", !enabled)
      restoreBall()
      options.onRest()
    }
    // Du phong: neu trinh duyet tam ngung ve khung hinh (tab bi an), cu danh van phai no
    // dung gio va khung keo co khong duoc ket o trang thai dang ra co.
    const impactTimer = window.setTimeout(impact, plan.forward * 1000 + 120)
    const finishTimer = window.setTimeout(finish, plan.total * 1000 + 300)
    // Roi man hinh giua chung: don dep ma khong danh.
    cancelStroke = () => {
      hit = true
      finish()
    }

    const frame = () => {
      if (finished) return
      const { x, phase } = strokeAt(plan, (performance.now() - start) / 1000)
      draw(x)
      options.onStroke(x, phase)
      if (phase !== "forward") impact()
      if (phase === "done") return finish()
      raf = requestAnimationFrame(frame)
    }
    busy = true
    raf = requestAnimationFrame(frame)
  }

  node.addEventListener("pointerdown", (e) => {
    if (!enabled || busy) return
    drag = { x: e.clientX, fraction: 0, before: value }
    try {
      node.setPointerCapture(e.pointerId)
    } catch {
      // Con tro khong con hoat dong (hiem): van keo duoc trong pham vi khung.
    }
    node.classList.add("cue-pull--dragging")
  })

  node.addEventListener("pointermove", (e) => {
    if (!drag) return
    // Keo sang trai la lui co. Tinh theo quang keo ke tu cho dat tay.
    const raw = Math.max(0, (drag.x - e.clientX) / (node.clientWidth * TRAVEL))
    const fraction = Math.min(1, raw)
    // Keo qua het hanh trinh: co nhich them mot chut roi cung lai, nhu tay da cang het.
    const shown = raw <= 1 ? raw : 1 + OVERPULL * (1 - 1 / (1 + (raw - 1) * 4))
    draw(shown)
    if (fraction === drag.fraction) return
    drag.fraction = fraction
    if (fraction >= CANCEL_BELOW) {
      value = toValue(fraction)
      announce()
      options.onPull(value, shown)
    } else {
      options.onPull(drag.before, shown)
    }
  })

  function release(cancelled: boolean) {
    if (!drag) return
    const { fraction, before } = drag
    drag = null
    node.classList.remove("cue-pull--dragging")
    if (cancelled || fraction < CANCEL_BELOW) {
      value = before
      announce()
      draw(0)
      options.onCancel(before)
      options.onRest()
      return
    }
    value = toValue(fraction)
    announce()
    strikeFrom(fraction, value)
  }

  node.addEventListener("pointerup", () => release(false))
  node.addEventListener("pointercancel", () => release(true))

  node.addEventListener("keydown", (e) => {
    if (!enabled || busy || drag) return
    const step = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0
    if (step) {
      e.preventDefault()
      value = clamp(value + step, 1, FORCE_MAX)
      announce()
      options.onCancel(value)
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      strikeFrom(toFraction(value), value)
    }
  })

  announce()
  return {
    el: node,
    setMark(next) {
      mark.hidden = next === null
      // Dau co o do lui f nam cach mep phai: 45 px (vien bi) + f * hanh trinh.
      if (next !== null) mark.style.right = `calc(45px + ${toFraction(clamp(next, 0, FORCE_MAX)) * TRAVEL * 100}%)`
    },
    setValue(next) {
      value = clamp(next, 0, FORCE_MAX)
      announce()
    },
    setEnabled(on) {
      enabled = on
      node.classList.toggle("cue-pull--disabled", !on && !busy)
      node.setAttribute("aria-disabled", String(!on))
      if (!on && drag) release(true)
    },
    destroy() {
      cancelStroke?.()
    },
  }
}
