// Luat cua che do Danh chuoi (phang tu do, mot nguoi tap): dem chuoi, luot, va luat
// vung goc. Thuan du lieu, khong DOM. Nguon cua luat vung goc: D8 trong docs/DECISIONS.md.
import { TABLE, type Setup, type SimResult, type Vec2 } from "../engine"

/**
 * Vung goc: tam giac o moi goc ban, canh doc bang dai va canh doc bang ngan tinh tu
 * goc mat choi. Tren ban thi dau 2,84 m x 1,42 m la 71 cm va 35,5 cm, tuc 1/4 chieu
 * dai va 1/4 chieu rong mat choi.
 */
export const CORNER = {
  alongLong: TABLE.halfLength / 2,
  alongShort: TABLE.halfWidth / 2,
  /**
   * So diem duoc ghi lien tiep khi ca hai bi muc tieu van nam trong cung mot vung goc
   * (tinh tu luc chung vao vung). Sau do phai co it nhat mot bi muc tieu ra khoi vung.
   */
  caromsAllowedInside: 1,
}

/** Bon goc theo thu tu: trai duoi, phai duoi, trai tren, phai tren. Dung de ve. */
export function cornerTriangles(): Vec2[][] {
  const out: Vec2[][] = []
  for (const sy of [-1, 1]) {
    for (const sx of [-1, 1]) {
      const cx = sx * TABLE.halfLength
      const cy = sy * TABLE.halfWidth
      out.push([
        [cx, cy],
        [cx - sx * CORNER.alongLong, cy],
        [cx, cy - sy * CORNER.alongShort],
      ])
    }
  }
  return out
}

/** Chi so vung goc chua diem nay (0..3 theo thu tu cua cornerTriangles), hoac null. Nam tren vach tinh la trong vung. */
export function cornerOf(p: Vec2): number | null {
  const dx = TABLE.halfLength - Math.abs(p[0])
  const dy = TABLE.halfWidth - Math.abs(p[1])
  if (dx / CORNER.alongLong + dy / CORNER.alongShort > 1) return null
  return (p[1] > 0 ? 2 : 0) + (p[0] > 0 ? 1 : 0)
}

/** Vung goc ma CA HAI bi muc tieu (vang va do) cung nam trong, hoac null. Vi tri bi cai khong tinh. */
export function sharedCorner(balls: Setup): number | null {
  if (!balls.b1 || !balls.b2) return null
  const a = cornerOf(balls.b1)
  return a !== null && a === cornerOf(balls.b2) ? a : null
}

/** Trong cu danh, co luc nao mot trong hai bi muc tieu nam ngoai vung goc `corner` khong. */
export function leftCorner(result: SimResult, corner: number): boolean {
  for (const path of [result.paths.b1, result.paths.b2]) {
    if (path?.some((p) => cornerOf(p) !== corner)) return true
  }
  return false
}

export interface ChainState {
  /** Chuoi dang danh. */
  run: number
  /** Chuoi dai nhat cua buoi. */
  best: number
  /** So luot da ket thuc. */
  innings: number
  /** Tong diem cua cac luot da ket thuc va luot dang danh. */
  points: number
  /** Vung goc ma hai bi muc tieu dang nam trong tu dau cu danh, hoac null. */
  corner: number | null
  /** So diem da ghi ma hai bi muc tieu van o nguyen trong vung goc do. */
  cornerCaroms: number
}

export const newChain = (): ChainState => ({ run: 0, best: 0, innings: 0, points: 0, corner: null, cornerCaroms: 0 })

export type ShotOutcome = "point" | "miss" | "cornerFoul"

/** Ket thuc luot dang danh (truot, pham luat, hoac nguoi choi dung buoi). */
function endInning(s: ChainState): ChainState {
  return { ...s, best: Math.max(s.best, s.run), run: 0, innings: s.innings + 1 }
}

export function applyShot(
  state: ChainState,
  result: SimResult,
  cornerRule: boolean
): { state: ChainState; outcome: ShotOutcome } {
  const after = sharedCorner(result.final)
  const base = { ...state, corner: cornerRule ? after : null }

  if (!result.scored) return { state: { ...endInning(base), cornerCaroms: 0 }, outcome: "miss" }

  let cornerCaroms = 0
  if (cornerRule && after !== null) {
    // Van trong cung vung goc va khong bi nao ra ngoai trong cu danh: tinh la mot diem "trong vung".
    const stayed = state.corner === after && !leftCorner(result, after)
    cornerCaroms = stayed ? state.cornerCaroms + 1 : 0
    if (stayed && cornerCaroms > CORNER.caromsAllowedInside) {
      // Pham luat: diem khong duoc tinh, het luot.
      return { state: { ...endInning(base), cornerCaroms: 0 }, outcome: "cornerFoul" }
    }
  }
  const run = state.run + 1
  return {
    state: { ...base, run, best: Math.max(state.best, run), points: state.points + 1, cornerCaroms },
    outcome: "point",
  }
}

/** Dong buoi: luot dang danh do (neu da co diem) duoc tinh la mot luot. */
export function finish(state: ChainState): ChainState {
  return state.run > 0 ? endInning(state) : state
}

/** Diem trung binh moi luot; null khi chua co luot nao. */
export function average(points: number, innings: number): number | null {
  return innings > 0 ? points / innings : null
}
