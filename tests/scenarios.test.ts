// Test bo cham (moi loai muc tieu) va bo do loi giai.
import { describe, expect, it } from "vitest"
import { TABLE, simulate, type SimEvent, type SimResult, type Vec2 } from "../src/engine"
import { LEVEL4 } from "../src/scenarios/data/level4"
import { SAMPLES } from "../src/scenarios/data/samples"
import { judge, spread } from "../src/scenarios/judge"
import { checkAll, checkScenario } from "../src/scenarios/solver"
import type { Goal, Scenario } from "../src/scenarios/types"
import { SLIDER_MAX, SLIDER_MIN, sliderToPower } from "../src/table/power"

const base = { level: 0 as const, group: "T", title: "", prompt: "", explain: "" }
const scenario = (goal: Goal, extra: Partial<Scenario> = {}): Scenario => ({
  ...base,
  id: "T-01",
  balls: { cue: [-10, 0], b1: [0, 0], b2: [10, 5] },
  goal,
  ...extra,
})

/** Ket qua gia: chi co su kien va vi tri cuoi, du cho bo cham. */
function fake(events: SimEvent[], final: { cue: Vec2; b1?: Vec2; b2?: Vec2 } = { cue: [0, 0] }): SimResult {
  const hit = new Set(events.flatMap((e) => (e.type === "ball" && e.a === "cue" ? [e.b] : [])))
  return { times: [0], paths: { cue: [final.cue] }, events, final, scored: hit.size === 2, duration: 0, timedOut: false }
}
const ball = (b: "b1" | "b2", t: number): SimEvent => ({
  type: "ball",
  t,
  a: "cue",
  b,
  posA: [0, 0],
  posB: [2, 0],
  aRolling: false,
})
const cushion = (t: number): SimEvent => ({ type: "cushion", t, ball: "cue", cushion: "top", pos: [0, 0] })

