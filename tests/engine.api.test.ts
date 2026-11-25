// Test hop dong cua API engine: don vi, su kien, ghi diem, dau vao sai.
import { describe, expect, it } from "vitest"
import { BALL_RADIUS, TABLE, simulate, type Setup } from "../src/engine"

const centre = { x: 0, y: 0 }

describe("engine API", () => {
  it("kich thuoc ban tinh theo ban kinh bi, ti le 2:1", () => {
    expect(BALL_RADIUS).toBe(1)
    expect(TABLE.halfLength).toBeCloseTo(46.18, 6)
    expect(TABLE.halfWidth).toBeCloseTo(23.09, 6)
    expect(TABLE.centreLimitX).toBeCloseTo(TABLE.halfLength - 1, 6)
    expect(TABLE.centreLimitY).toBeCloseTo(TABLE.halfWidth - 1, 6)
  })

  it("duong di cua moi bi dai bang mang thoi gian va ket thuc o vi tri cuoi", () => {
    const setup: Setup = { cue: [-10, 0], b1: [10, 0.9], b2: [25, -12] }
    const r = simulate(setup, { angleDeg: 0, power: 0.5, tip: centre })
    expect(r.timedOut).toBe(false)
    expect(r.times[0]).toBe(0)
    expect(r.times[r.times.length - 1]).toBeCloseTo(r.duration, 9)
    for (const id of ["cue", "b1", "b2"] as const) {
      const path = r.paths[id]!
      expect(path.length).toBe(r.times.length)
      expect(path[0]).toEqual(setup[id])
      expect(path[path.length - 1]).toEqual(r.final[id])
      expect(Math.abs(r.final[id]![0])).toBeLessThanOrEqual(TABLE.centreLimitX + 1e-6)
      expect(Math.abs(r.final[id]![1])).toBeLessThanOrEqual(TABLE.centreLimitY + 1e-6)
    }
  })

  it("su kien theo thu tu thoi gian; va cham dau la bi cai voi b1 o cho hai bi cham nhau", () => {
    const r = simulate({ cue: [-10, 0], b1: [10, 0], b2: [0, 15] }, { angleDeg: 0, power: 0.3, tip: centre })
    for (let i = 1; i < r.events.length; i++) {
      expect(r.events[i].t).toBeGreaterThanOrEqual(r.events[i - 1].t)
    }
    const e = r.events[0]
    expect(e.type).toBe("ball")
    if (e.type !== "ball") return
    expect([e.a, e.b]).toEqual(["cue", "b1"])
    const gap = Math.hypot(e.posA[0] - e.posB[0], e.posA[1] - e.posB[1])
    expect(gap).toBeGreaterThan(1.99)
    expect(gap).toBeLessThan(2.4)
  })

  it("su kien cham bang ghi dung bang va vi tri nam tren gioi han tam bi", () => {
    const r = simulate({ cue: [0, 0] }, { angleDeg: 0, power: 0.3, tip: centre })
    const e = r.events[0]
    expect(e.type).toBe("cushion")
    if (e.type !== "cushion") return
    expect(e.ball).toBe("cue")
    expect(e.cushion).toBe("right")
    expect(e.pos[0]).toBe(TABLE.centreLimitX)
    expect(e.pos[1]).toBeCloseTo(0, 6)
    expect(simulate({ cue: [0, 0] }, { angleDeg: 90, power: 0.3, tip: centre }).events[0]).toMatchObject({ cushion: "top" })
    expect(simulate({ cue: [0, 0] }, { angleDeg: 180, power: 0.3, tip: centre }).events[0]).toMatchObject({ cushion: "left" })
    expect(simulate({ cue: [0, 0] }, { angleDeg: 270, power: 0.3, tip: centre }).events[0]).toMatchObject({ cushion: "bottom" })
  })

  it("ghi diem khi va chi khi bi cai cham ca hai bi kia", () => {
    // Ba bi thang hang: bi cai chi cham b1, b1 moi la bi cham b2.
    const line = simulate({ cue: [-10, 0], b1: [0, 0], b2: [6, 0] }, { angleDeg: 0, power: 0.15, tip: centre })
    expect(line.events.some((e) => e.type === "ball" && e.a === "b1" && e.b === "b2")).toBe(true)
    const cueHits = (r: typeof line) =>
      new Set(r.events.flatMap((e) => (e.type === "ball" && e.a === "cue" ? [e.b] : [])))
    expect(line.scored).toBe(cueHits(line).size === 2)

    // Cham mong b1 roi di tiep toi b2.
    const thin = simulate({ cue: [-10, 0], b1: [0, 1.9], b2: [8, -0.5] }, { angleDeg: 0, power: 0.3, tip: centre })
    expect(cueHits(thin)).toEqual(new Set(["b1", "b2"]))
    expect(thin.scored).toBe(true)

    const miss = simulate({ cue: [-10, 0], b1: [0, 10], b2: [8, -10] }, { angleDeg: 0, power: 0.1, tip: centre })
    expect(miss.scored).toBe(false)
    expect(simulate({ cue: [-10, 0], b1: [0, 0] }, { angleDeg: 0, power: 0.3, tip: centre }).scored).toBe(false)
  })

  it("power = 0 thi khong bi nao di chuyen", () => {
    const r = simulate({ cue: [0, 0], b1: [5, 0] }, { angleDeg: 0, power: 0, tip: centre })
    expect(r.events).toEqual([])
    expect(r.final).toEqual({ cue: [0, 0], b1: [5, 0] })
    expect(r.duration).toBe(0)
  })

  it("diem cham ngoai vong tron don vi duoc keo ve mep", () => {
    const setup: Setup = { cue: [0, 0] }
    const a = simulate(setup, { angleDeg: 30, power: 0.4, tip: { x: 3, y: 4 } })
    const b = simulate(setup, { angleDeg: 30, power: 0.4, tip: { x: 0.6, y: 0.8 } })
    expect(a.final).toEqual(b.final)
  })

  it("bi nam dung sat bang hoac sat goc: van mo phong duoc, khong nem loi (D19)", () => {
    const X = TABLE.centreLimitX
    const Y = TABLE.centreLimitY
    const tip = { x: 0, y: 0 }
    // Cac the tung lam loi vat ly nem "Depth exceeded resolving collisions".
    const cases: [Setup, number, number][] = [
      [{ cue: [X, 0] }, 90, 0.3],
      [{ cue: [0, Y] }, 0, 0.3],
      [{ cue: [X, Y] }, 0, 1],
      [{ cue: [-X, -Y] }, 180, 0.02],
      [{ cue: [X - 0.005, Y - 0.005] }, 90, 0.3],
    ]
    for (const [setup, angleDeg, power] of cases) {
      const r = simulate(setup, { angleDeg, power, tip })
      expect(r.timedOut).toBe(false)
      // Bi chi bi doi toi da 0,05 ban kinh bi so voi cho dat.
      expect(Math.hypot(r.paths.cue[0][0] - setup.cue[0], r.paths.cue[0][1] - setup.cue[1])).toBeLessThan(0.08)
    }
  })

  it("bao loi khi bi nam ngoai ban hoac chong len nhau", () => {
    const s = { angleDeg: 0, power: 0.3, tip: centre }
    expect(() => simulate({ cue: [TABLE.centreLimitX + 0.5, 0] }, s)).toThrow(RangeError)
    expect(() => simulate({ cue: [0, 0], b1: [1.5, 0] }, s)).toThrow(RangeError)
  })
})
