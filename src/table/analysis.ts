// Phan tich cu vua danh: doc ket qua mo phong va giai thich tung chang bang loi, de
// nguoi hoc hieu TAI SAO bi di nhu vay. Moi cau deu dua tren so do tu chinh cu danh do
// (va mot lan mo phong "neu khong xoay ngang" de so sanh o bang), khong doan.
import { TABLE, simulate, type BallId, type CushionId, type Setup, type Shot, type SimResult, type Vec2 } from "../engine"
import { vn } from "../format"
import { spread } from "../scenarios/judge"
import { powerToForce } from "./power"
import { tipZoneName } from "./tipZone"

const NAME: Record<BallId, string> = { cue: "bi cái", b1: "bi vàng", b2: "bi đỏ" }
const CUSHION: Record<CushionId, string> = { top: "băng dài", bottom: "băng dài", left: "băng ngắn", right: "băng ngắn" }
const WINDOW = 0.04
const deg = (rad: number) => (rad * 180) / Math.PI
const dist = (p: Vec2, q: Vec2) => Math.hypot(q[0] - p[0], q[1] - p[1])
/** Quang duong tinh bang "vien bi" (duong kinh bi), don vi nguoi hoc de hinh dung. */
const ballsOf = (r: number, digits = 1) => vn(r / 2, digits)

function at(result: SimResult, path: Vec2[], t: number): Vec2 {
  const i = result.times.findIndex((x) => x >= t)
  return path[i < 0 ? path.length - 1 : i]
}

/** Toc do trung binh cua mot bi trong khoang [t0, t1], tinh theo dung thoi diem cua cac mau. */
function speed(result: SimResult, path: Vec2[], t0: number, t1: number): number {
  const index = (t: number) => {
    const i = result.times.findIndex((x) => x >= t)
    return i < 0 ? path.length - 1 : i
  }
  const i = index(t0)
  const j = index(t1)
  const dt = result.times[j] - result.times[i]
  return dt > 0 ? dist(path[i], path[j]) / dt : 0
}

function travelled(result: SimResult, path: Vec2[], until: number): number {
  let sum = 0
  for (let i = 1; i < path.length && result.times[i] <= until; i++) sum += dist(path[i - 1], path[i])
  return sum
}

function thicknessName(fraction: number): string {
  if (fraction >= 0.9) return "gần như chạm đầy"
  if (fraction >= 0.65) return "khoảng 3/4 bi"
  if (fraction >= 0.4) return "khoảng nửa bi"
  if (fraction >= 0.15) return "khoảng 1/4 bi"
  return "rất mỏng"
}

/** Goc toi va goc bat (do, tinh tu huong vuong goc voi bang; dau theo chieu troi doc bang). */
function cushionAngles(result: SimResult, e: { t: number; pos: Vec2; cushion: CushionId }) {
  const before = at(result, result.paths.cue, e.t - WINDOW)
  const after = at(result, result.paths.cue, e.t + WINDOW)
  const horizontal = e.cushion === "top" || e.cushion === "bottom"
  const angle = (v: Vec2) => deg(Math.atan2(horizontal ? v[0] : v[1], Math.abs(horizontal ? v[1] : v[0])))
  return {
    in: angle([e.pos[0] - before[0], e.pos[1] - before[1]]),
    out: angle([after[0] - e.pos[0], after[1] - e.pos[1]]),
  }
}

const firstCueCushion = (result: SimResult) =>
  result.events.find((e): e is Extract<typeof e, { type: "cushion" }> => e.type === "cushion" && e.ball === "cue")

