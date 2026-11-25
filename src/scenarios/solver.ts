// Bo do loi giai: kiem moi tinh huong co giai duoc bang chinh giao dien cua app.
// Luoi cu danh dung dung cac gia tri nguoi hoc dat duoc: huong boi cua 0,1 do,
// luc la mot vi tri tren thanh luc. Chay qua `npm run scenarios:check`.
import { TABLE, simulate, type Shot, type Vec2 } from "../engine"
import { SLIDER_STEP, sliderToPower } from "../table/power"
import { judge } from "./judge"
import { NINE_TIPS } from "./tips"
import type { Scenario } from "./types"

/** Loi giai phai con dat khi lech huong chung nay va lech mot buoc thanh luc ve moi phia. */
export const ROBUST = { angleDeg: 0.3, slider: SLIDER_STEP }

const FREE_TIPS = [
  { x: 0, y: 0 },
  { x: 0, y: 0.6 },
  { x: 0, y: -0.6 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 0.6, y: 0 },
  { x: -0.6, y: 0 },
]
// Nac thanh luc (xem src/table/power.ts): 46 ~ power 0,08; 16 ~ 0,02; 81 ~ 0,41.
/** Luoi day cho bai chon diem cham (huong da khoa): moi 0,3 trong vong tron, cong diem cheo chuan va hai cuc doc. */
const DENSE_TIPS = (() => {
  const steps = [0, 0.3, -0.3, 0.6, -0.6, 0.9, -0.9]
  const out = steps.flatMap((x) => steps.map((y) => ({ x, y }))).filter((t) => Math.hypot(t.x, t.y) <= 1)
  out.push(...NINE_TIPS.filter((t) => t.x !== 0 && t.y !== 0), { x: 0, y: 1 }, { x: 0, y: -1 })
  return out.sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))
})()
const TIP_ROBUST = 0.1

const SCORE_SLIDERS = [46, 31, 58, 16, 70, 81]
const FINE_SLIDERS = Array.from({ length: 43 }, (_, i) => 2 + 2 * i) // 2..86

interface Candidate {
  angleDeg: number
  /** null khi luc bi khoa trong tinh huong. */
  slider: number | null
  tip: { x: number; y: number }
}

export interface CheckReport {
  id: string
  ok: boolean
  problems: string[]
  /** So cu danh da mo phong. */
  tried: number
  /** Loi giai ben dau tien tim duoc (neu tinh huong can danh). */
  solution?: Candidate
}

const round1 = (deg: number) => Math.round(deg * 10) / 10

function angleGrid(s: Scenario): number[] {
  if (s.locked?.angleDeg !== undefined) return [s.locked.angleDeg]
  const goal = s.goal
  const direct = goal.type === "gather" || (goal.type === "score" && goal.require !== "cushionFirst")
  // Huong tu do ma khong nham thang vao bi: quet ca vong, buoc 2 do.
  if (!direct) return Array.from({ length: 180 }, (_, i) => 2 * i)
  // Chi thu cac huong ma bi cai cham thang vao mot bi (cham bi truoc, bang sau).
  const out = new Set<number>()
  for (const id of ["b1", "b2"] as const) {
    const p = s.balls[id]
    if (!p) continue
    const dx = p[0] - s.balls.cue[0]
    const dy = p[1] - s.balls.cue[1]
    const centre = (Math.atan2(dy, dx) * 180) / Math.PI
    const half = (Math.asin(Math.min(1, 2 / Math.hypot(dx, dy))) * 180) / Math.PI
    for (let a = centre - half; a <= centre + half; a += 0.5) out.add(round1((a + 360) % 360))
  }
  return [...out]
}

function sliderGrid(s: Scenario): (number | null)[] {
  if (s.locked?.power !== undefined) return [null]
  if (s.goal.type === "score") return SCORE_SLIDERS
  // Gom bi: loi giai thuong nam o luc nhe den vua, nen thu vung do truoc cho nhanh.
  if (s.goal.type === "gather") return [...FINE_SLIDERS].sort((a, b) => Math.abs(a - 30) - Math.abs(b - 30))
  // Dung trong o ma huong tu do thi luoi rat lon: lay thua thanh luc de khong qua vai phut.
  if (s.goal.type === "stopInZone" && s.locked?.angleDeg === undefined) return FINE_SLIDERS.filter((_, i) => i % 2 === 0)
  // Huong da khoa thi luoi nho: thu ca cac nac le.
  return s.locked?.angleDeg !== undefined ? FINE_SLIDERS.flatMap((v) => [v, v + 1]) : FINE_SLIDERS
}

