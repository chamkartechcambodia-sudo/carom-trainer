// Tien ich tao phan tu DOM va SVG. Khong dung framework (xem D3).
type Child = Node | string

/** Mot man hinh: phan tu goc va ham don dep khi roi man hinh. */
export interface Screen {
  el: HTMLElement
  destroy(): void
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = "",
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  node.append(...children)
  return node
}

export function button(label: string, className: string, onClick: () => void): HTMLButtonElement {
  const node = el("button", `btn ${className}`.trim(), label)
  node.type = "button"
  node.addEventListener("click", onClick)
  return node
}

export function link(label: string, target: string, className = ""): HTMLAnchorElement {
  const node = el("a", className, label)
  node.href = target
  return node
}

const SVG_NS = "http://www.w3.org/2000/svg"

export function svg<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  ...children: Node[]
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag)
  setAttrs(node, attrs)
  node.append(...children)
  return node
}

export function setAttrs(node: Element, attrs: Record<string, string | number>) {
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value))
}

/** Toa do con tro trong he toa do rieng cua mot phan tu SVG. */
export function pointerIn(node: SVGGraphicsElement, e: PointerEvent): [number, number] {
  const m = node.getScreenCTM()
  if (!m) return [0, 0]
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
  return [p.x, p.y]
}
