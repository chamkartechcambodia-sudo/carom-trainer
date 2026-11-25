// Lop luu tru DUY NHAT cua app. Moi doc/ghi localStorage di qua day va deu boc
// try/catch: app van chay (khong luu) khi trinh duyet chan hoac day bo nho.

export const STORAGE_KEY = "carom-trainer"
export const DATA_VERSION = 1
const APP_MARK = "carom-trainer"

export interface AidSettings {
  aimLine: boolean
  ghostBall: boolean
  tangentLine: boolean
  predictedPath: boolean
}

export interface Settings {
  /** So qua dat tren 10 de qua mot bai tap ban that. */
  passThreshold: number
  /** Luat vung goc. Chua co tac dung toi buoc 8. */
  cornerRule: boolean
  /** Tro giup ngam bat san khi mo ban. */
  aids: AidSettings
  /** Mo moi cap de xem truoc, bo qua dieu kien qua cap. */
  unlockAll: boolean
  /** Do manh cua co: so mu cua duong cong luc (1 manh, 1,5 vua, 2 nhe). Xem table/power.ts. */
  cueCurve: 1 | 1.5 | 2
}

export interface DrillEntry {
  drillId: string
  /** Ngay tap, dang YYYY-MM-DD. */
  date: string
  /** So qua dat (bai dem), hoac 1/0 (bai tu danh gia). */
  made: number
}

/** Mot buoi danh chuoi: tren mo phong (app tu ghi) hoac tren ban that (nguoi dung nhap). */
export interface Session {
  /** YYYY-MM-DD. */
  date: string
  kind: "sim" | "real"
  innings: number
  points: number
  bestRun: number
}

export interface AppData {
  version: number
  settings: Settings
  /** So tap ban that, theo thu tu ghi. */
  drillLog: DrillEntry[]
  /** Id cac tinh huong mo phong da dat it nhat mot lan. */
  scenariosPassed: string[]
  /** Cac buoi danh chuoi, theo thu tu ghi. */
  sessions: Session[]
}

export const PASS_THRESHOLD_MIN = 5
export const PASS_THRESHOLD_MAX = 10

export function defaultData(): AppData {
  return {
    version: DATA_VERSION,
    settings: {
      passThreshold: 7,
      cornerRule: false,
      aids: { aimLine: true, ghostBall: true, tangentLine: true, predictedPath: false },
      unlockAll: false,
      cueCurve: 1,
    },
    drillLog: [],
    scenariosPassed: [],
    sessions: [],
  }
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v)
const bool = (v: unknown, fallback: boolean) => (typeof v === "boolean" ? v : fallback)
const DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Dua du lieu bat ky ve dung dang AppData. Khong bao gio nem loi: truong thieu
 * hoac sai kieu thi lay mac dinh, dong so tap hong thi bo.
 */
export function sanitise(raw: unknown): AppData {
  const data = defaultData()
  if (!isObject(raw)) return data
  if (isObject(raw.settings)) {
    const s = raw.settings
    const t = s.passThreshold
    if (typeof t === "number" && Number.isInteger(t) && t >= PASS_THRESHOLD_MIN && t <= PASS_THRESHOLD_MAX) {
      data.settings.passThreshold = t
    }
    data.settings.cornerRule = bool(s.cornerRule, false)
    data.settings.unlockAll = bool(s.unlockAll, false)
    if (s.cueCurve === 1 || s.cueCurve === 1.5 || s.cueCurve === 2) data.settings.cueCurve = s.cueCurve
    if (isObject(s.aids)) {
      data.settings.aids = {
        aimLine: bool(s.aids.aimLine, true),
        ghostBall: bool(s.aids.ghostBall, true),
        tangentLine: bool(s.aids.tangentLine, true),
        predictedPath: bool(s.aids.predictedPath, false),
      }
    }
  }
  if (Array.isArray(raw.drillLog)) {
    for (const e of raw.drillLog) {
      if (!isObject(e)) continue
      const { drillId, date, made } = e
      if (typeof drillId !== "string" || typeof date !== "string" || !DATE.test(date)) continue
      if (typeof made !== "number" || !Number.isInteger(made) || made < 0 || made > 10) continue
      data.drillLog.push({ drillId, date, made })
    }
  }
  if (Array.isArray(raw.sessions)) {
    const count = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0
    for (const e of raw.sessions) {
      if (!isObject(e)) continue
      const { date, kind, innings, points, bestRun } = e
      if (typeof date !== "string" || !DATE.test(date) || (kind !== "sim" && kind !== "real")) continue
      if (!count(innings) || innings < 1 || !count(points) || !count(bestRun) || bestRun > points) continue
      data.sessions.push({ date, kind, innings, points, bestRun })
    }
  }
  if (Array.isArray(raw.scenariosPassed)) {
    data.scenariosPassed = [...new Set(raw.scenariosPassed.filter((x): x is string => typeof x === "string"))]
  }
  return data
}

/** Phan cua Storage ma app can; test truyen ban gia vao. */
export type Backend = Pick<Storage, "getItem" | "setItem" | "removeItem">

export type ImportResult = { ok: true } | { ok: false; error: string }

export interface Store {
  /** Du lieu hien tai. Khong sua truc tiep, dung `update`. */
  get(): AppData
  /** Sua du lieu roi luu. Tra ve false neu khong ghi duoc xuong may. */
  update(change: (data: AppData) => void): boolean
  exportJson(): string
  /** Thay toan bo du lieu bang noi dung file sao luu. */
  importJson(text: string): ImportResult
  /** Xoa het, ve mac dinh. */
  clear(): boolean
}

export function createStore(backend: Backend | null): Store {
  let data = defaultData()
  try {
    const text = backend?.getItem(STORAGE_KEY)
    if (text) data = sanitise(JSON.parse(text))
  } catch {
    // Du lieu hong hoac khong doc duoc: bat dau tu mac dinh.
  }

  const save = (): boolean => {
    if (!backend) return false
    try {
      backend.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    } catch {
      return false
    }
  }

  return {
    get: () => data,
    update(change) {
      change(data)
      return save()
    },
    exportJson() {
      return JSON.stringify({ app: APP_MARK, exportedAt: new Date().toISOString(), ...data }, null, 2)
    },
    importJson(text) {
      let raw: unknown
      try {
        raw = JSON.parse(text)
      } catch {
        return { ok: false, error: "File không phải JSON hợp lệ." }
      }
      if (!isObject(raw) || raw.app !== APP_MARK) {
        return { ok: false, error: "Đây không phải file sao lưu của app này." }
      }
      if (typeof raw.version !== "number" || raw.version > DATA_VERSION) {
        return { ok: false, error: "File sao lưu được tạo bởi phiên bản app mới hơn." }
      }
      data = sanitise(raw)
      save()
      return { ok: true }
    },
    clear() {
      data = defaultData()
      if (!backend) return false
      try {
        backend.removeItem(STORAGE_KEY)
        return true
      } catch {
        return false
      }
    },
  }
}

/** localStorage cua trinh duyet, hoac null neu bi chan. */
export function browserBackend(): Backend | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}
