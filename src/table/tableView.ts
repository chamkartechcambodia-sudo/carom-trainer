// Ban carom ve bang SVG, nhin tu tren. Moi thu ben trong nhom `world` dung toa do
// cua engine (don vi ban kinh bi, y huong len); phep bien doi cua nhom lo viec lat
// truc va xoay doc man hinh, nen khong co phep doi toa do nao khac trong ma.
import "./table.css"
import { BALL_RADIUS, TABLE, type BallId, type Setup, type SimResult, type Vec2 } from "../engine"
import { pointerIn, setAttrs, svg } from "../app/dom"
import type { AimPreview } from "./aim"
import { buildTrack, sampleAt, type Track } from "./replay"

export interface Aids {
  aimLine: boolean
  ghostBall: boolean
  tangentLine: boolean
  /** Duong bi cai thuc su di sau va cham dau tien, lay tu mo phong cu danh hien tai. */
  predictedPath: boolean
}

const RAIL = 3.2
const HALF_X = TABLE.halfLength + RAIL
const HALF_Y = TABLE.halfWidth + RAIL
const IDS: BallId[] = ["b1", "b2", "cue"] // bi cai ve sau cung de nam tren
const COLOUR: Record<BallId, string> = { cue: "cue", b1: "yellow", b2: "red" }

export class TableView {
  readonly el: SVGSVGElement
  /** Tat khi dang phat lai de keo tren ban khong doi huong ngam. */
  interactive = true

  private readonly world = svg("g")
  private readonly balls = {} as Record<BallId, SVGCircleElement>
  private readonly trails = {} as Record<BallId, SVGPolylineElement>
  private readonly aimLine = svg("line", { class: "aid aid--aim" })
  private readonly objectLine = svg("line", { class: "aid aid--object" })
  private readonly tangentLine = svg("line", { class: "aid aid--tangent" })
  private readonly ghost = svg("circle", { class: "aid aid--ghost", r: BALL_RADIUS })
  private readonly zone = svg("circle", { class: "zone" })
  private readonly predicted = svg("polyline", { class: "aid aid--predicted" })
  private readonly lastAim = svg("line", { class: "aid aid--last" })
  private readonly cornerLayer = svg("g")
  private readonly cueLayer = svg("g")
  private readonly ghostLayer = svg("g")
  private readonly markLayer = svg("g")
  private replay: { times: number[]; tracks: Partial<Record<BallId, Track>> } | null = null

  /**
   * Khong truyen `onPoint` thi ban o che do tinh (chi de xem). `first` la true o lan cham
   * xuong, false khi dang re tay.
   */
  constructor(onPoint?: (point: Vec2, first: boolean) => void) {
    this.el = svg("svg", { class: "table", role: "img", "aria-label": "Bàn bida phăng nhìn từ trên" })
    this.world.append(
      svg("rect", { class: "table__rail", x: -HALF_X, y: -HALF_Y, width: 2 * HALF_X, height: 2 * HALF_Y, rx: 1.6 }),
      svg("rect", {
        class: "table__felt",
        x: -TABLE.halfLength,
        y: -TABLE.halfWidth,
        width: 2 * TABLE.halfLength,
        height: 2 * TABLE.halfWidth,
      }),
      ...this.diamonds()
    )
    const trailLayer = svg("g")
    const ballLayer = svg("g")
    for (const id of IDS) {
      this.trails[id] = svg("polyline", { class: `trail trail--${COLOUR[id]}` })
      this.balls[id] = svg("circle", { class: `ball ball--${COLOUR[id]}`, r: BALL_RADIUS })
      trailLayer.append(this.trails[id])
      ballLayer.append(this.balls[id])
    }
    this.world.append(
      this.cornerLayer,
      this.zone,
      this.ghostLayer,
      trailLayer,
      this.aimLine,
      this.objectLine,
      this.lastAim,
      this.tangentLine,
      this.predicted,
      this.ghost,
      ballLayer,
      this.cueLayer,
      this.markLayer
    )
    this.el.append(this.world)
    this.setPortrait(false)
    this.setZone(null)
    this.setAim(null, { aimLine: false, ghostBall: false, tangentLine: false, predictedPath: false })
    this.setPredicted(null)
    this.setLastAim(null)
    if (onPoint) this.listen(onPoint)
  }

