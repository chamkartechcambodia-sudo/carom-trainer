// Cac loai khoi cua mot bai Hieu va ham tao khoi dung chung cho moi file bai hoc.
// Mot bai di theo trinh tu: muc tieu -> tung y nho, moi y co hinh ve -> tu bam thu tren
// ban mo phong -> loi hay gap -> ghi nho -> tu kiem tra (D21 trong docs/DECISIONS.md).
import type { Setup } from "../engine"
import type { Diagram } from "../table/diagram"
import type { Figure } from "../table/figure"
import type { TipExplorer } from "../table/tipExplorer"

export type Block =
  /** Hoc xong bai nay thi lam duoc gi. */
  | { type: "goal"; text: string }
  /** Tieu de cua mot y nho trong bai. */
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  /** Vi du doi thuong. */
  | { type: "example"; text: string }
  /** Hinh ve giai thich (so do tinh co chu thich). */
  | { type: "diagram"; diagram: Diagram; caption: string }
  /** Ban mo phong nho co nut bam. */
  | { type: "figure"; figure: Figure }
  /** Mat bi cai bam duoc, ve ngay duong di. */
  | { type: "explorer"; explorer: TipExplorer }
  /** Cac buoc lam theo thu tu. */
  | { type: "steps"; items: string[] }
  | { type: "mistakes"; items: string[] }
  /** Ghi nho: vai cau dang mang theo ra ban. */
  | { type: "key"; items: string[] }
  /** Cau tu kiem tra: bam mot lua chon thi hien dung sai va loi giai thich. */
  | { type: "check"; question: string; options: string[]; answer: number; explain: string }

export interface Lesson {
  /** Vi du "4.1". */
  id: string
  title: string
  body: Block[]
}

export const goal = (text: string): Block => ({ type: "goal", text })
export const h = (text: string): Block => ({ type: "heading", text })
export const p = (text: string): Block => ({ type: "text", text })
export const ex = (text: string): Block => ({ type: "example", text })
export const dg = (diagram: Diagram, caption: string): Block => ({ type: "diagram", diagram, caption })
export const steps = (...items: string[]): Block => ({ type: "steps", items })
export const mistakes = (...items: string[]): Block => ({ type: "mistakes", items })
export const key = (...items: string[]): Block => ({ type: "key", items })
export const check = (question: string, options: string[], answer: number, explain: string): Block => ({
  type: "check",
  question,
  options,
  answer,
  explain,
})
/** Ban mo phong nho. `more`: cau doan truoc, chi dan nhin gi, nut so sanh, duong moc 90 do. */
export const fig = (
  caption: string,
  balls: Setup,
  variants: Figure["variants"],
  more: Pick<Figure, "predict" | "look" | "compare" | "tangent" | "compareCut"> = {}
): Block => ({ type: "figure", figure: { caption, balls, variants, ...more } })
