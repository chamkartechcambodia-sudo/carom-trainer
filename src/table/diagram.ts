// Hinh ve giai thich cho bai Hieu: so do tinh co chu thich, ve bang SVG.
// Tat ca la hinh tu dung (khong sao chep so do cua sach hay trang web nao). Bai hoc chi
// khai bao loai hinh va tham so; file nay lo viec ve. Hinh la so do, khong phai mo phong:
// do dai mui ten va goc chi de minh hoa, tru khi chu thich ghi con so.
import { svg } from "../app/dom"
import "./diagram.css"

export type Diagram =
  | { kind: "speedDistance" }
  | { kind: "cushionLoss" }
  | { kind: "threeSpeeds" }
  | { kind: "thickness" }
  /** Bi ma va huong hai bi sau cham. `paths`: ve them duong bi cai khi con xoay toi / xoay lui. */
  | { kind: "ghost"; tangent?: boolean; paths?: ("follow" | "draw")[] }
  | { kind: "speedSplit" }
  | { kind: "spinTriple" }
  | { kind: "slideToRoll" }
  | { kind: "mirror"; speed?: boolean }
  | { kind: "english"; mode: "headOn" | "oblique" }
  | { kind: "patterns" }
  | { kind: "squirt" }
  | { kind: "tipFace"; mode: "nine" | "axes" | "high" }
  | { kind: "bigBall" }
  | { kind: "cluster" }
  | { kind: "whoStays" }
  | { kind: "meeting" }
  | { kind: "smallGame" }
  | { kind: "railBall" }
  | { kind: "cornerZones" }

type Pt = [number, number]
type BallKind = "cue" | "yellow" | "red" | "ghost"

const W = 340

// ---------- But ve ----------
const line = (a: Pt, b: Pt, cls = "") => svg("line", { class: `dg-line ${cls}`.trim(), x1: a[0], y1: a[1], x2: b[0], y2: b[1] })

function head(from: Pt, to: Pt, cls: string) {
  const d = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1
  const ux = (to[0] - from[0]) / d
  const uy = (to[1] - from[1]) / d
  const bx = to[0] - ux * 9
  const by = to[1] - uy * 9
  const pts = [to, [bx - uy * 4, by + ux * 4], [bx + uy * 4, by - ux * 4]].map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")
  return svg("polygon", { class: `dg-head ${cls}`.trim(), points: pts })
}

const arrow = (a: Pt, b: Pt, cls = ""): SVGElement[] => [line(a, b, cls), head(a, b, cls)]

/** Duong cong bac hai tu a qua diem keo c toi b, co mui ten o cuoi. */
function curve(a: Pt, c: Pt, b: Pt, cls = ""): SVGElement[] {
  return [svg("path", { class: `dg-line ${cls}`.trim(), d: `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}` }), head(c, b, cls)]
}

const ball = (p: Pt, r: number, kind: BallKind) => svg("circle", { class: `dg-ball dg-ball--${kind}`, cx: p[0], cy: p[1], r })

function text(p: Pt, content: string, cls = "", anchor: "start" | "middle" | "end" = "middle") {
  const node = svg("text", { class: `dg-text ${cls}`.trim(), x: p[0], y: p[1], "text-anchor": anchor })
  node.textContent = content
  return node
}

/** Nhieu dong chu, dong sau thap hon dong truoc 13 don vi. */
const lines = (p: Pt, rows: string[], cls = "", anchor: "start" | "middle" | "end" = "middle") =>
  rows.map((row, i) => text([p[0], p[1] + i * 13], row, cls, anchor))

const felt = (x: number, y: number, w: number, h: number) => svg("rect", { class: "dg-felt", x, y, width: w, height: h, rx: 6 })

/** Ban thu nho: vien go va mat ni. Tra ve cac phan tu va khung mat ni [x, y, w, h]. */
function miniTable(x: number, y: number, w: number, h: number): SVGElement[] {
  return [svg("rect", { class: "dg-rail", x: x - 6, y: y - 6, width: w + 12, height: h + 12, rx: 6 }), svg("rect", { class: "dg-felt", x, y, width: w, height: h })]
}

/** Mot doan bang (thanh go) nam ngang. */
const cushion = (x: number, y: number, w: number) => svg("rect", { class: "dg-rail", x, y, width: w, height: 12, rx: 3 })

/** Mui ten cong quanh vien bi nhin ngang: `dir` 1 la quay thuan chieu kim dong ho. */
function spin(p: Pt, r: number, dir: 1 | -1, cls = "dg-accent"): SVGElement[] {
  const R = r + 6
  const a0 = dir === 1 ? -150 : -30
  const a1 = dir === 1 ? -30 : -150
  const at = (deg: number): Pt => [p[0] + R * Math.cos((deg * Math.PI) / 180), p[1] + R * Math.sin((deg * Math.PI) / 180)]
  const s = at(a0)
  const e = at(a1)
  const before = at(a1 - dir * 25)
  return [
    svg("path", { class: `dg-line ${cls}`, d: `M${s[0].toFixed(1)} ${s[1].toFixed(1)} A${R} ${R} 0 0 ${dir === 1 ? 1 : 0} ${e[0].toFixed(1)} ${e[1].toFixed(1)}` }),
    head(before, e, cls),
  ]
}