export function analyseShot(balls: Setup, shot: Shot, result: SimResult): string[] {
  const lines: string[] = []
  const cuePath = result.paths.cue
  lines.push(`Cú đánh: hướng ${vn((((shot.angleDeg % 360) + 360) % 360))}°, lực ${vn(powerToForce(shot.power))} trên 100, điểm chạm ${tipZoneName(shot.tip)}.`)

  const cueEvents = result.events.filter((e) => (e.type === "ball" ? e.a === "cue" : e.ball === "cue"))
  const hit = cueEvents.find((e): e is Extract<typeof e, { type: "ball" }> => e.type === "ball")
  const cushionCount = cueEvents.filter((e) => e.type === "cushion").length

  if (!hit) {
    const total = travelled(result, cuePath, Infinity)
    lines.push(
      `Bi cái đi ${ballsOf(total, 0)} viên bi (khoảng ${vn(total / (2 * TABLE.halfLength))} chiều dài bàn), chạm ${cushionCount} băng rồi dừng, không chạm bi nào.`
    )
  } else {
    const target = hit.b
    const cushionsBefore = cueEvents.filter((e) => e.type === "cushion" && e.t < hit.t).length
    const rollNote = hit.aRolling
      ? shot.tip.y < -0.15
        ? "đã lăn tự nhiên: xoáy lui đã mòn hết trên đường đi"
        : shot.tip.y > 0.15
          ? "đang lăn tới"
          : "đã lăn tự nhiên: cú giữa tâm trượt một đoạn rồi tự lăn"
      : "còn trượt"
    lines.push(
      `Bi cái đi ${ballsOf(travelled(result, cuePath, hit.t))} viên bi${cushionsBefore ? `, qua ${cushionsBefore} băng,` : ""} rồi chạm ${NAME[target]}. Lúc chạm, bi cái ${rollNote}.`
    )

    // Do day cham: do lech cua duong bi cai toi so voi tam bi muc tieu.
    const before = at(result, cuePath, hit.t - WINDOW)
    const inLen = dist(before, hit.posA)
    const dir: Vec2 = inLen > 0 ? [(hit.posA[0] - before[0]) / inLen, (hit.posA[1] - before[1]) / inLen] : [1, 0]
    const toTarget: Vec2 = [hit.posB[0] - hit.posA[0], hit.posB[1] - hit.posA[1]]
    const sinCut = Math.min(1, Math.abs(dir[0] * toTarget[1] - dir[1] * toTarget[0]) / 2)
    const fraction = 1 - sinCut
    lines.push(
      `Độ dày chạm: ${thicknessName(fraction)} (bi cái che khoảng ${vn(fraction * 100, 0)}% ${NAME[target]}). Vì vậy ${NAME[target]} chạy lệch khoảng ${vn(deg(Math.asin(sinCut)), 0)}° so với hướng bi cái tới.`
    )

    // Chia toc do: so quang duong trong mot khoang ngan ngay truoc va ngay sau va cham.
    const speedIn = speed(result, cuePath, hit.t - WINDOW, hit.t)
    if (speedIn > 0.5) {
      // Mau ngay tai thoi diem va cham la vi tri truoc va cham, nen do tu mau ke tiep.
      const objShare = (speed(result, result.paths[target]!, hit.t + 0.01, hit.t + 0.01 + WINDOW) / speedIn) * 100
      const cueShare = (speed(result, cuePath, hit.t + 0.01, hit.t + 0.01 + WINDOW) / speedIn) * 100
      const why =
        fraction >= 0.65
          ? "Chạm dày nên bi mục tiêu nhận phần lớn."
          : fraction < 0.4
            ? "Chạm mỏng nên bi cái giữ phần lớn."
            : "Chạm cỡ nửa bi nên hai bi chia nhau."
      lines.push(
        `Chia tốc độ: ${NAME[target]} nhận khoảng ${vn(Math.min(100, objShare), 0)}%, bi cái còn khoảng ${vn(Math.min(100, cueShare), 0)}%. ${why}`
      )
    }

    // Huong bi cai roi di so voi duong 90 do.
    const later = at(result, cuePath, hit.t + 0.3)
    const to: Vec2 = [later[0] - hit.posA[0], later[1] - hit.posA[1]]
    if (sinCut < 0.12) {
      const along = to[0] * dir[0] + to[1] * dir[1]
      if (along > 1) lines.push(`Đánh gần chính diện: bi cái đi theo ${NAME[target]}, vì nó còn xoáy tới lúc chạm.`)
      else if (along < -1) lines.push("Đánh gần chính diện: bi cái lùi về, vì nó còn xoáy lui lúc chạm.")
      else lines.push("Đánh gần chính diện: bi cái gần như dừng tại chỗ, vì lúc chạm nó hầu như không còn xoáy tới hay xoáy lui.")
    } else if (Math.hypot(to[0], to[1]) > 0.2) {
      const n: Vec2 = [toTarget[0] / 2, toTarget[1] / 2]
      const dot = dir[0] * n[0] + dir[1] * n[1]
      const tangent: Vec2 = [dir[0] - dot * n[0], dir[1] - dot * n[1]]
      const cross = tangent[0] * to[1] - tangent[1] * to[0]
      const forward = Math.sign(tangent[0] * dir[1] - tangent[1] * dir[0]) || 1
      const off = deg(Math.atan2(cross, tangent[0] * to[0] + tangent[1] * to[1])) * forward
      if (Math.abs(off) < 6) {
        lines.push(`Bi cái rời đi sát đường 90° (lệch ${vn(Math.abs(off), 0)}°), vì lúc chạm nó gần như không xoáy tới hay xoáy lui.`)
      } else if (off > 0) {
        const why = hit.aRolling
          ? "nó đã lăn (còn xoáy tới) lúc chạm"
          : shot.tip.y > 0.15
            ? "chạm trên tâm nên nó còn xoáy tới"
            : "nó đã bắt đầu lăn một phần, và va chạm không nảy hoàn toàn"
        lines.push(`Bi cái rời đi lệch về phía trước đường 90° khoảng ${vn(off, 0)}°, vì ${why}.`)
      } else {
        lines.push(`Bi cái rời đi lệch về phía sau đường 90° khoảng ${vn(-off, 0)}°, vì nó còn xoáy lui lúc chạm.`)
      }
    }
  }

  // Bang dau tien cua bi cai, va tac dung cua xoay ngang (so voi cung cu danh khong xoay ngang).
  const cushion = firstCueCushion(result)
  if (cushion) {
    const a = cushionAngles(result, cushion)
    let text = `Ở ${CUSHION[cushion.cushion]} đầu tiên: bi cái tới với góc ${vn(Math.abs(a.in), 0)}° (tính từ hướng vuông góc với băng) và bật ra ${vn(Math.abs(a.out), 0)}°.`
    if (Math.abs(shot.tip.x) >= 0.15) {
      const side = shot.tip.x > 0 ? "phải" : "trái"
      const plain = simulate(balls, { ...shot, tip: { x: 0, y: shot.tip.y } })
      const other = firstCueCushion(plain)
      if (other && other.cushion === cushion.cushion && dist(other.pos, cushion.pos) < 2) {
        const b = cushionAngles(plain, other)
        const change = a.out - b.out
        if (Math.abs(a.in) < 5) {
          text +=
            Math.abs(change) >= 3
              ? ` Đâm gần thẳng băng: xoáy ${side} làm bi bật lệch sang ${side} khoảng ${vn(Math.abs(change), 0)}° so với cú không xoáy ngang.`
              : ` Xoáy ${side} gần như không đổi hướng bật: xoáy đã mòn trên đường đi.`
        } else {
          const wider = change * Math.sign(a.in)
          if (wider >= 3) text += ` Xoáy ${side} ở đây là xoáy thuận: góc bật mở rộng thêm khoảng ${vn(wider, 0)}° so với cú không xoáy ngang.`
          else if (wider <= -3) text += ` Xoáy ${side} ở đây là xoáy nghịch: góc bật dựng lại khoảng ${vn(-wider, 0)}° so với cú không xoáy ngang.`
          else text += ` Xoáy ${side} gần như không đổi góc bật: xoáy đã mòn trên đường đi, hoặc bi đi quá sượt.`
        }
      }
    } else if (Math.abs(a.out) < Math.abs(a.in) - 4) {
      text += " Không xoáy ngang; góc bật dựng hơn góc tới một chút, thường gặp khi bi tới băng có lực."
    } else {
      text += " Không xoáy ngang nên góc bật gần bằng góc tới."
    }
    lines.push(text)
  }

  // Ket qua.
  const others = (["b1", "b2"] as const).filter((id) => balls[id])
  if (others.length === 2) {
    if (result.scored) {
      lines.push("Kết quả: bi cái chạm cả hai bi, ghi điểm.")
    } else {
      const touched = new Set(result.events.flatMap((e) => (e.type === "ball" && e.a === "cue" ? [e.b] : [])))
      const missed = others.filter((id) => !touched.has(id))
      const gaps = missed.map((id) => {
        let gap = Infinity
        const path = result.paths[id]!
        for (let i = 0; i < cuePath.length; i++) gap = Math.min(gap, dist(cuePath[i], path[i]) - 2)
        return `${NAME[id]} ${ballsOf(Math.max(0, gap))} viên bi`
      })
      lines.push(`Kết quả: chưa ghi điểm. Lúc gần nhất, bi cái còn cách ${gaps.join(" và ")} (tính từ mép tới mép).`)
    }
    lines.push(`Sau cú đánh, ba bi nằm trong một vòng tròn bán kính ${ballsOf(spread(result))} viên bi quanh trọng tâm của chúng.`)
  }
  return lines
}
