import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

// San pham cuoi la MOT file dist/index.html tu chua (xem docs/DECISIONS.md, D3).
export default defineConfig({
  plugins: [viteSingleFile()],
  build: { target: "es2020" },
})