function tipGrid(s: Scenario) {
  if (s.locked?.tip) return [s.locked.tip]
  if (s.locked?.angleDeg !== undefined) return DENSE_TIPS
  // Bai dung trong o ma huong tu do thi luoi rat lon: chi do voi cham giua tam.
  return s.goal.type === "stopInZone" ? [FREE_TIPS[0]] : FREE_TIPS
}

function toShot(s: Scenario, c: Candidate): Shot {
  return {
    angleDeg: c.angleDeg,
    power: c.slider === null ? s.locked!.power! : sliderToPower(c.slider),
    tip: c.tip,
  }
}

function neighbours(s: Scenario, c: Candidate): Candidate[] {
  const out: Candidate[] = []
  if (s.locked?.angleDeg === undefined) {
    out.push({ ...c, angleDeg: c.angleDeg - ROBUST.angleDeg }, { ...c, angleDeg: c.angleDeg + ROBUST.angleDeg })
  }
  if (c.slider !== null) {
    out.push({ ...c, slider: c.slider - ROBUST.slider }, { ...c, slider: c.slider + ROBUST.slider })
  }
  // Huong va luc deu khoa: nguoi hoc chi chon diem cham, nen do ben tinh theo diem cham.
  if (out.length === 0 && !s.locked?.tip) {
    for (const [dx, dy] of [[TIP_ROBUST, 0], [-TIP_ROBUST, 0], [0, TIP_ROBUST], [0, -TIP_ROBUST]]) {
      const tip = { x: c.tip.x + dx, y: c.tip.y + dy }
      if (Math.hypot(tip.x, tip.y) <= 1) out.push({ ...c, tip })
    }
  }
  return out
}

function structuralProblems(s: Scenario): string[] {
  const problems: string[] = []
  try {
    simulate(s.balls, { angleDeg: 0, power: 0, tip: { x: 0, y: 0 } })
  } catch (e) {
    problems.push(`thế bi không hợp lệ: ${(e as Error).message}`)
  }
  const goal = s.goal
  const inTable = (p: Vec2, margin = 0) =>
    Math.abs(p[0]) <= TABLE.centreLimitX - margin + 1e-6 && Math.abs(p[1]) <= TABLE.centreLimitY - margin + 1e-6
  if (goal.type === "stopInZone" && !inTable([goal.zone.cx, goal.zone.cy])) {
    problems.push("tâm ô đích nằm ngoài vùng bi tới được")
  }
  if (goal.type === "choice") {
    if (goal.answer < 0 || goal.answer >= goal.options.length) problems.push("đáp án nằm ngoài danh sách lựa chọn")
    if (goal.shots && goal.shots.length !== goal.options.length) problems.push("số cú đánh khác số lựa chọn")
    if (goal.overlay && !goal.shots) problems.push("bài chồng vệt cần có cú đánh cho từng lựa chọn")
    if (goal.replay && goal.replay.tips.length !== goal.options.length) problems.push("số điểm chạm khác số lựa chọn")
  }
  if (goal.type === "markCushion") {
    const [x, y] = goal.target
    const onLine =
      Math.abs(Math.abs(x) - TABLE.centreLimitX) < 1e-6 || Math.abs(Math.abs(y) - TABLE.centreLimitY) < 1e-6
    if (!inTable(goal.target) || !onLine) problems.push("điểm đích không nằm trên đường tâm bi chạm băng")
  }
  if ((goal.type === "score" || goal.type === "gather") && !(s.balls.b1 && s.balls.b2)) {
    problems.push("mục tiêu ghi điểm cần đủ ba bi")
  }
  if (goal.type === "score" && goal.onlyTip && (s.locked?.angleDeg === undefined || s.locked?.power === undefined)) {
    problems.push("onlyTip cần khóa cả hướng và lực")
  }
  return problems
}

