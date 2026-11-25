// Danh sach moi tinh huong cua app: mau (dung cho test) va cua tung cap.
// `npm run scenarios:check` kiem toan bo danh sach nay.
import type { Scenario } from "../types"
import { LEVEL1 } from "./level1"
import { LEVEL2 } from "./level2"
import { LEVEL3 } from "./level3"
import { LEVEL4 } from "./level4"
import { LEVEL5, LEVEL6, LEVEL7 } from "./level567"
import { SAMPLES } from "./samples"

export const ALL_SCENARIOS: Scenario[] = [...SAMPLES, ...LEVEL1, ...LEVEL2, ...LEVEL3, ...LEVEL4, ...LEVEL5, ...LEVEL6, ...LEVEL7]
