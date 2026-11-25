// Logic qua cap: thuan du lieu, khong DOM. Qua cap dua tren so tap ban that (D7);
// ket qua mo phong chi hien de tham khao, khong chan len cap.
import type { Drill, Level } from "../content/levels"
import type { AppData, Settings } from "./storage"

/** Nguong dat cua mot bai: nguong chung cong phan dieu chinh rieng, kep trong 1..10. */
export function drillThreshold(drill: Drill, settings: Settings): number {
  if (drill.kind === "check") return 1
  return Math.min(10, Math.max(1, settings.passThreshold + (drill.thresholdDelta ?? 0)))
}

/** Ket qua tot nhat tung ghi cho mot bai, null neu chua ghi lan nao. */
export function drillBest(drillId: string, data: AppData): number | null {
  const mine = data.drillLog.filter((e) => e.drillId === drillId)
  return mine.length ? Math.max(...mine.map((e) => e.made)) : null
}

/** Mot bai dat khi co it nhat mot buoc tap dat nguong. */
export function drillPassed(drill: Drill, data: AppData): boolean {
  const best = drillBest(drill.id, data)
  return best !== null && best >= drillThreshold(drill, data.settings)
}

/** Cap hoan thanh khi moi bai tap ban that cua cap deu dat. Cap chua co bai thi chua hoan thanh. */
export function levelComplete(level: Level, data: AppData): boolean {
  return level.drills.length > 0 && level.drills.every((d) => drillPassed(d, data))
}

/**
 * Cap 1 mo san; cap sau mo khi cap ngay truoc da mo va da hoan thanh.
 * Cai dat "mo moi cap" bo qua dieu kien nay (de xem truoc noi dung).
 */
export function levelUnlocked(levelId: number, levels: Level[], data: AppData): boolean {
  if (data.settings.unlockAll) return levels.some((level) => level.id === levelId)
  for (const level of [...levels].sort((a, b) => a.id - b.id)) {
    if (level.id === levelId) return true
    if (!levelComplete(level, data)) return false
  }
  return false
}

export interface LevelProgress {
  drillsPassed: number
  drillsTotal: number
  scenariosPassed: number
  scenariosTotal: number
}

export function levelProgress(level: Level, data: AppData): LevelProgress {
  const passed = new Set(data.scenariosPassed)
  return {
    drillsPassed: level.drills.filter((d) => drillPassed(d, data)).length,
    drillsTotal: level.drills.length,
    scenariosPassed: level.scenarios.filter((s) => passed.has(s.id)).length,
    scenariosTotal: level.scenarios.length,
  }
}