/** Mat bi cai nhin tu phia nguoi danh, kem mot cham do o cho dau co cham (don vi: phan ban kinh). */
function face(p: Pt, r: number, tip: Pt | null): SVGElement[] {
  const out: SVGElement[] = [
    ball(p, r, "cue"),
    line([p[0] - r, p[1]], [p[0] + r, p[1]], "dg-thin"),
    line([p[0], p[1] - r], [p[0], p[1] + r], "dg-thin"),
  ]
  if (tip) out.push(svg("circle", { class: "dg-tip", cx: p[0] + tip[0] * r, cy: p[1] - tip[1] * r, r: Math.max(2.5, r * 0.13) }))
  return out
}

interface Drawing {
  h: number
  alt: string
  nodes: SVGElement[]
}

// ---------- Cac hinh ----------
function speedDistance(): Drawing {
  const rows: [string, number, string][] = [
    ["Tốc độ ×1", 1, "lăn xa ×1"],
    ["Tốc độ ×2", 4, "lăn xa ×4"],
    ["Tốc độ ×3", 9, "lăn xa ×9"],
  ]
  const unit = 21
  const nodes = rows.flatMap(([label, times, far], i) => {
    const y = 28 + i * 40
    return [
      text([8, y + 4], label, "", "start"),
      ball([86, y], 7, "cue"),
      ...arrow([94, y], [94 + times * unit, y], "dg-accent"),
      text([100 + times * unit, y + 4], far, "dg-strong", "start"),
    ]
  })
  return { h: 132, alt: "Tốc độ gấp đôi thì bi lăn xa gấp bốn; gấp ba thì xa gấp chín.", nodes }
}

function cushionLoss(): Drawing {
  return {
    h: 178,
    alt: "Đâm thẳng vào băng thì bi bật ra chậm hẳn; đi sượt dọc băng thì gần như giữ nguyên tốc độ.",
    nodes: [
      cushion(10, 8, 150),
      cushion(180, 8, 150),
      text([85, 172], "Đâm thẳng: mất nhiều tốc độ", "dg-strong"),
      text([255, 172], "Đi sượt: mất ít", "dg-strong"),
      // Dam thang: mui ten toi dai, mui ten bat ra ngan.
      ball([70, 138], 8, "cue"),
      ...arrow([70, 128], [70, 24], "dg-accent"),
      ...arrow([100, 24], [100, 78], "dg-dash"),
      text([64, 80], "tới", "", "end"),
      text([108, 56], "bật ra", "", "start"),
      // Di suot: hai mui ten gan bang nhau.
      ball([196, 62], 8, "cue"),
      ...arrow([204, 58], [252, 24], "dg-accent"),
      ...arrow([258, 24], [304, 56], "dg-dash"),
      text([214, 34], "tới", "", "end"),
      text([296, 34], "bật ra", "", "start"),
      ...lines([255, 96], ["Độ dài mũi tên = tốc độ.", "Hình minh họa, không phải số đo."], "dg-muted"),
    ],
  }
}

function threeSpeeds(): Drawing {
  const [x, y, w, h] = [20, 16, 300, 126]
  const row = (i: number) => y + 26 + i * 38
  return {
    h: 158,
    alt: "Ba mức lực chuẩn: nhẹ là nửa bàn, vừa là hết chiều dài bàn, mạnh là đi tới băng bên kia rồi quay về.",
    nodes: [
      ...miniTable(x, y, w, h),
      ball([x + 12, row(0)], 6, "cue"),
      ...arrow([x + 20, row(0)], [x + w / 2, row(0)], "dg-onfelt"),
      text([x + w / 2 + 8, row(0) + 4], "Nhẹ: nửa bàn", "dg-onfelt", "start"),
      ball([x + 12, row(1)], 6, "cue"),
      ...arrow([x + 20, row(1)], [x + w - 8, row(1)], "dg-onfelt"),
      text([x + 150, row(1) - 6], "Vừa: hết một chiều dài bàn", "dg-onfelt"),
      ball([x + 12, row(2)], 6, "cue"),
      line([x + 20, row(2)], [x + w - 4, row(2)], "dg-onfelt"),
      ...arrow([x + w - 4, row(2) + 9], [x + 30, row(2) + 9], "dg-onfelt dg-dash"),
      text([x + 150, row(2) - 6], "Mạnh: tới băng bên kia rồi quay về", "dg-onfelt"),
    ],
  }
}

function thickness(): Drawing {
  const cols: [string, number, string][] = [
    ["Đầy", 1, "0°"],
    ["3/4 bi", 0.75, "≈ 15°"],
    ["Nửa bi", 0.5, "30°"],
    ["1/4 bi", 0.25, "≈ 49°"],
    ["Mỏng", 0.1, "≈ 64°"],
  ]
  const r = 16
  const nodes: SVGElement[] = [text([W / 2, 14], "Nhìn từ phía người đánh: bi cái (trắng) che lên bi vàng bao nhiêu", "dg-muted")]
  cols.forEach(([label, fraction, cut], i) => {
    const cx = 34 + i * 68
    const shift = 2 * r * (1 - fraction)
    nodes.push(
      ball([cx - shift / 2, 52], r, "yellow"),
      svg("circle", { class: "dg-ball dg-ball--cue dg-ball--over", cx: cx + shift / 2, cy: 52, r }),
      text([cx, 92], label, "dg-strong"),
      text([cx, 108], cut, "")
    )
  })
  nodes.push(text([W / 2, 126], "Hàng số dưới: bi vàng chạy lệch bao nhiêu so với hướng đánh", "dg-muted"))
  return { h: 134, alt: "Năm độ dày chạm nhìn từ phía người đánh: đầy, ba phần tư, nửa bi, một phần tư, mỏng; và góc bi mục tiêu chạy lệch tương ứng.", nodes }
}

