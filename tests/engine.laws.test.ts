// Test quy luat vat ly qua API cua src/engine (buoc 2 trong docs/PLAN.md).
// Nguong duoc dat theo quy luat, khong theo so do. Neu mot test o day that bai:
// DUNG va bao nguoi dung, khong noi nguong, khong sua cong thuc vat ly.
import { describe, expect, it } from "vitest"
import { simulate, type Shot, type SimResult, type Vec2 } from "../src/engine"

const CENTRE = { x: 0, y: 0 }
const deg = (rad: number) => (rad * 180) / Math.PI
const dist = (p: Vec2, q: Vec2) => Math.hypot(q[0] - p[0], q[1] - p[1])

function shot(angleDeg: number, power: number, tip = CENTRE): Shot {
  return { angleDeg, power, tip }
}

/** Vi tri cua mot bi tai thoi diem t (mau gan nhat khong som hon t). */
function posAt(r: SimResult, path: Vec2[], t: number): Vec2 {
  const i = r.times.findIndex((x) => x >= t)
  return path[i < 0 ? path.length - 1 : i]
}

/** Quang duong bi di duoc trong khoang [t0, t1]. */
function travelled(r: SimResult, path: Vec2[], t0 = 0, t1 = Infinity) {
  let sum = 0
  for (let i = 1; i < path.length; i++) {
    if (r.times[i - 1] >= t0 && r.times[i] <= t1) sum += dist(path[i - 1], path[i])
  }
  return sum
}

function firstBallHit(r: SimResult) {
  const e = r.events.find((v) => v.type === "ball")
  if (!e || e.type !== "ball") throw new Error("khong co va cham bi")
  return e
}

/** Cho bi cai nam truoc khi co va cham bi lan hai (bi muc tieu bat bang quay lai). */
function cueAfterFirstHit(r: SimResult): Vec2 {
  const second = r.events.filter((v) => v.type === "ball")[1]
  return second ? posAt(r, r.paths.cue, second.t) : r.final.cue
}

// --- Bi cham bi ---

describe("bi cham bi", () => {
  it("danh thang chinh dien, khong xoay, cu ly ngan: bi cai gan nhu dung yen", () => {
    const r = simulate({ cue: [-4, 0], b1: [0, 0] }, shot(0, 0.2))
    const hit = firstBallHit(r)
    expect(dist(hit.posA, cueAfterFirstHit(r))).toBeLessThan(2)
    expect(travelled(r, r.paths.b1!)).toBeGreaterThan(20)
  })

  it.each([1, 1.4, 1.8])(
    "danh xeo khong xoay, cu ly ngan (lech %s R): hai bi tach nhau 80 den 95 do",
    (offset) => {
      const r = simulate({ cue: [-4, offset], b1: [0, 0] }, shot(0, 0.3))
      const hit = firstBallHit(r)
      const c = posAt(r, r.paths.cue, hit.t + 0.02)
      const o = posAt(r, r.paths.b1!, hit.t + 0.02)
      const cueDir = Math.atan2(c[1] - hit.posA[1], c[0] - hit.posA[0])
      const objDir = Math.atan2(o[1] - hit.posB[1], o[0] - hit.posB[0])
      const split = Math.abs(deg(cueDir - objDir))
      expect(split).toBeGreaterThanOrEqual(80)
      expect(split).toBeLessThanOrEqual(95)
    }
  )

  it("tren tam: bi cai di qua ve phia truoc; duoi tam: bi cai lui", () => {
    const run = (y: number) => {
      const r = simulate({ cue: [-6, 0], b1: [0, 0] }, shot(0, 0.2, { x: 0, y }))
      return { contactX: firstBallHit(r).posA[0], restX: cueAfterFirstHit(r)[0] }
    }
    const centre = run(0)
    const top = run(0.8)
    const bottom = run(-0.8)
    expect(top.restX).toBeGreaterThan(centre.restX + 3)
    expect(bottom.restX).toBeLessThan(centre.restX - 3)
    // Lui that su: nam sau cho va cham, khong chi la "ngan hon cu giua tam".
    // Luc nhe nen lui it (do duoc 1.4 R); xem ghi chu trong docs/PROGRESS.md.
    expect(bottom.restX).toBeLessThan(bottom.contactX - 0.5)
  })
})

