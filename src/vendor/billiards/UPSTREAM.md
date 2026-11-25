# Nguồn gốc lõi vật lý

- Dự án: https://github.com/tailuge/billiards
- Tác giả: tailuge
- Giấy phép: GPL-3.0 (xem `LICENSE` ở gốc dự án)
- Commit đã trích: `555bc720d52fdf43cdeb5fad313f22c1f6b2cfc7` (2026-11-24)
- Mô hình vật lý theo README của upstream: Han (2005), Mathavan (2010), cùng các
  tài liệu của Alciatore và Stronge.

## Cái gì được lấy

15 file sao chép bằng `scripts/vendor-physics.py` (bóng, kết quả va chạm, toàn
bộ `model/physics`, hai file toán tiện ích, hình học bàn và lỗ).

## Thay đổi so với bản gốc

- `model/ball.ts`: bỏ phần tạo lưới 3D (`BallMesh`, `BallAppearance`).
- `utils/utils.ts`: chỉ giữ các hàm toán và `bisectionSolver`.
- `model/table.ts`: viết lại rút gọn bằng tay. Giữ nguyên vòng lặp va chạm
  (`advance`, `prepareAdvance*`); bỏ cơ 3D, phiên chơi mạng, cảnh báo khoảng
  cách, báo cáo lỗi.
- Mọi file có `// @ts-nocheck` vì upstream không bật kiểm kiểu nghiêm ngặt.

Không có công thức vật lý nào bị sửa.

## Cập nhật lên bản upstream mới

1. `git clone https://github.com/tailuge/billiards` ra thư mục ngoài dự án.
2. `python3 scripts/vendor-physics.py <thư-mục-đó>`. Script báo lỗi nếu đoạn mã
   cần vá không còn khớp.
3. So `model/table.ts` của upstream với bản rút gọn, chép tay thay đổi trong
   vòng lặp va chạm nếu có.
4. `npm run check`, rồi cập nhật commit ở trên.
