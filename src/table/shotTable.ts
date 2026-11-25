// Ban danh dung chung: ban SVG + ngam + luc + diem cham + tro giup + danh/phat lai.
// Trang "Danh tu do" va man hinh tinh huong deu dung lai thanh phan nay.
import { simulate, type BallId, type Setup, type Shot, type SimResult, type Vec2 } from "../engine"
import { button, el } from "../app/dom"
import { vn } from "../format"
import { aimPreview, angleTo } from "./aim"
import { analyseShot } from "./analysis"
import { pickBall, placeBall } from "./arrange"
import { createCuePull } from "./cuePull"
import { predictCue, type CuePrediction } from "./predict"
import { POWER_DEFAULT, forceToPower, nudgePower as stepPower, powerToForce } from "./power"
import { runClock } from "./replay"
import { TableView, type Aids } from "./tableView"
import { createTipPicker } from "./tipPicker"
import { tipZoneName, type Tip } from "./tipZone"

export interface ShotTableOptions {
  balls: Setup
  /** Phan cua cu danh bi co dinh; dieu khien tuong ung bi an hoac khoa. */
  locked?: Partial<Shot>
  aids?: Partial<Aids>
  zone?: { cx: number; cy: number; r: number }
  /**
   * true (danh tu do): sau moi cu, bi nam lai cho dung va la the cua cu sau.
   * false (tinh huong): moi cu deu bat dau tu the ban dau.
   */
  continuous: boolean
  /** false: nguoi hoc khong tu danh (hinh minh hoa, bai chon dap an); nut chi hien de bo qua. */
  manualShot?: boolean
  /** Neu co: bam tren ban khong doi huong ngam ma bao diem bam cho man hinh (bai cham len bang). */
  onTablePoint?: (point: Vec2) => void
  /** Goi khi bi dung han (hoac nguoi dung bam Bo qua). */
  onDone: (result: SimResult) => void
  /**
   * Goi khi nguoi dung bam "Quay lai truoc cu nay": ban da ve dung the truoc cu vua danh.
   * Man hinh dung de hoan lai nhung gi cu do da thay doi (vi du diem cua chuoi).
   */
  onBack?: () => void
  /** false: khong cho quay lai truoc cu vua danh (Danh chuoi, de so lieu thong ke trung thuc). Mac dinh true. */
  allowBack?: boolean
  /** Goi khi ket qua cu truoc het hieu luc: nguoi dung chinh cu moi (rolling = false) hoac bi bat dau lan (true). */
  onClear: (rolling: boolean) => void
}

/** Nhung phan cua man hinh can nam canh ban khi xem tren dien thoai doc. Phan tu phai da nam trong trang. */
export interface HudParts {
  /** Dong thong bao (ket qua, huong dan): nam ngay duoi ban. */
  status?: HTMLElement
  /** Dieu khien rieng cua man hinh, dat duoi dong thong bao (vi du cac nut dap an). */
  dock?: HTMLElement[]
  /** Nut phu dat o cot ben canh ban (vi du Dat lai, Thu lai, Tiep theo). */
  side?: HTMLElement[]
}

export interface ShotTable {
  tableEl: SVGSVGElement
  /**
   * Khung chua ban, dung thay cho `tableEl` o cac man hinh choi. Tren dien thoai doc, khung
   * gom ban va moi dieu khien chinh vao vua mot man hinh (D20): canh ban la diem cham va
   * nut ngam, duoi ban la thong bao, keo co va nut Danh. Man hinh rong thi khung chi chua
   * ban, cac dieu khien o nguyen cho cu. Chi goi mot lan, sau khi `parts` da nam trong trang.
   */
  hud(parts?: HudParts): HTMLElement
  /** Dang o bo cuc dien thoai doc (xem `hud`). */
  hudActive(): boolean
  /** Ban, de man hinh ve them vet chong va dau cham bang. */
  table: TableView
  /** Cac nhom dieu khien: ngam, luc, diem cham, tro giup. */
  controlsEl: HTMLElement
  /** Hang nut Danh / Xem lai. */
  actionsEl: HTMLElement
  /** Khung "Phan tich cu vua danh"; an cho toi khi co mot cu danh xong. */
  analysisEl: HTMLElement
  /** Dong "Cu vua danh": huong, luc, diem cham cua cu gan nhat, kem nut dung lai. Con do sau khi dat lai bi. */
  lastShotEl: HTMLElement
  /** Dua ban ve the ban dau (hoac mot the moi), xoa vet. */
  reset(balls?: Setup): void
  /**
   * Bat/tat che do xep the: keo bi tren ban de dat cho moi, khong ngam va khong danh duoc.
   * Khi tat, the vua xep thanh the ban dau ("Dat lai" se ve the nay). Tra ve false neu
   * khong doi duoc (bi dang lan).
   */
  setArranging(on: boolean): boolean
  /** Danh mot cu cho san (dung cho bai chon dap an). */
  play(shot: Shot): void
  setEnabled(on: boolean): void
  destroy(): void
}

