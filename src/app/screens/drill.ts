// So tap ban that cho mot bai: so do xep bi, ghi so qua dat tren 10, lich su theo ngay.
import { todayIso, vnDate } from "../../format"
import { TableView } from "../../table/tableView"
import { save, type App } from "../app"
import { button, el, link, type Screen } from "../dom"
import { drillPassed, drillThreshold } from "../progress"
import { href } from "../router"
import type { DrillEntry } from "../storage"
import { message, openLevel } from "./level"

export function createDrill(app: App, levelId: number, drillId: string): Screen {
  const level = openLevel(app, levelId)
  if ("destroy" in level) return level
  const back = link(`← Cấp ${level.id}`, href.level(level.id), "back")
  const drill = level.drills.find((d) => d.id === drillId)
  if (!drill) return message("Không có bài tập này", "Hãy quay lại và chọn một bài trong danh sách.", back)

  const threshold = drillThreshold(drill, app.store.get().settings)
  const state = el("p", "status")
  const history = el("div")

  const diagram = el("div", "stack")
  if (drill.layouts?.length) {
    drill.layouts.forEach((layout, i) => {
      const table = new TableView() // che do tinh: chi de xem
      table.setBalls(layout.balls)
      table.setZone(layout.zone ?? null)
      if (drill.layouts!.length > 1) diagram.append(el("p", "muted", `Thế ${i + 1}`))
      diagram.append(table.el)
    })
  } else {
    diagram.append(el("p", "muted", "Chưa có sơ đồ xếp bi. Sơ đồ được soạn ở bước sau của kế hoạch."))
  }

  const date = el("input", "input")
  date.type = "date"
  date.value = todayIso()
  date.max = todayIso()
  const dateField = el("label", "field", el("span", "muted", "Ngày tập"), date)

  function add(made: number) {
    const day = /^\d{4}-\d{2}-\d{2}$/.test(date.value) ? date.value : todayIso()
    save(app, (data) => data.drillLog.push({ drillId: drill!.id, date: day, made }))
    render()
  }

  let made = threshold
  const count = el("span", "count", String(made))
  count.setAttribute("aria-live", "polite")
  const step = (delta: number) => {
    made = Math.min(10, Math.max(0, made + delta))
    count.textContent = String(made)
  }
  const entry =
    drill.kind === "count"
      ? el(
          "div",
          "stack",
          el("h2", "", "Ghi một buổi tập (đánh 10 quả)"),
          dateField,
          el(
            "div",
            "row",
            button("−", "", () => step(-1)),
            count,
            el("span", "", "/ 10 quả đạt"),
            button("+", "", () => step(1))
          ),
          el("div", "row", button("Ghi vào sổ", "btn--primary", () => add(made)))
        )
      : el(
          "div",
          "stack",
          el("h2", "", "Ghi một buổi tập (tự đánh giá)"),
          dateField,
          el(
            "div",
            "row",
            button("Đạt", "btn--primary", () => add(1)),
            button("Chưa đạt", "", () => add(0))
          )
        )

  const describe = (e: DrillEntry) => (drill.kind === "check" ? (e.made ? "Đạt" : "Chưa đạt") : `${e.made}/10`)

  function render() {
    const data = app.store.get()
    const passed = drillPassed(drill!, data)
    state.textContent = passed ? "Bài này đã đạt." : "Bài này chưa đạt."
    state.className = `status status--${passed ? "ok" : "warn"}`

    // Moi nhat len dau; cung ngay thi dong ghi sau len truoc.
    const mine = data.drillLog
      .map((e, index) => ({ e, index }))
      .filter((x) => x.e.drillId === drill!.id)
      .sort((a, b) => b.e.date.localeCompare(a.e.date) || b.index - a.index)
    if (!mine.length) {
      history.replaceChildren(el("p", "muted", "Chưa có buổi tập nào."))
      return
    }
    const rows = mine.map(({ e, index }) => {
      const remove = button("Xóa", "", () => {
        save(app, (d) => d.drillLog.splice(index, 1))
        render()
      })
      remove.setAttribute("aria-label", `Xóa buổi ${vnDate(e.date)}, ${describe(e)}`)
      return el("tr", "", el("td", "", vnDate(e.date)), el("td", "", describe(e)), el("td", "", remove))
    })
    const head = el("tr", "", el("th", "", "Ngày"), el("th", "", "Kết quả"), el("th", "", ""))
    history.replaceChildren(el("table", "history", el("thead", "", head), el("tbody", "", ...rows)))
  }
  render()

  const rule =
    drill.kind === "count"
      ? `Đạt khi: ${drill.passWhen} Cần ít nhất ${threshold}/10 quả trong một buổi.`
      : `Đạt khi: ${drill.passWhen}`

  const page = el(
    "main",
    "page narrow stack",
    el("header", "page__header", back, el("h1", "", drill.title), el("p", "muted", `Bài tập bàn thật, cấp ${level.id}`)),
    el("div", "card stack", el("p", "", drill.how), el("p", "", rule), diagram),
    el("div", "card stack", state, entry),
    el("div", "card stack", el("h2", "", "Lịch sử"), history)
  )
  return { el: page, destroy() {} }
}