function ghost(tangent: boolean, paths: ("follow" | "draw")[]): Drawing {
  const r = 15
  const cue: Pt = [42, 96]
  const g: Pt = [188, 96]
  const cut = (30 * Math.PI) / 180
  // Truc y cua SVG huong xuong: bi vang nam chech len tren, bi cai lech xuong duoi.
  const o: Pt = [g[0] + 2 * r * Math.cos(cut), g[1] - 2 * r * Math.sin(cut)]
  const od: Pt = [Math.cos(cut), -Math.sin(cut)]
  const td: Pt = [Math.sin(cut), Math.cos(cut)]
  const at = (p: Pt, d: Pt, t: number): Pt => [p[0] + d[0] * t, p[1] + d[1] * t]
  const nodes: SVGElement[] = [
    felt(4, 4, W - 8, 192),
    line(cue, [g[0] + 120, g[1]], "dg-onfelt dg-thin dg-dash"),
    ...arrow(at(cue, [1, 0], r + 2), at(g, [-1, 0], r + 4), "dg-onfelt"),
    ball(cue, r, "cue"),
    ball(o, r, "yellow"),
    ball(g, r, "ghost"),
    ...arrow(at(o, od, r + 2), at(o, od, r + 70), "dg-yellowline"),
    text([cue[0], cue[1] + 30], "bi cái", "dg-onfelt"),
    ...lines([g[0] - 34, g[1] - 34], ["bi ma: chỗ bi cái", "nằm lúc chạm"], "dg-onfelt", "end"),
    line([g[0] - 30, g[1] - 26], [g[0] - 9, g[1] - 11], "dg-onfelt dg-thin"),
    ...lines([W - 12, 20], ["bi vàng chạy theo đường", "nối hai tâm"], "dg-onfelt", "end"),
  ]
  if (tangent) {
    const s = 9
    nodes.push(
      ...arrow(at(g, td, r + 2), at(g, td, 84), "dg-onfelt dg-dot"),
      // Dau goc vuong giua duong noi tam va duong 90 do.
      svg("path", {
        class: "dg-line dg-onfelt dg-thin",
        d: `M${at(g, od, s)[0]} ${at(g, od, s)[1]} L${at(at(g, od, s), td, s)[0]} ${at(at(g, od, s), td, s)[1]} L${at(g, td, s)[0]} ${at(g, td, s)[1]}`,
      }),
      text([at(g, td, 92)[0] + 6, at(g, td, 92)[1] + 4], "đường 90°", "dg-onfelt dg-strong", "start")
    )
  }
  if (paths.includes("follow")) {
    const end = at(at(g, td, 50), [1, 0], 74)
    nodes.push(...curve(at(g, td, r + 2), at(g, td, 52), end, "dg-onfelt"), ...lines([end[0] - 2, end[1] + 16], ["trên tâm:", "cong về trước"], "dg-onfelt", "middle"))
  }
  if (paths.includes("draw")) {
    const end = at(at(g, td, 50), [-1, 0], 70)
    nodes.push(...curve(at(g, td, r + 2), at(g, td, 52), end, "dg-onfelt"), ...lines([end[0] - 2, end[1] + 16], ["dưới tâm:", "cong về sau"], "dg-onfelt", "middle"))
  }
  return {
    h: 200,
    alt: tangent
      ? "Nhìn từ trên xuống: bi ma là chỗ bi cái nằm lúc chạm. Bi vàng chạy theo đường nối hai tâm; bi cái rời đi theo đường vuông góc với đường đó, gọi là đường 90°."
      : "Nhìn từ trên xuống: bi ma là chỗ bi cái nằm lúc chạm. Bi vàng chạy theo đường nối tâm bi ma với tâm của nó.",
    nodes,
  }
}

function speedSplit(): Drawing {
  const rows: [string, number, number][] = [
    ["Dày (3/4 bi)", 97, 25],
    ["Nửa bi", 87, 50],
    ["Mỏng (1/4 bi)", 66, 75],
  ]
  const x0 = 104
  const full = 170
  const nodes: SVGElement[] = [text([W / 2, 14], "Mỗi bi nhận bao nhiêu phần tốc độ của bi cái lúc tới (lý thuyết)", "dg-muted")]
  rows.forEach(([label, object, cueShare], i) => {
    const y = 34 + i * 48
    nodes.push(
      text([8, y + 16], label, "dg-strong", "start"),
      svg("rect", { class: "dg-bar dg-bar--yellow", x: x0, y, width: (full * object) / 100, height: 13, rx: 3 }),
      text([x0 + (full * object) / 100 + 6, y + 11], `bi vàng ${object}%`, "", "start"),
      svg("rect", { class: "dg-bar dg-bar--cue", x: x0, y: y + 17, width: (full * cueShare) / 100, height: 13, rx: 3 }),
      text([x0 + (full * cueShare) / 100 + 6, y + 28], `bi cái ${cueShare}%`, "", "start")
    )
  })
  return { h: 176, alt: "Chạm dày: bi vàng nhận 97% tốc độ, bi cái còn 25%. Nửa bi: 87% và 50%. Chạm mỏng: 66% và 75%.", nodes }
}

