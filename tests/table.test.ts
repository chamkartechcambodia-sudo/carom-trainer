// Test phan thuan toan hoc cua src/table: hinh hoc ngam, ten vung diem cham, phat lai.
import { describe, expect, it } from "vitest"
import { TABLE, simulate, type Setup } from "../src/engine"
import { aimPreview, angleTo, slideOnCushion, snapToCushion } from "../src/table/aim"
import { GRAB_REACH, MIN_GAP, RAIL_GAP, pickBall, placeBall } from "../src/table/arrange"
import { predictCue } from "../src/table/predict"
import { buildTrack, sampleAt } from "../src/table/replay"
import { clampTip, tipZoneName } from "../src/table/tipZone"

describe("aimPreview", () => {
  it("khong gap bi nao: duong ngam dung o cho tam bi cham bang", () => {
    const p = aimPreview({ cue: [0, 0], b1: [0, 10] }, 0)
    expect(p.ghost).toBeUndefined()
    expect(p.end[0]).toBeCloseTo(TABLE.centreLimitX, 9)
    expect(p.end[1]).toBeCloseTo(0, 9)
  })

  it("danh thang chinh dien: bi ma cach bi muc tieu dung 2 R, khong co duong 90 do", () => {
    const p = aimPreview({ cue: [-10, 0], b1: [0, 0] }, 0)
    expect(p.end[0]).toBeCloseTo(-2, 9)
    expect(p.ghost?.target).toBe("b1")
    expect(p.ghost?.tangentDir).toBeNull()
  })

  it("danh xeo: duong 90 do vuong goc voi huong bi muc tieu va nghieng ve phia bi cai lech", () => {
    // Bi muc tieu nam lech ve +y so voi duong ngam nen bi cai lech ve -y.
    const p = aimPreview({ cue: [-10, 0], b1: [0, 1] }, 0)
    const g = p.ghost!
    expect(Math.hypot(0 - p.end[0], 1 - p.end[1])).toBeCloseTo(2, 9)
    expect(g.objectDir[0] * g.tangentDir![0] + g.objectDir[1] * g.tangentDir![1]).toBeCloseTo(0, 9)
    expect(g.tangentDir![1]).toBeLessThan(0)
    expect(g.tangentDir![0]).toBeGreaterThan(0)
    expect(Math.abs(g.tangentEnd![1])).toBeCloseTo(TABLE.centreLimitY, 9)
  })

  it("chon bi gan hon khi ca hai nam tren duong ngam; bo qua bi o sau lung", () => {
    expect(aimPreview({ cue: [0, 0], b1: [20, 0], b2: [10, 0] }, 0).ghost?.target).toBe("b2")
    expect(aimPreview({ cue: [0, 0], b1: [-10, 0] }, 0).ghost).toBeUndefined()
  })

  it("khop voi engine: bi ma trung cho bi cai cham bi, bi cham dau la bi du doan", () => {
    const setup: Setup = { cue: [-22, -8], b1: [4, 2], b2: [20, 10] }
    const angleDeg = angleTo(setup.cue, [4, 3.2])
    const p = aimPreview(setup, angleDeg)
    const hit = simulate(setup, { angleDeg, power: 0.3, tip: { x: 0, y: 0 } }).events[0]
    expect(hit.type).toBe("ball")
    if (hit.type !== "ball") return
    expect(hit.b).toBe(p.ghost?.target)
    expect(Math.hypot(hit.posA[0] - p.end[0], hit.posA[1] - p.end[1])).toBeLessThan(0.4)
  })

  it("angleTo tra ve goc trong [0, 360)", () => {
    expect(angleTo([0, 0], [1, 0])).toBeCloseTo(0, 9)
    expect(angleTo([0, 0], [0, 1])).toBeCloseTo(90, 9)
    expect(angleTo([0, 0], [0, -1])).toBeCloseTo(270, 9)
  })
})

