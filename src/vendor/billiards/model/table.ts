// @ts-nocheck
// Ban rut gon cua src/model/table.ts trong https://github.com/tailuge/billiards
// (GPL-3.0, commit 555bc72). Giu nguyen vong lap va cham; bo co 3D, phien choi
// mang, canh bao khoang cach va bao cao loi. File nay viet tay, KHONG do script sinh.
import { Cushion } from "./physics/cushion"
import { Collision } from "./physics/collision"
import { Knuckle } from "./physics/knuckle"
import { Pocket } from "./physics/pocket"
import { Ball } from "./ball"
import { TableGeometry } from "../view/tablegeometry"
import { Outcome } from "./outcome"
import { PocketGeometry } from "../view/pocketgeometry"
import { bounceHanBlend } from "./physics/physics"

interface Pair {
  a: Ball
  b: Ball
}

export class Table {
  balls: Ball[]
  pairs: Pair[] = []
  outcome: Outcome[] = []
  time = 0
  cueball: Ball
  cushionModel = bounceHanBlend

  constructor(balls: Ball[]) {
    this.cueball = balls[0]
    this.balls = balls
    for (let a = 0; a < balls.length; a++) {
      for (let b = a + 1; b < balls.length; b++) {
        this.pairs.push({ a: balls[a], b: balls[b] })
      }
    }
  }

  advance(t: number) {
    this.time += t * 1000
    let depth = 0
    while (!this.prepareAdvanceAll(t)) {
      if (depth++ > 100) {
        throw new Error("Depth exceeded resolving collisions")
      }
    }
    this.balls.forEach((a) => {
      a.update(t)
      a.fround()
    })
  }

  prepareAdvanceAll(t: number) {
    return (
      this.pairs.every((pair) => this.prepareAdvancePair(pair.a, pair.b, t)) &&
      this.balls.every((ball) => this.prepareAdvanceToCushions(ball, t))
    )
  }

  private prepareAdvancePair(a: Ball, b: Ball, t: number) {
    if (Collision.willCollide(a, b, t)) {
      const incidentSpeed = Collision.collide(a, b)
      this.outcome.push(Outcome.collision(a, b, incidentSpeed, this.time))
      return false
    }
    return true
  }

  private prepareAdvanceToCushions(a: Ball, t: number): boolean {
    if (!a.onTable()) {
      return true
    }
    const futurePosition = a.futurePosition(t)
    if (
      Math.abs(futurePosition.y) < TableGeometry.tableY &&
      Math.abs(futurePosition.x) < TableGeometry.tableX
    ) {
      return true
    }
    const result = Cushion.bounceAny(
      a,
      t,
      TableGeometry.hasPockets,
      this.cushionModel
    )
    if (result && result.incidentSpeed) {
      this.outcome.push(
        Outcome.cushion(a, result.incidentSpeed, this.time, result.cushion)
      )
      return false
    }
    if (TableGeometry.hasPockets) {
      const k = Knuckle.findBouncing(a, t)
      if (k) {
        const knuckleIncidentSpeed = k.bounce(a)
        this.outcome.push(Outcome.cushion(a, knuckleIncidentSpeed, this.time))
        return false
      }
      const p = Pocket.findPocket(PocketGeometry.pocketCenters, a, t)
      if (p) {
        const pocketIncidentSpeed = p.fall(a, t)
        this.outcome.push(Outcome.pot(a, pocketIncidentSpeed, this.time))
        return false
      }
    }
    return true
  }

  allStationary() {
    return this.balls.every((b) => !b.inMotion())
  }
}
