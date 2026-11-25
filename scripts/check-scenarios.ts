// Kiem moi tinh huong trong src/scenarios/data co giai duoc khong.
// Chay: npm run scenarios:check. Thoat voi ma 1 neu co tinh huong khong hop le.
// Dung may chu Vite (khong mo cong) de nap ma TypeScript cua du an.
import { createServer } from "vite"

const server = await createServer({
  configFile: false,
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true },
})

let failed = 0
try {
  const { ALL_SCENARIOS } = await server.ssrLoadModule("/src/scenarios/data/index.ts")
  const { checkAll } = await server.ssrLoadModule("/src/scenarios/solver.ts")
  const { powerToForce, sliderToPower } = await server.ssrLoadModule("/src/table/power.ts")
  // Bo do lam viec theo nac tinh chinh; in ra theo luc hien thi cho nguoi soan de doc.
  const shown = (slider) => (slider === null ? "khóa" : powerToForce(sliderToPower(slider)).toFixed(1))
  const started = Date.now()
  for (const r of checkAll(ALL_SCENARIOS)) {
    const s = r.solution
    const found = s
      ? `  hướng ${s.angleDeg}°, lực ${shown(s.slider)}, điểm chạm (${s.tip.x}; ${s.tip.y})`
      : ""
    console.log(`${r.ok ? "ĐẠT " : "LỖI "} ${r.id}  (${r.tried} cú thử)${found}`)
    for (const p of r.problems) console.log(`      - ${p}`)
    if (!r.ok) failed++
  }
  const secs = ((Date.now() - started) / 1000).toFixed(1)
  console.log(`\n${ALL_SCENARIOS.length} tình huống, ${failed} lỗi, ${secs} giây.`)
} finally {
  await server.close()
}
process.exit(failed ? 1 : 0)