function spinTriple(): Drawing {
  const cols: { x: number; title: string; tip: Pt; dir: 1 | -1 | 0; spinLabel: string; result: string }[] = [
    { x: 58, title: "Chạm trên tâm", tip: [0, 0.5], dir: 1, spinLabel: "xoáy tới", result: "đi theo" },
    { x: 170, title: "Hết xoáy lúc chạm", tip: [0, -0.15], dir: 0, spinLabel: "không quay", result: "dừng lại" },
    { x: 282, title: "Chạm dưới tâm", tip: [0, -0.6], dir: -1, spinLabel: "xoáy lui", result: "lùi về" },
  ]
  const nodes: SVGElement[] = [line([10, 142], [W - 10, 142], "dg-thin")]
  for (const c of cols) {
    nodes.push(
      text([c.x, 14], c.title, "dg-strong"),
      ...face([c.x, 46], 22, c.tip),
      // Nhin ngang: bi dang di sang phai tren mat ni.
      ball([c.x - 10, 124], 16, "cue"),
      ...arrow([c.x + 12, 124], [c.x + 40, 124], "dg-thin"),
      ...(c.dir === 0 ? [] : spin([c.x - 10, 124], 16, c.dir)),
      text([c.x, 96], c.spinLabel, ""),
      text([c.x, 196], c.result, "dg-strong")
    )
    // Ket qua sau khi cham day vao bi vang.
    nodes.push(ball([c.x + 6, 168], 8, "yellow"))
    if (c.dir === 1) nodes.push(ball([c.x - 34, 168], 8, "cue"), ...arrow([c.x - 24, 168], [c.x - 6, 168], "dg-accent"))
    else if (c.dir === 0) nodes.push(ball([c.x - 12, 168], 8, "cue"))
    else nodes.push(ball([c.x - 12, 168], 8, "cue"), ...arrow([c.x - 22, 168], [c.x - 46, 168], "dg-accent"))
  }
  nodes.push(...lines([W / 2, 212], ["Hàng giữa: nhìn ngang, bi đang đi sang phải.", "Hàng dưới: bi cái làm gì sau khi chạm đầy bi vàng."], "dg-muted"))
  return {
    h: 232,
    alt: "Ba cột. Chạm trên tâm: bi cái xoáy tới, sau khi chạm đầy thì đi theo. Hết xoáy lúc chạm: bi cái dừng lại. Chạm dưới tâm: bi cái xoáy lui, sau khi chạm thì lùi về.",
    nodes,
  }
}

function slideToRoll(): Drawing {
  const xs = [44, 130, 214, 296]
  const labels = [["vừa đánh:", "trượt"], ["nỉ cọ đáy bi,", "bắt đầu quay"], ["quay", "nhanh dần"], ["lăn", "tự nhiên"]]
  const nodes: SVGElement[] = [line([8, 62], [W - 8, 62], "dg-thin"), text([W / 2, 12], "Nhìn ngang, bi đi sang phải. Chạm giữa tâm.", "dg-muted")]
  xs.forEach((x, i) => {
    nodes.push(ball([x, 46], 15, "cue"))
    if (i > 0) nodes.push(...spin([x, 46], 15, 1, i === 3 ? "dg-accent" : "dg-accent dg-thin"))
    nodes.push(...lines([x, 80], labels[i], i === 0 || i === 3 ? "dg-strong" : ""))
    if (i < 3) nodes.push(...arrow([x + 26, 46], [x + 52, 46], "dg-thin"))
  })
  return { h: 102, alt: "Bi chạm giữa tâm lúc đầu trượt mà chưa quay; nỉ cọ làm nó quay dần cho tới khi lăn tự nhiên.", nodes }
}

