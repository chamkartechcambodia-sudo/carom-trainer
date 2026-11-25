// Kieu du lieu tinh huong. Mo ta day du o docs/SCENARIO_FORMAT.md.
import type { Setup, Shot, SimResult, Vec2 } from "../engine"
import type { Tip } from "../table/tipZone"

export type Zone = { cx: number; cy: number; r: number }

export type Goal =
  /**
   * Ghi diem: bi cai cham du hai bi. `require` them dieu kien ve bang.
   * `onlyTip` (can khoa huong va luc): trong chin diem cham chuan, chi diem nay ghi
   * diem; bo do kiem dieu do. Bo cham khong dung truong nay.
   */
  | { type: "score"; require?: "cushionBeforeSecond" | "cushionFirst"; onlyTip?: Tip }
  /** Bi cai dung trong o. `cushions`: bi cai phai cham dung chung nay lan bang. */
  | { type: "stopInZone"; ball: "cue"; zone: Zone; cushions?: number }
  /** Ghi diem VA ba bi nam gon: moi tam bi cach trong tam cua ba bi khong qua `radius`. */
  | { type: "gather"; radius: number }
  /**
   * Chon dap an. Neu co `shots` (moi lua chon mot cu danh) thi app danh cu ung
   * voi lua chon de nguoi hoc xem, va bo do kiem rang chi cu cua `answer` ghi diem.
   */
  | ChoiceGoal
  /** Cham len bang cho bi cai can toi. `shot`: cu mau, app danh sau khi nguoi hoc chot diem. */
  | { type: "markCushion"; target: Vec2; tolerance: number; shot?: Shot }

export interface ChoiceGoal {
  type: "choice"
  options: string[]
  answer: number
  shots?: Shot[]
  /**
   * Can `shots`. Nguoi hoc xem truoc duong bi cai cua tung lua chon (ve chong len
   * nhau, tinh khi chua co bi do) roi moi chon.
   */
  overlay?: boolean
  /**
   * Bai doc nguoc: app danh mot cu voi diem cham `tips[answer]`, nguoi hoc doan
   * diem cham. Moi lua chon ung voi mot phan tu cua `tips`.
   */
  replay?: { angleDeg: number; power: number; tips: Tip[] }
}

export interface Scenario {
  /** Vi du "L4-C-02". */
  id: string
  /** 0 danh cho tinh huong mau. */
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  group: string
  title: string
  /** Cau giao viec. */
  prompt: string
  balls: Setup
  goal: Goal
  /** Phan cua cu danh bi co dinh, nguoi hoc khong doi duoc. */
  locked?: Partial<Shot>
  aids?: { ghostBall?: boolean; tangentLine?: boolean; predictedPath?: boolean }
  maxAttempts?: number
  hint?: string
  /** Loi giai thich hien sau khi danh. */
  explain: string
}

/** Mot lan thu cua nguoi hoc: mot cu danh, mot lua chon, hoac mot diem cham len bang. */
export type Attempt = { result: SimResult } | { choice: number; result?: SimResult } | { mark: Vec2 }

export interface Verdict {
  passed: boolean
  /** Dung cho gather: ghi diem nhung bi chua gom. */
  partial?: boolean
  scored: boolean
  /** Mot cau tieng Viet cho nguoi hoc. */
  detail: string
}
