// Hinh "chin diem cham": mat bi cai bam duoc, moi lan doi diem cham la ve ngay
// duong di cua cu danh (khong phat hoat hinh) de so sanh nhanh.
import { simulate, type Setup } from "../engine"
import { el, type Screen } from "../app/dom"
import { TableView } from "./tableView"
import { createTipPicker } from "./tipPicker"
import { tipZoneName, type Tip } from "./tipZone"

export interface TipExplorer {
  caption: string
  balls: Setup
  angleDeg: number
  power: number
}

export function createTipExplorer(spec: TipExplorer): Screen {
  const table = new TableView()
  const label = el("p", "muted")
  label.setAttribute("aria-live", "polite")
  const narrowPortrait = window.matchMedia("(max-width: 700px) and (orientation: portrait)")
  const applyOrientation = () => table.setPortrait(narrowPortrait.matches)
  narrowPortrait.addEventListener("change", applyOrientation)
  applyOrientation()

  const show = (tip: Tip) => {
    const result = simulate(spec.balls, { angleDeg: spec.angleDeg, power: spec.power, tip })
    table.setReplay(result)
    table.setTime(result.duration)
    label.textContent = `Điểm chạm: ${tipZoneName(tip)}`
  }
  const picker = createTipPicker(show)
  show({ x: 0, y: 0 })

  const node = el(
    "figure",
    "figure stack",
    el("figcaption", "", spec.caption),
    table.el,
    el("div", "row", picker.el, label)
  )
  return { el: node, destroy: () => narrowPortrait.removeEventListener("change", applyOrientation) }
}
