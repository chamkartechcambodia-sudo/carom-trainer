// Man hinh chinh: 7 cap, trang thai khoa hay mo, tien do tung cap.
import type { App } from "../app"
import { el, link, type Screen } from "../dom"
import { levelComplete, levelProgress, levelUnlocked } from "../progress"
import { href } from "../router"

export function createHome(app: App): Screen {
  const data = app.store.get()
  const cards = app.levels.map((level) => {
    const unlocked = levelUnlocked(level.id, app.levels, data)
    const done = levelComplete(level, data)
    const p = levelProgress(level, data)
    const badge = done
      ? el("span", "badge badge--ok", "Đã hoàn thành")
      : el("span", "badge", unlocked ? "Đang mở" : "Chưa mở")
    const progress = unlocked
      ? `Bàn thật: ${p.drillsPassed}/${p.drillsTotal} bài đạt · Mô phỏng: ${p.scenariosPassed}/${p.scenariosTotal} tình huống`
      : `Hoàn thành bài tập bàn thật của cấp ${level.id - 1} để mở.`
    const body = [
      el("div", "row", el("strong", "", `Cấp ${level.id}`), badge),
      el("h2", "", level.title),
      el("p", "", level.learns),
      el("p", "muted", progress),
    ]
    const card = unlocked ? el("a", "card level-card", ...body) : el("div", "card level-card level-card--locked", ...body)
    if (card instanceof HTMLAnchorElement) card.href = href.level(level.id)
    return el("li", "", card)
  })

  const page = el(
    "main",
    "page stack",
    el(
      "header",
      "page__header",
      el("h1", "", "Học bida phăng"),
      el("p", "muted", "Bảy cấp, từ kiểm soát lực đến giữ chuỗi. Qua cấp bằng bài tập trên bàn thật.")
    ),
    el("ul", "levels", ...cards),
    el(
      "div",
      "row",
      link("Đánh tự do", href.freePlay, "btn back"),
      link("Đánh chuỗi", href.chain, "btn back"),
      link("Thống kê", href.stats, "btn back"),
      link("Giới hạn của mô phỏng", href.limits, "btn back")
    )
  )
  return { el: page, destroy() {} }
}
