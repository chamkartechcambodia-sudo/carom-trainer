// Test luat cua che do Danh chuoi: dem chuoi, luot, luat vung goc, va luu buoi danh.
import { describe, expect, it } from "vitest"
import {
  CORNER,
  applyShot,
  average,
  cornerOf,
  cornerTriangles,
  finish,
  leftCorner,
  newChain,
  sharedCorner,
  type ChainState,
} from "../src/app/chain"
import { createStore, sanitise } from "../src/app/storage"
import { TABLE, type SimResult, type Vec2 } from "../src/engine"

// Hai diem nam sau trong goc phai tren, va mot diem o giua ban.
const IN_A: Vec2 = [TABLE.halfLength - 4, TABLE.halfWidth - 3]
const IN_B: Vec2 = [TABLE.halfLength - 7, TABLE.halfWidth - 2]
const MID: Vec2 = [0, 0]

/** Ket qua gia: bi vang va bi do di theo cac duong cho san; vi tri cuoi la diem cuoi cua duong. */
function shot(scored: boolean, b1: Vec2[], b2: Vec2[]): SimResult {
  return {
    times: b1.map((_, i) => i),
    paths: { cue: b1.map(() => MID), b1, b2 },
    events: [],
    final: { cue: MID, b1: b1[b1.length - 1], b2: b2[b2.length - 1] },
    scored,
    duration: b1.length,
    timedOut: false,
  }
}
const stay = (p: Vec2): Vec2[] => [p, p]
const play = (s: ChainState, r: SimResult, rule = true) => applyShot(s, r, rule)

describe("vung goc", () => {
  it("la tam giac 1/4 chieu dai x 1/4 chieu rong o moi goc", () => {
    expect(CORNER.alongLong).toBeCloseTo(TABLE.halfLength / 2, 9)
    expect(CORNER.alongShort).toBeCloseTo(TABLE.halfWidth / 2, 9)
    const t = cornerTriangles()
    expect(t).toHaveLength(4)
    expect(t[3][0]).toEqual([TABLE.halfLength, TABLE.halfWidth])
    expect(t[3][1][0]).toBeCloseTo(TABLE.halfLength - CORNER.alongLong, 9)
    expect(t[3][2][1]).toBeCloseTo(TABLE.halfWidth - CORNER.alongShort, 9)
  })

  it("cornerOf nhan dung goc, giua ban thi null", () => {
    expect(cornerOf(IN_A)).toBe(3)
    expect(cornerOf([-IN_A[0], -IN_A[1]])).toBe(0)
    expect(cornerOf([IN_A[0], -IN_A[1]])).toBe(1)
    expect(cornerOf([-IN_A[0], IN_A[1]])).toBe(2)
    expect(cornerOf(MID)).toBeNull()
    // Gan bang dai nhung xa goc: ngoai vung.
    expect(cornerOf([0, TABLE.halfWidth - 1])).toBeNull()
    // Ngay ngoai canh huyen cua tam giac.
    expect(cornerOf([TABLE.halfLength - CORNER.alongLong / 2 - 1, TABLE.halfWidth - CORNER.alongShort / 2 - 1])).toBeNull()
  })

  it("sharedCorner chi tinh hai bi muc tieu, khong tinh bi cai", () => {
    expect(sharedCorner({ cue: MID, b1: IN_A, b2: IN_B })).toBe(3)
    expect(sharedCorner({ cue: IN_A, b1: IN_B, b2: MID })).toBeNull()
    expect(sharedCorner({ cue: MID, b1: IN_A, b2: [-IN_B[0], IN_B[1]] })).toBeNull()
    expect(sharedCorner({ cue: MID })).toBeNull()
  })

  it("leftCorner: bi ra khoi vung roi quay lai van tinh la da ra", () => {
    expect(leftCorner(shot(true, stay(IN_A), stay(IN_B)), 3)).toBe(false)
    expect(leftCorner(shot(true, [IN_A, MID, IN_A], stay(IN_B)), 3)).toBe(true)
  })
})

describe("dem chuoi va luot", () => {
  it("ghi diem noi chuoi; truot thi het luot va chuoi ve 0", () => {
    let s = newChain()
    s = play(s, shot(true, stay(MID), stay(MID)), false).state
    s = play(s, shot(true, stay(MID), stay(MID)), false).state
    expect(s).toMatchObject({ run: 2, best: 2, innings: 0, points: 2 })
    const miss = play(s, shot(false, stay(MID), stay(MID)), false)
    expect(miss.outcome).toBe("miss")
    expect(miss.state).toMatchObject({ run: 0, best: 2, innings: 1, points: 2 })
    s = play(miss.state, shot(true, stay(MID), stay(MID)), false).state
    expect(s).toMatchObject({ run: 1, best: 2, innings: 1, points: 3 })
  })

  it("finish dong luot dang danh do; khong them luot khi chuoi dang la 0", () => {
    let s = play(newChain(), shot(true, stay(MID), stay(MID)), false).state
    expect(finish(s)).toMatchObject({ run: 0, innings: 1, points: 1, best: 1 })
    s = play(s, shot(false, stay(MID), stay(MID)), false).state
    expect(finish(s).innings).toBe(1)
    expect(finish(newChain()).innings).toBe(0)
  })

  it("trung binh = diem chia luot, null khi chua co luot", () => {
    expect(average(7, 2)).toBe(3.5)
    expect(average(0, 0)).toBeNull()
  })
})

