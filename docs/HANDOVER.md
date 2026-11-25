# Bàn giao (bước 9, 2026-11-25)

App "Học bida phăng": 7 cấp, 23 bài lý thuyết, 81 tình huống trên bàn mô phỏng,
21 bài tập bàn thật, Đánh tự do, Đánh chuỗi, Thống kê, Cài đặt và sao lưu.

## Cách dùng

- Dùng ngay: mở `dist/index.html` bằng trình duyệt. Một file duy nhất, không cần
  máy chủ, không cần mạng. Chép file này sang điện thoại cũng chạy.
- Làm tiếp: `npm install`, `npm run dev`, và `npm run check` trước khi báo xong.
- Dữ liệu nằm trong `localStorage` của trình duyệt đang dùng. Đổi máy hoặc đổi
  trình duyệt thì vào Cài đặt, xuất file sao lưu rồi nhập ở máy mới.
- Mở `dist/index.html` từ hai thư mục khác nhau có thể bị trình duyệt coi là hai
  nơi lưu khác nhau. Nên để file ở một chỗ cố định.

## Đã kiểm

Lệnh `npm run check` (2026-11-25), đạt toàn bộ:

- `typecheck`: không lỗi.
- `test`: 9 file, 120 test đạt. Gồm test quy luật vật lý, API engine, bàn và
  ngắm, bộ chấm tình huống, lưu trữ và qua cấp, chuỗi, phân tích cú đánh, cú ra cơ.
- `scenarios:check`: 84 tình huống (81 của app và 3 mẫu), 0 lỗi. Mỗi tình huống
  có ít nhất một lời giải còn đúng khi lệch nhẹ hướng, lực hoặc điểm chạm.
- `build`: ra `dist/index.html`, 242 kB.

Thử thủ công trên `npm run dev`, bằng cách điều khiển trình duyệt qua mã:

- Khung điện thoại dọc 375x812: đi hết 64 màn hình (trang chính, 7 cấp, 23 bài
  lý thuyết, 21 bài tập bàn thật, màn tình huống đầu của mỗi cấp, Đánh tự do,
  Đánh chuỗi, Thống kê, Cài đặt, Giới hạn). Không màn nào lỗi, trống, hay tràn ngang.
- Khung máy tính 1280x800: cùng 64 màn hình và trang "Không tìm thấy trang".
  Không lỗi, không tràn ngang, bàn nằm gọn trong màn hình.
- Bấm "Tiếp theo" qua đủ 81 tình huống của 7 cấp ở khung điện thoại: tình huống
  nào cũng có bàn, không có chữ lỗi (`undefined`, `NaN`, chỗ điền lực chưa thay).
- Xóa dữ liệu: bộ nhớ trống, cấp 2 đến 7 về "Chưa mở".
- Qua cấp: ghi ba bài tập bàn thật của cấp 1 thì cấp 2 mở, cấp 3 vẫn khóa. Nâng
  ngưỡng đạt lên 8/10 thì bài 7/10 thành chưa đạt và cấp 2 khóa lại; trả về 7
  thì mở lại.
- Lưu: tải lại trang, sổ tập, tình huống đã đạt và buổi chuỗi vẫn còn.
- Xuất: ra file `hoc-bida-phang-<ngày>.json`.
- Nhập: file không phải JSON và file có phiên bản lạ đều bị từ chối kèm lời báo,
  dữ liệu cũ giữ nguyên. Xóa hết rồi nhập file vừa xuất thì dữ liệu về đủ.
- Tình huống chọn đáp án (cấp 5): chọn đúng thì báo "Đúng rồi!", trang cấp ghi
  "Đã đạt 1/9".
- Đánh chuỗi: đánh một cú, kết thúc và lưu, buổi hiện ở Thống kê kèm hai biểu
  đồ. Không còn nút quay lại ở chế độ này (D18).
- Đánh tự do và tình huống: có dòng "Cú vừa đánh" và nút "Quay lại trước cú này".

`dist/index.html` mở trực tiếp (`file://`) bằng Edge không giao diện: trang
chính, Đánh tự do, tình huống cấp 1 và Cài đặt đều dựng đủ tiêu đề, bàn và nút.
File không tải thêm gì từ bên ngoài.

Rà chữ:

- Chuỗi hiển thị nào cũng có dấu. Sáu thông báo lỗi nội bộ ở `src/engine` và
  `src/scenarios/judge.ts` viết không dấu đã được sửa trong bước này.