describe("judge", () => {
  it("score: dat khi bi cai cham du hai bi", () => {
    const s = scenario({ type: "score" })
    expect(judge(s, { result: fake([ball("b1", 1), ball("b2", 2)]) })).toMatchObject({ passed: true, scored: true })
    const one = judge(s, { result: fake([ball("b1", 1)]) })
    expect(one).toMatchObject({ passed: false, scored: false })
    expect(one.detail).toContain("bi vàng")
    expect(judge(s, { result: fake([]) }).detail).toContain("không chạm bi nào")
  })

  it("score + cushionBeforeSecond: can bang giua hai lan cham bi", () => {
    const s = scenario({ type: "score", require: "cushionBeforeSecond" })
    expect(judge(s, { result: fake([ball("b1", 1), cushion(2), ball("b2", 3)]) }).passed).toBe(true)
    expect(judge(s, { result: fake([cushion(0.5), ball("b1", 1), ball("b2", 3)]) })).toMatchObject({
      passed: false,
      scored: true,
    })
    expect(judge(s, { result: fake([ball("b1", 1), ball("b2", 2), cushion(3)]) }).passed).toBe(false)
  })

  it("score + cushionFirst: bi cai phai cham bang truoc khi cham bi", () => {
    const s = scenario({ type: "score", require: "cushionFirst" })
    expect(judge(s, { result: fake([cushion(1), ball("b2", 2), ball("b1", 3)]) }).passed).toBe(true)
    expect(judge(s, { result: fake([ball("b1", 1), cushion(2), ball("b2", 3)]) })).toMatchObject({
      passed: false,
      scored: true,
    })
  })

  it("stopInZone: dat khi tam bi cai nam trong o", () => {
    const s = scenario({ type: "stopInZone", ball: "cue", zone: { cx: 10, cy: 0, r: 3 } })
    expect(judge(s, { result: fake([], { cue: [12.9, 0] }) }).passed).toBe(true)
    const miss = judge(s, { result: fake([], { cue: [14, 0] }) })
    expect(miss.passed).toBe(false)
    expect(miss.detail).toContain("2,0 viên bi")
  })

  it("stopInZone + cushions: phai cham dung so bang", () => {
    const s = scenario({ type: "stopInZone", ball: "cue", zone: { cx: 10, cy: 0, r: 3 }, cushions: 1 })
    expect(judge(s, { result: fake([cushion(1)], { cue: [10, 0] }) }).passed).toBe(true)
    const direct = judge(s, { result: fake([], { cue: [10, 0] }) })
    expect(direct.passed).toBe(false)
    expect(direct.detail).toContain("đúng 1 băng")
    expect(judge(s, { result: fake([cushion(1), cushion(2)], { cue: [10, 0] }) }).passed).toBe(false)
  })

  it("gather: ghi diem ma bi con xa thi chi dat mot phan", () => {
    const s = scenario({ type: "gather", radius: 6 })
    const both = [ball("b1", 1), ball("b2", 2)]
    const near = fake(both, { cue: [0, 0], b1: [4, 0], b2: [2, 3] })
    const far = fake(both, { cue: [0, 0], b1: [30, 0], b2: [2, 3] })
    expect(spread(near)).toBeLessThan(6)
    expect(judge(s, { result: near })).toMatchObject({ passed: true, scored: true })
    expect(judge(s, { result: far })).toMatchObject({ passed: false, partial: true, scored: true })
    const noScore = judge(s, { result: fake([ball("b1", 1)], { cue: [0, 0], b1: [4, 0], b2: [2, 3] }) })
    expect(noScore.passed).toBe(false)
    expect(noScore.partial).toBeUndefined()
  })

  it("choice: dat khi chon dung dap an", () => {
    const s = scenario({ type: "choice", options: ["A", "B"], answer: 1 })
    expect(judge(s, { choice: 1 }).passed).toBe(true)
    const wrong = judge(s, { choice: 0 })
    expect(wrong.passed).toBe(false)
    expect(wrong.detail).toContain("B")
  })

  it("markCushion: dat khi diem cham nam trong sai so", () => {
    const s = scenario({ type: "markCushion", target: [5, TABLE.centreLimitY], tolerance: 1 })
    expect(judge(s, { mark: [5.8, TABLE.centreLimitY] }).passed).toBe(true)
    expect(judge(s, { mark: [7, TABLE.centreLimitY] }).passed).toBe(false)
  })

  it("bao loi khi lan thu khong hop voi loai muc tieu", () => {
    expect(() => judge(scenario({ type: "score" }), { choice: 0 })).toThrow()
    expect(() => judge(scenario({ type: "choice", options: ["A"], answer: 0 }), { mark: [0, 0] })).toThrow()
  })
})

describe("sliderToPower", () => {
  it("di tu 0,01 toi 1 va moi nac tang cung mot ti le", () => {
    expect(sliderToPower(SLIDER_MIN)).toBeCloseTo(0.01, 9)
    expect(sliderToPower(SLIDER_MAX)).toBeCloseTo(1, 9)
    expect(sliderToPower(41) / sliderToPower(40)).toBeCloseTo(sliderToPower(81) / sliderToPower(80), 9)
  })
})