describe("luat vung goc", () => {
  const inside = () => shot(true, stay(IN_A), stay(IN_B))

  it("tat luat thi ghi bao nhieu diem trong goc cung duoc", () => {
    let s = newChain()
    for (let i = 0; i < 5; i++) s = play(s, inside(), false).state
    expect(s).toMatchObject({ run: 5, points: 5, corner: null })
  })

  it("bat luat: sau cu dua bi vao vung, duoc ghi dung so diem cho phep roi phai dua bi ra", () => {
    // Cu dua hai bi vao vung (truoc do o ngoai): duoc tinh diem, chua tinh vao gioi han.
    let s = play(newChain(), shot(true, [MID, IN_A], [MID, IN_B])).state
    expect(s).toMatchObject({ run: 1, corner: 3, cornerCaroms: 0 })
    for (let i = 1; i <= CORNER.caromsAllowedInside; i++) {
      const r = play(s, inside())
      expect(r.outcome).toBe("point")
      s = r.state
      expect(s.cornerCaroms).toBe(i)
    }
    const run = s.run
    const foul = play(s, inside())
    expect(foul.outcome).toBe("cornerFoul")
    // Diem khong duoc tinh, het luot.
    expect(foul.state).toMatchObject({ run: 0, innings: 1, points: run, best: run, cornerCaroms: 0 })
  })

  it("mot bi ra khoi vung roi quay lai thi dem lai tu dau", () => {
    let s = play(newChain(), shot(true, [MID, IN_A], [MID, IN_B])).state
    for (let i = 0; i < CORNER.caromsAllowedInside; i++) s = play(s, inside()).state
    const out = play(s, shot(true, [IN_A, MID, IN_A], stay(IN_B)))
    expect(out.outcome).toBe("point")
    expect(out.state.cornerCaroms).toBe(0)
    expect(play(out.state, inside()).outcome).toBe(CORNER.caromsAllowedInside >= 1 ? "point" : "cornerFoul")
  })

  it("dua mot bi ra han khoi vung thi het bi rang buoc", () => {
    let s = play(newChain(), shot(true, [MID, IN_A], [MID, IN_B])).state
    s = play(s, shot(true, [IN_A, MID], stay(IN_B))).state
    expect(s).toMatchObject({ corner: null, cornerCaroms: 0 })
  })

  it("truot trong vung goc: het luot, luot sau dem lai tu dau", () => {
    let s = play(newChain(), shot(true, [MID, IN_A], [MID, IN_B])).state
    s = play(s, shot(false, stay(IN_A), stay(IN_B))).state
    expect(s).toMatchObject({ run: 0, innings: 1, corner: 3, cornerCaroms: 0 })
  })
})

describe("luu buoi danh", () => {
  it("ghi va doc lai; bo dong sai", () => {
    const map = new Map<string, string>()
    const backend = { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v), removeItem: (k: string) => void map.delete(k) }
    const store = createStore(backend)
    store.update((d) => d.sessions.push({ date: "2026-11-25", kind: "sim", innings: 4, points: 9, bestRun: 5 }))
    expect(createStore(backend).get().sessions).toEqual([{ date: "2026-11-25", kind: "sim", innings: 4, points: 9, bestRun: 5 }])
    const cleaned = sanitise({
      sessions: [
        { date: "2026-11-25", kind: "real", innings: 10, points: 12, bestRun: 4 },
        { date: "2026-11-25", kind: "real", innings: 0, points: 0, bestRun: 0 },
        { date: "2026-11-25", kind: "real", innings: 3, points: 2, bestRun: 5 },
        { date: "2026-11-25", kind: "khac", innings: 3, points: 2, bestRun: 1 },
        { date: "hom nay", kind: "sim", innings: 3, points: 2, bestRun: 1 },
      ],
    })
    expect(cleaned.sessions).toEqual([{ date: "2026-11-25", kind: "real", innings: 10, points: 12, bestRun: 4 }])
    // File sao luu cu chua co truong nay van nhap duoc.
    expect(sanitise({ version: 1 }).sessions).toEqual([])
  })
})