function mirror(speed: boolean): Drawing {
  const p: Pt = [170, 26]
  const nodes: SVGElement[] = [
    cushion(20, 12, 300),
    line(p, [170, 150], "dg-thin dg-dash"),
    ...arrow([62, 150], [p[0] - 3, p[1] + 4], "dg-accent"),
    ...arrow(p, [278, 150], "dg-accent"),
    ball([54, 158], 8, "cue"),
    svg("path", { class: "dg-line dg-thin", d: "M170 76 A50 50 0 0 1 137 64" }),
    svg("path", { class: "dg-line dg-thin", d: "M170 76 A50 50 0 0 0 203 64" }),
    text([140, 60], "góc tới", "", "end"),
    text([200, 60], "góc bật", "", "start"),
  ]
  if (speed) {
    nodes.push(
      ...arrow(p, [236, 150], "dg-dash"),
      ...arrow(p, [318, 136], "dg-dot"),
      line([24, 172], [52, 172], "dg-accent"),
      text([58, 176], "lực vừa: góc bật gần bằng góc tới", "", "start"),
      line([24, 188], [52, 188], "dg-dash"),
      text([58, 192], "đánh mạnh: bật dựng hơn", "", "start"),
      line([24, 204], [52, 204], "dg-dot"),
      text([58, 208], "đánh nhẹ: bật thoải hơn", "", "start")
    )
  } else nodes.push(text([170, 166], "nét đứt: đường vuông góc với băng", "dg-muted"))
  return {
    h: speed ? 214 : 174,
    alt: speed
      ? "Bi không xoáy bật băng với góc bật gần bằng góc tới. Đánh mạnh thì bật dựng hơn, đánh nhẹ thì bật thoải hơn."
      : "Bi không xoáy bật băng với góc bật gần bằng góc tới, đo so với đường vuông góc với băng.",
    nodes,
  }
}

function english(mode: "headOn" | "oblique"): Drawing {
  const p: Pt = [170, 26]
  if (mode === "headOn") {
    return {
      h: 214,
      alt: "Đâm thẳng vào băng: chạm bên trái thì bi bật sang trái, giữa tâm thì bật thẳng về, chạm bên phải thì bật sang phải.",
      nodes: [
        cushion(20, 12, 300),
        ...arrow([170, 128], [170, 30], "dg-accent"),
        ball([170, 138], 9, "cue"),
        ...arrow([164, 28], [84, 112], "dg-dash"),
        ...arrow([176, 28], [256, 112], "dg-dash"),
        ...arrow([184, 30], [184, 96], "dg-dot"),
        ...face([62, 144], 18, [-0.5, 0]),
        ...face([278, 144], 18, [0.5, 0]),
        ...lines([62, 178], ["chạm trái:", "bật sang trái"], "dg-strong"),
        ...lines([278, 178], ["chạm phải:", "bật sang phải"], "dg-strong"),
        ...lines([170, 164], ["giữa tâm:", "bật thẳng về"], ""),
        text([170, 208], "Trái, phải tính theo người đánh đang nhìn về phía băng.", "dg-muted"),
      ],
    }
  }
  return {
    h: 206,
    alt: "Đâm xéo vào băng, bi trôi sang phải: xoáy phải là thuận, góc bật mở rộng và bi nhanh hơn; xoáy trái là nghịch, góc bật dựng lại và bi chậm đi.",
    nodes: [
      cushion(20, 12, 300),
      ...arrow([70, 44], [150, 44], "dg-thin"),
      text([24, 58], "bi đang trôi sang phải dọc băng", "dg-muted", "start"),
      ...arrow([84, 140], [p[0] - 3, p[1] + 4], "dg-accent"),
      ball([78, 148], 9, "cue"),
      ...arrow(p, [222, 142], "dg-dash"),
      ...arrow(p, [256, 140], "dg-dot"),
      ...arrow(p, [318, 108], "dg-accent"),
      line([24, 164], [52, 164], "dg-dash"),
      text([58, 168], "xoáy trái = NGHỊCH: dựng lại, bi chậm đi", "", "start"),
      line([24, 180], [52, 180], "dg-dot"),
      text([58, 184], "không xoáy", "", "start"),
      line([24, 196], [52, 196], "dg-accent"),
      text([58, 200], "xoáy phải = THUẬN: mở rộng, bi nhanh hơn", "", "start"),
    ],
  }
}

function patterns(): Drawing {
  const a: [number, number, number, number] = [16, 28, 144, 86]
  const b: [number, number, number, number] = [180, 28, 144, 86]
  const num = (p: Pt, n: number) => [svg("circle", { class: "dg-num", cx: p[0], cy: p[1], r: 7 }), text([p[0], p[1] + 4], String(n), "dg-numtext")]
  return {
    h: 150,
    alt: "Hai kiểu ghi điểm có băng. Bi, băng, bi: bi cái chạm bi thứ nhất, tới băng, rồi tới bi thứ hai. Băng trước: bi cái chạm băng trước rồi mới chạm hai bi.",
    nodes: [
      text([a[0] + a[2] / 2, 14], "Bi, băng, bi", "dg-strong"),
      ...miniTable(...a),
      svg("polyline", { class: "dg-line dg-onfelt", points: "36,96 70,70 104,28 138,62" }),
      ball([36, 96], 6, "cue"),
      ball([76, 66], 6, "yellow"),
      ball([142, 66], 6, "red"),
      ...num([64, 58], 1),
      ...num([104, 40], 2),
      ...num([142, 50], 3),
      text([b[0] + b[2] / 2, 14], "Băng trước", "dg-strong"),
      ...miniTable(...b),
      svg("polyline", { class: "dg-line dg-onfelt", points: "200,100 250,28 284,72 300,92" }),
      ball([200, 100], 6, "cue"),
      ball([288, 78], 6, "yellow"),
      ball([304, 98], 6, "red"),
      ...num([250, 40], 1),
      ...num([276, 80], 2),
      ...num([314, 86], 3),
      text([W / 2, 140], "Số 1, 2, 3 là thứ tự bi cái chạm.", "dg-muted"),
    ],
  }
}

