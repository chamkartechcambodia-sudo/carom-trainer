// Dinh dang chu so cho giao dien. Khong phu thuoc DOM de bo cham va script dung duoc.

/** So thap phan kieu Viet: dau phay. */
export function vn(value: number, digits = 1): string {
  return value.toFixed(digits).replace(".", ",")
}

/** Ngay hom nay theo gio may, dang YYYY-MM-DD. */
export function todayIso(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** "2026-11-25" thanh "25/11/2026". */
export function vnDate(iso: string): string {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}
