// Man hinh cap (bon muc Hieu, Thu, Tap, Qua cap), bai Hieu, va trang Thu cua cap.
import type { Level } from "../../content/levels"
import { createScenarioRunner } from "../../scenarios/scenarioScreen"
import { createFigure } from "../../table/figure"
import { createTipExplorer } from "../../table/tipExplorer"
import { save, type App } from "../app"
import { el, link, type Screen } from "../dom"
import { drillBest, drillPassed, drillThreshold, levelComplete, levelProgress, levelUnlocked } from "../progress"
import { href } from "../router"

const still = (page: HTMLElement): Screen => ({ el: page, destroy() {} })

export function message(title: string, text: string, back = link("← Trang chính", href.home, "back")): Screen {
  return still(el("main", "page narrow stack", back, el("h1", "", title), el("p", "", text)))
}

/** Tra ve cap neu ton tai va da mo; nguoc lai tra ve man hinh bao loi. */
export function openLevel(app: App, id: number): Level | Screen {
  const level = app.levels.find((l) => l.id === id)
  if (!level) return message("Không có cấp này", "Hãy quay lại trang chính và chọn một cấp.")
  if (!levelUnlocked(id, app.levels, app.store.get())) {
    return message(`Cấp ${id} chưa mở`, `Hoàn thành mọi bài tập bàn thật của cấp ${id - 1} để mở cấp này.`)
  }
  return level
}

const isScreen = (x: Level | Screen): x is Screen => "destroy" in x

function section(title: string, ...children: (Node | string)[]) {
  return el("section", "card section", el("h2", "", title), ...children)
}

export function createLevel(app: App, id: number): Screen {
  const level = openLevel(app, id)
  if (isScreen(level)) return level
  const data = app.store.get()
  const p = levelProgress(level, data)

  const lessons = el(
    "ul",
    "list",
    ...level.lessons.map((l) => el("li", "", link(`${l.id} ${l.title}`, href.lesson(level.id, l.id), "list__item")))
  )

  const scenarios = level.scenarios.length
    ? el(
        "div",
        "stack",
        el("p", "", `Đã đạt ${p.scenariosPassed}/${p.scenariosTotal} tình huống trên bàn mô phỏng.`),
        el("div", "row", link("Vào bàn mô phỏng", href.scenarios(level.id), "btn btn--primary back"))
      )
    : el("p", "muted", "Chưa có tình huống. Phần này được soạn ở bước sau của kế hoạch.")

  const drills = level.drills.length
    ? el(
        "ul",
        "list",
        ...level.drills.map((d) => {
          const best = drillBest(d.id, data)
          const passed = drillPassed(d, data)
          const text =
            best === null
              ? "Chưa tập"
              : d.kind === "check"
                ? passed
                  ? "Đạt"
                  : "Chưa đạt"
                : `Tốt nhất ${best}/10`
          const row = link("", href.drill(level.id, d.id), "list__item")
          row.append(el("span", "", d.title), el("span", passed ? "badge badge--ok" : "badge", text))
          return el("li", "", row)
        })
      )
    : el("p", "muted", "Cấp này chưa có bài tập bàn thật. Phần này được soạn ở bước sau của kế hoạch.")

  const next = app.levels.find((l) => l.id === level.id + 1)
  const exam = levelComplete(level, data)
    ? next
      ? el("p", "status status--ok", `Đã đạt mọi bài tập. Cấp ${next.id} đã mở.`)
      : el("p", "status status--ok", "Đã đạt mọi bài tập của cấp cuối.")
    : el("p", "", `Đã đạt ${p.drillsPassed}/${p.drillsTotal} bài tập bàn thật.`)
  const sample = level.drills.find((d) => d.kind === "count" && !d.thresholdDelta)
  const rule = sample
    ? `Mỗi bài đánh 10 quả; đạt khi có một buổi được từ ${drillThreshold(sample, data.settings)}/10 trở lên. Ngưỡng chỉnh được trong Cài đặt. Kết quả trên bàn mô phỏng không chặn lên cấp.`
    : "Kết quả trên bàn mô phỏng không chặn lên cấp."

  return still(
    el(
      "main",
      "page narrow stack",
      el(
        "header",
        "page__header",
        link("← Trang chính", href.home, "back"),
        el("h1", "", `Cấp ${level.id}: ${level.title}`),
        el("p", "muted", level.learns)
      ),
      ...(level.note ? [el("p", "note", level.note)] : []),
      section("1. Hiểu", lessons),
      section("2. Thử", scenarios),
      section("3. Tập", drills),
      section("4. Qua cấp", el("p", "", `Kiểm tra: ${level.exam}`), exam, el("p", "muted", rule))
    )
  )
}

export function createLesson(app: App, id: number, lessonId: string): Screen {
  const level = openLevel(app, id)
  if (isScreen(level)) return level
  const back = link(`← Cấp ${level.id}`, href.level(level.id), "back")
  const lesson = level.lessons.find((l) => l.id === lessonId)
  if (!lesson) return message("Không có bài này", "Hãy quay lại và chọn một bài trong danh sách.", back)
  const figures: Screen[] = []
  const blocks = lesson.body.map((block) => {
    if (block.type === "text") return el("p", "", block.text)
    if (block.type === "example") return el("p", "note", el("strong", "", "Ví dụ đời thường. "), block.text)
    const figure = block.type === "explorer" ? createTipExplorer(block.explorer) : createFigure(block.figure)
    figures.push(figure)
    return figure.el
  })
  const index = level.lessons.indexOf(lesson)
  const next = level.lessons[index + 1]
  const onward = next
    ? link(`Bài tiếp: ${next.id} ${next.title}`, href.lesson(level.id, next.id), "btn btn--primary back")
    : link(`Xong phần Hiểu. Về cấp ${level.id}`, href.level(level.id), "btn btn--primary back")
  const page = el(
    "main",
    "page narrow stack",
    el("header", "page__header", back, el("h1", "", `${lesson.id} ${lesson.title}`)),
    el("div", "card stack", ...blocks),
    el("div", "row", onward)
  )
  return { el: page, destroy: () => figures.forEach((f) => f.destroy()) }
}

export function createLevelScenarios(app: App, id: number): Screen {
  const level = openLevel(app, id)
  if (isScreen(level)) return level
  const back = () => link(`← Cấp ${level.id}`, href.level(level.id), "back")
  if (!level.scenarios.length) return message("Chưa có tình huống", "Phần này được soạn ở bước sau của kế hoạch.", back())
  return createScenarioRunner(level.scenarios, {
    aids: app.store.get().settings.aids,
    back,
    onVerdict: (scenario, verdict) => {
      if (!verdict.passed || app.store.get().scenariosPassed.includes(scenario.id)) return
      save(app, (data) => data.scenariosPassed.push(scenario.id))
    },
  })
}
