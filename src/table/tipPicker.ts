// Mat bi cai bam duoc de chon diem cham. Ve dung ti le: vong net dut la gioi han
// an toan (tip = 1), cham do la cho dau co cham.
import { MAX_TIP_OFFSET } from "../engine"
import { pointerIn, setAttrs, svg } from "../app/dom"
import { clampTip, type Tip } from "./tipZone"

const KEY_STEP = 0.1

export interface TipPicker {
  el: SVGSVGElement
  set(tip: Tip): void
  /** Vong rong danh dau diem cham cua cu vua danh (null de an). */
  setGhost(tip: Tip | null): void
}

export function createTipPicker(onChange: (tip: Tip) => void): TipPicker {
  const dot = svg("circle", { class: "tip-picker__dot", r: 0.085 })
  const ghost = svg("circle", { class: "tip-picker__ghost", r: 0.13 })
  ghost.style.display = "none"
  const el = svg(
    "svg",
    {
      class: "tip-picker",
      viewBox: "-1.05 -1.05 2.1 2.1",
      tabindex: 0,
      role: "application",
      "aria-label": "Điểm chạm trên mặt bi cái. Bấm hoặc dùng phím mũi tên để chọn.",
    },
    svg("circle", { class: "tip-picker__face", r: 1 }),
    svg("line", { class: "tip-picker__guide", x1: -1, y1: 0, x2: 1, y2: 0 }),
    svg("line", { class: "tip-picker__guide", x1: 0, y1: -1, x2: 0, y2: 1 }),
    svg("circle", { class: "tip-picker__limit", r: MAX_TIP_OFFSET }),
    ghost,
    dot
  )

  let current: Tip = { x: 0, y: 0 }
  const set = (tip: Tip) => {
    current = clampTip(tip)
    // Truc y cua SVG huong xuong, cua diem cham huong len.
    setAttrs(dot, { cx: current.x * MAX_TIP_OFFSET, cy: -current.y * MAX_TIP_OFFSET })
  }
  const change = (tip: Tip) => {
    set(tip)
    onChange(current)
  }

  let dragging = false
  const fromPointer = (e: PointerEvent) => {
    const [x, y] = pointerIn(el, e)
    change({ x: x / MAX_TIP_OFFSET, y: -y / MAX_TIP_OFFSET })
  }
  el.addEventListener("pointerdown", (e) => {
    dragging = true
    el.setPointerCapture(e.pointerId)
    fromPointer(e)
  })
  el.addEventListener("pointermove", (e) => {
    if (dragging) fromPointer(e)
  })
  const stop = () => (dragging = false)
  el.addEventListener("pointerup", stop)
  el.addEventListener("pointercancel", stop)

  const KEYS: Record<string, [number, number]> = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, 1],
    ArrowDown: [0, -1],
  }
  el.addEventListener("keydown", (e) => {
    const step = KEYS[e.key]
    if (!step) return
    e.preventDefault()
    change({ x: current.x + step[0] * KEY_STEP, y: current.y + step[1] * KEY_STEP })
  })

  set(current)
  const setGhost = (tip: Tip | null) => {
    ghost.style.display = tip ? "" : "none"
    if (tip) setAttrs(ghost, { cx: tip.x * MAX_TIP_OFFSET, cy: -tip.y * MAX_TIP_OFFSET })
  }
  return { el, set, setGhost }
}
