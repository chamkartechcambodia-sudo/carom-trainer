// Trang thong ke: diem trung binh moi luot va chuoi dai nhat theo thoi gian, tach rieng
// mo phong va ban that. Buoi ban that do nguoi dung nhap sau moi buoi tap.
// Bieu do: moi dai luong mot bieu do duong rieng (khong dung hai truc), mot chuoi so
// lieu nen khong can chu giai; co bang so lieu ben duoi va nhan gia tri khi di chuot.
import { todayIso, vn, vnDate } from "../../format"
import { save, type App } from "../app"
import { average } from "../chain"
import { button, el, link, setAttrs, svg, type Screen } from "../dom"
import { href } from "../router"
import type { Session } from "../storage"

const KIND_NAME = { sim: "Mô phỏng", real: "Bàn thật" } as const

const W = 320
const H = 150
const PAD = { left: 34, right: 44, top: 14, bottom: 22 }

/** Bieu do duong mot chuoi so lieu, truc x la thu tu buoi. */
function lineChart(title: string, values: number[], labels: string[], digits: number): HTMLElement {
  const figure = el("figure", "chart", el("figcaption", "", title))
  if (values.length === 0) {
    figure.append(el("p", "muted", "Chưa có buổi nào."))
    return figure
  }
  const max = Math.max(1, ...values)
  const x = (i: number) => PAD.left + (values.length === 1 ? 0.5 : i / (values.length - 1)) * (W - PAD.left - PAD.right)
  const y = (v: number) => H - PAD.bottom - (v / max) * (H - PAD.top - PAD.bottom)
  const readout = el("p", "muted")
  readout.setAttribute("aria-live", "polite")
  const say = (i: number) => (readout.textContent = `${labels[i]}: ${vn(values[i], digits)}`)
  say(values.length - 1)

  const node = svg("svg", { class: "chart__svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${title}. Số liệu có trong bảng bên dưới.` })
  for (const v of [0, max / 2, max]) {
    node.append(
      svg("line", { class: "chart__grid", x1: PAD.left, x2: W - PAD.right, y1: y(v), y2: y(v) }),
      Object.assign(svg("text", { class: "chart__tick", x: PAD.left - 6, y: y(v) + 4, "text-anchor": "end" }), {
        textContent: vn(v, v === 0 || max >= 10 ? 0 : digits),
      })
    )
  }
  node.append(svg("polyline", { class: "chart__line", points: values.map((v, i) => `${x(i)},${y(v)}`).join(" ") }))
  values.forEach((v, i) => {
    const dot = svg("circle", { class: "chart__dot", cx: x(i), cy: y(v), r: 4, tabindex: 0 })
    setAttrs(dot, { "aria-label": `${labels[i]}: ${vn(v, digits)}` })
    // Vung bam rong hon cham de de di chuot va cham tay.
    const hit = svg("circle", { class: "chart__hit", cx: x(i), cy: y(v), r: 14 })
    for (const target of [dot, hit]) {
      target.addEventListener("pointerenter", () => say(i))
      target.addEventListener("focus", () => say(i))
    }
    node.append(hit, dot)
  })
  // Chi ghi nhan truc tiep cho diem cuoi.
  const last = values.length - 1
  node.append(
    Object.assign(svg("text", { class: "chart__label", x: x(last) + 8, y: y(values[last]) + 4 }), {
      textContent: vn(values[last], digits),
    })
  )
  figure.append(node, readout)
  return figure
}

export function createStats(app: App): Screen {
  const host = el("div", "stack")

  const date = el("input", "input")
  date.type = "date"
  date.value = todayIso()
  date.max = todayIso()
  const number = (label: string) => {
    const input = el("input", "input")
    input.type = "number"
    input.min = "0"
    input.step = "1"
    input.inputMode = "numeric"
    return { input, node: el("label", "field", el("span", "muted", label), input) }
  }
  const innings = number("Số lượt")
  const points = number("Tổng điểm")
  const best = number("Chuỗi dài nhất")
  const feedback = el("p", "status")
  feedback.setAttribute("aria-live", "polite")

  const addBtn = button("Ghi buổi bàn thật", "btn--primary", () => {
    const n = Number(innings.input.value)
    const p = Number(points.input.value)
    const b = Number(best.input.value)
    const whole = [n, p, b].every((v) => Number.isInteger(v) && v >= 0)
    const say = (text: string) => {
      feedback.textContent = text
      feedback.className = "status status--warn"
    }
    if (!whole || innings.input.value === "" || points.input.value === "" || best.input.value === "") {
      return say("Nhập đủ ba số nguyên không âm.")
    }
    if (n < 1) return say("Số lượt phải từ 1 trở lên.")
    if (b > p) return say("Chuỗi dài nhất không thể lớn hơn tổng điểm.")
    if (p > 0 && b < 1) return say("Đã có điểm thì chuỗi dài nhất phải từ 1 trở lên.")
    const day = /^\d{4}-\d{2}-\d{2}$/.test(date.value) ? date.value : todayIso()
    save(app, (d) => d.sessions.push({ date: day, kind: "real", innings: n, points: p, bestRun: b }))
    for (const f of [innings, points, best]) f.input.value = ""
    feedback.textContent = "Đã ghi."
    feedback.className = "status status--ok"
    render()
  })

  function block(kind: Session["kind"]) {
    const all = app.store.get().sessions
    // Thu tu thoi gian; cung ngay thi theo thu tu ghi.
    const mine = all.map((s, index) => ({ s, index })).filter((x) => x.s.kind === kind)
    mine.sort((a, b) => a.s.date.localeCompare(b.s.date) || a.index - b.index)
    const labels = mine.map((x) => vnDate(x.s.date))
    const section = el("section", "card section", el("h2", "", KIND_NAME[kind]))
    if (mine.length === 0) {
      section.append(
        el("p", "muted", kind === "sim" ? "Chưa có buổi nào. Vào Đánh chuỗi, đánh xong bấm Kết thúc buổi và lưu." : "Chưa có buổi nào. Ghi buổi đầu tiên ở khung phía trên.")
      )
      return section
    }
    const totalPoints = mine.reduce((sum, x) => sum + x.s.points, 0)
    const totalInnings = mine.reduce((sum, x) => sum + x.s.innings, 0)
    section.append(
      el(
        "div",
        "stats",
        el("div", "stat", el("span", "muted", "Trung bình chung"), el("strong", "stat__value", vn(average(totalPoints, totalInnings) ?? 0, 2))),
        el("div", "stat", el("span", "muted", "Chuỗi dài nhất"), el("strong", "stat__value", String(Math.max(...mine.map((x) => x.s.bestRun))))),
        el("div", "stat", el("span", "muted", "Số buổi"), el("strong", "stat__value", String(mine.length)))
      ),
      el(
        "div",
        "charts",
        lineChart("Điểm trung bình mỗi lượt, theo buổi", mine.map((x) => average(x.s.points, x.s.innings) ?? 0), labels, 2),
        lineChart("Chuỗi dài nhất, theo buổi", mine.map((x) => x.s.bestRun), labels, 0)
      )
    )
    const rows = [...mine].reverse().map(({ s, index }) => {
      const remove = button("Xóa", "", () => {
        save(app, (d) => d.sessions.splice(index, 1))
        render()
      })
      remove.setAttribute("aria-label", `Xóa buổi ${vnDate(s.date)}`)
      return el(
        "tr",
        "",
        el("td", "", vnDate(s.date)),
        el("td", "", String(s.innings)),
        el("td", "", String(s.points)),
        el("td", "", vn(average(s.points, s.innings) ?? 0, 2)),
        el("td", "", String(s.bestRun)),
        el("td", "", remove)
      )
    })
    const head = el("tr", "", ...["Ngày", "Lượt", "Điểm", "Trung bình", "Chuỗi dài nhất", ""].map((h) => el("th", "", h)))
    section.append(el("div", "scroll-x", el("table", "history", el("thead", "", head), el("tbody", "", ...rows))))
    return section
  }

  function render() {
    host.replaceChildren(block("real"), block("sim"))
  }
  render()

  const page = el(
    "main",
    "page narrow stack",
    el(
      "header",
      "page__header",
      link("← Trang chính", href.home, "back"),
      el("h1", "", "Thống kê"),
      el("p", "muted", "Hai chỉ số của mục tiêu: điểm trung bình mỗi lượt và chuỗi dài nhất. Bàn thật và mô phỏng được tính riêng.")
    ),
    el(
      "section",
      "card section",
      el("h2", "", "Ghi một buổi trên bàn thật"),
      el("div", "fields", el("label", "field", el("span", "muted", "Ngày"), date), innings.node, points.node, best.node),
      el("div", "row", addBtn),
      feedback
    ),
    host
  )
  return { el: page, destroy() {} }
}
