// Cai dat, sao luu, xoa du lieu, va trang "Gioi han cua mo phong".
import { LIMITS_DETAIL, LIMITS_INTRO } from "../../content/limits"
import { todayIso } from "../../format"
import { FORCE_CURVES, forceToPower, setForceCurve, type ForceCurve } from "../../table/power"
import { save, type App } from "../app"
import { button, el, link, type Screen } from "../dom"
import { href } from "../router"
import { PASS_THRESHOLD_MAX, PASS_THRESHOLD_MIN, type AidSettings } from "../storage"

const still = (page: HTMLElement): Screen => ({ el: page, destroy() {} })

export function createSettings(app: App, reload: () => void): Screen {
  const settings = app.store.get().settings
  const feedback = el("p", "status")
  feedback.setAttribute("aria-live", "polite")
  const say = (text: string, ok = true) => {
    feedback.textContent = text
    feedback.className = `status status--${ok ? "ok" : "warn"}`
  }

  const check = (label: string, checked: boolean, onChange: (value: boolean) => void) => {
    const input = el("input")
    input.type = "checkbox"
    input.checked = checked
    input.addEventListener("change", () => onChange(input.checked))
    return el("label", "check", input, label)
  }

  const threshold = el("select", "input")
  for (let n = PASS_THRESHOLD_MIN; n <= PASS_THRESHOLD_MAX; n++) {
    const option = el("option", "", `${n}/10`)
    option.value = String(n)
    option.selected = n === settings.passThreshold
    threshold.append(option)
  }
  threshold.addEventListener("change", () => save(app, (d) => (d.settings.passThreshold = Number(threshold.value))))

  // Do manh cua co: mo ta moi lua chon bang chinh con so no cho ra.
  const CURVE_NAME: Record<ForceCurve, string> = { 1: "Mạnh", 1.5: "Vừa", 2: "Nhẹ, dễ chỉnh cú nhỏ" }
  const curveSelect = el("select", "input")
  for (const c of FORCE_CURVES) {
    setForceCurve(c)
    const pct = (force: number) => Math.round(forceToPower(force) * 100)
    const option = el("option", "", `${CURVE_NAME[c]}: kéo 30 được ${pct(30)}% lực tối đa, kéo 50 được ${pct(50)}%`)
    option.value = String(c)
    option.selected = c === settings.cueCurve
    curveSelect.append(option)
  }
  setForceCurve(settings.cueCurve)
  curveSelect.addEventListener("change", () => {
    const next = Number(curveSelect.value) as ForceCurve
    setForceCurve(next)
    save(app, (d) => (d.settings.cueCurve = next))
  })

  const aid = (label: string, key: keyof AidSettings) =>
    check(label, settings.aids[key], (value) => save(app, (d) => (d.settings.aids[key] = value)))

  const exportBtn = button("Xuất file sao lưu", "", () => {
    const blob = new Blob([app.store.exportJson()], { type: "application/json" })
    const a = el("a")
    a.href = URL.createObjectURL(blob)
    a.download = `hoc-bida-phang-${todayIso()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    say("Đã xuất file sao lưu.")
  })

  const file = el("input", "input")
  file.type = "file"
  file.accept = "application/json,.json"
  file.addEventListener("change", async () => {
    const picked = file.files?.[0]
    if (!picked) return
    let text: string
    try {
      text = await picked.text()
    } catch {
      return say("Không đọc được file.", false)
    }
    if (!window.confirm("Nhập file này sẽ thay toàn bộ dữ liệu hiện có. Tiếp tục?")) {
      file.value = ""
      return
    }
    const result = app.store.importJson(text)
    if (!result.ok) {
      file.value = ""
      return say(result.error, false)
    }
    reload()
  })

  const clearBtn = button("Xóa toàn bộ dữ liệu", "", () => {
    if (!window.confirm("Xóa hết tiến độ, sổ tập và cài đặt? Không hoàn tác được.")) return
    app.store.clear()
    reload()
  })

  return still(
    el(
      "main",
      "page narrow stack",
      el("header", "page__header", link("← Trang chính", href.home, "back"), el("h1", "", "Cài đặt")),
      el(
        "section",
        "card section",
        el("h2", "", "Qua cấp"),
        el("label", "field", el("span", "", "Ngưỡng đạt của mỗi bài tập bàn thật"), threshold),
        el("p", "muted", "Bài được ghi là khó hơn có ngưỡng thấp hơn một quả."),
        check("Mở mọi cấp để xem trước", settings.unlockAll, (value) => save(app, (d) => (d.settings.unlockAll = value))),
        el("p", "muted", "Khi bật, cấp nào cũng vào được dù chưa đạt bài tập bàn thật của cấp trước.")
      ),
      el(
        "section",
        "card section",
        el("h2", "", "Kéo cơ"),
        el("label", "field", el("span", "", "Độ mạnh của cơ"), curveSelect),
        el(
          "p",
          "muted",
          "Kéo hết cỡ luôn là 100% lực. Lựa chọn này quyết định lực tăng nhanh hay chậm ở nửa đầu quãng kéo. Chọn mức mạnh thì các cú rất nhỏ nằm sát đầu quãng kéo; khi đó dùng nút − và + để chỉnh cho chính xác."
        )
      ),
      el(
        "section",
        "card section",
        el("h2", "", "Luật"),
        check("Áp dụng luật vùng góc", settings.cornerRule, (value) => save(app, (d) => (d.settings.cornerRule = value))),
        el(
          "p",
          "muted",
          "Dùng trong chế độ Đánh chuỗi. Khi cả hai bi mục tiêu nằm trong cùng một vùng góc, bạn chỉ được ghi thêm một điểm rồi phải đưa ít nhất một bi ra khỏi vùng. Chơi phong trào thường bỏ qua luật này."
        )
      ),
      el(
        "section",
        "card section",
        el("h2", "", "Trợ giúp ngắm bật sẵn"),
        aid("Đường ngắm kéo dài", "aimLine"),
        aid("Bi ma", "ghostBall"),
        aid("Đường 90° (khi bi cái còn trượt)", "tangentLine"),
        aid("Đường dự đoán (bi cái sẽ đi thật)", "predictedPath"),
        el("p", "muted", "Vẫn bật tắt được ngay trên bàn. Một số tình huống tự tắt trợ giúp.")
      ),
      el(
        "section",
        "card section",
        el("h2", "", "Sao lưu"),
        el("p", "muted", "Dữ liệu chỉ nằm trong trình duyệt này. Xuất file để giữ lại hoặc chuyển sang máy khác."),
        el("div", "row", exportBtn),
        el("label", "field", el("span", "", "Nhập file sao lưu"), file),
        feedback
      ),
      el("section", "card section", el("h2", "", "Xóa dữ liệu"), el("div", "row", clearBtn)),
      el("div", "row", link("Giới hạn của mô phỏng", href.limits, "back"))
    )
  )
}

export function createLimits(): Screen {
  return still(
    el(
      "main",
      "page narrow stack",
      el("header", "page__header", link("← Trang chính", href.home, "back"), el("h1", "", "Giới hạn của mô phỏng")),
      el("div", "card stack", ...LIMITS_INTRO.map((text) => el("p", "", text))),
      el(
        "div",
        "card stack",
        el("h2", "", "Những chỗ mô phỏng khác bàn thật"),
        el("ul", "stack", ...LIMITS_DETAIL.map((text) => el("li", "", text)))
      )
    )
  )
}