function squirt(): Drawing {
  return {
    h: 150,
    alt: "Chạm bên phải tâm: bi cái không đi đúng hướng cây cơ chỉ mà lệch sang trái, rồi cong về lại một chút. Hình đã phóng đại.",
    nodes: [
      felt(4, 4, W - 8, 142),
      line([62, 86], [330, 86], "dg-onfelt dg-thin dg-dash"),
      svg("line", { class: "dg-cue", x1: 6, y1: 95, x2: 44, y2: 95 }),
      ball([62, 86], 17, "cue"),
      svg("circle", { class: "dg-tip", cx: 47, cy: 95, r: 3 }),
      ...curve([80, 82], [200, 40], [320, 52], "dg-onfelt"),
      text([200, 104], "hướng cây cơ đang chỉ", "dg-onfelt"),
      ...lines([196, 22], ["bi cái đi thật: lệch sang trái,", "rồi cong về lại một chút"], "dg-onfelt"),
      ...lines([64, 122], ["chạm bên phải tâm", "(nhìn từ sau cây cơ)"], "dg-onfelt"),
      text([330, 138], "đã phóng đại", "dg-onfelt dg-muted", "end"),
    ],
  }
}

function tipFace(mode: "nine" | "axes" | "high"): Drawing {
  const c: Pt = [170, 104]
  const r = 62
  const nodes: SVGElement[] = [ball(c, r, "cue"), svg("circle", { class: "dg-line dg-thin dg-dash dg-nofill", cx: c[0], cy: c[1], r: r / 2 })]
  const dot = (x: number, y: number) => svg("circle", { class: "dg-tip", cx: c[0] + x * r, cy: c[1] - y * r, r: 4 })
  if (mode === "high") {
    nodes.push(line([c[0] - r, c[1]], [c[0] + r, c[1]], "dg-thin"), line([c[0], c[1] - r], [c[0], c[1] + r], "dg-thin"), dot(0, 0.2))
    nodes.push(line([c[0] + 6, c[1] - r * 0.2], [c[0] + 66, c[1] - 44], "dg-thin"), text([c[0] + 70, c[1] - 42], "chạm hơi trên tâm", "dg-strong", "start"))
    nodes.push(text([c[0] - 68, c[1] + 44], "vòng nét đứt:", "dg-muted", "end"), text([c[0] - 68, c[1] + 57], "giới hạn an toàn", "dg-muted", "end"))
    return { h: 190, alt: "Mặt bi cái nhìn từ phía người đánh, điểm chạm nằm hơi trên tâm một chút.", nodes }
  }
  const k = 0.4
  const names: [number, number, string, Pt, "start" | "middle" | "end"][] = [
    [0, 1, "Trên", [0, -r - 8], "middle"],
    [1, 1, "Trên phải", [r * 0.78, -r * 0.82], "start"],
    [1, 0, "Phải", [r + 8, 4], "start"],
    [1, -1, "Dưới phải", [r * 0.78, r * 0.9], "start"],
    [0, -1, "Dưới", [0, r + 16], "middle"],
    [-1, -1, "Dưới trái", [-r * 0.78, r * 0.9], "end"],
    [-1, 0, "Trái", [-r - 8, 4], "end"],
    [-1, 1, "Trên trái", [-r * 0.78, -r * 0.82], "end"],
  ]
  nodes.push(dot(0, 0))
  for (const [x, y, name, at, anchor] of names) {
    const f = x !== 0 && y !== 0 ? k * 0.75 : k
    nodes.push(dot(x * f, y * f))
    if (mode === "nine") nodes.push(text([c[0] + at[0], c[1] + at[1]], name, "", anchor))
  }
  if (mode === "nine") {
    nodes.push(text([W / 2, 198], "Chấm giữa: giữa tâm. Vòng nét đứt: giới hạn an toàn (nửa bán kính bi).", "dg-muted"))
    return { h: 204, alt: "Chín điểm chạm trên mặt bi cái: giữa tâm, trên, dưới, trái, phải và bốn điểm chéo, tất cả nằm trong vòng giới hạn nửa bán kính.", nodes }
  }
  nodes.push(
    ...arrow([c[0], c[1] + r - 6], [c[0], c[1] - r + 6], "dg-accent"),
    ...arrow([c[0], c[1] - r + 6], [c[0], c[1] + r - 6], "dg-accent"),
    ...arrow([c[0] - r + 6, c[1]], [c[0] + r - 6, c[1]], "dg-dash"),
    ...arrow([c[0] + r - 6, c[1]], [c[0] - r + 6, c[1]], "dg-dash"),
    ...lines([c[0], 12], ["Trục dọc (trên, dưới):", "bi cái làm gì sau khi chạm BI"], "dg-strong"),
    ...lines([c[0], c[1] + r + 20], ["Trục ngang (trái, phải):", "bi cái làm gì khi chạm BĂNG"], "dg-strong")
  )
  return { h: 206, alt: "Hai trục của điểm chạm. Trục dọc quyết định bi cái làm gì sau khi chạm bi; trục ngang quyết định bi cái làm gì khi chạm băng.", nodes }
}

