// Du doan duong bi cai bang chinh loi mo phong: danh thu cu hien tai va lay doan
// duong ngay sau lan cham bi dau tien. Khac duong 90 do (chi dung khi bi cai con
// truot), day la duong bi cai thuc su di voi huong, luc va diem cham dang chon.
import { simulate, type Setup, type Shot, type Vec2 } from "../engine"

export interface CuePrediction {
  /** Tu cho cham bi dau tien toi su kien ke tiep cua bi cai (bang hoac bi), hoac toi khi dung. */
  path: Vec2[]
  /** Bi cai da lan tu nhien luc cham, nen se di qua ve phia truoc duong 90 do. */
  rolling: boolean
}

/** null neu bi cai khong cham bi nao truoc khi cham bang (khong co gi de so voi duong 90 do). */
export function predictCue(balls: Setup, shot: Shot): CuePrediction | null {
  const result = simulate(balls, shot)
  const mine = result.events.filter((e) => (e.type === "ball" ? e.a === "cue" : e.ball === "cue"))
  const hit = mine[0]
  if (!hit || hit.type !== "ball") return null
  const until = mine[1]?.t ?? result.duration
  const path: Vec2[] = [hit.posA]
  result.times.forEach((t, i) => {
    if (t > hit.t && t <= until) path.push(result.paths.cue[i])
  })
  return { path, rolling: hit.aRolling }
}