export function checkScenario(s: Scenario): CheckReport {
  const problems = structuralProblems(s)
  const report: CheckReport = { id: s.id, ok: false, problems, tried: 0 }
  if (problems.length) return report
  const goal = s.goal

  if (goal.type === "markCushion") {
    if (goal.shot) {
      report.tried++
      const events = simulate(s.balls, goal.shot).events.filter((e) => e.type === "ball" || e.ball === "cue")
      const first = events[0]
      if (!first || first.type !== "cushion") problems.push("cú mẫu không chạm băng trước")
      else if (Math.hypot(first.pos[0] - goal.target[0], first.pos[1] - goal.target[1]) > 0.5) {
        problems.push("cú mẫu chạm băng lệch khỏi điểm đích quá nửa bán kính bi")
      }
      if (s.balls.b1 && !events.some((e) => e.type === "ball" && e.a === "cue")) {
        problems.push("cú mẫu không đưa bi cái tới bi nào")
      }
    }
    report.ok = problems.length === 0
    return report
  }

  if (goal.type === "choice" && goal.replay) {
    // Bai doc nguoc: ket qua cua dap an phai khac ro voi moi diem cham con lai.
    const { angleDeg, power, tips } = goal.replay
    const finals = tips.map((tip) => {
      report.tried++
      return simulate(s.balls, { angleDeg, power, tip }).final.cue
    })
    const mine = finals[goal.answer]
    finals.forEach((f, i) => {
      if (i !== goal.answer && Math.hypot(f[0] - mine[0], f[1] - mine[1]) < 3) {
        problems.push(`"${goal.options[i]}" cho kết quả gần như giống đáp án`)
      }
    })
    report.ok = problems.length === 0
    return report
  }

  if (goal.type === "choice" && !goal.shots) {
    report.ok = true
    return report
  }

  if (goal.type === "choice") {
    goal.shots!.forEach((shot, i) => {
      report.tried++
      const scored = simulate(s.balls, shot).scored
      if (i === goal.answer && !scored) problems.push(`cú của đáp án ("${goal.options[i]}") không ghi điểm`)
      if (i !== goal.answer && scored) problems.push(`lựa chọn sai "${goal.options[i]}" vẫn ghi điểm`)
    })
    report.ok = problems.length === 0
    return report
  }

  const passes = (c: Candidate) => {
    report.tried++
    return judge(s, { result: simulate(s.balls, toShot(s, c)) }).passed
  }
  const tips = tipGrid(s)
  let fragile = 0
  for (const tip of tips) {
    for (const slider of sliderGrid(s)) {
      for (const angleDeg of angleGrid(s)) {
        const c: Candidate = { angleDeg, slider, tip }
        if (!passes(c)) continue
        if (neighbours(s, c).every(passes)) {
          report.solution = c
          if (goal.type === "score" && goal.onlyTip) {
            const only = goal.onlyTip
            for (const tip of NINE_TIPS) {
              const mine = tip.x === only.x && tip.y === only.y
              if (passes({ angleDeg, slider, tip }) !== mine) {
                problems.push(mine ? "điểm chạm duy nhất không ghi điểm" : `điểm chạm (${tip.x}; ${tip.y}) cũng ghi điểm`)
              }
            }
          }
          report.ok = problems.length === 0
          return report
        }
        fragile++
      }
    }
  }
  problems.push(
    fragile
      ? `có ${fragile} lời giải nhưng đều quá mong manh (lệch ${ROBUST.angleDeg}° hoặc một lần bấm − hoặc + là trượt)`
      : "không tìm thấy lời giải nào trong lưới cú đánh"
  )
  return report
}

export function checkAll(scenarios: Scenario[]): CheckReport[] {
  const seen = new Set<string>()
  return scenarios.map((s) => {
    const report = checkScenario(s)
    if (seen.has(s.id)) {
      report.ok = false
      report.problems.push("trùng id với tình huống khác")
    }
    seen.add(s.id)
    return report
  })
}
