// Diem vao cua app: khung chung (thanh dieu huong, thong bao) va dieu huong bang hash.
import "./app/theme.css"
import type { App } from "./app/app"
import { el, link, type Screen } from "./app/dom"
import { href, parseRoute, type Route } from "./app/router"
import { createChain } from "./app/screens/chain"
import { createDrill } from "./app/screens/drill"
import { createHome } from "./app/screens/home"
import { createLesson, createLevel, createLevelScenarios, message } from "./app/screens/level"
import { createLimits, createSettings } from "./app/screens/settings"
import { createStats } from "./app/screens/stats"
import { browserBackend, createStore } from "./app/storage"
import { LEVELS } from "./content/levels"
import { createFreePlay } from "./table/freePlay"
import { setForceCurve } from "./table/power"

const notice = el("div", "notice")
notice.setAttribute("role", "status")
notice.hidden = true

const app: App = {
  store: createStore(browserBackend()),
  levels: LEVELS,
  notify(text) {
    notice.textContent = text
    notice.hidden = false
  },
}

const NAV = [
  { label: "Trang chính", target: href.home, names: ["home", "level", "lesson", "scenarios", "drill"] },
  { label: "Đánh tự do", target: href.freePlay, names: ["freePlay"] },
  { label: "Đánh chuỗi", target: href.chain, names: ["chain"] },
  { label: "Thống kê", target: href.stats, names: ["stats"] },
  { label: "Cài đặt", target: href.settings, names: ["settings", "limits"] },
]
const links = NAV.map((item) => link(item.label, item.target))
const nav = el("nav", "nav", ...links)
nav.setAttribute("aria-label", "Điều hướng chính")
const host = el("div")
let current: Screen | null = null

function create(route: Route): Screen {
  const aids = app.store.get().settings.aids
  switch (route.name) {
    case "home":
      return createHome(app)
    case "level":
      return createLevel(app, route.level)
    case "lesson":
      return createLesson(app, route.level, route.lesson)
    case "scenarios":
      return createLevelScenarios(app, route.level)
    case "drill":
      return createDrill(app, route.level, route.drill)
    case "freePlay":
      return createFreePlay(aids)
    case "chain":
      return createChain(app)
    case "stats":
      return createStats(app)
    case "settings":
      return createSettings(app, render)
    case "limits":
      return createLimits()
    case "notFound":
      return message("Không tìm thấy trang", "Địa chỉ này không có trong app.")
  }
}

function render() {
  // Do manh cua co ap cho moi ban; doc lai moi lan vi co the vua doi trong Cai dat hoac nhap file.
  setForceCurve(app.store.get().settings.cueCurve)
  const route = parseRoute(location.hash)
  current?.destroy()
  current = create(route)
  host.replaceChildren(current.el)
  NAV.forEach((item, i) =>
    item.names.includes(route.name) ? links[i].setAttribute("aria-current", "page") : links[i].removeAttribute("aria-current")
  )
  window.scrollTo(0, 0)
}

window.addEventListener("hashchange", render)
document.querySelector<HTMLDivElement>("#app")?.append(nav, notice, host)
render()