  private diamonds(): SVGElement[] {
    const out: SVGElement[] = []
    const dot = (cx: number, cy: number) => out.push(svg("circle", { class: "table__diamond", cx, cy, r: 0.42 }))
    for (let i = 0; i <= 8; i++) {
      const x = -TABLE.halfLength + (i * TABLE.halfLength) / 4
      dot(x, TABLE.halfWidth + RAIL / 2)
      dot(x, -TABLE.halfWidth - RAIL / 2)
    }
    for (let j = 1; j <= 3; j++) {
      const y = -TABLE.halfWidth + (j * TABLE.halfWidth) / 2
      dot(TABLE.halfLength + RAIL / 2, y)
      dot(-TABLE.halfLength - RAIL / 2, y)
    }
    return out
  }

  private listen(onPoint: (point: Vec2, first: boolean) => void) {
    this.el.classList.add("table--interactive")
    let dragging = false
    const report = (e: PointerEvent, first = false) => {
      if (this.interactive) onPoint(pointerIn(this.world, e), first)
    }
    this.el.addEventListener("pointerdown", (e) => {
      dragging = true
      this.el.setPointerCapture(e.pointerId)
      report(e, true)
    })
    this.el.addEventListener("pointermove", (e) => {
      if (dragging) report(e)
    })
    const stop = () => (dragging = false)
    this.el.addEventListener("pointerup", stop)
    this.el.addEventListener("pointercancel", stop)
  }

  /** Man hinh doc hep: xoay ban 90 do de bi to hon. Khong lat guong (xoay trai/phai giu nguyen). */
  setPortrait(portrait: boolean) {
    this.el.classList.toggle("table--portrait", portrait)
    if (portrait) {
      setAttrs(this.el, { viewBox: `${-HALF_Y} ${-HALF_X} ${2 * HALF_Y} ${2 * HALF_X}` })
      this.world.setAttribute("transform", "matrix(0 -1 -1 0 0 0)")
    } else {
      setAttrs(this.el, { viewBox: `${-HALF_X} ${-HALF_Y} ${2 * HALF_X} ${2 * HALF_Y}` })
      this.world.setAttribute("transform", "matrix(1 0 0 -1 0 0)")
    }
  }

  /** O dich cua bai "bi dung trong o". null de an. */
  setZone(zone: { cx: number; cy: number; r: number } | null) {
    this.zone.style.display = zone ? "" : "none"
    if (zone) setAttrs(this.zone, zone)
  }

  /** Ve cac vung goc (tam giac) cua luat vung goc; mang rong de xoa. */
  setCornerZones(triangles: Vec2[][]) {
    this.cornerLayer.replaceChildren(
      ...triangles.map((t) => svg("polygon", { class: "corner-zone", points: t.map((p) => `${p[0]},${p[1]}`).join(" ") }))
    )
  }

