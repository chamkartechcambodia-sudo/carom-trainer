# Kế hoạch thực thi

Làm theo thứ tự, mỗi lần một bước. Sau mỗi bước: `npm run check` phải đạt, rồi
cập nhật `docs/PROGRESS.md`. Bước 6, 7, 9 là điểm dừng chờ người dùng.

---

## Bước 1. Khung dự án và lõi vật lý  (ĐÃ XONG)

- **Làm gì:** tạo dự án Vite + TypeScript; trích lõi vật lý của tailuge/billiards
  vào `src/vendor/billiards` bằng `scripts/vendor-physics.py`; giữ ghi công và
  GPL-3.0.
- **Đầu vào:** kho upstream tại commit `555bc72`.
- **Đầu ra:** dự án build được; `tests/vendor.smoke.test.ts` đạt.

---

## Bước 2. Lớp bọc vật lý (`src/engine`)

- **Làm gì:**
  1. Tạo `src/engine/index.ts` xuất hàm `simulate(setup, shot)`: nhận vị trí ba
     bi (đơn vị bán kính bi) và một `Shot` (xem `docs/SCENARIO_FORMAT.md`), trả về:
     đường đi từng bi lấy mẫu theo thời gian, danh sách sự kiện (bi chạm bi, bi
     chạm băng nào, lúc nào), vị trí cuối, và cờ `scored` theo luật phăng (bi cái
     chạm cả hai bi kia).
  2. Xuất kích thước bàn và bán kính bi để giao diện vẽ đúng tỉ lệ.
  3. Chọn thang lực: `power` 0..1 ánh xạ sang tốc độ sao cho 1.0 là cú đánh mạnh
     hợp lý trên bàn carom. Ghi cách chọn vào `docs/DECISIONS.md`.
  4. Viết `tests/engine.laws.test.ts` kiểm các quy luật:
     - Đánh thẳng chính diện, không xoáy, cự ly ngắn: bi cái gần như đứng yên.
     - Đánh xéo không xoáy, cự ly ngắn: hướng hai bi ngay sau va chạm lệch nhau
       trong khoảng 80° đến 95°.
     - Trên tâm: bi cái đi quá về phía trước so với cú không xoáy. Dưới tâm: lùi.
     - Đâm thẳng vào băng: xoáy phải bật sang phải, xoáy trái bật sang trái
       (nhìn từ người đánh).
     - Đâm xéo vào băng: xoáy thuận cho góc bật rộng hơn và bi đi xa hơn; xoáy
       nghịch cho góc bật dựng hơn.
     - Không xoáy, đâm xéo vào băng: góc bật gần góc tới (cho phép sai số rộng).
     - Lực lớn hơn thì bi cái đi được quãng đường dài hơn.
     - Tất định: cùng đầu vào cho cùng kết quả.
  5. Xác minh và ghi lại dấu trục của `tip` so với `offset` của lõi vật lý.
- **Đầu vào:** `src/vendor/billiards`, `docs/SCENARIO_FORMAT.md`, phần "Kiến thức
  nền" trong `docs/LEVELS.md`.
- **Đầu ra:** `src/engine/` với kiểu dữ liệu công khai; bộ test quy luật đạt.
- **Nghiệm thu:** `npm run check`. Không file nào ngoài `src/engine` và
  `tests/vendor.smoke.test.ts` import từ `src/vendor`.
- **Dừng lại khi:** một quy luật không đạt dù đã kiểm kỹ cách gọi engine. Báo
  người dùng kèm số liệu; không nới test cho qua, không sửa công thức vật lý.

---

## Bước 3. Bàn mô phỏng 2D (`src/table`)

- **Làm gì:**
  1. Component bàn SVG nhìn từ trên, đúng tỉ lệ bàn carom, ba bi trắng, vàng, đỏ.
  2. Ngắm: kéo trên bàn để đổi hướng; có nút tinh chỉnh từng độ.
  3. Chọn điểm chạm: mặt bi cái bấm được, chấm tự do trong giới hạn an toàn;
     hiện tên vùng (ví dụ "trên phải, xoáy vừa").
  4. Thanh lực; nút Đánh; nút Đặt lại.
  5. Phát lại chuyển động từ kết quả `simulate`, vẽ vệt đường đi mỗi bi, hiện kết
     quả (ghi điểm hay chưa).
  6. Trợ giúp bật tắt được: bi ma, đường 90°, đường ngắm kéo dài.
  7. Tôn trọng `prefers-reduced-motion` (nhảy thẳng tới kết quả).
  8. Một file hệ thiết kế (`src/app/theme.css` hoặc tương đương): màu, cỡ chữ,
     nút, khoảng cách. Mọi màn hình sau dùng lại.