function bigBall(): Drawing {
  return {
    h: 176,
    alt: "Bi nằm giữa bàn: bi cái đi lệch ra ngoài là trượt. Bi nằm gần băng: bi cái đi lệch ra ngoài một chút vẫn bật băng quay lại chạm, nên mục tiêu to hơn.",
    nodes: [
      felt(6, 6, 158, 132),
      felt(176, 6, 158, 132),
      cushion(176, 6, 158),
      // Bi giua ban: lech la truot.
      ball([86, 60], 10, "red"),
      ...arrow([40, 128], [80, 70], "dg-onfelt"),
      ...arrow([58, 128], [124, 24], "dg-onfelt dg-dash"),
      text([86, 156], "Bi giữa bàn", "dg-strong"),
      text([86, 170], "đi lệch (nét đứt) là trượt", ""),
      // Bi gan bang: lech van bat bang cham lai.
      ball([256, 34], 10, "red"),
      ...arrow([210, 128], [250, 44], "dg-onfelt"),
      svg("polyline", { class: "dg-line dg-onfelt dg-dash", points: "228,128 276,20 266,30" }),
      text([256, 156], "Bi gần băng", "dg-strong"),
      text([256, 170], "đi lệch vẫn bật băng chạm lại", ""),
    ],
  }
}

function cluster(): Drawing {
  const a: [number, number, number, number] = [16, 28, 144, 78]
  const b: [number, number, number, number] = [180, 28, 144, 78]
  return {
    h: 134,
    alt: "Ba bi nằm gần nhau thì cú sau dễ; ba bi tản ra khắp bàn thì cú sau khó.",
    nodes: [
      ...miniTable(...a),
      ball([78, 62], 6, "cue"),
      ball([94, 56], 6, "yellow"),
      ball([92, 74], 6, "red"),
      text([a[0] + a[2] / 2, 14], "Ba bi gần nhau", "dg-strong"),
      text([a[0] + a[2] / 2, 128], "cú sau dễ, chuỗi tiếp tục", ""),
      ...miniTable(...b),
      ball([196, 92], 6, "cue"),
      ball([252, 40], 6, "yellow"),
      ball([312, 86], 6, "red"),
      text([b[0] + b[2] / 2, 14], "Ba bi tản ra", "dg-strong"),
      text([b[0] + b[2] / 2, 128], "cú sau khó, chuỗi dễ đứt", ""),
    ],
  }
}

function whoStays(): Drawing {
  return {
    h: 160,
    alt: "Chạm dày: bi vàng chạy xa, bi cái ở lại gần. Chạm mỏng: bi vàng chỉ nhích đi, bi cái đi tiếp.",
    nodes: [
      felt(6, 6, 158, 112),
      felt(176, 6, 158, 112),
      // Cham day
      ball([36, 70], 9, "cue"),
      ball([70, 66], 9, "yellow"),
      ...arrow([82, 64], [152, 54], "dg-yellowline"),
      ...arrow([48, 78], [66, 92], "dg-onfelt"),
      text([85, 136], "Chạm dày", "dg-strong"),
      text([85, 150], "bi vàng chạy, bi cái ở lại", ""),
      // Cham mong
      ball([206, 78], 9, "cue"),
      ball([240, 62], 9, "yellow"),
      ...arrow([250, 54], [262, 44], "dg-yellowline"),
      ...arrow([218, 80], [318, 96], "dg-onfelt"),
      text([255, 136], "Chạm mỏng", "dg-strong"),
      text([255, 150], "bi vàng ở lại, bi cái đi tiếp", ""),
    ],
  }
}

function meeting(): Drawing {
  const t: [number, number, number, number] = [20, 14, 300, 140]
  return {
    h: 190,
    alt: "Điểm hẹn: coi chỗ bi đỏ nằm là nơi cả ba bi gặp lại. Bi cái tới đó vừa hết đà; bi vàng ở lại gần hoặc đi một vòng rồi quay về gần đó.",
    nodes: [
      ...miniTable(...t),
      svg("circle", { class: "dg-line dg-onfelt dg-dash dg-nofill", cx: 224, cy: 66, r: 30 }),
      ball([232, 60], 7, "red"),
      ball([92, 116], 7, "cue"),
      ball([150, 96], 7, "yellow"),
      ...arrow([100, 113], [142, 99], "dg-onfelt"),
      ...curve([150, 88], [176, 60], [214, 70], "dg-onfelt"),
      svg("polyline", { class: "dg-line dg-yellowline dg-dash", points: "158,94 262,154 300,90 246,74" }),
      head([300, 90], [246, 74], "dg-yellowline"),
      text([224, 30], "điểm hẹn", "dg-onfelt dg-strong"),
      text([170, 176], "Nét liền: bi cái. Nét đứt vàng: bi vàng đi một vòng rồi quay về.", "dg-muted"),
    ],
  }
}

