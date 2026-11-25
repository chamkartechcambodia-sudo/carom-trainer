# Định dạng tình huống

Bản nháp để bước 4 hiện thực. Được chỉnh khi hiện thực, miễn cập nhật file này.

## Hệ tọa độ

- Gốc ở tâm bàn, trục x dọc băng dài, trục y dọc băng ngắn.
- Đơn vị dữ liệu: **bán kính bi** (R). Một viên bi có đường kính 2.
- Kích thước bàn lấy từ engine (`TableGeometry` sau khi cấu hình `libre`), không
  ghi cứng trong dữ liệu.
- Engine chịu trách nhiệm đổi sang đơn vị nội bộ của lõi vật lý.

## Cú đánh

```ts
interface Shot {
  angleDeg: number   // hướng đánh, 0 = +x, ngược chiều kim đồng hồ
  power: number      // 0..1, engine đổi sang tốc độ
  tip: { x: number; y: number } // -1..1, x>0 = phải, y>0 = trên (nhìn từ người đánh)
}
```

Kiểu `Shot` nằm ở `src/engine`. Dấu của `tip` đã được xác minh bằng
`tests/engine.laws.test.ts` (bước 2); chi tiết ở D9 trong `docs/DECISIONS.md`.
`tip` ngoài vòng tròn đơn vị được kéo về mép.

## Tình huống

Kiểu dữ liệu thật nằm ở `src/scenarios/types.ts`; file này mô tả ý nghĩa.

```ts
interface Scenario {
  id: string                 // ví dụ "L4-C-02"; tình huống mẫu dùng tiền tố "M-"
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7   // 0 = tình huống mẫu
  group: string              // nhóm trong cấp, ví dụ "C"
  title: string
  prompt: string             // câu giao việc, tiếng Việt
  balls: { cue: [number, number]; b1?: [number, number]; b2?: [number, number] }
  goal: Goal
  locked?: Partial<Shot>     // phần của cú đánh bị cố định (ví dụ hướng xoáy)
  aids?: { ghostBall?: boolean; tangentLine?: boolean; predictedPath?: boolean }  // không ghi thì theo cài đặt
  maxAttempts?: number
  hint?: string
  explain: string            // lời giải thích hiện sau khi đánh
}

type Goal =
  | { type: "score"; require?: "cushionBeforeSecond" | "cushionFirst"; onlyTip?: Tip }
  | { type: "stopInZone"; ball: "cue"; zone: Zone; cushions?: number }
  | { type: "gather"; radius: number }
  | { type: "choice"; options: string[]; answer: number; shots?: Shot[]; overlay?: boolean;
      replay?: { angleDeg: number; power: number; tips: Tip[] } }
  | { type: "markCushion"; target: [number, number]; tolerance: number; shot?: Shot }

type Zone = { cx: number; cy: number; r: number }
```

Ý nghĩa từng mục tiêu (bộ chấm ở `src/scenarios/judge.ts`):

- `score`: bi cái chạm đủ hai bi. `cushionBeforeSecond`: có ít nhất một lần chạm
  băng giữa lần đầu chạm bi thứ nhất và lần đầu chạm bi thứ hai (bi, băng, bi).
  `cushionFirst`: bi cái chạm băng trước khi chạm bi nào.
- `stopInZone`: tâm bi cái dừng trong vòng tròn `zone`. Nếu có `cushions` thì bi
  cái còn phải chạm đúng chừng đó lần băng.
- `gather`: ghi điểm VÀ mọi tâm bi cách trọng tâm của ba bi không quá `radius`.
  Ghi điểm mà bi còn xa thì `partial: true`.
- `choice`: chọn một trong `options`. Nếu có `shots` (mỗi lựa chọn một cú đánh
  cho sẵn) thì app đánh cú ứng với lựa chọn cho người học xem rồi mới chấm.
- `markCushion`: chấm một điểm lên băng, đạt khi cách `target` không quá
  `tolerance`. Có `shot` thì app đánh cú mẫu sau khi người học chốt điểm.
- `score` có `onlyTip` (cần khóa hướng và lực): trong chín điểm chạm chuẩn
  (`src/scenarios/tips.ts`) chỉ điểm này ghi điểm. Chỉ bộ dò dùng trường này.
