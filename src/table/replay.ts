// Phat lai ket qua simulate: lay vi tri va do dai vet tai mot thoi diem bat ky.
import type { Vec2 } from "../engine"

export interface Track {
  points: Vec2[]
  /** Do dai cong don toi tung diem. */
  cumulative: number[]
}

export function buildTrack(points: Vec2[]): Track {
  const cumulative = [0]
  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
    cumulative.push(cumulative[i - 1] + d)
  }
  return { points, cumulative }
}

/** Vi tri bi va do dai vet da di tai thoi diem t (noi suy tuyen tinh giua hai mau). */
export function sampleAt(times: number[], track: Track, t: number): { pos: Vec2; length: number } {
  const last = times.length - 1
  if (t <= times[0]) return { pos: track.points[0], length: 0 }
  if (t >= times[last]) return { pos: track.points[last], length: track.cumulative[last] }
  let lo = 0
  let hi = last
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (times[mid] <= t) lo = mid
    else hi = mid
  }
  const k = (t - times[lo]) / (times[hi] - times[lo])
  const p = track.points[lo]
  const q = track.points[hi]
  return {
    pos: [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k],
    length: track.cumulative[lo] + (track.cumulative[hi] - track.cumulative[lo]) * k,
  }
}

/**
 * Chay dong ho phat lai bang requestAnimationFrame. Goi `onFrame(t)` moi khung,
 * khung cuoi luon la `duration`. Tra ve ham dung (nhay thang toi cuoi neu `finish`).
 */
export function runClock(
  duration: number,
  onFrame: (t: number) => void,
  onDone: () => void
): (finish: boolean) => void {
  let raf = 0
  let start = -1
  let ended = false
  const end = (finish: boolean) => {
    if (ended) return
    ended = true
    cancelAnimationFrame(raf)
    if (finish) {
      onFrame(duration)
      onDone()
    }
  }
  const tick = (now: number) => {
    if (start < 0) start = now
    const t = (now - start) / 1000
    if (t >= duration) return end(true)
    onFrame(t)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return end
}
