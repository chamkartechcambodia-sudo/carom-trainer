// Man hinh chay mot tinh huong: loi giao viec, ban, so lan thu, ket qua, loi giai
// thich, nut thu lai va tiep theo. Moi loai muc tieu co mot kieu tuong tac:
//   danh (score, stopInZone, gather) | chon dap an, co the kem cu danh, vet chong
//   hoac cu mau de doc nguoc (choice) | cham len bang (markCushion).
import { button, el, type Screen } from "../app/dom"
import { simulate, type Shot, type SimResult, type Vec2 } from "../engine"
import { slideOnCushion, snapToCushion } from "../table/aim"
import { fillForce } from "../table/power"
import { createShotTable } from "../table/shotTable"
import type { Aids } from "../table/tableView"
import { judge } from "./judge"
import type { Attempt, Scenario, Verdict } from "./types"

export interface RunnerOptions {
  /** Tro giup ngam mac dinh (tu cai dat); tinh huong co the ghi de. */
  aids?: Partial<Aids>
  /** Goi moi khi mot lan thu duoc cham. */
  onVerdict?: (scenario: Scenario, verdict: Verdict) => void
  /** Phan tu dat tren tieu de, vi du duong dan quay lai. */
  back?: () => HTMLElement
}

export interface ScenarioNav extends RunnerOptions {
  /** Vi du "Tình huống 2/3". */
  position: string
  nextLabel: string
  onNext: () => void
}

const NO_AIDS: Aids = { aimLine: false, ghostBall: false, tangentLine: false, predictedPath: false }
const MARK_STEP = 0.25

