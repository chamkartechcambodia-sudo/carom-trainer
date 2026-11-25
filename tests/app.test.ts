// Test lop luu tru, logic mo khoa va bo phan tich duong dan.
import { describe, expect, it } from "vitest"
import { drillBest, drillPassed, drillThreshold, levelComplete, levelProgress, levelUnlocked } from "../src/app/progress"
import { href, parseRoute } from "../src/app/router"
import { STORAGE_KEY, createStore, defaultData, sanitise, type AppData, type Backend } from "../src/app/storage"
import { LEVELS, type Drill, type Level } from "../src/content/levels"

function memory(initial?: string): Backend & { map: Map<string, string> } {
  const map = new Map<string, string>()
  if (initial !== undefined) map.set(STORAGE_KEY, initial)
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  }
}

const broken: Backend = {
  getItem() {
    throw new Error("bi chan")
  },
  setItem() {
    throw new Error("day bo nho")
  },
  removeItem() {
    throw new Error("bi chan")
  },
}

describe("storage", () => {
  it("ghi roi doc lai tu mot store moi cho cung du lieu", () => {
    const backend = memory()
    const a = createStore(backend)
    expect(
      a.update((d) => {
        d.settings.passThreshold = 8
        d.settings.aids.ghostBall = false
        d.drillLog.push({ drillId: "L1-T1", date: "2026-11-25", made: 6 })
        d.scenariosPassed.push("L1-A-01")
      })
    ).toBe(true)
    const b = createStore(backend)
    expect(b.get()).toEqual(a.get())
    expect(b.get().settings.passThreshold).toBe(8)
    expect(b.get().drillLog).toHaveLength(1)
  })

  it("du lieu hong (khong phai JSON) thi bat dau tu mac dinh, khong nem loi", () => {
    expect(createStore(memory("{day khong phai json")).get()).toEqual(defaultData())
    expect(createStore(memory('"chuoi"')).get()).toEqual(defaultData())
    expect(createStore(memory("null")).get()).toEqual(defaultData())
  })

  it("sanitise giu phan dung, bo phan sai", () => {
    const data = sanitise({
      version: 1,
      settings: { passThreshold: 99, cornerRule: "co", aids: { aimLine: false, ghostBall: 3 } },
      drillLog: [
        { drillId: "L1-T1", date: "2026-11-25", made: 7 },
        { drillId: "L1-T1", date: "25/11/2026", made: 7 },
        { drillId: "L1-T1", date: "2026-11-25", made: 11 },
        { drillId: 5, date: "2026-11-25", made: 3 },
        "rac",
      ],
      scenariosPassed: ["a", "a", 7, "b"],
      la: "truong la",
    })
    expect(data.settings).toEqual({
      passThreshold: 7,
      cornerRule: false,
      aids: { aimLine: false, ghostBall: true, tangentLine: true, predictedPath: false },
      unlockAll: false,
      cueCurve: 1,
    })
    expect(data.drillLog).toEqual([{ drillId: "L1-T1", date: "2026-11-25", made: 7 }])
    expect(data.scenariosPassed).toEqual(["a", "b"])
    expect("la" in data).toBe(false)
  })

  it("trinh duyet chan luu tru: app van chay, update bao khong luu duoc", () => {
    for (const backend of [broken, null]) {
      const store = createStore(backend)
      expect(store.get()).toEqual(defaultData())
      expect(store.update((d) => (d.settings.passThreshold = 9))).toBe(false)
      expect(store.get().settings.passThreshold).toBe(9)
      expect(store.clear()).toBe(false)
      expect(store.get()).toEqual(defaultData())
    }
  })

  it("xuat roi nhap vao mot store khac cho ket qua giong het", () => {
    const a = createStore(memory())
    a.update((d) => {
      d.settings.passThreshold = 6
      d.settings.cornerRule = true
      d.drillLog.push({ drillId: "L4-T2", date: "2026-11-20", made: 1 }, { drillId: "L1-T1", date: "2026-11-25", made: 9 })
      d.scenariosPassed.push("x", "y")
    })
    const backend = memory()
    const b = createStore(backend)
    expect(b.importJson(a.exportJson())).toEqual({ ok: true })
    expect(b.get()).toEqual(a.get())
    expect(createStore(backend).get()).toEqual(a.get())
  })

  it("tu choi file khong phai sao luu cua app, va giu nguyen du lieu cu", () => {
    const store = createStore(memory())
    store.update((d) => (d.settings.passThreshold = 9))
    for (const text of ["khong phai json", "[1,2]", '{"version":1}', '{"app":"carom-trainer","version":99}']) {
      const result = store.importJson(text)
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error.length).toBeGreaterThan(0)
    }
    expect(store.get().settings.passThreshold).toBe(9)
  })

  it("clear dua ve mac dinh va xoa khoi may", () => {
    const backend = memory()
    const store = createStore(backend)
    store.update((d) => d.scenariosPassed.push("x"))
    expect(backend.map.has(STORAGE_KEY)).toBe(true)
    expect(store.clear()).toBe(true)
    expect(store.get()).toEqual(defaultData())
    expect(backend.map.has(STORAGE_KEY)).toBe(false)
  })
})

