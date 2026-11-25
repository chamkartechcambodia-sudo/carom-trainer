// Che do "Danh chuoi": choi phang tu do tren mo phong, dem chuoi hien tai, chuoi dai
// nhat, so luot; ap luat vung goc khi cai dat bat. Ket thuc buoi thi luu vao thong ke.
import type { Setup } from "../../engine"
import { todayIso, vn } from "../../format"
import { createShotTable } from "../../table/shotTable"
import { save, type App } from "../app"
import { applyShot, average, CORNER, cornerTriangles, finish, newChain, sharedCorner } from "../chain"
import { button, el, link, type Screen } from "../dom"
import { href } from "../router"

/** The khai cuoc: bi do o diem tren, bi vang o diem duoi, bi cai canh bi vang. */
const BREAK: Setup = { cue: [-23.1, -5.9], b1: [-23.1, 0], b2: [23.1, 0] }
/** The de: ba bi da nam gan nhau, de tap giu chuoi ngay. */
const EASY: Setup = { cue: [-6, -4], b1: [0, 0], b2: [5, 3] }

const IDLE = "Ghi điểm để nối chuỗi. Trượt thì hết lượt và bắt đầu lượt mới từ chỗ bi đang nằm."

export function createChain(app: App): Screen {
  const settings = app.store.get().settings
  let state = newChain()
  let saved = false

  const status = el("p", "status", IDLE)
  status.setAttribute("aria-live", "polite")
  const setStatus = (text: string, tone = "") => {
    status.textContent = text
    status.className = `status${tone ? ` status--${tone}` : ""}`
  }

  const cells = ["Chuỗi hiện tại", "Chuỗi dài nhất", "Số lượt", "Tổng điểm", "Trung bình mỗi lượt"].map((label) => {
    const value = el("strong", "stat__value", "0")
    return { value, node: el("div", "stat", el("span", "muted", label), value) }
  })
  const cornerNote = el("p", "note")

  function render() {
    const avg = average(state.points - state.run, state.innings)
    const values = [state.run, state.best, state.innings, state.points, avg === null ? "–" : vn(avg, 2)]
    cells.forEach((c, i) => (c.value.textContent = String(values[i])))
    cornerNote.hidden = !settings.cornerRule || state.corner === null
    const left = CORNER.caromsAllowedInside - state.cornerCaroms
    cornerNote.textContent =
      left > 0
        ? `Hai bi mục tiêu đang ở trong vùng góc. Còn được ghi ${left} điểm mà không cần đưa bi ra.`
        : "Hai bi mục tiêu đang ở trong vùng góc: cú này phải đưa ít nhất một bi ra khỏi vùng, nếu không điểm không được tính."
    saveBtn.disabled = saved || finish(state).innings === 0
  }

  const shots = createShotTable({
    balls: BREAK,
    aids: settings.aids,
    continuous: true,
    onClear: (rolling) => rolling && setStatus("Bi đang lăn…"),
    // Khong cho quay lai de danh lai cu truot: chuoi va trung binh ghi vao Thong ke phai that.
    allowBack: false,
    onDone: (result) => {
      const before = state.run
      const next = applyShot(state, result, settings.cornerRule)
      state = next.state
      saved = false
      if (next.outcome === "point") setStatus(`Ghi điểm! Chuỗi hiện tại: ${state.run}.`, "ok")
      else if (next.outcome === "cornerFoul") {
        setStatus(`Phạm luật vùng góc: không bi mục tiêu nào ra khỏi vùng. Điểm không được tính, hết lượt (chuỗi ${before}).`, "warn")
      } else setStatus(`Trượt. Hết lượt với chuỗi ${before}. Lượt mới bắt đầu từ thế này.`, "warn")
      render()
    },
  })
  if (settings.cornerRule) shots.table.setCornerZones(cornerTriangles())

  function restart(balls: Setup) {
    if (state.points > 0 && !saved && !window.confirm("Bắt đầu buổi mới? Buổi đang đánh chưa được lưu.")) return
    state = newChain()
    saved = false
    shots.reset(balls)
    if (settings.cornerRule) state.corner = sharedCorner(balls)
    setStatus(IDLE)
    render()
  }

  const saveBtn = button("Kết thúc buổi và lưu", "btn--primary", () => {
    const done = finish(state)
    if (done.innings === 0) return
    state = done
    save(app, (d) => d.sessions.push({ date: todayIso(), kind: "sim", innings: done.innings, points: done.points, bestRun: done.best }))
    saved = true
    setStatus(`Đã lưu buổi: ${done.points} điểm trong ${done.innings} lượt, chuỗi dài nhất ${done.best}.`, "ok")
    render()
  })

  render()

  const saveRow = el(
    "div",
    "row",
    saveBtn,
    button("Xếp thế khai cuộc", "", () => restart(BREAK)),
    button("Xếp thế dễ", "", () => restart(EASY))
  )
  const panel = el(
    "div",
    "card stack",
    status,
    cornerNote,
    shots.actionsEl,
    shots.lastShotEl,
    shots.analysisEl,
    shots.controlsEl,
    saveRow,
    el("div", "row", link("Xem thống kê", href.stats, "back"))
  )

  const page = el(
    "main",
    "page page--play",
    el(
      "header",
      "page__header",
      link("← Trang chính", href.home, "back"),
      el("h1", "", "Đánh chuỗi"),
      el(
        "p",
        "muted hud-drop",
        settings.cornerRule
          ? "Phăng tự do trên bàn mô phỏng. Luật vùng góc đang bật (bốn tam giác ở góc bàn)."
          : "Phăng tự do trên bàn mô phỏng. Luật vùng góc đang tắt; bật trong Cài đặt."
      )
    ),
    el(
      "div",
      "play",
      el("div", "stack", shots.hud({ status, dock: [cornerNote] }), el("div", "stats", ...cells.map((c) => c.node))),
      panel
    )
  )
  return { el: page, destroy: shots.destroy }
}
