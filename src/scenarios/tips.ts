// Chin diem cham chuan (cap 4): ba hang tren, giua, duoi; ba cot trai, giua, phai.
// Diem thang la 0,6; diem cheo la (0,45; 0,45), tuc cung cach tam khoang 0,64.
import type { Tip } from "../table/tipZone"

const S = 0.6
const D = 0.45

export const NINE_TIPS: Tip[] = [
  { x: -D, y: D },
  { x: 0, y: S },
  { x: D, y: D },
  { x: -S, y: 0 },
  { x: 0, y: 0 },
  { x: S, y: 0 },
  { x: -D, y: -D },
  { x: 0, y: -S },
  { x: D, y: -D },
]

export const NINE_NAMES = [
  "Trên trái",
  "Trên",
  "Trên phải",
  "Trái",
  "Giữa tâm",
  "Phải",
  "Dưới trái",
  "Dưới",
  "Dưới phải",
]