const count = (id: string, extra: Partial<Drill> = {}): Drill => ({ id, title: id, how: "", passWhen: "", kind: "count", ...extra })
const level = (id: number, drills: Drill[]): Level => ({ id, title: "", learns: "", exam: "", lessons: [], scenarios: [], drills })
const withLog = (...log: [string, number][]): AppData => ({
  ...defaultData(),
  drillLog: log.map(([drillId, made]) => ({ drillId, date: "2026-11-25", made })),
})

describe("logic qua cap", () => {
  const levels = [level(1, [count("a"), count("b")]), level(2, [count("c", { thresholdDelta: -1 })]), level(3, [])]

  it("nguong: nguong chung, dieu chinh rieng, bai tu danh gia", () => {
    const s = defaultData().settings
    expect(drillThreshold(count("a"), s)).toBe(7)
    expect(drillThreshold(count("a", { thresholdDelta: -1 }), s)).toBe(6)
    expect(drillThreshold(count("a", { thresholdDelta: 5 }), s)).toBe(10)
    expect(drillThreshold(count("a", { kind: "check" }), s)).toBe(1)
  })

  it("bai dat khi buoi tot nhat dat nguong", () => {
    expect(drillBest("a", withLog())).toBeNull()
    expect(drillPassed(count("a"), withLog())).toBe(false)
    expect(drillPassed(count("a"), withLog(["a", 6]))).toBe(false)
    expect(drillPassed(count("a"), withLog(["a", 6], ["a", 7], ["a", 3]))).toBe(true)
    expect(drillPassed(count("a", { kind: "check" }), withLog(["a", 0]))).toBe(false)
    expect(drillPassed(count("a", { kind: "check" }), withLog(["a", 1]))).toBe(true)
  })

  it("cap 1 mo san; cap sau chi mo khi moi bai cua cap truoc dat", () => {
    expect(levelUnlocked(1, levels, withLog())).toBe(true)
    expect(levelUnlocked(2, levels, withLog())).toBe(false)
    expect(levelUnlocked(2, levels, withLog(["a", 8]))).toBe(false)
    const one = withLog(["a", 8], ["b", 7])
    expect(levelComplete(levels[0], one)).toBe(true)
    expect(levelUnlocked(2, levels, one)).toBe(true)
    expect(levelUnlocked(3, levels, one)).toBe(false)
    expect(levelUnlocked(3, levels, withLog(["a", 8], ["b", 7], ["c", 6]))).toBe(true)
    // Dat cap 2 ma chua dat cap 1 thi cap 3 van khoa.
    expect(levelUnlocked(3, levels, withLog(["c", 10]))).toBe(false)
    expect(levelUnlocked(9, levels, one)).toBe(false)
  })

  it("nang nguong trong cai dat co the lam mot bai het dat", () => {
    const data = withLog(["a", 7], ["b", 7])
    expect(levelUnlocked(2, levels, data)).toBe(true)
    data.settings.passThreshold = 8
    expect(levelUnlocked(2, levels, data)).toBe(false)
  })

  it("cai dat mo moi cap bo qua dieu kien, nhung khong mo cap khong ton tai", () => {
    const data = withLog()
    data.settings.unlockAll = true
    expect(levelUnlocked(3, levels, data)).toBe(true)
    expect(levelUnlocked(9, levels, data)).toBe(false)
  })

  it("cap 5 den 7 co noi dung that; cap 6 va 7 dung muc tieu gom bi", () => {
    for (const l of LEVELS.slice(4)) {
      expect(l.lessons).toHaveLength(3)
      expect(l.scenarios).toHaveLength(9)
      expect(l.scenarios.every((s) => s.level === l.id)).toBe(true)
      expect(l.drills.length).toBeGreaterThanOrEqual(2)
      expect(l.drills.every((d) => d.layouts?.length)).toBe(true)
      for (const lesson of l.lessons) {
        expect(lesson.body.filter((b) => b.type === "figure")).toHaveLength(1)
        expect(lesson.body.filter((b) => b.type === "example")).toHaveLength(1)
      }
    }
    for (const l of LEVELS.slice(5)) expect(l.scenarios.every((s) => s.goal.type === "gather")).toBe(true)
    const ids = LEVELS.flatMap((l) => l.scenarios.map((s) => s.id))
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(81)
  })

  it("cap khong co bai tap thi khong bao gio duoc tinh la hoan thanh", () => {
    expect(levelComplete(levels[2], withLog())).toBe(false)
  })

  it("tien do dem so bai dat va so tinh huong dat cua dung cap do", () => {
    const data = withLog(["a", 9])
    data.scenariosPassed = ["khong-thuoc-cap-nay"]
    expect(levelProgress(levels[0], data)).toEqual({ drillsPassed: 1, drillsTotal: 2, scenariosPassed: 0, scenariosTotal: 0 })
  })

  it("cap 4 co 5 bai Hieu, 9 nhom A den I moi nhom 3 the, 6 bai Tap co so do", () => {
    const l4 = LEVELS[3]
    expect(l4.lessons.map((l) => l.id)).toEqual(["4.1", "4.2", "4.3", "4.4", "4.5"])
    expect(l4.scenarios).toHaveLength(27)
    for (const g of "ABCDEFGHI") expect(l4.scenarios.filter((s) => s.group === g)).toHaveLength(3)
    expect(l4.drills.every((d) => d.layouts?.length)).toBe(true)
    expect(l4.drills[5].layouts).toHaveLength(2)
    for (const lesson of l4.lessons) {
      expect(lesson.body.some((b) => b.type === "figure" || b.type === "explorer")).toBe(true)
      expect(lesson.body.filter((b) => b.type === "example")).toHaveLength(1)
    }
  })

  it("cap 1 den 3 co noi dung that: moi bai Hieu co mot hinh va mot vi du, moi cap 9 tinh huong", () => {
    for (const l of LEVELS.slice(0, 3)) {
      expect(l.scenarios).toHaveLength(9)
      expect(new Set(l.scenarios.map((s) => s.group)).size).toBe(3)
      expect(l.scenarios.every((s) => s.level === l.id)).toBe(true)
      expect(l.drills.length).toBeGreaterThanOrEqual(2)
      expect(l.drills.every((d) => d.layouts?.length)).toBe(true)
      for (const lesson of l.lessons) {
        expect(lesson.body.filter((b) => b.type === "figure")).toHaveLength(1)
        expect(lesson.body.filter((b) => b.type === "example")).toHaveLength(1)
      }
    }
  })

  it("du lieu 7 cap: id bai tap khong trung, bai 6 cua cap 4 co nguong 6/10", () => {
    const ids = LEVELS.flatMap((l) => l.drills.map((d) => d.id))
    expect(new Set(ids).size).toBe(ids.length)
    expect(LEVELS.map((l) => l.id)).toEqual([1, 2, 3, 4, 5, 6, 7])
    const l4 = LEVELS[3]
    expect(l4.drills).toHaveLength(6)
    expect(l4.lessons).toHaveLength(5)
    expect(drillThreshold(l4.drills[5], defaultData().settings)).toBe(6)
  })
})

