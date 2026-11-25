// Chuyen dong cua cay co khi ra co, tinh theo vat ly thay vi mot hoat hinh co dinh.
// Mo hinh "con lac" (Alciatore, TP B.4): toc do co di theo nua duong cosin, tuc la khoi
// dong em, tang toc dan va dat toc do lon nhat dung luc cham bi (gia toc bang 0 o hai
// dau). Sau khi cham, co mat khoang mot nua toc do cho vien bi, theo da mot doan, dung
// yen mot nhip roi moi ve vi tri nghi. Thuan toan hoc.
// Cac hang so va nguon: D15 trong docs/DECISIONS.md.
import { MAX_SPEED_MPS } from "../engine"

export const STROKE = {
  /** Toc do bi cai / toc do co luc cham giua tam (co carom 500 g, bi 210 g, do nay dau co 0,73). */
  ballPerCueSpeed: 1.22,
  /** Phan toc do co con giu ngay sau khi cham bi (cung cac so tren). */
  cueKeeps: 0.48,
  /** Quang lui co that cua cu manh nhat (met). */
  maxBackswing: 0.3,
  /**
   * Quang lui that tang cham hon toc do: do duoc khoang 18 cm o 1,2 m/s va 30 cm o 4,3 m/s,
   * tuc quang lui ti le voi toc do mu 0,4. Dung de tinh thoi gian ra co cho giong that du
   * nguoi dung chon do manh cua co nao.
   */
  backswingExponent: 0.4,
  /** Gioi han thoi gian ra co tren man hinh (giay). Cu nhe ngoai doi con cham hon, nhung cho lau thi kho chiu. */
  minForward: 0.12,
  maxForward: 0.45,
  /** Quang theo da: do duoc gan bang 0,8 quang lui; tren man hinh co tran vi het cho. */
  followRatio: 0.8,
  minFollow: 0.04,
  maxFollow: 0.18,
  /** Theo da khong ngan hon chung nay (giay), de co dung lai em. */
  minFollowTime: 0.1,
  /** Sau khi theo da, co dung yen chung nay (giay) roi moi ve: nguoi danh tot giu co, khong giat ve. */
  hold: 0.22,
  /** Thoi gian co ve vi tri nghi (giay). */
  settle: 0.35,
}

export interface StrokePlan {
  /** Quang lui luc buong tay, phan cua hanh trinh (0..1). */
  from: number
  /** Thoi gian tu luc buong tay toi luc cham bi (giay). */
  forward: number
  /** Thoi gian theo da sau khi cham bi (giay). */
  follow: number
  /** Quang theo da qua vi tri vien bi, phan cua hanh trinh. */
  followDistance: number
  /** Tong thoi gian ke ca luc dung yen va ve vi tri nghi. */
  total: number
}

/** `fraction`: quang lui tren man hinh 0..1; `power`: luc 0..1 cua engine. */
export function planStroke(fraction: number, power: number): StrokePlan {
  const cueSpeed = (power * MAX_SPEED_MPS) / STROKE.ballPerCueSpeed
  // Mo hinh con lac: quang lui that = toc do luc cham * thoi gian / 2.
  const backswing = STROKE.maxBackswing * power ** STROKE.backswingExponent
  const real = cueSpeed > 0 ? (2 * backswing) / cueSpeed : STROKE.maxForward
  const forward = Math.min(STROKE.maxForward, Math.max(STROKE.minForward, real))
  // Toc do tren man hinh luc cham (phan hanh trinh moi giay), roi phan con lai sau va cham.
  const after = ((2 * fraction) / forward) * STROKE.cueKeeps
  const followDistance = Math.min(STROKE.maxFollow, Math.max(STROKE.minFollow, fraction * STROKE.followRatio))
  // Giam toc deu toi khi dung: quang theo da = toc do * thoi gian / 2.
  const follow = Math.max(STROKE.minFollowTime, after > 0 ? (2 * followDistance) / after : 0)
  return { from: fraction, forward, follow, followDistance, total: forward + follow + STROKE.hold + STROKE.settle }
}

export type StrokePhase = "forward" | "follow" | "hold" | "settle" | "done"

/**
 * Vi tri dau co tai thoi diem `t` giay sau khi buong tay, tinh theo phan hanh trinh:
 * duong = con lui sau vien bi, 0 = cham bi, am = da di qua vi tri vien bi.
 */
export function strokeAt(plan: StrokePlan, t: number): { x: number; phase: StrokePhase } {
  if (t < plan.forward) {
    // Toc do = (vf/2)(1 - cos(pi u)); quang da di = from * (u - sin(pi u)/pi).
    const u = t / plan.forward
    return { x: plan.from * (1 - u + Math.sin(Math.PI * u) / Math.PI), phase: "forward" }
  }
  const afterImpact = t - plan.forward
  if (afterImpact < plan.follow) {
    const u = afterImpact / plan.follow
    return { x: -plan.followDistance * (2 * u - u * u), phase: "follow" }
  }
  const resting = afterImpact - plan.follow
  if (resting < STROKE.hold) return { x: -plan.followDistance, phase: "hold" }
  const settling = resting - STROKE.hold
  if (settling < STROKE.settle) {
    // Ve em o ca hai dau (smoothstep) tu cho theo da xa nhat ve vi tri nghi.
    const u = settling / STROKE.settle
    return { x: -plan.followDistance * (1 - u * u * (3 - 2 * u)), phase: "settle" }
  }
  return { x: 0, phase: "done" }
}