describe("predictCue (duong du doan)", () => {
  const centre = { x: 0, y: 0 }

  it("bat dau o cho cham bi dau tien va dung o su kien ke tiep cua bi cai", () => {
    const balls: Setup = { cue: [-10, 1.4], b1: [0, 0], b2: [30, -15] }
    const shot = { angleDeg: 0, power: 0.3, tip: centre }
    const p = predictCue(balls, shot)!
    const result = simulate(balls, shot)
    const mine = result.events.filter((e) => (e.type === "ball" ? e.a === "cue" : e.ball === "cue"))
    expect(mine[0].type).toBe("ball")
    if (mine[0].type !== "ball") return
    expect(p.path[0]).toEqual(mine[0].posA)
    expect(p.path.length).toBeGreaterThan(5)
    const end = p.path[p.path.length - 1]
    const next = mine[1]
    const nextPos = next.type === "cushion" ? next.pos : next.posA
    expect(Math.hypot(end[0] - nextPos[0], end[1] - nextPos[1])).toBeLessThan(1)
  })

  it("doi diem cham thi duong du doan doi theo", () => {
    const balls: Setup = { cue: [-8, 1], b1: [0, 0] }
    const end = (y: number) => {
      const path = predictCue(balls, { angleDeg: 0, power: 0.2, tip: { x: 0, y } })!.path
      return path[Math.min(path.length - 1, 40)]
    }
    const top = end(0.8)
    const bottom = end(-0.8)
    // Tren tam keo bi cai ve phia truoc (+x) nhieu hon duoi tam.
    expect(top[0]).toBeGreaterThan(bottom[0] + 1)
  })

  it("bao bi cai da lan hay con truot luc cham", () => {
    expect(predictCue({ cue: [-4, 1.4], b1: [0, 0] }, { angleDeg: 0, power: 0.3, tip: centre })!.rolling).toBe(false)
    expect(predictCue({ cue: [-40, 1.4], b1: [0, 0] }, { angleDeg: 0, power: 0.12, tip: centre })!.rolling).toBe(true)
  })

  it("tra ve null khi bi cai khong cham bi nao truoc khi cham bang", () => {
    expect(predictCue({ cue: [0, 0] }, { angleDeg: 0, power: 0.3, tip: centre })).toBeNull()
    expect(predictCue({ cue: [0, 0], b1: [0, 10] }, { angleDeg: 0, power: 0.3, tip: centre })).toBeNull()
  })
})

describe("cham len bang", () => {
  it("snapToCushion dua diem ve bang gan nhat, ke ca khi bam ngoai ban", () => {
    expect(snapToCushion([5, 20])).toEqual([5, TABLE.centreLimitY])
    expect(snapToCushion([5, 99])).toEqual([5, TABLE.centreLimitY])
    expect(snapToCushion([-44, 3])).toEqual([-TABLE.centreLimitX, 3])
    expect(snapToCushion([10, -21])).toEqual([10, -TABLE.centreLimitY])
  })

  it("slideOnCushion truot doc bang va dung lai o goc", () => {
    expect(slideOnCushion([5, TABLE.centreLimitY], 0.25)).toEqual([5.25, TABLE.centreLimitY])
    expect(slideOnCushion([TABLE.centreLimitX, 3], -1)).toEqual([TABLE.centreLimitX, 2])
    expect(slideOnCushion([TABLE.centreLimitX - 0.1, -TABLE.centreLimitY], 5)[0]).toBe(TABLE.centreLimitX)
  })
})

describe("tipZoneName", () => {
  it("goi ten theo huong va muc xoay", () => {
    expect(tipZoneName({ x: 0, y: 0 })).toBe("giữa tâm")
    expect(tipZoneName({ x: 0.05, y: -0.1 })).toBe("giữa tâm")
    expect(tipZoneName({ x: 0.4, y: 0.4 })).toBe("trên phải, xoáy vừa")
    expect(tipZoneName({ x: 0, y: 0.3 })).toBe("trên, xoáy nhẹ")
    expect(tipZoneName({ x: -1, y: 0 })).toBe("trái, xoáy mạnh")
    expect(tipZoneName({ x: 0.6, y: -0.6 })).toBe("dưới phải, xoáy mạnh")
    expect(tipZoneName({ x: 0, y: -0.5 })).toBe("dưới, xoáy vừa")
  })

  it("clampTip keo diem ngoai vong tron ve mep, giu nguyen diem ben trong", () => {
    const c = clampTip({ x: 3, y: 4 })
    expect(c.x).toBeCloseTo(0.6, 9)
    expect(c.y).toBeCloseTo(0.8, 9)
    expect(clampTip({ x: 0.2, y: -0.3 })).toEqual({ x: 0.2, y: -0.3 })
  })
})

