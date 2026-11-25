// Hinh hoc cua viec ngam: duong ngam, bi ma, duong 90 do. Thuan toan hoc, khong DOM.
import { BALL_RADIUS, TABLE, type BallId, type Setup, type Vec2 } from "../engine"

export interface AimPreview {
  /** Vec-to don vi cua huong danh. */
  dir: Vec2
  /** Tam bi cai o cuoi duong ngam: vi tri bi ma, hoac cho bi cai cham bang. */
  end: Vec2
  /** Co khi duong ngam gap mot bi truoc khi gap bang. */
  ghost?: {
    target: BallId
    /** Huong bi muc tieu chay di (duong noi tam bi ma toi tam bi muc tieu). */
    objectDir: Vec2
    /** Huong duong 90 do ve phia bi cai lech sang. null khi danh thang chinh dien. */
    tangentDir: Vec2 | null
    /** Cho duong 90 do gap bang. */
    tangentEnd: Vec2 | null
  }
}

/** Quang duong tu `from` theo `dir` toi khi tam bi cham gioi han ban. */
function distanceToCushion(from: Vec2, dir: Vec2): number {
  let t = Infinity
  if (dir[0] > 0) t = Math.min(t, (TABLE.centreLimitX - from[0]) / dir[0])
  if (dir[0] < 0) t = Math.min(t, (-TABLE.centreLimitX - from[0]) / dir[0])
  if (dir[1] > 0) t = Math.min(t, (TABLE.centreLimitY - from[1]) / dir[1])
  if (dir[1] < 0) t = Math.min(t, (-TABLE.centreLimitY - from[1]) / dir[1])
  return Math.max(0, t)
}

const along = (from: Vec2, dir: Vec2, t: number): Vec2 => [from[0] + dir[0] * t, from[1] + dir[1] * t]

export function aimPreview(setup: Setup, angleDeg: number): AimPreview {
  const a = (angleDeg * Math.PI) / 180
  const dir: Vec2 = [Math.cos(a), Math.sin(a)]
  const cue = setup.cue
  let best = distanceToCushion(cue, dir)
  let target: BallId | undefined

  for (const id of ["b1", "b2"] as const) {
    const p = setup[id]
    if (!p) continue
    // Giai |cue + t*dir - p| = 2R, lay nghiem nho nhat va duong.
    const rx = p[0] - cue[0]
    const ry = p[1] - cue[1]
    const proj = rx * dir[0] + ry * dir[1]
    const disc = proj * proj - (rx * rx + ry * ry) + 4 * BALL_RADIUS * BALL_RADIUS
    if (disc < 0) continue
    const t = proj - Math.sqrt(disc)
    if (t >= 0 && t < best) {
      best = t
      target = id
    }
  }

  const end = along(cue, dir, best)
  if (!target) return { dir, end }

  const p = setup[target]!
  const objectDir: Vec2 = [(p[0] - end[0]) / 2, (p[1] - end[1]) / 2]
  const dot = dir[0] * objectDir[0] + dir[1] * objectDir[1]
  const tx = dir[0] - dot * objectDir[0]
  const ty = dir[1] - dot * objectDir[1]
  const len = Math.hypot(tx, ty)
  if (len < 1e-6) return { dir, end, ghost: { target, objectDir, tangentDir: null, tangentEnd: null } }
  const tangentDir: Vec2 = [tx / len, ty / len]
  const tangentEnd = along(end, tangentDir, distanceToCushion(end, tangentDir))
  return { dir, end, ghost: { target, objectDir, tangentDir, tangentEnd } }
}

/** Goc (do) cua huong tu `from` toi `to`, trong khoang [0, 360). */
export function angleTo(from: Vec2, to: Vec2): number {
  const deg = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI
  return (deg + 360) % 360
}

/** Diem gan nhat tren duong tam bi cham bang (hinh chu nhat gioi han tam bi). */
export function snapToCushion(p: Vec2): Vec2 {
  const x = Math.max(-TABLE.centreLimitX, Math.min(TABLE.centreLimitX, p[0]))
  const y = Math.max(-TABLE.centreLimitY, Math.min(TABLE.centreLimitY, p[1]))
  const dx = TABLE.centreLimitX - Math.abs(x)
  const dy = TABLE.centreLimitY - Math.abs(y)
  return dx < dy ? [Math.sign(x || 1) * TABLE.centreLimitX, y] : [x, Math.sign(y || 1) * TABLE.centreLimitY]
}

/** Truot mot diem doc theo bang no dang nam, mot doan `delta` (duong = sang phai hoac len tren). */
export function slideOnCushion(p: Vec2, delta: number): Vec2 {
  const onSide = Math.abs(Math.abs(p[0]) - TABLE.centreLimitX) < 1e-6
  return onSide
    ? [p[0], Math.max(-TABLE.centreLimitY, Math.min(TABLE.centreLimitY, p[1] + delta))]
    : [Math.max(-TABLE.centreLimitX, Math.min(TABLE.centreLimitX, p[0] + delta)), p[1]]
}