- `choice` có `overlay` (cần `shots`): người học xem đường bi cái của từng lựa
  chọn vẽ chồng lên nhau rồi mới chọn.
- `choice` có `replay`: bài đọc ngược. App đánh cú với `tips[answer]`, người học
  đoán điểm chạm; mỗi lựa chọn ứng với một phần tử của `tips`.

## Lần thử và kết quả chấm

```ts
type Attempt = { result: SimResult } | { choice: number; result?: SimResult } | { mark: [number, number] }

interface Verdict {
  passed: boolean
  partial?: boolean      // dùng cho gather: ghi điểm nhưng bi chưa gom
  scored: boolean
  detail: string         // một câu tiếng Việt cho người học
}
```

## Bộ dò lời giải (`npm run scenarios:check`)

Mã ở `src/scenarios/solver.ts`, chạy bằng `scripts/check-scenarios.ts`, nằm trong
`npm run check`. In báo cáo từng tình huống; thoát với mã 1 nếu có lỗi.

- Lưới cú đánh chỉ gồm giá trị người học đặt được trên giao diện: hướng là bội
  của 0,1°, lực là một mức của nút − và + (thang tinh chỉnh, xem D11 và D16), và
  tôn trọng `locked`. Báo cáo in lực theo thang hiển thị 0 đến 100.
- **Hướng:** với `score` thường và `gather`, chỉ thử các hướng nhắm thẳng vào
  một bi (bước 0,5°). Với `cushionFirst` và `stopInZone`, quét cả vòng bước 2°.
- **Lực:** `score` thử 6 mức; `gather` và `stopInZone` thử nấc 2 đến 86, bước 2
  (bước 1 nếu hướng bị khóa; bước 4 nếu `stopInZone` để hướng tự do).
- **Điểm chạm:** giữa tâm; trên và dưới ở mức 0,6 và 1,0; trái và phải ở mức
  0,6. `stopInZone` để hướng tự do thì chỉ thử giữa tâm. Khi hướng bị khóa (bài
  chọn điểm chạm) thì dùng lưới dày: mọi điểm cách nhau 0,3 trong vòng tròn,
  thêm bốn điểm chéo chuẩn.
- **Độ bền:** lời giải được chấp nhận khi vẫn đạt lúc lệch hướng ±0,3° và lệch
  một bước thanh lực (0,5 nấc) về mỗi phía. Dừng ở lời giải bền đầu tiên. Khi
  cả hướng và lực đều khóa thì độ bền tính theo điểm chạm: lệch 0,1 theo bốn
  phía vẫn phải đạt.
- **`onlyTip`:** thử cả chín điểm chạm chuẩn; chỉ điểm đã khai được ghi điểm.
- **`replay`:** vị trí cuối của bi cái với đáp án phải cách vị trí cuối của mọi
  điểm chạm khác ít nhất 3 R.
- **`markCushion` có `shot`:** cú mẫu phải chạm băng trước, cách `target` không
  quá 0,5 R, rồi tới một bi.
- **`choice` có `shots`:** cú của đáp án phải ghi điểm, cú của mọi lựa chọn sai
  phải không ghi điểm.
- **Kiểm cấu trúc:** id không trùng, thế bi hợp lệ, ô đích trong bàn, điểm đích
  của `markCushion` nằm trên đường tâm bi chạm băng, mục tiêu ghi điểm đủ ba bi.
- **Giới hạn đã biết:** lời giải cần điểm chạm chéo hoặc lượng xoáy khác 0,6 có
  thể bị bỏ sót (báo vô nghiệm oan); khi đó khóa điểm chạm trong tình huống hoặc
  mở rộng lưới. `score` thường không dò lời giải băng trước. Tình huống vô
  nghiệm tốn nhiều thời gian nhất vì phải quét hết lưới: đo được 58 giây cho
  một tình huống `gather` (7 955 cú thử, khoảng 7 ms mỗi cú).
- Bộ dò dừng ở lời giải bền đầu tiên, nên nó KHÔNG chứng minh lời giải mẫu của
  người soạn là lời giải duy nhất. Muốn kiểm lời giải mẫu thì chạy bộ dò trên
  bản sao của tình huống có khóa điểm chạm mẫu.
