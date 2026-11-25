// Xep the bang tay: chon bi dang bi nam va tim cho dat hop le gan diem keo nhat.
// Thuan du lieu de test duoc; phan cham va ve nam o shotTable.
import { BALL_RADIUS, TABLE, type BallId, type Setup, type Vec2 } from "../engine"

/** Ngon tay che mat bi, nen cho nam rong hon vien bi mot chut (don vi: ban kinh bi). */
export const GRAB_REACH = 2.5
/** Khoang cach tam toi thieu giua hai bi khi xep: ho nhau mot khe nho, khong dinh nhau. */
export const MIN_GAP = 2 * BALL_RADIUS + 0.02
/**
 * Khe giua bi va bang khi xep. Bi nam DUNG gioi han roi danh doc theo bang thi loi vat ly
 * nem loi "Depth exceeded resolving collisions" (D19 trong docs/DECISIONS.md), nen bi xep
 * tay luon cach bang mot khe khong nhin thay duoc (0,02 ban kinh bi, khoang 0,6 mm).
 */
export const RAIL_GAP = 0.02

const IDS: BallId[] = ["cue", "b1", "b2"]
const LIMIT_X = TABLE.centreLimitX - RAIL_GAP
const LIMIT_Y = TABLE.centreLimitY - RAIL_GAP
const dist = (a: Vec2, b: Vec2) => Math.hypot(a[0] - b[0], a[1] - b[1])
const clamp = (v: number, limit: number) => Math.max(-limit, Math.min(limit, v))
const onTable = (p: Vec2): Vec2 => [clamp(p[0], LIMIT_X), clamp(p[1], LIMIT_Y)]
const inside = (p: Vec2) => Math.abs(p[0]) <= LIMIT_X && Math.abs(p[1]) <= LIMIT_Y

/** Bi gan diem cham nhat trong tam nam, hoac null neu cham vao cho trong. */
export function pickBall(setup: Setup, point: Vec2): BallId | null {
  let best: BallId | null = null
  let bestDist = GRAB_REACH
  for (const id of IDS) {
    const pos = setup[id]
    if (!pos) continue
    const d = dist(pos, point)
    if (d <= bestDist) {
      best = id
      bestDist = d
    }
  }
  return best
}

/**
 * Cho dat bi `id` gan `point` nhat ma van hop le: tam bi nam trong mat ban va khong de len
 * bi khac. Keo de len bi khac thi bi truot quanh bi do. Tra null neu khong tim duoc cho;
 * khi do giu nguyen vi tri cu.
 */
export function placeBall(setup: Setup, id: BallId, point: Vec2): Vec2 | null {
  const others = IDS.filter((other) => other !== id && setup[other]).map((other) => setup[other]!)
  const free = (p: Vec2) => others.every((q) => dist(p, q) >= MIN_GAP - 1e-9)
  const target = onTable(point)
  let p = target
  for (let pass = 0; pass < 8; pass++) {
    let moved = false
    for (const q of others) {
      const d = dist(p, q)
      if (d >= MIN_GAP) continue
      // Day ra theo huong tu bi kia toi diem keo; trung tam thi day sang phai.
      const ux = d > 1e-9 ? (p[0] - q[0]) / d : 1
      const uy = d > 1e-9 ? (p[1] - q[1]) / d : 0
      p = onTable([q[0] + ux * MIN_GAP, q[1] + uy * MIN_GAP])
      moved = true
    }
    if (!moved) return p
  }
  // Day mai khong xong (bi kia nam sat bang hoac goc): thu cac cho quanh tung bi kia, lay cho gan nhat.
  let best: Vec2 | null = null
  for (const q of others) {
    for (let k = 0; k < 48; k++) {
      const a = (k / 48) * 2 * Math.PI
      const c: Vec2 = [q[0] + Math.cos(a) * MIN_GAP, q[1] + Math.sin(a) * MIN_GAP]
      if (inside(c) && free(c) && (!best || dist(c, target) < dist(best, target))) best = c
    }
  }
  return best
}
