// Ten vung diem cham tren mat bi cai, de hien cho nguoi hoc.
export interface Tip {
  x: number
  y: number
}

const DIRECTIONS = ["phải", "trên phải", "trên", "trên trái", "trái", "dưới trái", "dưới", "dưới phải"]

/** Keo diem cham ve trong vong tron don vi. */
export function clampTip(tip: Tip): Tip {
  const len = Math.hypot(tip.x, tip.y)
  return len > 1 ? { x: tip.x / len, y: tip.y / len } : tip
}

/** Vi du: "giữa tâm", "trên phải, xoáy vừa", "dưới, xoáy mạnh". */
export function tipZoneName(tip: Tip): string {
  const amount = Math.hypot(tip.x, tip.y)
  if (amount < 0.15) return "giữa tâm"
  const sector = Math.round((Math.atan2(tip.y, tip.x) * 180) / Math.PI / 45)
  const direction = DIRECTIONS[(sector + 8) % 8]
  const level = amount < 0.45 ? "nhẹ" : amount < 0.8 ? "vừa" : "mạnh"
  return `${direction}, xoáy ${level}`
}