const copy = (s: Setup): Setup => JSON.parse(JSON.stringify(s))

/** Thoi gian (giay) cho ban hien the ban dau truoc khi mot cu moi bat dau, khi ban dang hien ket qua cu truoc. */
const LEAD_IN = 0.7
/** Bo cuc dien thoai: ban khong thap hon muc nay (px), va khe giua cac khoi (px, khop voi CSS). */
const HUD_MIN_TABLE = 240
const HUD_GAP = 6

export function createShotTable(options: ShotTableOptions): ShotTable {
  const locked = options.locked ?? {}
  let start0 = copy(options.balls)
  let balls = copy(start0)
  const manual = options.manualShot ?? true
  const startAngle = () => {
    const target = start0.b1 ?? start0.b2
    return locked.angleDeg ?? (target ? angleTo(start0.cue, target) : 0)
  }
  let angleDeg = startAngle()
  let tip: Tip = locked.tip ?? { x: 0, y: 0 }
  let shown: SimResult | null = null
  let stopClock: ((finish: boolean) => void) | null = null
  let enabled = true
  /** Dang xep the bang tay, va bi dang bi nam (neu co). */
  let arranging = false
  let grabbed: BallId | null = null
  const aids: Aids = { aimLine: true, ghostBall: true, tangentLine: true, predictedPath: false, ...options.aids }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const narrowPortrait = window.matchMedia("(max-width: 700px) and (orientation: portrait)")

  const table = new TableView(aimAt)
  table.setZone(options.zone ?? null)
  const angleLabel = el("span", "muted")
  const tipLabel = el("p", "muted")
  const ROLL_NOTE = "Bi cái đã lăn khi chạm nên sẽ đi quá về phía trước đường 90°."
  const SHORT_NOTE = "Với lực này bi cái chưa tới được bi mục tiêu."
  const rollNote = el("p", "note")
  rollNote.setAttribute("aria-live", "polite")
  rollNote.hidden = true
  let predictQueued = false
  /** Ket qua mo phong cua cu vua danh, de ve lai duong bi cai khi quay lai. */
  let lastResult: SimResult | null = null
  /** The va cu danh cua ket qua dang hien, de phan tich. */
  let last: { balls: Setup; shot: Shot } | null = null
  /** Thoi diem (ms) ban vua quay ve the ban dau sau khi hien ket qua mot cu; -Infinity neu chua. */
  let backAt = -Infinity
  const analysisList = el("ol", "analysis__list")
  const analysisEl = el("details", "analysis", el("summary", "", "Phân tích cú vừa đánh"), analysisList)
  analysisEl.hidden = true
  const powerLabel = el("h2")
  /** Luc dang nho (power 0..1 cua engine): lan keo co gan nhat, hoac sau khi chinh bang nut - va +. */
  let powerNow = POWER_DEFAULT
  /** Cu danh da mo phong san tu luc buong tay, cho toi luc dau co cham bi. */
  let prepared: { balls: Setup; shot: Shot; result: SimResult } | null = null
  /** Vi tri bi cai va huong danh luc bat dau ra co, de ve cay co tren ban. */
  let strokeFrom: { pos: Vec2; angleDeg: number } | null = null
  const cue = createCuePull({
    value: powerToForce(powerNow),
    onPull(value, fraction) {
      if (stopClock || !enabled) return
      powerNow = forceToPower(value)
      clearResult()
      renderAim()
      strokeFrom = { pos: balls.cue, angleDeg }
      table.setCue({ ...strokeFrom, pull: fraction })
    },
    // Co dang ra co hoac theo da: ve cay co tren ban khop voi khung keo co. Vi tri va huong
    // lay tu luc bat dau ra co, vi sau khi cham thi bi cai da chay di.
    onStroke(position, phase) {
      // Theo da xong la cay co tren ban mo di ngay tai cho: khong ve canh co lui ve vi tri
      // nghi (chi khung keo co moi can ve cho cu de keo cu sau).
      if (phase === "hold" || phase === "settle" || phase === "done") return table.fadeCue()
      strokeFrom ??= { pos: balls.cue, angleDeg }
      table.setCue({ ...strokeFrom, pull: position })
    },
    // Vua buong tay: mo phong san cu danh trong luc co con dang lao toi.
    onRelease(value) {
      prepared = null
      if (stopClock || !enabled) return
      powerNow = forceToPower(value)
      if (shown) clearResult()
      const shot = currentShot()
      prepared = { balls: copy(balls), shot, result: simulate(balls, shot) }
    },
    onImpact() {
      const ready = prepared
      prepared = null
      if (!ready || stopClock || !enabled) return
      // Dau co vua cham bi: bi phai chay ngay, khong giu nhip cho "ve the ban dau".
      backAt = -Infinity
      last = { balls: ready.balls, shot: ready.shot }
      renderLast()
      start(ready.result)
    },
    onRest() {
      strokeFrom = null
      table.setCue(null)
    },
    onCancel(restored) {
      powerNow = forceToPower(restored)
      renderAim()
    },
  })
  const picker = createTipPicker((next) => {
    tip = next
    clearResult()
    renderAim()
  })
  picker.set(tip)
  const shootBtn = button("Đánh", "btn--primary btn--grow", () => (stopClock ? stopClock(true) : shoot()))
  const replayBtn = button("Xem lại", "", () => shown && start(shown, true))
  const lastText = el("span", "")
  const backBtn = button("Quay lại trước cú này", "", back)
  const lastShotEl = el("div", "last-shot", lastText, backBtn)
  lastShotEl.hidden = true
  backBtn.hidden = !manual || options.allowBack === false

  /** Ghi lai cu vua danh de xem lai: dong chu, vong tren mat bi cai, vach tren khung keo co. */
  function renderLast() {
    if (!last) return
    const { shot } = last
    lastText.textContent = `Cú vừa đánh: hướng ${vn(shot.angleDeg)}°, lực ${vn(powerToForce(shot.power))}/100, điểm chạm ${tipZoneName(shot.tip)}.`
    lastShotEl.hidden = false
    picker.setGhost(shot.tip)
    cue.setMark(locked.power === undefined ? powerToForce(shot.power) : null)
  }

  /**
   * Quay ve dung thoi diem truoc cu vua danh: bi ve cho cu, huong, luc va diem cham nhu
   * luc do (phan nao bi khoa thi giu nguyen). Duong bi cai cua cu do duoc giu lai o dang
   * vet mo, va khung phan tich van mo, de nguoi hoc so sanh trong luc chinh them mot chut
   * roi danh lai.
   */
  function back() {
    if (!last || stopClock || !enabled || options.allowBack === false) return
    const { shot } = last
    shown = null
    backAt = performance.now()
    balls = copy(last.balls)
    table.setReplay(null)
    table.setBalls(balls)
    table.setGhosts(lastResult ? [null, lastResult.paths.cue] : [])
    if (locked.angleDeg === undefined) angleDeg = shot.angleDeg
    if (locked.power === undefined) {
      powerNow = shot.power
      cue.setValue(powerToForce(powerNow))
    }
    if (!locked.tip) {
      tip = shot.tip
      picker.set(tip)
    }
    renderButtons()
    renderAim()
    if (options.onBack) options.onBack()
    else options.onClear(false)
  }

  const currentShot = (): Shot => ({
    angleDeg,
    power: locked.power ?? powerNow,
    tip,
  })

  function renderLabels() {
    angleLabel.textContent = `Hướng ${vn(angleDeg)}°`
    tipLabel.textContent = `Điểm chạm: ${tipZoneName(tip)}${locked.tip ? " (cố định)" : ""}`
    powerLabel.textContent = `Lực: ${vn(powerToForce(powerNow))}/100`
  }

  function renderAim() {
    const preview = shown || arranging ? null : aimPreview(balls, angleDeg)
    table.setAim(preview, aids, balls.cue)
    // Huong cua cu truoc chi co nghia khi bi cai dang o dung cho cu do xuat phat.
    const same = last && Math.hypot(last.balls.cue[0] - balls.cue[0], last.balls.cue[1] - balls.cue[1]) < 0.01
    const differs = last && Math.abs(last.shot.angleDeg - angleDeg) > 0.05
    table.setLastAim(preview && same && differs ? { from: balls.cue, to: aimPreview(balls, last!.shot.angleDeg).end } : null)
    renderLabels()
    // Du doan can mot lan mo phong: gop cac thay doi lien tiep vao mot khung hinh.
    if (!preview?.ghost || !(aids.predictedPath || aids.tangentLine)) return renderPrediction(null, false)
    if (predictQueued) return
    predictQueued = true
    requestAnimationFrame(() => {
      predictQueued = false
      if (shown || stopClock) return renderPrediction(null, false)
      renderPrediction(predictCue(balls, currentShot()), true)
    })
  }

  /** `aimed`: duong ngam dang chi vao mot bi (nen thieu du doan nghia la luc khong du toi noi). */
  function renderPrediction(prediction: CuePrediction | null, aimed: boolean) {
    table.setPredicted(prediction && aids.predictedPath ? prediction.path : null)
    const text = prediction ? (prediction.rolling ? ROLL_NOTE : "") : aimed ? SHORT_NOTE : ""
    rollNote.textContent = text
    rollNote.hidden = !text
  }

  function renderButtons() {
    const playing = stopClock !== null
    shootBtn.textContent = playing ? "Bỏ qua" : "Đánh"
    shootBtn.disabled = !playing && (!enabled || arranging)
    shootBtn.hidden = !manual && !playing
    replayBtn.disabled = playing || !shown
    backBtn.disabled = playing || !enabled
    table.interactive = !playing && (options.onTablePoint || arranging ? true : enabled && locked.angleDeg === undefined)
    cue.setEnabled(!playing && enabled && !arranging)
  }

  /** Nguoi dung bat dau chinh cu danh moi: bo vet cua cu truoc. */
  function clearResult() {
    if (!shown || stopClock) return
    shown = null
    backAt = performance.now()
    analysisEl.hidden = true
    table.setReplay(null)
    table.setBalls(balls)
    options.onClear(false)
    renderButtons()
    renderAim()
  }

  function aimAt(point: Vec2, first: boolean) {
    if (arranging) return drag(point, first)
    if (options.onTablePoint) return options.onTablePoint(point)
    if (Math.hypot(point[0] - balls.cue[0], point[1] - balls.cue[1]) < 0.5) return
    clearResult()
    angleDeg = angleTo(balls.cue, point)
    renderAim()
  }

  /** Che do xep the: lan cham xuong chon bi gan nhat, re tay thi bi do di theo. */
  function drag(point: Vec2, first: boolean) {
    if (first) grabbed = pickBall(balls, point)
    if (!grabbed) return
    const next = placeBall(balls, grabbed, point)
    if (!next) return
    balls[grabbed] = next
    table.setBalls(balls)
  }

  function setArranging(on: boolean) {
    if (stopClock) return false
    if (on === arranging) return true
    arranging = on
    grabbed = null
    table.el.classList.toggle("table--arranging", on)
    if (on) {
      // The sap doi nen ket qua, vet va "cu vua danh" cua the cu khong con nghia.
      shown = null
      last = null
      lastResult = null
      lastShotEl.hidden = true
      analysisEl.hidden = true
      picker.setGhost(null)
      cue.setMark(null)
      table.setReplay(null)
      table.setGhosts([])
      table.setBalls(balls)
    } else {
      start0 = copy(balls)
      angleDeg = startAngle()
    }
    renderButtons()
    renderAim()
    return true
  }

  function nudge(delta: number) {
    if (stopClock || !enabled || arranging) return
    clearResult()
    angleDeg = (((angleDeg + delta) % 360) + 360) % 360
    renderAim()
  }

  function nudgePower(steps: number) {
    if (stopClock || !enabled || arranging) return
    powerNow = stepPower(powerNow, steps)
    cue.setValue(powerToForce(powerNow))
    clearResult()
    renderAim()
  }

  function fresh(shot: Shot) {
    if (shown) clearResult()
    last = { balls: copy(balls), shot }
    renderLast()
    start(simulate(balls, shot))
  }

  function shoot() {
    if (stopClock || !enabled || arranging) return
    fresh(currentShot())
  }

  /** `replay`: chi xem lai cu vua danh, khong tinh la mot cu moi. */
  function start(result: SimResult, replay = false) {
    shown = result
    table.setReplay(result)
    renderAim()
    if (!replay) {
      options.onClear(true)
      lastResult = result
      table.setGhosts([])
    }
    analysisEl.hidden = true
    const done = () => {
      stopClock = null
      if (options.continuous) balls = copy(result.final)
      if (last) {
        analysisList.replaceChildren(...analyseShot(last.balls, last.shot, result).map((line) => el("li", "", line)))
        analysisEl.hidden = false
      }
      renderButtons()
      if (!replay) options.onDone(result)
    }
    if (reducedMotion.matches) {
      table.setTime(result.duration)
      done()
      return
    }
    // Neu ban vua moi quay ve the ban dau (nguoi xem chua kip nhin), giu the do them cho du
    // LEAD_IN giay roi moi cho bi chay. Che do noi tiep (bi nam lai cho dung) khong can.
    if (replay) backAt = performance.now()
    const seen = (performance.now() - backAt) / 1000
    const lead = options.continuous ? 0 : Math.max(0, LEAD_IN - seen)
    stopClock = runClock(result.duration + lead, (t) => table.setTime(Math.max(0, t - lead)), done)
    renderButtons()
  }

  function reset(next?: Setup) {
    stopClock?.(false)
    stopClock = null
    if (shown) backAt = performance.now()
    shown = null
    if (next) start0 = copy(next)
    balls = copy(start0)
    analysisEl.hidden = true
    table.setGhosts([])
    angleDeg = startAngle()
    table.setReplay(null)
    table.setBalls(balls)
    renderButtons()
    renderAim()
  }

  function aidCheck(label: string, key: keyof Aids) {
    const input = el("input")
    input.type = "checkbox"
    input.checked = aids[key]
    input.addEventListener("change", () => {
      aids[key] = input.checked
      renderAim()
    })
    return el("label", "check", input, label)
  }

  const applyOrientation = () => table.setPortrait(narrowPortrait.matches)
  narrowPortrait.addEventListener("change", applyOrientation)
  applyOrientation()

  const aimFree = locked.angleDeg === undefined
  const nudgeBtns = aimFree
    ? [
        button("−1°", "", () => nudge(-1)),
        button("−0,1°", "", () => nudge(-0.1)),
        button("+0,1°", "", () => nudge(0.1)),
        button("+1°", "", () => nudge(1)),
      ]
    : []
  const aimGroup = aimFree
    ? el("div", "stack", el("div", "row", el("h2", "", "Ngắm"), angleLabel), el("div", "row", ...nudgeBtns))
    : el("p", "muted", "Hướng đánh được giữ cố định.")

  const powerFree = locked.power === undefined
  const minusBtn = button("−", "", () => nudgePower(-1))
  const plusBtn = button("+", "", () => nudgePower(1))
  const powerGroup =
    locked.power === undefined
      ? el(
          "div",
          "stack",
          powerLabel,
          cue.el,
          el("p", "muted", "Nắm đầu cơ gần viên bi, kéo sang trái rồi buông tay để đánh. Con số là phần trăm quãng kéo; kéo hết cỡ là 100. Độ mạnh của cơ chỉnh được trong Cài đặt."),
          el(
            "div",
            "row",
            minusBtn,
            plusBtn,
            el("span", "muted", "Chỉnh từng chút (2,4% lực), rồi bấm Đánh")
          )
        )
      : el("p", "muted", "Lực đánh được giữ cố định.")

  const tipSide = el("div", "stack", tipLabel)
  let centreBtn: HTMLButtonElement | null = null
  if (locked.tip) {
    picker.el.classList.add("tip-picker--locked")
    picker.el.setAttribute("tabindex", "-1")
  } else {
    centreBtn = button("Về giữa tâm", "", () => {
      tip = { x: 0, y: 0 }
      picker.set(tip)
      clearResult()
      renderAim()
    })
    tipSide.append(centreBtn)
  }

  const tipGroup = el("div", "stack", el("h2", "", "Điểm chạm"), el("div", "row", picker.el, tipSide))
  const controlsEl = el(
    "div",
    "stack",
    aimGroup,
    powerGroup,
    tipGroup,
    el(
      "div",
      "",
      el("h2", "", "Trợ giúp ngắm"),
      aidCheck("Đường ngắm kéo dài", "aimLine"),
      aidCheck("Bi ma", "ghostBall"),
      aidCheck("Đường 90° (khi bi cái còn trượt)", "tangentLine"),
      aidCheck("Đường dự đoán (bi cái sẽ đi thật)", "predictedPath"),
      rollNote
    )
  )

  table.setBalls(balls)
  renderButtons()
  renderAim()

  const actionsEl = el("div", "row", shootBtn, replayBtn)

  // ---------- Bo cuc dien thoai doc: ban va dieu khien chinh trong mot man hinh ----------
  let stage: HTMLElement | null = null
  let hudOn = false
  let stopHud = () => {}
  /** Cac phan tu da doi cho, kem dau giu cho de tra ve dung vi tri cu. */
  const homes: { node: Element; mark: Comment }[] = []
  const moveTo = (target: Element, nodes: (Element | null | undefined)[], front = false) => {
    const moved: Element[] = []
    for (const node of nodes) {
      if (!node?.parentNode) continue
      const mark = document.createComment("")
      node.replaceWith(mark)
      homes.push({ node, mark })
      moved.push(node)
    }
    if (front) target.prepend(...moved)
    else target.append(...moved)
  }
  const moveBack = () => {
    for (const { node, mark } of homes.splice(0).reverse()) mark.replaceWith(node)
  }

  function hud(parts: HudParts = {}): HTMLElement {
    if (stage) return stage
    const tipBox = el("div", "hud-tip")
    const aimBox = el("div", "hud-aim")
    const sideBox = el("div", "hud-more")
    const side = el("div", "stage__side", tipBox, aimBox, sideBox)
    const statusBox = el("div", "hud-status")
    const extraBox = el("div", "hud-extra")
    const cueBox = el("div", "hud-cue")
    const actionBox = el("div", "hud-actions")
    const dock = el("div", "stage__dock", statusBox, extraBox, cueBox, actionBox)
    const node = el("div", "stage", el("div", "stage__main", table.el, side), dock)
    stage = node

    // Chieu cao ban = phan con lai cua man hinh sau khi tru phan phia tren khung va phan dieu khien duoi ban.
    const fit = () => {
      if (!hudOn || !node.isConnected) return
      const screenH = window.visualViewport?.height ?? window.innerHeight
      const top = node.getBoundingClientRect().top + window.scrollY
      const tableH = Math.max(HUD_MIN_TABLE, Math.floor(screenH - top - dock.offsetHeight - HUD_GAP * 2))
      node.style.setProperty("--table-h", `${tableH}px`)
    }
    const apply = () => {
      moveBack()
      hudOn = narrowPortrait.matches
      node.classList.toggle("stage--hud", hudOn)
      // Phan con lai cua ba nhom dieu khien (tieu de, loi chi dan) khong con gi de dieu khien.
      if (aimFree) aimGroup.hidden = hudOn
      if (powerFree) powerGroup.hidden = hudOn
      tipGroup.hidden = hudOn
      if (!hudOn) return
      // Bai nguoi hoc khong tu danh (chon dap an, cham bang): khong dua dieu khien cu danh ra canh ban.
      if (manual) moveTo(tipBox, [picker.el, tipLabel, centreBtn])
      if (manual && aimFree) moveTo(aimBox, [angleLabel, ...nudgeBtns])
      moveTo(sideBox, parts.side ?? [])
      moveTo(statusBox, [parts.status])
      moveTo(extraBox, parts.dock ?? [])
      if (manual && powerFree) {
        moveTo(cueBox, [powerLabel, cue.el])
        moveTo(actionsEl, [minusBtn, plusBtn], true)
      }
      moveTo(actionBox, [actionsEl])
      fit()
    }
    narrowPortrait.addEventListener("change", apply)
    window.addEventListener("resize", fit)
    window.visualViewport?.addEventListener("resize", fit)
    const watcher = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit)
    watcher?.observe(dock)
    watcher?.observe(node)
    stopHud = () => {
      narrowPortrait.removeEventListener("change", apply)
      window.removeEventListener("resize", fit)
      window.visualViewport?.removeEventListener("resize", fit)
      watcher?.disconnect()
    }
    apply()
    return node
  }

  return {
    tableEl: table.el,
    table,
    hud,
    hudActive: () => hudOn,
    controlsEl,
    actionsEl,
    analysisEl,
    lastShotEl,
    reset,
    setArranging,
    play(shot) {
      if (stopClock) return
      fresh(shot)
    },
    setEnabled(on) {
      enabled = on
      renderButtons()
    },
    destroy() {
      stopHud()
      cue.destroy()
      stopClock?.(false)
      stopClock = null
      narrowPortrait.removeEventListener("change", applyOrientation)
    },
  }
}
