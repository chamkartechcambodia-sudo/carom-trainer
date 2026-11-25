// Hinh tuong tac cua bai Hieu: mot ban nho va vai nut; moi nut danh mot cu cho san
// bang chinh loi mo phong, de nguoi hoc so sanh ket qua.
import type { Setup, Shot } from "../engine"
import { button, el, type Screen } from "../app/dom"
import { createShotTable } from "./shotTable"

export interface FigureVariant {
  label: string
  shot: Shot
  /** The bi rieng cua nut nay (mac dinh dung the chung cua hinh). */
  balls?: Setup
}

export interface Figure {
  caption: string
  balls: Setup
  variants: FigureVariant[]
}

export function createFigure(figure: Figure): Screen {
  const status = el("p", "muted")
  status.setAttribute("aria-live", "polite")
  let playing = ""

  const shots = createShotTable({
    balls: figure.balls,
    locked: { angleDeg: figure.variants[0].shot.angleDeg },
    aids: { aimLine: false, ghostBall: false, tangentLine: false, predictedPath: false },
    continuous: false,
    manualShot: false,
    onClear: (rolling) => (status.textContent = rolling ? `Đang xem: ${playing}` : ""),
    onDone: () => (status.textContent = `Vừa xem: ${playing}. Bấm nút khác để so sánh.`),
  })

  const buttons = figure.variants.map((variant) =>
    button(variant.label, "", () => {
      playing = variant.label
      shots.reset(variant.balls ?? figure.balls)
      shots.play(variant.shot)
    })
  )

  // De nguoi hoc xem lai the ban dau bao lau tuy y truoc khi chon nut khac.
  const resetBtn = button("Về thế ban đầu", "", () => {
    shots.reset()
    status.textContent = ""
  })

  const node = el(
    "figure",
    "figure stack",
    el("figcaption", "", figure.caption),
    shots.tableEl,
    el("div", "row", ...buttons),
    el("div", "row", shots.actionsEl, resetBtn),
    status,
    shots.lastShotEl,
    shots.analysisEl
  )
  return { el: node, destroy: shots.destroy }
}
