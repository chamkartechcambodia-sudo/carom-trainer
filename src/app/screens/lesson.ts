// Dung noi dung mot bai Hieu tu danh sach khoi (src/content/blocks.ts).
import type { Block } from "../../content/blocks"
import { createDiagram } from "../../table/diagram"
import { createFigure } from "../../table/figure"
import { createTipExplorer } from "../../table/tipExplorer"
import { button, el, type Screen } from "../dom"

const list = (tag: "ul" | "ol", items: string[]) => el(tag, "lesson__list", ...items.map((item) => el("li", "", item)))

function createCheck(block: Extract<Block, { type: "check" }>): HTMLElement {
  const result = el("p", "note")
  result.setAttribute("aria-live", "polite")
  result.hidden = true
  const options = block.options.map((label, i) =>
    button(label, "", () => {
      const right = i === block.answer
      for (const b of options) b.classList.remove("option--right", "option--wrong")
      options[i].classList.add(right ? "option--right" : "option--wrong")
      // Tra loi sai thi chua lo dap an: de nguoi hoc thu lai.
      result.replaceChildren(el("strong", "", right ? "Đúng. " : "Chưa đúng, thử lại. "), right ? block.explain : "")
      result.hidden = false
    })
  )
  return el("section", "lesson__check stack", el("h2", "", "Tự kiểm tra"), el("p", "", block.question), el("div", "stack", ...options), result)
}

/** Tra ve cac phan tu cua bai va ham don dep (dung dong ho cua cac ban mo phong). */
export function renderLesson(body: Block[]): { nodes: HTMLElement[]; destroy: () => void } {
  const live: Screen[] = []
  const nodes = body.map((block): HTMLElement => {
    switch (block.type) {
      case "goal":
        return el("p", "lesson__goal", el("strong", "", "Học xong bài này bạn sẽ: "), block.text)
      case "heading":
        return el("h2", "lesson__heading", block.text)
      case "text":
        return el("p", "", block.text)
      case "example":
        return el("p", "note", el("strong", "", "Ví dụ đời thường. "), block.text)
      case "diagram":
        return el("figure", "figure stack", createDiagram(block.diagram), el("figcaption", "figure__note", block.caption))
      case "steps":
        return list("ol", block.items)
      case "mistakes":
        return el("section", "lesson__box lesson__box--warn", el("h2", "", "Lỗi hay gặp"), list("ul", block.items))
      case "key":
        return el("section", "lesson__box", el("h2", "", "Ghi nhớ"), list("ul", block.items))
      case "check":
        return createCheck(block)
      case "figure":
      case "explorer": {
        const figure = block.type === "explorer" ? createTipExplorer(block.explorer) : createFigure(block.figure)
        live.push(figure)
        return figure.el
      }
    }
  })
  return { nodes, destroy: () => live.forEach((f) => f.destroy()) }
}