  /** Cac duong di ve san, chong len nhau de so sanh (toi da ba kieu net). Phan tu null thi bo qua. */
  setGhosts(paths: (Vec2[] | null)[]) {
    this.ghostLayer.replaceChildren(
      ...paths.flatMap((path, i) =>
        path
          ? [svg("polyline", { class: `ghost-trail ghost-trail--${i + 1}`, points: path.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ") })]
          : []
      )
    )
  }

  /** Dau cham tren bang: "guess" la diem nguoi hoc chon, "target" la diem dung. */
  setMarks(marks: { pos: Vec2; kind: "guess" | "target" }[]) {
    this.markLayer.replaceChildren(
      ...marks.map((m) => svg("circle", { class: `mark mark--${m.kind}`, cx: m.pos[0], cy: m.pos[1], r: 1 }))
    )
  }

  setBalls(setup: Setup) {
    for (const id of IDS) {
      const p = setup[id]
      this.balls[id].style.display = p ? "" : "none"
      if (p) setAttrs(this.balls[id], { cx: p[0], cy: p[1] })
    }
  }

  /** Ve tro giup ngam tu vi tri bi cai. `preview` null thi an het. */
  setAim(preview: AimPreview | null, aids: Aids, cue: Vec2 = [0, 0]) {
    const show = (node: SVGElement, on: boolean) => (node.style.display = on ? "" : "none")
    const ghost = preview?.ghost
    show(this.aimLine, !!preview && aids.aimLine)
    show(this.ghost, !!ghost && aids.ghostBall)
    show(this.objectLine, !!ghost && aids.ghostBall)
    show(this.tangentLine, !!ghost?.tangentEnd && aids.tangentLine)
    if (!preview) return
    const [ex, ey] = preview.end
    setAttrs(this.aimLine, { x1: cue[0], y1: cue[1], x2: ex, y2: ey })
    if (!ghost) return
    setAttrs(this.ghost, { cx: ex, cy: ey })
    // Doan ngan chi huong bi muc tieu se chay di.
    setAttrs(this.objectLine, {
      x1: ex + ghost.objectDir[0] * 3,
      y1: ey + ghost.objectDir[1] * 3,
      x2: ex + ghost.objectDir[0] * 9,
      y2: ey + ghost.objectDir[1] * 9,
    })
    if (ghost.tangentEnd) {
      setAttrs(this.tangentLine, { x1: ex, y1: ey, x2: ghost.tangentEnd[0], y2: ghost.tangentEnd[1] })
    }
  }

  /**
   * Ve cay co phia sau bi cai theo huong danh; `pull` 0..1 la do lui co. null de an.
   * Co ve dai hon ban nen phan thua bi khung hinh cat di.
   */
  setCue(cue: { pos: Vec2; angleDeg: number; pull: number } | null) {
    this.cueLayer.style.transition = "none"
    this.cueLayer.style.opacity = ""
    if (!cue) return this.cueLayer.replaceChildren()
    const a = (cue.angleDeg * Math.PI) / 180
    const back: Vec2 = [-Math.cos(a), -Math.sin(a)]
    const at = (d: number) => `${cue.pos[0] + back[0] * d},${cue.pos[1] + back[1] * d}`
    const tip = BALL_RADIUS + 0.4 + cue.pull * 14
    const line = (cls: string, from: number, to: number) => {
      const [x1, y1] = at(from).split(",")
      const [x2, y2] = at(to).split(",")
      return svg("line", { class: cls, x1, y1, x2, y2 })
    }
    this.cueLayer.replaceChildren(line("cue-stick", tip + 1, tip + 60), line("cue-stick cue-stick--tip", tip, tip + 1))
  }

  /** Lam cay co tren ban mo dan roi mat, giu nguyen vi tri dang ve. Goi nhieu lan cung khong sao. */
  fadeCue() {
    this.cueLayer.style.transition = "opacity 160ms linear"
    this.cueLayer.style.opacity = "0"
  }

  /** Huong ngam cua cu vua danh, ve mo tu vi tri bi cai (null de an). */
  setLastAim(line: { from: Vec2; to: Vec2 } | null) {
    this.lastAim.style.display = line ? "" : "none"
    if (line) setAttrs(this.lastAim, { x1: line.from[0], y1: line.from[1], x2: line.to[0], y2: line.to[1] })
  }

  /** Duong du doan cua bi cai (null de an). */
  setPredicted(path: Vec2[] | null) {
    this.predicted.style.display = path ? "" : "none"
    if (path) this.predicted.setAttribute("points", path.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" "))
  }

  /** Nap mot ket qua de phat lai (null de xoa vet). Goi setTime de dat thoi diem. */
  setReplay(result: SimResult | null) {
    this.replay = null
    for (const id of IDS) this.trails[id].setAttribute("points", "")
    if (!result) return
    const tracks: Partial<Record<BallId, Track>> = {}
    for (const id of IDS) {
      const path = result.paths[id]
      if (!path) continue
      tracks[id] = buildTrack(path)
      this.trails[id].setAttribute("points", path.map((p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(" "))
    }
    this.replay = { times: result.times, tracks }
    this.setTime(0)
  }

  setTime(t: number) {
    if (!this.replay) return
    for (const id of IDS) {
      const track = this.replay.tracks[id]
      if (!track) continue
      const { pos, length } = sampleAt(this.replay.times, track, t)
      setAttrs(this.balls[id], { cx: pos[0], cy: pos[1] })
      const total = track.cumulative[track.cumulative.length - 1]
      // Chi ve phan vet da di: mot net dai `length`, sau do la khoang trong.
      this.trails[id].style.strokeDasharray = `${length} ${total + 1}`
      this.trails[id].style.display = length > 0 ? "" : "none"
    }
  }
}
