// Hinh tuong tac cua bai Hieu: mot ban nho va vai nut; moi nut danh mot cu cho san
// bang chinh loi mo phong, de nguoi hoc so sanh ket qua.
import { simulate, type Setup, type Shot, type Vec2 } from "../engine"
import { button, el, svg, type Screen } from "../app/dom"
import { aimPreview } from "./aim"
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
  /** Cau hoi de nguoi hoc tu doan truoc khi bam nut. */
  predict?: string
  /** Chi cho nguoi hoc biet can nhin vao dau. */
  look?: string
  /**
   * Co nut "So sánh tất cả": ve chong duong di cua bi nay o moi nut len cung mot ban, moi
   * nut mot kieu net. Chi dung khi moi nut dung chung mot the bi.
   */
  compare?: "cue" | "b1"
  /** Ve them duong 90 do cua nut dau tien (net cham) lam moc de so. */
  tangent?: boolean
  /** Vet so sanh dung o lan cham bang dau tien cua bi do, de hinh khong roi vi cac doan bat bang. */
  compareCut?: boolean
}

/** So kieu net phan biet duoc cua vet so sanh (khop voi .ghost-trail--1..5 trong table.css). */
const STYLES = 5
/** Vi tri cua duong moc 90 do trong danh sach vet (kieu net .ghost-trail--6). */
const REF = STYLES

/** Mau net ve nho de lam chu giai, cung kieu net voi vet tren ban. */
const key = (index: number) =>
  svg(
    "svg",
    { class: "trail-key", viewBox: "0 0 9 3", "aria-hidden": "true" },
    svg("rect", { class: "table__felt", x: 0, y: 0, width: 9, height: 3, rx: 0.6 }),
    svg("polyline", { class: `ghost-trail ghost-trail--${index + 1}`, points: "0.8,1.5 8.2,1.5" })
  )

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

  const comparable = !!figure.compare && figure.variants.length <= STYLES && figure.variants.every((v) => !v.balls)
  const preview = aimPreview(figure.balls, figure.variants[0].shot.angleDeg)
  const tangentPath: Vec2[] | null = figure.tangent && preview.ghost?.tangentEnd ? [preview.end, preview.ghost.tangentEnd] : null
  /** Danh sach vet: cac vet so sanh (hoac rong), roi duong moc 90 do o vi tri REF. */
  const withRef = (paths: (Vec2[] | null)[]) => {
    const out: (Vec2[] | null)[] = Array.from({ length: STYLES }, (_, i) => paths[i] ?? null)
    out[REF] = tangentPath
    return out
  }
  const legend = el("p", "muted trail-legend")
  legend.hidden = true

  const buttons = figure.variants.map((variant, i) => {
    const b = button("", "", () => {
      playing = variant.label
      legend.hidden = true
      shots.reset(variant.balls ?? figure.balls)
      shots.play(variant.shot)
      // Duong moc 90 do nam san tren ban de so voi duong bi cai dang chay.
      if (tangentPath && !variant.balls) shots.table.setGhosts(withRef([]))
    })
    if (comparable) b.append(key(i), " ")
    b.append(variant.label)
    return b
  })

  // De nguoi hoc xem lai the ban dau bao lau tuy y truoc khi chon nut khac.
  const resetBtn = button("Về thế ban đầu", "", () => {
    shots.reset()
    legend.hidden = true
    status.textContent = ""
  })

  const tools: HTMLElement[] = [shots.actionsEl, resetBtn]
  if (comparable) {
    const ball = figure.compare!
    tools.unshift(
      button("So sánh tất cả", "btn--primary", () => {
        shots.reset()
        const paths = figure.variants.map((v) => {
          const result = simulate(figure.balls, v.shot)
          const path = result.paths[ball] ?? null
          if (!path || !figure.compareCut) return path
          const first = result.events.find((e) => e.type === "cushion" && e.ball === ball)
          return first ? path.filter((_, i) => result.times[i] <= first.t) : path
        })
        shots.table.setGhosts(withRef(paths))
        const name = ball === "cue" ? "bi cái" : "bi vàng"
        legend.textContent = `Mỗi kiểu nét là đường ${name} của một nút, xem mẫu nét trên từng nút.${tangentPath ? " Đường chấm mảnh là đường 90°." : ""}`
        legend.hidden = false
        status.textContent = ""
      })
    )
  }

  const node = el(
    "figure",
    "figure stack",
    el("figcaption", "", figure.caption),
    ...(figure.predict ? [el("p", "figure__ask", el("strong", "", "Đoán trước khi bấm: "), figure.predict)] : []),
    shots.tableEl,
    el("div", "row", ...buttons),
    el("div", "row", ...tools),
    legend,
    status,
    ...(figure.look ? [el("p", "figure__look", el("strong", "", "Nhìn gì: "), figure.look)] : []),
    shots.lastShotEl,
    shots.analysisEl
  )
  return { el: node, destroy: shots.destroy }
}
