// Hai thang luc, cung quy ve `power` 0..1 cua engine (xem D16, D17 trong docs/DECISIONS.md).
//
// 1. LUC HIEN THI (0..100): con so nguoi dung thay va cung la do lui cua co tinh theo phan
//    tram hanh trinh. power = (luc / 100) ^ so mu. So mu la "do manh cua co", nguoi dung
//    chon trong Cai dat:
//      1   (mac dinh, "manh"): con so bang dung phan tram toc do toi da; keo 30 la 30%.
//      1,5 ("vua"): keo 30 la 16%, keo 50 la 35%.
//      2   ("nhe"): keo 30 la 9%, keo 50 la 25%; de chinh cu nho bang tay nhat.
//
// 2. NAC TINH CHINH (1..100, buoc 0,5): thang cap so nhan cu (D11), moi buoc doi luc
//    2,4%, tuc khoang 5% quang duong, deu nhau o moi vung luc. Hai nut - va + va bo do
//    loi giai dung thang nay; no khong hien ra cho nguoi dung.

export const FORCE_MAX = 100
/** Luc mac dinh khi mo ban, tinh bang power de khong phu thuoc do manh cua co. */
export const POWER_DEFAULT = 0.1

export type ForceCurve = 1 | 1.5 | 2
export const FORCE_CURVES: ForceCurve[] = [1, 1.5, 2]
export const FORCE_CURVE_DEFAULT: ForceCurve = 1

let curve: ForceCurve = FORCE_CURVE_DEFAULT

/** Dat do manh cua co (so mu cua duong cong luc). Goi khi mo app va khi doi cai dat. */
export function setForceCurve(next: ForceCurve) {
  curve = next
}

export const forceToPower = (force: number) => (Math.min(FORCE_MAX, Math.max(0, force)) / FORCE_MAX) ** curve
export const powerToForce = (power: number) => FORCE_MAX * Math.min(1, Math.max(0, power)) ** (1 / curve)

/**
 * Thay moi cho ghi `{{luc:0.0464}}` trong loi van bang con so luc hien thi ung voi power
 * do, theo do manh cua co dang dung. Nho vay goi y luon khop voi con so tren man hinh.
 */
export function fillForce(text: string): string {
  return text.replace(/\{\{luc:([0-9.]+)\}\}/g, (_, power: string) => String(Math.round(powerToForce(Number(power)))))
}

export const SLIDER_MIN = 1
export const SLIDER_MAX = 100
export const SLIDER_STEP = 0.5

const MIN_POWER = 0.01

/** Nac tinh chinh sang power: nac 1 = 0,01 va nac 100 = 1, moi nac tang luc khoang 4,8%. */
export const sliderToPower = (value: number) =>
  MIN_POWER * (1 / MIN_POWER) ** ((value - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN))

/** Nguoc cua sliderToPower (power duoi 0,01 thi kep ve nac 1). */
export const powerToSlider = (power: number) =>
  SLIDER_MIN + ((SLIDER_MAX - SLIDER_MIN) * Math.log(Math.max(power, MIN_POWER) / MIN_POWER)) / Math.log(1 / MIN_POWER)

/** He so cua mot buoc tinh chinh: dung bang nua nac cua thang cap so nhan (khoang 1,0235). */
const FINE_FACTOR = (1 / MIN_POWER) ** (SLIDER_STEP / (SLIDER_MAX - SLIDER_MIN))
/** Luc nho nhat con chinh duoc bang nut. */
const FINE_FLOOR = 0.0004

/** Doi luc di `steps` buoc tinh chinh (moi buoc 2,4%), ke ca o vung luc rat nhe. */
export function nudgePower(power: number, steps: number): number {
  return Math.min(1, Math.max(FINE_FLOOR, power * FINE_FACTOR ** steps))
}
