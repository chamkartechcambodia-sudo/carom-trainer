// Ngu canh dung chung cho moi man hinh.
import type { Level } from "../content/levels"
import type { AppData, Store } from "./storage"

export interface App {
  store: Store
  levels: Level[]
  /** Hien mot dong thong bao o dau trang (vi du khong luu duoc). */
  notify(message: string): void
}

/** Sua du lieu va bao cho nguoi dung neu khong ghi duoc xuong may. */
export function save(app: App, change: (data: AppData) => void) {
  if (!app.store.update(change)) {
    app.notify("Không lưu được vào trình duyệt này. Dữ liệu sẽ mất khi đóng trang; hãy xuất file sao lưu trong Cài đặt.")
  }
}
