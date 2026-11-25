// Trang "Danh tu do": ban 3 bi, bi nam lai cho dung sau moi cu.
import type { Setup } from "../engine"
import { button, el, link, type Screen } from "../app/dom"
import { href } from "../app/router"
import { judgeGoal } from "../scenarios/judge"
import { createShotTable } from "./shotTable"
import type { Aids } from "./tableView"

const START: Setup = { cue: [-22, -8], b1: [4, 2], b2: [20, 10] }
const BACK = "Đã quay lại trước cú vừa đánh. Đường nét đứt là đường bi cái lần trước; chỉnh rồi đánh lại."
const ARRANGE = "Đang xếp thế: kéo từng bi tới chỗ bạn muốn. Bi không ra khỏi bàn và không đè lên nhau. Xong thì bấm nút bên dưới."
const ARRANGED = "Đã xếp thế mới. Nút Đặt lại sẽ đưa bi về đúng thế này."
const IDLE = "Kéo trên bàn để ngắm, chọn điểm chạm, rồi kéo cơ sang trái và buông để đánh."

export function createFreePlay(aids: Partial<Aids> = {}): Screen {
  const status = el("p", "status", IDLE)
  status.setAttribute("aria-live", "polite")
  const setStatus = (text: string, tone = "") => {
    status.textContent = text
    status.className = `status${tone ? ` status--${tone}` : ""}`
  }

  const shots = createShotTable({
    balls: START,
    aids,
    continuous: true,
    onClear: (rolling) => setStatus(rolling ? "Bi đang lăn…" : IDLE),
    onBack: () => setStatus(BACK),
    onDone: (result) => {
      const verdict = judgeGoal({ type: "score" }, { result })
      setStatus(verdict.detail, verdict.passed ? "ok" : "warn")
    },
  })
  const resetBtn = button("Đặt lại", "", () => {
    shots.reset()
    setStatus(IDLE)
  })
  let arranging = false
  const defaultBtn = button("Về thế mặc định", "", () => shots.reset(START))
  defaultBtn.hidden = true
  const arrangeBtn = button("Xếp bi", "", () => {
    if (!shots.setArranging(!arranging)) return
    arranging = !arranging
    arrangeBtn.textContent = arranging ? "Xong, đánh thế này" : "Xếp bi"
    arrangeBtn.classList.toggle("btn--primary", arranging)
    arrangeBtn.setAttribute("aria-pressed", String(arranging))
    defaultBtn.hidden = !arranging
    resetBtn.hidden = arranging
    setStatus(arranging ? ARRANGE : ARRANGED)
  })
  arrangeBtn.setAttribute("aria-pressed", "false")
  shots.actionsEl.append(resetBtn, arrangeBtn, defaultBtn)

  const panel = el("div", "card stack", status, shots.actionsEl, shots.lastShotEl, shots.analysisEl, shots.controlsEl)
  const page = el(
    "main",
    "page page--play",
    el(
      "header",
      "page__header",
      link("← Trang chính", href.home, "back"),
      el("h1", "", "Đánh tự do"),
      el("p", "muted hud-drop", "Bàn phăng 3 bi. Bi trắng là bi cái. Bấm Xếp bi để tự đặt thế muốn tập.")
    ),
    el("div", "play", shots.hud({ status, side: [resetBtn, arrangeBtn, defaultBtn] }), panel)
  )
  return { el: page, destroy: shots.destroy }
}