- **Đầu vào:** API của engine; các mô phỏng mẫu trong cuộc trò chuyện gốc (bàn
  nỉ xanh, vệt trắng đậm là đường bi cái, đường chấm là đường 90°, vòng nét đứt
  là bi ma, chấm đỏ trên mặt bi cái là chỗ đầu cơ chạm).
- **Đầu ra:** trang "Đánh tự do" 3 bi chạy được bằng chuột và cảm ứng.
- **Nghiệm thu:** `npm run check`; chạy `npm run dev`, tự thử trên khung
  390×844 và 1280×800: ngắm, chọn điểm chạm, đánh, phát lại, đặt lại đều hoạt
  động; không tràn ngang.
- **Dừng lại khi:** hiệu năng phát lại kém trên khung điện thoại và không khắc
  phục được bằng cách giảm mẫu.

---

## Bước 4. Định dạng tình huống, bộ chấm, bộ dò lời giải (`src/scenarios`, `scripts`)

- **Làm gì:**
  1. Hiện thực các kiểu trong `docs/SCENARIO_FORMAT.md`.
  2. Bộ chấm `judge(scenario, result) → Verdict` cho mọi loại `Goal`, có test.
  3. Script `scripts/check-scenarios.ts` và lệnh `npm run scenarios:check`: dò
     lời giải bằng lưới cú đánh, kiểm độ bền của lời giải, kiểm các lựa chọn sai
     thật sự sai. Thêm lệnh này vào `npm run check`.
  4. Màn hình chạy một tình huống: lời giao việc, bàn, số lần thử, kết quả, lời
     giải thích, nút thử lại và tiếp theo.
  5. Ba tình huống mẫu (ghi điểm trực tiếp, bi dừng trong ô, chọn đáp án) để
     chứng minh cả chuỗi hoạt động.
- **Đầu vào:** engine, bàn 2D, `docs/SCENARIO_FORMAT.md`.
- **Đầu ra:** kiểu dữ liệu, bộ chấm, bộ dò, màn hình tình huống, ba tình huống mẫu.
- **Nghiệm thu:** `npm run check` (đã gồm `scenarios:check`). Cố ý thêm một tình
  huống vô nghiệm để thấy lệnh báo lỗi, rồi gỡ ra.
- **Dừng lại khi:** bộ dò mất quá vài phút cho một tình huống; khi đó thu hẹp
  lưới và ghi lại giới hạn.

---

## Bước 5. Khung app và sổ tập (`src/app`)

- **Làm gì:**
  1. Màn hình chính: 7 cấp, trạng thái khóa hay mở, tiến độ từng cấp.
  2. Màn hình cấp: bốn mục Hiểu, Thử, Tập, Qua cấp.
  3. Sổ tập bàn thật: danh sách bài của cấp, sơ đồ xếp bi (dùng lại component
     bàn ở chế độ tĩnh), nhập số quả đạt trên 10, lịch sử theo ngày.
  4. Logic mở khóa theo ngưỡng; cấp 1 mở sẵn.
  5. Lưu tiến độ: một lớp `storage` duy nhất, có phiên bản dữ liệu, try/catch,
     xuất và nhập JSON.
  6. Cài đặt: ngưỡng qua cấp, luật vùng góc (chưa có tác dụng tới bước 8), trợ
     giúp ngắm mặc định, xóa dữ liệu (có xác nhận).
  7. Trang "Giới hạn của mô phỏng" lấy nội dung từ `docs/SPEC.md`.
  8. Điều hướng bằng hash; nút quay lại hoạt động.
- **Đầu vào:** `docs/LEVELS.md`, `docs/SPEC.md`, hệ thiết kế ở bước 3.
- **Đầu ra:** app điều hướng đầy đủ với nội dung giữ chỗ; lưu và khôi phục được.
- **Nghiệm thu:** `npm run check`; test cho `storage` (ghi, đọc, dữ liệu hỏng,
  xuất rồi nhập lại cho kết quả giống) và cho logic mở khóa.
- **Dừng lại khi:** khung app trở nên rối khi không có framework; khi đó đề xuất
  với người dùng (xem D3), không tự thêm.

---

## Bước 6. Nội dung cấp 1 đến 3  (ĐIỂM DỪNG 1)

