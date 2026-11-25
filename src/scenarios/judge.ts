// Bo cham: mot lan thu co dat muc tieu cua tinh huong khong.
import type { BallId, SimResult, Vec2 } from "../engine"
import { vn } from "../format"
import type { Attempt, Goal, Scenario, Verdict } from "./types"

const BALL_NAME: Record<BallId, string> = { cue: "bi cái", b1: "bi vàng", b2: "bi đỏ" }
const dist = (p: Vec2, q: Vec2) => Math.hypot(p[0] - q[0], p[1] - q[1])

/** Thu tu bi cai cham: "b1", "b2" (lan dau cham moi bi) va "cushion". */
function cueContacts(result: SimResult): ("b1" | "b2" | "cushion")[] {
  const out: ("b1" | "b2" | "cushion")[] = []
  for (const e of result.events) {
    if (e.type === "cushion" && e.ball === "cue") out.push("cushion")
    if (e.type === "ball" && e.a === "cue" && e.b !== "cue" && !out.includes(e.b)) out.push(e.b)
  }
  return out
}

function missDetail(result: SimResult): string {
  const hit = cueContacts(result).filter((c) => c !== "cushion")
  if (hit.length === 0) return "Chưa ghi điểm. Bi cái không chạm bi nào."
  return `Chưa ghi điểm. Bi cái chỉ chạm ${BALL_NAME[hit[0]]}.`
}

/** Ban kinh nho nhat quanh trong tam chua du tam cua moi bi. */
export function spread(result: SimResult): number {
  const points = [result.final.cue, result.final.b1, result.final.b2].filter((p): p is Vec2 => !!p)
  const centre: Vec2 = [
    points.reduce((s, p) => s + p[0], 0) / points.length,
    points.reduce((s, p) => s + p[1], 0) / points.length,
  ]
  return Math.max(...points.map((p) => dist(p, centre)))
}

function judgeShot(goal: Goal, result: SimResult): Verdict {
  const scored = result.scored
  switch (goal.type) {
    case "score": {
      if (!scored) return { passed: false, scored, detail: missDetail(result) }
      const contacts = cueContacts(result)
      if (goal.require === "cushionFirst" && contacts[0] !== "cushion") {
        return { passed: false, scored, detail: "Ghi điểm, nhưng bài này yêu cầu bi cái chạm băng trước khi chạm bi." }
      }
      if (goal.require === "cushionBeforeSecond") {
        const balls = contacts.filter((c) => c !== "cushion")
        const between = contacts.slice(contacts.indexOf(balls[0]) + 1, contacts.indexOf(balls[1]))
        if (!between.includes("cushion")) {
          return { passed: false, scored, detail: "Ghi điểm, nhưng bài này yêu cầu bi cái chạm băng giữa hai lần chạm bi." }
        }
      }
      return { passed: true, scored, detail: "Ghi điểm! Bi cái chạm cả hai bi." }
    }
    case "stopInZone": {
      const off = dist(result.final.cue, [goal.zone.cx, goal.zone.cy])
      if (off > goal.zone.r) {
        return { passed: false, scored, detail: `Chưa đạt. Bi cái dừng cách tâm ô ${vn(off / 2)} viên bi.` }
      }
      const touched = cueContacts(result).filter((c) => c === "cushion").length
      if (goal.cushions !== undefined && touched !== goal.cushions) {
        const need = goal.cushions === 0 ? "không chạm băng" : `chạm đúng ${goal.cushions} băng`
        return { passed: false, scored, detail: `Bi dừng trong ô nhưng đã chạm ${touched} băng. Bài này cần ${need}.` }
      }
      return { passed: true, scored, detail: "Đạt! Bi cái dừng trong ô." }
    }
    case "gather": {
      if (!scored) return { passed: false, scored, detail: missDetail(result) }
      if (spread(result) <= goal.radius) return { passed: true, scored, detail: "Ghi điểm và ba bi nằm gọn. Rất tốt!" }
      return { passed: false, partial: true, scored, detail: "Ghi điểm, nhưng ba bi còn nằm xa nhau." }
    }
    default:
      throw new Error(`Mục tiêu ${goal.type} không chấm bằng một cú đánh`)
  }
}

export function judge(scenario: Scenario, attempt: Attempt): Verdict {
  return judgeGoal(scenario.goal, attempt)
}

export function judgeGoal(goal: Goal, attempt: Attempt): Verdict {
  if (goal.type === "choice") {
    if (!("choice" in attempt)) throw new Error("Tình huống chọn đáp án cần một lựa chọn")
    const passed = attempt.choice === goal.answer
    const scored = attempt.result?.scored ?? false
    return {
      passed,
      scored,
      detail: passed ? "Đúng rồi!" : `Chưa đúng. Đáp án là: ${goal.options[goal.answer]}.`,
    }
  }
  if (goal.type === "markCushion") {
    if (!("mark" in attempt)) throw new Error("Tình huống chấm lên băng cần một điểm")
    const off = dist(attempt.mark, goal.target)
    const passed = off <= goal.tolerance
    return {
      passed,
      scored: false,
      detail: passed ? "Đạt! Đúng chỗ bi cái cần tới." : `Chưa đạt. Lệch ${vn(off / 2)} viên bi.`,
    }
  }
  if (!("result" in attempt) || !attempt.result) throw new Error("Tình huống này cần một cú đánh")
  return judgeShot(goal, attempt.result)
}
