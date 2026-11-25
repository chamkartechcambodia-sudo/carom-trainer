// Lop boc loi vat ly. Day la noi DUY NHAT duoc import tu src/vendor.
// Don vi cong khai: ban kinh bi (R) cho chieu dai, giay cho thoi gian, do cho goc.
// Goc toa do o tam ban, x doc bang dai, y doc bang ngan (xem docs/SCENARIO_FORMAT.md).
import { Vector3 } from "three"
import { Ball, State } from "../vendor/billiards/model/ball"
import { Table } from "../vendor/billiards/model/table"
import { OutcomeType } from "../vendor/billiards/model/outcome"
import { TableGeometry } from "../vendor/billiards/view/tablegeometry"
import { R, maxPower, offCenterLimit } from "../vendor/billiards/model/physics/constants"
import { cueStrike } from "../vendor/billiards/model/physics/physics"

TableGeometry.configureForRule("libre")

export type Vec2 = [number, number]
export type BallId = "cue" | "b1" | "b2"
export type CushionId = "top" | "bottom" | "left" | "right"

/** Vi tri ba bi. Bi cai bat buoc, hai bi kia co the vang (bai tap chi co bi cai). */
export interface Setup {
  cue: Vec2
  b1?: Vec2
  b2?: Vec2
}

export interface Shot {
  /** Huong danh, 0 = +x, nguoc chieu kim dong ho. */
  angleDeg: number
  /** 0..1. Xem MAX_SPEED_MPS. */
  power: number
  /** Diem cham tren mat bi cai, -1..1. x>0 = phai, y>0 = tren (nhin tu nguoi danh). */
  tip: { x: number; y: number }
}

export type SimEvent =
  | {
      type: "ball"
      t: number
      a: BallId
      b: BallId
      posA: Vec2
      posB: Vec2
      /** Ngay truoc va cham, bi `a` da lan tu nhien (true) hay con truot (false). */
      aRolling: boolean
    }
  | { type: "cushion"; t: number; ball: BallId; cushion: CushionId; pos: Vec2 }

export interface SimResult {
  /** Thoi diem cua tung mau, giay. */
  times: number[]
  /** Duong di tung bi, cung do dai voi `times`. */
  paths: { cue: Vec2[]; b1?: Vec2[]; b2?: Vec2[] }
  /** Theo thu tu thoi gian. Va cham co bi cai thi bi cai luon la `a`. */
  events: SimEvent[]
  final: Setup
  /** Luat phang: bi cai cham ca hai bi kia. */
  scored: boolean
  duration: number
  /** true neu bi chua dung sau MAX_TIME giay mo phong. */
  timedOut: boolean
}

export const BALL_RADIUS = 1

/** Kich thuoc ban, don vi ban kinh bi. */
export const TABLE = {
  /** Nua chieu dai, nua chieu rong mat choi (tu tam ban toi mep bang). */
  halfLength: TableGeometry.X / R,
  halfWidth: TableGeometry.Y / R,
  /** Tam bi khong the vuot qua gioi han nay. */
  centreLimitX: TableGeometry.tableX / R,
  centreLimitY: TableGeometry.tableY / R,
} as const

/** Mot don vi (ban kinh bi) bang bao nhieu met trong loi vat ly. */
export const METRES_PER_UNIT = R

/** Toc do bi cai khi power = 1 va cham giua tam. Xem D9 trong docs/DECISIONS.md. */
export const MAX_SPEED_MPS = maxPower

/** tip = 1 ung voi do lech nay, tinh theo ban kinh bi (gioi han truot dau co). */
export const MAX_TIP_OFFSET = offCenterLimit

// Dau cua tip so voi `offset` cua cueStrike. Da xac minh bang
// tests/engine.laws.test.ts (xoay phai bat sang phai, tren tam lan theo).
const TIP_X_SIGN = -1
const TIP_Y_SIGN = 1

const STEP = 1 / 512
const SAMPLE_EVERY = 4
const MAX_TIME = 60

const CUSHIONS: Record<string, CushionId> = { L: "top", l: "bottom", S: "right", s: "left" }

function checkSetup(setup: Setup, ids: BallId[]) {
  const eps = 1e-3
  for (const id of ids) {
    const [x, y] = setup[id]!
    if (!(Math.abs(x) <= TABLE.centreLimitX + eps && Math.abs(y) <= TABLE.centreLimitY + eps)) {
      throw new RangeError(`Bi ${id} nằm ngoài bàn: (${x}, ${y})`)
    }
  }
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const p = setup[ids[i]]!
      const q = setup[ids[j]]!
      if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 2 * BALL_RADIUS - eps) {
        throw new RangeError(`Bi ${ids[i]} và ${ids[j]} chồng lên nhau`)
      }
    }
  }
}

function tipToOffset(tip: { x: number; y: number }): Vector3 {
  const len = Math.hypot(tip.x, tip.y)
  const k = (len > 1 ? 1 / len : 1) * offCenterLimit
  return new Vector3(TIP_X_SIGN * tip.x * k, TIP_Y_SIGN * tip.y * k, 0)
}