- Thuật ngữ nhất quán: bi cái, bi ma, ê-phê (định nghĩa là xoáy ngang ở bài
  4.2), xoáy thuận, xoáy nghịch, gom bi. Không còn từ thay thế như "bi chủ",
  "xoáy xuôi", tiếng Anh lẫn vào.

## Chưa kiểm

- Chạm tay thật trên điện thoại: kéo cơ, xoay hướng ngắm, chọn điểm chạm bằng
  ngón tay. Mới chỉ thử bằng chuột và bằng mã ở khung giả lập.
- Độ mượt của chuyển động: cú ra cơ, cây cơ mờ dần trên bàn, bi lăn. Khung thử
  không vẽ đều khung hình nên tôi không đánh giá được bằng mắt.
- Với `dist/index.html` mở trực tiếp: mới kiểm phần dựng màn hình. Chưa kiểm
  đánh một cú và lưu dữ liệu ở chế độ `file://`, và chưa thử trên Chrome,
  Firefox, Safari hay trình duyệt điện thoại.
- Hộp chọn file của hệ điều hành khi nhập sao lưu, và việc file xuất thật sự
  rơi vào thư mục Tải về. Tôi đưa file vào bằng mã và chặn bước tải xuống.
- Phạm lỗi luật vùng góc trong một ván chuỗi thật trên giao diện. Luật này chỉ
  có test đơn vị (`tests/chain.test.ts`).
- Phần lớn 81 tình huống chỉ được bộ dò lời giải xác nhận là giải được. Tôi chưa
  tự tay đánh qua từng tình huống, nên độ khó cảm nhận và lời gợi ý có thể chưa vừa.
- Nội dung chuyên môn chưa có người chơi carom có kinh nghiệm đọc lại. Thế bi
  và lời văn tự dựng, có đối chiếu nguồn ghi ở `docs/SOURCES.md`.
- Chưa ai đối chiếu số đo của mô phỏng với bàn thật (ĐIỂM DỪNG 2 hỏi việc này
  cho bài tập 1 và 2 của cấp 4).
- Trình đọc màn hình và điều khiển hoàn toàn bằng bàn phím chưa được thử.

## Giới hạn đã biết

Vật lý (chi tiết ở D9, D10 và trang "Giới hạn của mô phỏng" trong app):

- Không có hiện tượng bi cái lệch hướng khi đánh ê-phê (squirt). Hình ở bài 4.4
  là hình minh họa có ghi chú, không phải kết quả mô phỏng.
- Chạm dày hơn nửa bi thì hai bi tách nhau ít hơn 90°, khoảng 75° đến 78° ở 3/4 bi.
- Bi đi sượt dọc băng thì xoáy nghịch gần như không dựng góc bật.
- Kéo lùi yếu khi đánh nhẹ.
- Cú giữa tâm luôn đi trước đường 90° khoảng 4° đến 15°; xoáy ngang tắt dần
  trong cú dài và nhẹ.
- Không mô phỏng việc đưa cơ lệch.

Tính năng:

- "Quay lại trước cú này" chỉ nhớ một cú gần nhất và mất khi rời màn hình. Đánh
  chuỗi không có nút này.
- Đánh tự do xếp được thế bằng nút "Xếp bi" (thêm sau bàn giao, D19), nhưng
  thế đã xếp không được lưu qua lần mở sau.
- Lõi vật lý có lỗi khi bi nằm đúng sát băng; `src/engine` tự dời bi vào tối đa
  1,5 mm rồi tính lại (D19).
- Ở mức "Mạnh" của "Độ mạnh của cơ", các cú rất nhỏ nằm sát đầu quãng kéo; cần
  dùng nút − và + để chỉnh.
- Qua cấp chỉ dựa trên sổ tập bàn thật do người dùng tự ghi. App không kiểm
  được con số đó.
- Dữ liệu chỉ ở một trình duyệt. Xóa dữ liệu duyệt web là mất, trừ khi đã xuất
  file sao lưu.
- Mã nguồn nằm ở kho git riêng tư `chamkartechcambodia-sudo/carom-trainer` trên
  GitHub (từ 2026-11-25). Lịch sử bắt đầu từ một commit gộp; các bước trước đó
  chỉ có trong `docs/PROGRESS.md`.

## Giấy phép

GPL-3.0-or-later, vì lõi vật lý trong `src/vendor/billiards` lấy từ
tailuge/billiards (GPL-3.0, commit ghi ở `src/vendor/billiards/UPSTREAM.md`).
Khi chia sẻ `dist/index.html` cho người khác, phải kèm `LICENSE` và cho họ
đường tới mã nguồn.