function smallGame(): Drawing {
  return {
    h: 150,
    alt: "Cú nhỏ: ba bi chỉ nhích vài phân và vẫn nằm gần nhau. Cú quá tay: ba bi văng ra xa nhau.",
    nodes: [
      felt(6, 6, 158, 106),
      felt(176, 6, 158, 106),
      ball([66, 70], 9, "cue"),
      ball([92, 50], 9, "yellow"),
      ball([104, 76], 9, "red"),
      ...arrow([74, 62], [82, 56], "dg-onfelt"),
      ...arrow([100, 44], [106, 40], "dg-yellowline"),
      text([85, 130], "Cú nhỏ", "dg-strong"),
      text([85, 144], "ba bi chỉ nhích vài phân", ""),
      ball([228, 78], 9, "cue"),
      ball([254, 58], 9, "yellow"),
      ball([266, 84], 9, "red"),
      ...arrow([262, 50], [316, 20], "dg-yellowline"),
      ...arrow([220, 86], [190, 104], "dg-onfelt"),
      ...arrow([276, 88], [322, 98], "dg-redline"),
      text([255, 130], "Cú quá tay", "dg-strong"),
      text([255, 144], "ba bi văng ra xa nhau", ""),
    ],
  }
}

function railBall(): Drawing {
  return {
    h: 170,
    alt: "Bi sát băng: đánh thẳng vào nó theo hướng vuông góc với băng thì nó bật mạnh ra giữa bàn; đánh nhẹ dọc theo băng thì nó ở lại gần băng.",
    nodes: [
      felt(6, 6, 158, 122),
      felt(176, 6, 158, 122),
      cushion(6, 6, 158),
      cushion(176, 6, 158),
      ball([85, 28], 9, "yellow"),
      ball([85, 108], 9, "cue"),
      ...arrow([85, 98], [85, 40], "dg-onfelt"),
      ...arrow([97, 34], [140, 112], "dg-yellowline dg-dash"),
      text([85, 146], "Đánh vuông góc vào băng", "dg-strong"),
      text([85, 160], "bi bật mạnh ra giữa bàn", ""),
      ball([262, 28], 9, "yellow"),
      ball([200, 44], 9, "cue"),
      ...arrow([210, 41], [250, 31], "dg-onfelt"),
      ...arrow([273, 28], [300, 28], "dg-yellowline"),
      text([255, 146], "Đánh nhẹ dọc theo băng", "dg-strong"),
      text([255, 160], "bi ở lại gần băng", ""),
    ],
  }
}

function cornerZones(): Drawing {
  const [x, y, w, h] = [26, 34, 288, 144]
  const a = w / 4
  const b = h / 4
  const tri = (cx: number, cy: number, sx: number, sy: number) =>
    svg("polygon", { class: "dg-zone", points: `${cx},${cy} ${cx + sx * a},${cy} ${cx},${cy + sy * b}` })
  return {
    h: 204,
    alt: "Bốn vùng góc hình tam giác trên bàn phăng tự do: cạnh dọc băng dài 71 cm, cạnh dọc băng ngắn 35,5 cm.",
    nodes: [
      ...miniTable(x, y, w, h),
      tri(x, y, 1, 1),
      tri(x + w, y, -1, 1),
      tri(x, y + h, 1, -1),
      tri(x + w, y + h, -1, -1),
      line([x, y - 14], [x + a, y - 14], "dg-thin"),
      line([x, y - 18], [x, y - 10], "dg-thin"),
      line([x + a, y - 18], [x + a, y - 10], "dg-thin"),
      text([x + a / 2, y - 18], "71 cm", "dg-strong"),
      line([x - 14, y], [x - 14, y + b], "dg-thin"),
      text([x + 16, y + b + 16], "35,5 cm", "dg-onfelt dg-strong", "start"),
      line([x - 18, y], [x - 10, y], "dg-thin"),
      line([x - 18, y + b], [x - 10, y + b], "dg-thin"),
      text([x + w / 2, y + h / 2 + 4], "ngoài bốn tam giác: không giới hạn", "dg-onfelt"),
      text([W / 2, 198], "Mỗi tam giác: 1/4 chiều dài bàn và 1/4 chiều rộng bàn.", "dg-muted"),
    ],
  }
}

function draw(d: Diagram): Drawing {
  switch (d.kind) {
    case "speedDistance":
      return speedDistance()
    case "cushionLoss":
      return cushionLoss()
    case "threeSpeeds":
      return threeSpeeds()
    case "thickness":
      return thickness()
    case "ghost":
      return ghost(d.tangent ?? false, d.paths ?? [])
    case "speedSplit":
      return speedSplit()
    case "spinTriple":
      return spinTriple()
    case "slideToRoll":
      return slideToRoll()
    case "mirror":
      return mirror(d.speed ?? false)
    case "english":
      return english(d.mode)
    case "patterns":
      return patterns()
    case "squirt":
      return squirt()
    case "tipFace":
      return tipFace(d.mode)
    case "bigBall":
      return bigBall()
    case "cluster":
      return cluster()
    case "whoStays":
      return whoStays()
    case "meeting":
      return meeting()
    case "smallGame":
      return smallGame()
    case "railBall":
      return railBall()
    case "cornerZones":
      return cornerZones()
  }
}

/** Ve mot hinh giai thich. Chu thich doc duoc bang trinh doc man hinh nam o `aria-label`. */
export function createDiagram(d: Diagram): SVGSVGElement {
  const { h, alt, nodes } = draw(d)
  return svg("svg", { class: "diagram", viewBox: `0 0 ${W} ${h}`, role: "img", "aria-label": alt }, ...nodes)
}