describe("bo do loi giai", () => {
  it("loi giai tim duoc thuc su dat va con dat khi lech nhe", () => {
    const s = SAMPLES.find((x) => x.goal.type === "score")!
    const report = checkScenario(s)
    expect(report.ok).toBe(true)
    const c = report.solution!
    for (const dAngle of [-0.3, 0, 0.3]) {
      const result = simulate(s.balls, {
        angleDeg: c.angleDeg + dAngle,
        power: sliderToPower(c.slider!),
        tip: c.tip,
      })
      expect(judge(s, { result }).passed).toBe(true)
    }
  })

  it("bao loi tinh huong vo nghiem: huong bi khoa khong the dua bi cai toi o dich", () => {
    // Huong khoa 90 do: bi cai chi chay len xuong theo x = -40, o dich nam o x = 40.
    const report = checkScenario(
      scenario(
        { type: "stopInZone", ball: "cue", zone: { cx: 40, cy: 0, r: 1 } },
        { balls: { cue: [-40, 0] }, locked: { angleDeg: 90, tip: { x: 0, y: 0 } } }
      )
    )
    expect(report.ok).toBe(false)
    expect(report.problems.join(" ")).toContain("không tìm thấy lời giải")
  })

  it("bao loi tinh huong ghi diem thieu bi, the bi chong nhau, o dich ngoai ban", () => {
    expect(checkScenario(scenario({ type: "score" }, { balls: { cue: [0, 0], b1: [5, 0] } })).ok).toBe(false)
    expect(checkScenario(scenario({ type: "score" }, { balls: { cue: [0, 0], b1: [1, 0], b2: [9, 0] } })).ok).toBe(false)
    expect(
      checkScenario(scenario({ type: "stopInZone", ball: "cue", zone: { cx: 99, cy: 0, r: 2 } }, { balls: { cue: [0, 0] } })).ok
    ).toBe(false)
  })

  it("bai chon dap an: bao loi khi lua chon sai van ghi diem hoac dap an khong ghi diem", () => {
    const sample = SAMPLES.find((x) => x.goal.type === "choice")!
    expect(checkScenario(sample).ok).toBe(true)
    if (sample.goal.type !== "choice") return
    const flipped = checkScenario({ ...sample, goal: { ...sample.goal, answer: 0 } })
    expect(flipped.ok).toBe(false)
    expect(flipped.problems.join(" ")).toContain("vẫn ghi điểm")
    expect(flipped.problems.join(" ")).toContain("không ghi điểm")
  })

  const l4 = (id: string) => LEVEL4.find((x) => x.id === id)!

  it("onlyTip: bao loi khi diem cham khai bao khong phai diem duy nhat ghi diem", () => {
    const s = l4("L4-G-02")
    expect(checkScenario(s).ok).toBe(true)
    if (s.goal.type !== "score") return
    const wrong = checkScenario({ ...s, goal: { ...s.goal, onlyTip: { x: 0.45, y: -0.45 } } })
    expect(wrong.ok).toBe(false)
    expect(wrong.problems.join(" ")).toContain("cũng ghi điểm")
    expect(checkScenario({ ...s, locked: { angleDeg: s.locked!.angleDeg } }).problems.join(" ")).toContain("khóa cả hướng và lực")
  })

  it("markCushion co cu mau: bao loi khi diem dich khong phai cho cu mau cham bang", () => {
    const s = l4("L4-B-01")
    expect(checkScenario(s).ok).toBe(true)
    if (s.goal.type !== "markCushion") return
    const moved = checkScenario({ ...s, goal: { ...s.goal, target: [s.goal.target[0] + 3, s.goal.target[1]] } })
    expect(moved.ok).toBe(false)
    expect(moved.problems.join(" ")).toContain("lệch khỏi điểm đích")
  })

  it("bai doc nguoc: bao loi khi mot diem cham khac cho ket qua gan nhu giong dap an", () => {
    const s = l4("L4-I-01")
    expect(checkScenario(s).ok).toBe(true)
    if (s.goal.type !== "choice" || !s.goal.replay) return
    const tips = s.goal.replay.tips.map((t, i) => (i === 0 ? { x: t.x + 0.01, y: t.y } : t))
    tips[1] = tips[0]
    const same = checkScenario({ ...s, goal: { ...s.goal, answer: 0, replay: { ...s.goal.replay, tips } } })
    expect(same.ok).toBe(false)
    expect(same.problems.join(" ")).toContain("gần như giống đáp án")
  })

  it("bao loi id trung nhau", () => {
    const s = SAMPLES.find((x) => x.goal.type === "choice")!
    const reports = checkAll([s, s])
    expect(reports[0].ok).toBe(true)
    expect(reports[1].ok).toBe(false)
  })
})