export function createScenarioScreen(scenario: Scenario, nav: ScenarioNav): Screen {
  const goal = scenario.goal
  const isChoice = goal.type === "choice"
  const isMark = goal.type === "markCushion"
  const manual = !isChoice && !isMark
  let attempts = 0
  /** Viec can lam khi cu danh do app tu danh ket thuc (thay cho viec cham mot cu danh cua nguoi hoc). */
  let afterAutoShot: ((result: SimResult) => void) | null = null

  const status = el("p", "status")
  status.setAttribute("aria-live", "polite")
  const attemptsLabel = el("p", "muted")
  const explain = el("p", "note", fillForce(scenario.explain))
  const hint = el("p", "note", fillForce(scenario.hint ?? ""))
  const hintBtn = button("Gợi ý", "", () => {
    hint.hidden = false
    hintBtn.hidden = true
  })
  const retryBtn = button("Thử lại", "", retry)
  const nextBtn = button(nav.nextLabel, "", nav.onNext)
  const optionButtons: HTMLButtonElement[] = []

  const exhausted = () => scenario.maxAttempts !== undefined && attempts >= scenario.maxAttempts

  function renderAttempts() {
    attemptsLabel.textContent = scenario.maxAttempts
      ? `Lần thử: ${attempts}/${scenario.maxAttempts}`
      : `Lần thử: ${attempts}`
  }

  function clearVerdict(rolling = false) {
    status.textContent = rolling ? "Bi đang lăn…" : ""
    status.className = "status"
  }

  /** Loi ket qua cua lan cham gan nhat, de hien lai sau khi xem thu mot cach khac. */
  let verdictText = ""

  function showVerdict(verdict: Verdict, peeked = "") {
    const out = !verdict.passed && exhausted()
    verdictText = out ? `${verdict.detail} Hết lượt thử.` : verdict.detail
    status.textContent = peeked ? `${verdictText} Vừa xem thử: ${peeked}.` : verdictText
    status.className = `status status--${verdict.passed ? "ok" : "warn"}`
    explain.hidden = false
    retryBtn.textContent = out ? "Thử lại từ đầu" : "Thử lại"
    shots.setEnabled(!out && manual)
  }

  function record(attempt: Attempt): Verdict {
    attempts++
    renderAttempts()
    const verdict = judge(scenario, attempt)
    showVerdict(verdict)
    nav.onVerdict?.(scenario, verdict)
    return verdict
  }

  // Huong hien san tren ban khi nguoi hoc khong tu ngam.
  const fixedAngle =
    goal.type === "choice"
      ? (goal.shots?.[0].angleDeg ?? goal.replay?.angleDeg)
      : goal.type === "markCushion"
        ? goal.shot?.angleDeg
        : undefined

  const shots = createShotTable({
    balls: scenario.balls,
    locked: fixedAngle !== undefined ? { angleDeg: fixedAngle } : scenario.locked,
    aids: manual ? { ...nav.aids, ...scenario.aids } : NO_AIDS,
    manualShot: manual,
    zone: goal.type === "stopInZone" ? goal.zone : undefined,
    continuous: false,
    onTablePoint: isMark ? (point) => placeMark(snapToCushion(point)) : undefined,
    onClear: clearVerdict,
    onBack: () => {
      status.textContent = "Đã quay lại trước cú vừa đánh. Đường nét đứt là đường bi cái lần trước; chỉnh rồi đánh lại."
      status.className = "status"
    },
    onDone: (result) => {
      if (!afterAutoShot) return void record({ result })
      const run = afterAutoShot
      afterAutoShot = null
      run(result)
    },
  })
  if (!manual) shots.setEnabled(false)

  /** App tu danh mot cu tu the ban dau; `then` chay khi bi dung. */
  function autoShot(shot: Shot, then: (result: SimResult) => void) {
    afterAutoShot = then
    shots.reset()
    shots.play(shot)
  }

  const body: HTMLElement[] = []

  // ---------- Chon dap an ----------
  const viewed = new Set<number>()
  const ghosts: (Vec2[] | null)[] = []
  let answered = false

  function setOptions() {
    if (goal.type !== "choice") return
    const needView = goal.overlay && viewed.size < goal.options.length
    // Da tra loi dung ma bai co cu danh: van bam duoc de xem cac cach khac, khong tinh lan thu.
    const canPeek = answered && !!goal.shots
    for (const b of optionButtons) b.disabled = !canPeek && (answered || !!needView || exhausted())
  }

  function markOption(choice: number, passed: boolean) {
    optionButtons[choice].classList.add(passed ? "option--right" : "option--wrong")
    answered = passed
    setOptions()
  }

  function choose(index: number) {
    if (goal.type !== "choice") return
    for (const b of optionButtons) b.disabled = true
    const shot = goal.shots?.[index]
    if (answered && shot) {
      // Xem thu mot cach khac sau khi da dung: chi phat cu danh, khong tinh lan thu.
      return autoShot(shot, () => {
        showVerdict({ passed: true, scored: false, detail: "Đúng rồi!" }, goal.options[index])
        setOptions()
      })
    }
    if (!shot) return markOption(index, record({ choice: index }).passed)
    // Danh cu ung voi lua chon de nguoi hoc thay ket qua; cham khi bi dung.
    autoShot(shot, (result) => markOption(index, record({ choice: index, result }).passed))
  }

  if (goal.type === "choice") {
    if (goal.replay) {
      const { angleDeg, power, tips } = goal.replay
      const play = () => autoShot({ angleDeg, power, tip: tips[goal.answer] }, () => clearVerdict())
      body.push(el("div", "row", button("Xem cú đánh", "btn--primary btn--grow", play)))
    }
    if (goal.overlay && goal.shots) {
      const withoutRed = { cue: scenario.balls.cue, b1: scenario.balls.b1 }
      const allShots = goal.shots
      const previews = allShots.map((shot, i) => {
        const b = button("", "", () => {
          // Ve ngay duong bi cai khi chua co bi do, giu lai de chong len nhau.
          ghosts[i] = simulate(withoutRed, shot).paths.cue
          shots.table.setGhosts(allShots.map((_, k) => ghosts[k] ?? null))
          viewed.add(i)
          setOptions()
        })
        b.append(el("span", `swatch swatch--${i + 1}`), `Xem đường: ${goal.options[i]}`)
        return b
      })
      body.push(el("div", "stack", el("h2", "", "1. Xem đủ ba đường"), ...previews), el("h2", "", "2. Đường nào ghi điểm?"))
    }
    goal.options.forEach((label, i) => optionButtons.push(button(label, "", () => choose(i))))
    body.push(el("div", goal.options.length === 9 ? "grid9" : "stack", ...optionButtons))
    body.push(shots.actionsEl)
    setOptions()
  }

  // ---------- Cham len bang ----------
  let mark: Vec2 | null = null
  let marked = false
  const confirmBtn = button("Chốt điểm chạm", "btn--primary btn--grow", confirmMark)

  function renderMark() {
    confirmBtn.disabled = !mark || marked
    const marks: { pos: Vec2; kind: "guess" | "target" }[] = mark ? [{ pos: mark, kind: "guess" }] : []
    if (marked && goal.type === "markCushion") marks.push({ pos: goal.target, kind: "target" })
    shots.table.setMarks(marks)
  }

  function placeMark(point: Vec2) {
    if (marked) return
    mark = point
    renderMark()
  }

  function confirmMark() {
    if (goal.type !== "markCushion" || !mark || marked) return
    marked = true
    renderMark()
    const verdict = record({ mark })
    // Danh cu mau de nguoi hoc thay bi cai thuc su cham bang o dau; giu nguyen ket qua cham.
    if (goal.shot) autoShot(goal.shot, () => showVerdict(verdict))
  }

  if (isMark) {
    const nudge = (delta: number) => mark && placeMark(slideOnCushion(mark, delta))
    body.push(
      el("p", "muted", "Bấm lên băng để đặt dấu (vòng trắng). Dùng hai nút để nhích dấu từng chút."),
      el(
        "div",
        "row",
        button("◀ Nhích", "", () => nudge(-MARK_STEP)),
        button("Nhích ▶", "", () => nudge(MARK_STEP)),
        confirmBtn
      ),
      shots.actionsEl
    )
    renderMark()
  }

  if (manual) body.push(shots.actionsEl, shots.controlsEl)

  function retry() {
    if (exhausted()) attempts = 0
    afterAutoShot = null
    answered = false
    marked = false
    mark = null
    shots.setEnabled(manual)
    shots.reset()
    clearVerdict()
    renderAttempts()
    retryBtn.textContent = "Thử lại"
    for (const b of optionButtons) b.classList.remove("option--right", "option--wrong")
    setOptions()
    if (isMark) renderMark()
  }

  explain.hidden = true
  hint.hidden = true
  hintBtn.hidden = !scenario.hint
  renderAttempts()

  const panel = el(
    "div",
    "card stack",
    el("div", "row", attemptsLabel, hintBtn),
    hint,
    status,
    explain,
    shots.lastShotEl,
    shots.analysisEl,
    ...body,
    el("div", "row", retryBtn, nextBtn)
  )

  const page = el(
    "main",
    "page",
    // Loi giao viec nam tren ban de man hinh doc van thay no truoc khi cuon.
    el(
      "header",
      "page__header",
      ...(nav.back ? [nav.back()] : []),
      el("p", "muted", nav.position),
      el("h1", "", scenario.title),
      el("p", "", fillForce(scenario.prompt))
    ),
    el("div", "play", el("div", "", shots.tableEl), panel)
  )
  return { el: page, destroy: shots.destroy }
}

/** Chay lan luot mot danh sach tinh huong. */
export function createScenarioRunner(scenarios: Scenario[], options: RunnerOptions = {}): Screen {
  const host = el("div")
  let current: Screen | null = null
  const show = (index: number) => {
    current?.destroy()
    const last = index === scenarios.length - 1
    current = createScenarioScreen(scenarios[index], {
      ...options,
      position: `Tình huống ${index + 1}/${scenarios.length}`,
      nextLabel: last ? "Về tình huống đầu" : "Tiếp theo",
      onNext: () => show(last ? 0 : index + 1),
    })
    host.replaceChildren(current.el)
    window.scrollTo(0, 0)
  }
  show(0)
  return { el: host, destroy: () => current?.destroy() }
}
