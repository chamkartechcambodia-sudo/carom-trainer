// Kiem tra khoi: loi vat ly da trich chay duoc khong can giao dien.
// Day KHONG phai test quy luat vat ly (viec do thuoc buoc 2 trong docs/PLAN.md).
import { describe, expect, it } from "vitest"
import { Vector3 } from "three"
import { Ball, State } from "../src/vendor/billiards/model/ball"
import { Table } from "../src/vendor/billiards/model/table"
import { TableGeometry } from "../src/vendor/billiards/view/tablegeometry"
import { R } from "../src/vendor/billiards/model/physics/constants"
import { cueStrike } from "../src/vendor/billiards/model/physics/physics"

function shoot(offsetX: number, offsetY: number) {
  TableGeometry.configureForRule("libre")
  const cue = new Ball(new Vector3(-10 * R, 0, 0))
  const b1 = new Ball(new Vector3(10 * R, 0.9 * R, 0))
  const b2 = new Ball(new Vector3(25 * R, -12 * R, 0))
  const table = new Table([cue, b1, b2])
  const strike = cueStrike(0, 3, new Vector3(offsetX, offsetY, 0))
  cue.vel.copy(strike.vel)
  cue.rvel.copy(strike.rvel)
  cue.state = State.Sliding
  let steps = 0
  while (!table.allStationary() && steps++ < 200000) table.advance(0.001)
  return { table, steps, pos: table.balls.map((b) => [b.pos.x / R, b.pos.y / R]) }
}

describe("loi vat ly da trich (smoke)", () => {
  it("ban libre khong co lo", () => {
    TableGeometry.configureForRule("libre")
    expect(TableGeometry.hasPockets).toBe(false)
  })

  it("moi bi deu dung lai va nam trong ban", () => {
    const { table, steps } = shoot(0, 0)
    expect(table.allStationary()).toBe(true)
    expect(steps).toBeLessThan(200000)
    for (const b of table.balls) {
      expect(Math.abs(b.pos.x)).toBeLessThanOrEqual(TableGeometry.tableX + 1e-6)
      expect(Math.abs(b.pos.y)).toBeLessThanOrEqual(TableGeometry.tableY + 1e-6)
    }
  })

  it("ghi nhan va cham bi cai voi bi thu nhat", () => {
    const { table } = shoot(0, 0)
    expect(table.outcome.length).toBeGreaterThan(0)
    expect(String(table.outcome[0].type)).toBe("Collision")
  })

  it("cung mot cu danh cho cung mot ket qua (tat dinh)", () => {
    expect(shoot(0.2, 0.1).pos).toEqual(shoot(0.2, 0.1).pos)
  })

  it("diem cham khac nhau cho vi tri bi cai khac nhau", () => {
    const centre = shoot(0, 0).pos[0]
    const variants = [shoot(0, 0.4), shoot(0, -0.4), shoot(0.4, 0), shoot(-0.4, 0)]
    for (const v of variants) {
      const d = Math.hypot(v.pos[0][0] - centre[0], v.pos[0][1] - centre[1])
      expect(d).toBeGreaterThan(0.5)
    }
  })
})