// --- Duong 90 do chi dung khi bi cai con truot ---

/**
 * Cung mot the danh xeo (bi vang o goc toa do, duong ngam lech tam `offset` R), chi doi
 * khoang cach. Tra ve goc lech cua huong bi cai so voi duong 90 do, DUONG = ve phia
 * truoc (cung phia voi huong danh), do tu cho cham toi vi tri bi cai 0,3 giay sau.
 */
function forwardOfTangent(distance: number, offset: number, power: number) {
  const r = simulate({ cue: [-distance, offset], b1: [0, 0] }, shot(0, power))
  const hit = firstBallHit(r)
  // Phap tuyen va cham: tu bi ma toi tam bi vang. Duong 90 do vuong goc voi no.
  const n: Vec2 = [-hit.posA[0] / 2, -hit.posA[1] / 2]
  const tangent: Vec2 = [1 - n[0] * n[0], -n[0] * n[1]]
  const later = posAt(r, r.paths.cue, hit.t + 0.3)
  const to: Vec2 = [later[0] - hit.posA[0], later[1] - hit.posA[1]]
  const cross = tangent[0] * to[1] - tangent[1] * to[0]
  const dot = tangent[0] * to[0] + tangent[1] * to[1]
  // Huong danh la +x; dau cua (tangent x huong danh) cho biet phia nao la "phia truoc".
  const forward = Math.sign(-tangent[1]) || 1
  return { angle: deg(Math.atan2(cross, dot)) * forward, rolling: hit.aRolling }
}

describe("duong 90 do va bi tu lan", () => {
  const NEAR = { distance: 4, power: 0.3 } // hai bi cach nhau 2 R, luc kha manh: con truot
  const FAR = { distance: 40, power: 0.12 } // cach 38 R, luc vua: da lan

  it("cu ly ngan: bi cai con truot luc cham va di sat duong 90 do", () => {
    const near = forwardOfTangent(NEAR.distance, 1.4, NEAR.power)
    expect(near.rolling).toBe(false)
    expect(Math.abs(near.angle)).toBeLessThan(10)
  })

  it("cu ly dai, luc vua: bi cai da lan luc cham va lech ve phia truoc duong 90 do", () => {
    const near = forwardOfTangent(NEAR.distance, 1.4, NEAR.power)
    const far = forwardOfTangent(FAR.distance, 1.4, FAR.power)
    expect(far.rolling).toBe(true)
    expect(far.angle).toBeGreaterThan(0)
    expect(far.angle).toBeGreaterThan(near.angle + 5)
  })

  it("nua bi: van lech ve truoc nhieu hon khi danh xa (cu ly ngan da lech khoang 12 do, xem D10)", () => {
    // Cham day thi mo hinh khong sat duong 90 do ke ca khi con truot (D10 muc 1),
    // nen o day chi kiem chieu thay doi, khong kiem "sat".
    const near = forwardOfTangent(NEAR.distance, 1, NEAR.power)
    const far = forwardOfTangent(FAR.distance, 1, FAR.power)
    expect(near.rolling).toBe(false)
    expect(far.rolling).toBe(true)
    expect(far.angle).toBeGreaterThan(near.angle + 5)
  })
})

// --- Bi cham bang ---

/**
 * Chi co bi cai, dam vao bang tren, bi troi sang +x. `incidence` la goc toi do
 * tu phap tuyen cua bang. Voi huong di nay, xoay phai (tip.x > 0) la xoay thuan.
 */
