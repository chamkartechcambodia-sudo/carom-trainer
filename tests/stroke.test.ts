// Test mo hinh chuyen dong ra co: khoi dong em, dat toc do lon nhat luc cham bi, theo
// da, dung yen mot nhip, roi ve vi tri nghi.
import { describe, expect, it } from "vitest"
import { STROKE, planStroke, strokeAt } from "../src/table/stroke"

/**
 * Ke hoach ra co cho muc luc `percent` (% toc do toi da), voi quang keo tren man hinh bang
 * dung phan tram do (do manh cua co mac dinh).
 */
const plan = (percent: number) => planStroke(percent / 100, percent / 100)
/** Toc do (phan hanh trinh moi giay, duong = dang lao toi vien bi) quanh thoi diem t. */
const speedAt = (p: ReturnType<typeof plan>, t: number, dt = 1e-4) => (strokeAt(p, t - dt).x - strokeAt(p, t + dt).x) / (2 * dt)

describe("planStroke", () => {
  it("thoi gian ra co nam trong gioi han; cu manh ra co nhanh hon cu nhe", () => {
    const soft = plan(8)
    const hard = plan(100)
    for (const p of [soft, plan(30), hard]) {
      expect(p.forward).toBeGreaterThanOrEqual(STROKE.minForward)
      expect(p.forward).toBeLessThanOrEqual(STROKE.maxForward)
    }
    expect(hard.forward).toBeLessThan(plan(30).forward)
    expect(plan(30).forward).toBeLessThan(soft.forward)
  })

  it("cu manh nhat mat khoang 0,14 giay de ra co, dung voi quang lui 30 cm va toc do co 4,3 m/s", () => {
    expect(plan(100).forward).toBeCloseTo((2 * 0.3) / (5.24 / 1.22), 2)
  })

  it("toc do dau co luc cham tang theo luc", () => {
    const impact = (p: ReturnType<typeof plan>) => (2 * p.from) / p.forward
    expect(impact(plan(100))).toBeGreaterThan(impact(plan(75)))
    expect(impact(plan(75))).toBeGreaterThan(impact(plan(50)))
  })

  it("quang theo da gan bang 0,8 quang lui, co chan duoi va tran", () => {
    expect(plan(100).followDistance).toBe(STROKE.maxFollow)
    expect(plan(3).followDistance).toBe(STROKE.minFollow)
    const small = plan(15)
    expect(small.followDistance).toBeCloseTo(small.from * STROKE.followRatio, 9)
  })
})

describe("strokeAt", () => {
  const p = plan(70)

  it("bat dau o cho lui, toi vien bi dung luc het thoi gian ra co", () => {
    expect(strokeAt(p, 0)).toEqual({ x: p.from, phase: "forward" })
    expect(strokeAt(p, p.forward).x).toBeCloseTo(0, 9)
    expect(strokeAt(p, p.forward).phase).toBe("follow")
  })

  it("khoi dong em: luc vua buong tay co gan nhu dung yen", () => {
    expect(speedAt(p, 0.002)).toBeLessThan(0.02 * ((2 * p.from) / p.forward))
  })

  it("tang toc dan va khong bao gio lui lai; dat toc do lon nhat dung luc cham bi", () => {
    let previous = 0
    for (let i = 1; i < 20; i++) {
      const v = speedAt(p, (p.forward * i) / 20)
      expect(v).toBeGreaterThan(previous)
      previous = v
    }
    const peak = (2 * p.from) / p.forward
    expect(speedAt(p, p.forward - 0.002)).toBeGreaterThan(0.99 * peak)
    expect(speedAt(p, p.forward - 0.002)).toBeLessThanOrEqual(peak * 1.001)
  })

  it("ngay sau khi cham, co con khoang mot nua toc do roi cham dan toi cho theo da xa nhat", () => {
    const before = speedAt(p, p.forward - 0.001)
    const after = speedAt(p, p.forward + 0.001)
    expect(after / before).toBeGreaterThan(STROKE.cueKeeps - 0.05)
    expect(after / before).toBeLessThan(STROKE.cueKeeps + 0.05)
    expect(strokeAt(p, p.forward + p.follow - 1e-9).x).toBeCloseTo(-p.followDistance, 5)
  })

  it("dung yen mot nhip o cho theo da xa nhat, roi moi ve vi tri nghi va dung o do", () => {
    const stop = p.forward + p.follow
    expect(strokeAt(p, stop + STROKE.hold / 2)).toEqual({ x: -p.followDistance, phase: "hold" })
    const midway = strokeAt(p, stop + STROKE.hold + STROKE.settle / 2)
    expect(midway.phase).toBe("settle")
    expect(midway.x).toBeCloseTo(-p.followDistance / 2, 9)
    expect(strokeAt(p, p.total)).toEqual({ x: 0, phase: "done" })
    expect(strokeAt(p, p.total + 5)).toEqual({ x: 0, phase: "done" })
  })
})