describe("parseRoute", () => {
  it("doc dung moi duong dan ma app tao ra", () => {
    expect(parseRoute("")).toEqual({ name: "home" })
    expect(parseRoute(href.home)).toEqual({ name: "home" })
    expect(parseRoute(href.level(4))).toEqual({ name: "level", level: 4 })
    expect(parseRoute(href.lesson(4, "4.1"))).toEqual({ name: "lesson", level: 4, lesson: "4.1" })
    expect(parseRoute(href.scenarios(2))).toEqual({ name: "scenarios", level: 2 })
    expect(parseRoute(href.drill(4, "L4-T6"))).toEqual({ name: "drill", level: 4, drill: "L4-T6" })
    expect(parseRoute(href.freePlay)).toEqual({ name: "freePlay" })
    expect(parseRoute(href.chain)).toEqual({ name: "chain" })
    expect(parseRoute(href.stats)).toEqual({ name: "stats" })
    expect(parseRoute(href.settings)).toEqual({ name: "settings" })
    expect(parseRoute(href.limits)).toEqual({ name: "limits" })
  })

  it("duong dan la thi bao khong tim thay", () => {
    for (const hash of ["#/xyz", "#/cap/abc", "#/cap/4/la", "#/cap/4/hieu", "#/tu-do/thua"]) {
      expect(parseRoute(hash)).toEqual({ name: "notFound" })
    }
  })
})