function intoTopCushion(incidence: number, power: number, tipX: number) {
  const r = simulate({ cue: [-10, 12] }, shot(90 - incidence, power, { x: tipX, y: 0 }))
  const e = r.events[0]
  if (e.type !== "cushion" || e.cushion !== "top") throw new Error("khong cham bang tren truoc")
  const before = posAt(r, r.paths.cue, e.t - 0.04)
  const after = posAt(r, r.paths.cue, e.t + 0.04)
  const next = r.events[1]?.t ?? Infinity
  return {
    angleIn: deg(Math.atan2(e.pos[0] - before[0], e.pos[1] - before[1])),
    angleOut: deg(Math.atan2(after[0] - e.pos[0], e.pos[1] - after[1])),
    runAfter: travelled(r, r.paths.cue, e.t, Math.min(e.t + 0.3, next)),
  }
}

describe("bi cham bang", () => {
  it("dam thang vao bang phai: xoay phai bat sang phai, xoay trai bat sang trai", () => {
    // Nguoi danh nhin theo +x thi ben phai la -y.
    const yAfter = (tipX: number) => {
      const r = simulate({ cue: [20, 0] }, shot(0, 0.3, { x: tipX, y: 0 }))
      const e = r.events[0]
      expect(e.type === "cushion" && e.cushion).toBe("right")
      return posAt(r, r.paths.cue, e.t + 0.3)[1]
    }
    expect(yAfter(0.5)).toBeLessThan(-1)
    expect(yAfter(-0.5)).toBeGreaterThan(1)
    expect(Math.abs(yAfter(0))).toBeLessThan(0.1)
  })

  it("dam thang vao bang tren: xoay phai bat sang phai, xoay trai bat sang trai", () => {
    // Nguoi danh nhin theo +y thi ben phai la +x.
    const xAfter = (tipX: number) => {
      const r = simulate({ cue: [0, 5] }, shot(90, 0.3, { x: tipX, y: 0 }))
      const e = r.events[0]
      expect(e.type === "cushion" && e.cushion).toBe("top")
      return posAt(r, r.paths.cue, e.t + 0.3)[0]
    }
    expect(xAfter(0.5)).toBeGreaterThan(1)
    expect(xAfter(-0.5)).toBeLessThan(-1)
    expect(Math.abs(xAfter(0))).toBeLessThan(0.1)
  })

  it.each([30, 45])("dam xeo %s do, khong xoay: goc bat gan goc toi", (incidence) => {
    const none = intoTopCushion(incidence, 0.3, 0)
    expect(Math.abs(none.angleOut - none.angleIn)).toBeLessThan(15)
  })

  it.each([30, 45])("dam xeo %s do: xoay thuan bat rong hon va di xa hon", (incidence) => {
    const none = intoTopCushion(incidence, 0.3, 0)
    const running = intoTopCushion(incidence, 0.3, 0.6)
    expect(running.angleOut).toBeGreaterThan(none.angleOut + 1)
    expect(running.runAfter).toBeGreaterThan(none.runAfter)
  })

  it.each([30, 45])("dam xeo %s do: xoay nghich bat dung hon", (incidence) => {
    const none = intoTopCushion(incidence, 0.3, 0)
    const reverse = intoTopCushion(incidence, 0.3, -0.6)
    expect(reverse.angleOut).toBeLessThan(none.angleOut - 1)
  })
})

// --- Luc va tinh tat dinh ---

describe("luc va tinh tat dinh", () => {
  it("luc lon hon thi bi cai di duoc quang duong dai hon", () => {
    const lengths = [0.1, 0.2, 0.4, 0.8].map((power) => {
      const r = simulate({ cue: [0, 0] }, shot(17, power))
      return travelled(r, r.paths.cue)
    })
    for (let i = 1; i < lengths.length; i++) {
      expect(lengths[i]).toBeGreaterThan(lengths[i - 1])
    }
  })

  it("cung dau vao cho cung ket qua", () => {
    const setup = { cue: [-10, 0] as Vec2, b1: [10, 0.9] as Vec2, b2: [25, -12] as Vec2 }
    const s = shot(3, 0.5, { x: 0.3, y: -0.4 })
    expect(simulate(setup, s)).toEqual(simulate(setup, s))
  })
})
