# Học bida phăng (carom-trainer)

Web app tiếng Việt giúp một người tự học bida phăng tự do (carom libre) từ đầu
đến mức gom bi và đánh chuỗi dài. Ba phần: bài học theo cấp, bàn mô phỏng 3 bi,
sổ tập bàn thật.

## Đọc trước khi làm

1. `docs/SPEC.md`: mục tiêu, phạm vi, ngoài phạm vi.
2. `docs/PLAN.md`: 9 bước thực thi, mỗi bước có đầu vào, đầu ra, nghiệm thu.
3. `docs/PROGRESS.md`: đang ở bước nào. Cập nhật file này sau mỗi bước.
4. `docs/LEVELS.md`, `docs/SCENARIO_FORMAT.md`, `docs/DECISIONS.md`: tra khi cần.

Làm đúng một bước của PLAN mỗi lần, theo thứ tự. Không nhảy bước.

## Lệnh

- `npm install`: cài phụ thuộc.
- `npm run dev`: chạy thử trên máy.
- `npm run test`: chạy test (vitest).
- `npm run typecheck`: kiểm kiểu.
- `npm run check`: typecheck + test + build. Phải xanh trước khi báo xong một bước.
- `python3 scripts/vendor-physics.py <thư-mục-checkout-upstream>`: sinh lại lõi vật lý.

## Kiến trúc

```
src/vendor/billiards/   Lõi vật lý trích từ tailuge/billiards (GPL-3.0). Không sửa tay.
src/engine/             Lớp bọc: nơi DUY NHẤT được import từ src/vendor.
src/table/              Bàn 2D (SVG), ngắm, chọn điểm chạm, phát lại.
src/scenarios/          Kiểu dữ liệu tình huống, bộ chấm, dữ liệu từng cấp.
src/app/                Khung app, điều hướng, sổ tập, lưu tiến độ, cài đặt.
src/content/            Bài lý thuyết và bài tập bàn thật của từng cấp.
tests/                  Test.
scripts/                Công cụ: trích vật lý, dò lời giải tình huống.
```

## Quy tắc bắt buộc

- **Vật lý:** không sửa công thức trong `src/vendor/billiards`. Cần thay đổi thì
  sửa `scripts/vendor-physics.py` và ghi lý do vào `docs/DECISIONS.md`.
- **Ranh giới:** chỉ `src/engine` import `src/vendor`. Phần còn lại dùng API của engine.
- **Không giả định về vật lý:** dấu của trục, đơn vị, chiều xoáy phải được xác
  minh bằng test trước khi dùng. Nếu test quy luật thất bại, DỪNG và báo người
  dùng, không chỉnh test cho qua.
- **Tình huống phải giải được:** mọi tình huống đưa vào app phải qua
  `npm run scenarios:check` (tạo ở bước 4). Không thêm tình huống chưa kiểm.
- **Nội dung:** thế bi và lời văn tự dựng. Được tra cứu tài liệu dạy carom để
  đối chiếu kiến thức, không sao chép sơ đồ hay đoạn văn của sách, video.
- **Ngôn ngữ:** toàn bộ chữ trên giao diện là tiếng Việt có dấu. Tên biến, hàm,
  file bằng tiếng Anh.
- **Giao diện:** một hệ thiết kế chung (màu, cỡ chữ, nút) định nghĩa một chỗ và
  dùng lại. Thành phần giống nhau thì dùng chung một component.
- **Giản dị:** YAGNI, KISS, DRY. Không thêm framework, backend, tài khoản, hay
  tính năng ngoài `docs/SPEC.md`.
- **Lưu trữ:** mọi đọc/ghi `localStorage` bọc try/catch. Phải có xuất/nhập file
  sao lưu.
- **Giấy phép:** dự án là GPL-3.0-or-later vì dùng lõi vật lý GPL. Giữ `LICENSE`
  và `src/vendor/billiards/UPSTREAM.md`.

## Điểm dừng

Sau bước 6, bước 7 và bước 9 trong PLAN: build, báo người dùng dùng thử, CHỜ
phản hồi rồi mới làm tiếp. Các bước khác làm liền mạch.

## Khi báo cáo

Nói rõ: đã làm gì, lệnh nào đã chạy và kết quả, cái gì chưa kiểm, giới hạn đã biết.