/** Khi phai tinh lai (xem `simulate`), bi nam sat bang hon muc nay duoc doi vao dung muc nay. */
const RAIL_NUDGE = 0.05

/**
 * Mo phong mot cu danh. Loi vat ly doi khi khong giai duoc va cham voi bang khi mot bi nam
 * dung sat bang hoac sat goc (nem "Depth exceeded resolving collisions"; D19). Gap loi do
 * thi doi cac bi sat bang vao trong RAIL_NUDGE (khoang 1,5 mm) roi tinh lai mot lan.
 */
export function simulate(setup: Setup, shot: Shot): SimResult {
  try {
    return simulateOnce(setup, shot)
  } catch (error) {
    if (!(error instanceof Error) || !error.message.startsWith("Depth exceeded")) throw error
    const pull = (p: Vec2 | undefined): Vec2 | undefined =>
      p && [
        Math.max(-TABLE.centreLimitX + RAIL_NUDGE, Math.min(TABLE.centreLimitX - RAIL_NUDGE, p[0])),
        Math.max(-TABLE.centreLimitY + RAIL_NUDGE, Math.min(TABLE.centreLimitY - RAIL_NUDGE, p[1])),
      ]
    const nudged: Setup = { cue: pull(setup.cue)! }
    if (setup.b1) nudged.b1 = pull(setup.b1)
    if (setup.b2) nudged.b2 = pull(setup.b2)
    try {
      return simulateOnce(nudged, shot)
    } catch {
      throw error
    }
  }
}

function simulateOnce(setup: Setup, shot: Shot): SimResult {
  const ids: BallId[] = ["cue"]
  if (setup.b1) ids.push("b1")
  if (setup.b2) ids.push("b2")
  checkSetup(setup, ids)

  const balls = ids.map((id) => new Ball(new Vector3(setup[id]![0] * R, setup[id]![1] * R, 0)))
  const idOf = new Map<unknown, BallId>(balls.map((b, i) => [b, ids[i]]))
  const table = new Table(balls)

  const power = Math.min(1, Math.max(0, shot.power))
  if (power > 0) {
    const strike = cueStrike(
      (shot.angleDeg * Math.PI) / 180,
      power * maxPower,
      tipToOffset(shot.tip)
    )
    balls[0].vel.copy(strike.vel)
    balls[0].rvel.copy(strike.rvel)
    balls[0].state = State.Sliding
  }

  const positions = (): Vec2[] => balls.map((b) => [b.pos.x / R, b.pos.y / R] as Vec2)
  const times: number[] = []
  const tracks: Vec2[][] = ids.map(() => [])
  let lastRecorded = -1
  const record = (step: number, pos: Vec2[]) => {
    if (step === lastRecorded) return
    lastRecorded = step
    times.push(step * STEP)
    pos.forEach((p, i) => tracks[i].push(p))
  }

  const events: SimEvent[] = []
  const hit = new Set<BallId>()
  let step = 0
  let seen = 0
  record(0, positions())

  while (!table.allStationary() && step * STEP < MAX_TIME) {
    const before = positions()
    const rollingBefore = balls.map((b) => b.state === State.Rolling)
    table.advance(STEP)
    step++
    if (seen < table.outcome.length) {
      // Va cham xay ra trong buoc nay: ghi mau ngay truoc do de vet co goc nhon.
      record(step - 1, before)
      const t = (step - 1) * STEP
      for (; seen < table.outcome.length; seen++) {
        const o = table.outcome[seen]
        const ia = ids.indexOf(idOf.get(o.ballA)!)
        if (o.type === OutcomeType.Collision) {
          let a = ia
          let b = ids.indexOf(idOf.get(o.ballB)!)
          if (b === 0) [a, b] = [b, a]
          if (a === 0) hit.add(ids[b])
          events.push({
            type: "ball",
            t,
            a: ids[a],
            b: ids[b],
            posA: before[a],
            posB: before[b],
            aRolling: rollingBefore[a],
          })
        } else if (o.type === OutcomeType.Cushion) {
          const cushion = CUSHIONS[o.cushion as string]
          const pos: Vec2 = [before[ia][0], before[ia][1]]
          if (cushion === "top") pos[1] = TABLE.centreLimitY
          else if (cushion === "bottom") pos[1] = -TABLE.centreLimitY
          else if (cushion === "right") pos[0] = TABLE.centreLimitX
          else pos[0] = -TABLE.centreLimitX
          events.push({ type: "cushion", t, ball: ids[ia], cushion, pos })
        }
      }
    }
    if (step % SAMPLE_EVERY === 0) record(step, positions())
  }
  const end = positions()
  record(step, end)

  const pick = <T>(items: T[]) => {
    const out: { cue: T; b1?: T; b2?: T } = { cue: items[0] }
    ids.forEach((id, i) => {
      if (id !== "cue") out[id] = items[i]
    })
    return out
  }

  return {
    times,
    paths: pick(tracks),
    events,
    final: pick(end),
    scored: hit.size === 2,
    duration: step * STEP,
    timedOut: !table.allStationary(),
  }
}