describe("sampleAt", () => {
  const times = [0, 1, 2]
  const track = buildTrack([
    [0, 0],
    [4, 0],
    [4, 3],
  ])

  it("noi suy vi tri va do dai vet giua hai mau", () => {
    expect(track.cumulative).toEqual([0, 4, 7])
    expect(sampleAt(times, track, 0.5)).toEqual({ pos: [2, 0], length: 2 })
    expect(sampleAt(times, track, 1.5)).toEqual({ pos: [4, 1.5], length: 5.5 })
  })

  it("kep ve hai dau khi t nam ngoai khoang", () => {
    expect(sampleAt(times, track, -1)).toEqual({ pos: [0, 0], length: 0 })
    expect(sampleAt(times, track, 9)).toEqual({ pos: [4, 3], length: 7 })
  })
})

describe("xep the bang tay", () => {
  const setup: Setup = { cue: [0, 0], b1: [10, 0], b2: [-10, 5] }
  const gap = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[1] - b[1])

  it("pickBall: chon bi gan nhat trong tam nam, cham cho trong thi khong chon", () => {
    expect(pickBall(setup, [0.5, 0.5])).toBe("cue")
    expect(pickBall(setup, [9, 1])).toBe("b1")
    expect(pickBall(setup, [0, GRAB_REACH + 0.1])).toBeNull()
    expect(pickBall({ cue: [0, 0] }, [10, 0])).toBeNull()
  })

  it("placeBall: cho trong thi dat dung diem keo", () => {
    expect(placeBall(setup, "cue", [3, -4])).toEqual([3, -4])
  })

  it("placeBall: keo ra ngoai ban thi bi dung sat bang, cach gioi han mot khe RAIL_GAP", () => {
    const p = placeBall(setup, "cue", [999, -999])!
    expect(p[0]).toBeCloseTo(TABLE.centreLimitX - RAIL_GAP, 9)
    expect(p[1]).toBeCloseTo(-(TABLE.centreLimitY - RAIL_GAP), 9)
  })

  it("placeBall: keo de len bi khac thi bi nam sat ben canh, khong chong len", () => {
    const p = placeBall(setup, "cue", [9.5, 0.3])!
    expect(gap(p, setup.b1!)).toBeCloseTo(MIN_GAP, 9)
    const onTop = placeBall(setup, "cue", [10, 0])!
    expect(gap(onTop, setup.b1!)).toBeCloseTo(MIN_GAP, 9)
  })

  it("placeBall: bi kia nam sat goc, keo vao dung goc thi van ra mot cho hop le", () => {
    const corner: Setup = { cue: [0, 0], b1: [TABLE.centreLimitX, TABLE.centreLimitY] }
    const p = placeBall(corner, "cue", [TABLE.centreLimitX, TABLE.centreLimitY])!
    expect(gap(p, corner.b1!)).toBeGreaterThanOrEqual(MIN_GAP - 1e-9)
    expect(Math.abs(p[0])).toBeLessThanOrEqual(TABLE.centreLimitX)
    expect(Math.abs(p[1])).toBeLessThanOrEqual(TABLE.centreLimitY)
  })

  it("bi xep sat bang roi danh doc theo bang: engine khong nem loi (ly do co RAIL_GAP)", () => {
    const p = placeBall({ cue: [0, 0] }, "cue", [999, 999])!
    for (const angleDeg of [0, 45, 90, 180, 270]) {
      for (const power of [0.02, 0.3, 1]) {
        expect(() => simulate({ cue: p }, { angleDeg, power, tip: { x: 0, y: 0 } })).not.toThrow()
      }
    }
  })

  it("moi cho placeBall tra ve deu la the engine chap nhan", () => {
    const tight: Setup = { cue: [0, 0], b1: [20, 3], b2: [22.5, 3.4] }
    let seed = 7
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648)
    for (let i = 0; i < 300; i++) {
      // Mot nua so diem roi quanh hai bi nam sat nhau, de ep truong hop bi day qua lai.
      const near = i % 2 === 0
      const point: [number, number] = near
        ? [21 + (rnd() - 0.5) * 6, 3 + (rnd() - 0.5) * 6]
        : [(rnd() - 0.5) * 3 * TABLE.centreLimitX, (rnd() - 0.5) * 3 * TABLE.centreLimitY]
      const p = placeBall(tight, "cue", point)
      if (!p) continue
      expect(() => simulate({ ...tight, cue: p }, { angleDeg: 0, power: 0.05, tip: { x: 0, y: 0 } })).not.toThrow()
    }
  })
})