- **Làm gì:** với từng cấp 1 (lực), 2 (độ dày chạm và 90°), 3 (trên/dưới tâm):
  1. Tra cứu tài liệu dạy carom để đối chiếu kiến thức; ghi nguồn vào
     `docs/SOURCES.md`.
  2. Soạn chi tiết cấp theo khuôn của cấp 4 và ghi vào `docs/LEVELS.md`.
  3. Viết bài Hiểu: chữ ngắn, một hình tương tác cho mỗi ý chính, một ví dụ đời
     thường cho mỗi bài.
  4. Dựng tình huống Thử (mỗi cấp 3 đến 4 nhóm, mỗi nhóm 3 đến 4 thế), tất cả
     qua `scenarios:check`.
  5. Soạn bài Tập bàn thật kèm sơ đồ và điều kiện đạt.
- **Đầu vào:** khung app, bộ dò lời giải, "Kiến thức nền" trong `docs/LEVELS.md`.
- **Đầu ra:** ba cấp dùng được trọn vẹn; `docs/LEVELS.md` có chi tiết ba cấp.
- **Nghiệm thu:** `npm run check`; tự đi hết ba cấp trên `npm run dev`; build ra
  `dist/index.html`.
- **Điểm dừng:** gửi người dùng bản build, hỏi về độ khó, lời văn, cách chấm.
  Chờ phản hồi.

---

## Bước 7. Nội dung cấp 4  (ĐIỂM DỪNG 2)

- **Làm gì:** hiện thực đúng "Cấp 4 chi tiết" trong `docs/LEVELS.md`: 5 bài Hiểu,
  9 nhóm tình huống A đến I, 6 bài Tập. Bổ sung loại mục tiêu hay giao diện còn
  thiếu (chấm điểm lên băng, chồng ba vệt đường, đoán điểm chạm).
- **Đầu vào:** `docs/LEVELS.md` mục cấp 4; phản hồi của người dùng ở điểm dừng 1.
- **Đầu ra:** cấp 4 hoàn chỉnh.
- **Nghiệm thu:** `npm run check`; với nhóm D và G, bộ dò xác nhận chỉ lựa chọn
  đúng mới đạt.
- **Điểm dừng:** gửi bản build. Nhắc người dùng đây là cấp mô phỏng kém chính xác
  nhất so với bàn thật, nhờ đối chiếu với bài tập 1 và 2 trên bàn thật nếu được.

---

## Bước 8. Nội dung cấp 5 đến 7 và chế độ đánh chuỗi

- **Làm gì:**
  1. Tra cứu về chọn lời giải, cú gom bi và kỹ thuật giữ bi sát nhau trong
     straight rail; ghi nguồn. Tra luật vùng góc chính thức và ghi vào D8.
  2. Soạn chi tiết cấp 5, 6, 7 vào `docs/LEVELS.md`, rồi làm nội dung như bước 6.
  3. Cấp 6 và 7 dùng mục tiêu `gather`: chấm hai phần, ghi điểm mà bi văng xa chỉ
     đạt một nửa.
  4. Chế độ "Đánh chuỗi": chơi phăng tự do trên mô phỏng, đếm chuỗi hiện tại,
     chuỗi dài nhất, số lượt; áp luật vùng góc khi cài đặt bật.
  5. Trang thống kê: điểm trung bình mỗi lượt và chuỗi dài nhất theo thời gian,
     tách riêng mô phỏng và bàn thật (bàn thật do người dùng nhập sau mỗi buổi).
- **Đầu vào:** bộ chấm `gather`, khung app, nguồn tra cứu.
- **Đầu ra:** đủ 7 cấp; chế độ đánh chuỗi; trang thống kê.
- **Nghiệm thu:** `npm run check`; tự đi hết ba cấp và một ván đánh chuỗi.
- **Dừng lại khi:** không dựng được thế gom bi nào có lời giải đủ bền; khi đó
  báo người dùng và đề xuất giảm số thế.

---

## Bước 9. Kiểm thử và bàn giao  (ĐIỂM DỪNG 3)

- **Làm gì:**
  1. Chạy `npm run check`.
  2. Thử thủ công trên khung điện thoại dọc và máy tính: mọi màn hình, lưu, xuất,
     nhập, xóa dữ liệu, qua cấp.
  3. Rà chữ tiếng Việt: có dấu, nhất quán thuật ngữ (bi cái, bi ma, ê-phê, xoáy
     thuận, xoáy nghịch, gom bi).
  4. Build `dist/index.html`; kiểm file mở được trực tiếp, không cần máy chủ.
  5. Viết `docs/HANDOVER.md`: đã kiểm gì, chưa kiểm gì, giới hạn đã biết.
- **Đầu vào:** app hoàn chỉnh.
- **Đầu ra:** `dist/index.html`, mã nguồn kèm `LICENSE`, `docs/HANDOVER.md`.
- **Điểm dừng:** bàn giao cho người dùng.
