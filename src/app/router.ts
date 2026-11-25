// Dieu huong bang hash. `parseRoute` thuan du lieu de test duoc.

export type Route =
  | { name: "home" }
  | { name: "level"; level: number }
  | { name: "lesson"; level: number; lesson: string }
  | { name: "scenarios"; level: number }
  | { name: "drill"; level: number; drill: string }
  | { name: "freePlay" }
  | { name: "chain" }
  | { name: "stats" }
  | { name: "settings" }
  | { name: "limits" }
  | { name: "notFound" }

export const href = {
  home: "#/",
  level: (level: number) => `#/cap/${level}`,
  lesson: (level: number, lesson: string) => `#/cap/${level}/hieu/${encodeURIComponent(lesson)}`,
  scenarios: (level: number) => `#/cap/${level}/thu`,
  drill: (level: number, drill: string) => `#/cap/${level}/tap/${encodeURIComponent(drill)}`,
  freePlay: "#/tu-do",
  chain: "#/chuoi",
  stats: "#/thong-ke",
  settings: "#/cai-dat",
  limits: "#/gioi-han",
}

export function parseRoute(hash: string): Route {
  const parts = hash
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean)
    .map(decodeURIComponent)
  if (parts.length === 0) return { name: "home" }
  const [head, a, b, c] = parts
  if (parts.length === 1) {
    if (head === "tu-do") return { name: "freePlay" }
    if (head === "chuoi") return { name: "chain" }
    if (head === "thong-ke") return { name: "stats" }
    if (head === "cai-dat") return { name: "settings" }
    if (head === "gioi-han") return { name: "limits" }
  }
  if (head === "cap" && /^\d+$/.test(a ?? "")) {
    const level = Number(a)
    if (parts.length === 2) return { name: "level", level }
    if (parts.length === 3 && b === "thu") return { name: "scenarios", level }
    if (parts.length === 4 && b === "hieu") return { name: "lesson", level, lesson: c }
    if (parts.length === 4 && b === "tap") return { name: "drill", level, drill: c }
  }
  return { name: "notFound" }
}
