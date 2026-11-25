# Tiến độ

Cập nhật sau mỗi bước. Ghi ngày, kết quả nghiệm thu, và điều đáng lưu ý.

- [x] Bước 1. Khung dự án và lõi vật lý. Xong 2026-11-25.
  - `npm run typecheck`, `npm run test` (5 test khói), `npm run build` đều đạt.
  - Lưu ý: test khói chỉ xác nhận lõi chạy, tất định, và có phản ứng với điểm
    chạm. Chưa kiểm quy luật vật lý.
- [x] Bước 2. Lớp bọc vật lý. Xong 2026-11-25. Người dùng đã chấp nhận ba giới hạn ở D10 (2026-11-25).
  - `npm run check` đạt: typecheck, 28 test (5 khói, 15 quy luật, 8 hợp đồng
    API), build. Chỉ `src/engine` và `tests/vendor.smoke.test.ts` import vendor.
  - `src/engine/index.ts`: `simulate(setup, shot)`, `TABLE`, `BALL_RADIUS`,
    `MAX_SPEED_MPS`. Thang lực và dấu trục: xem D9.
  - Dấu trục: `tip.x` ngược dấu `offset.x` của lõi, engine đã đảo. `tip.y` cùng dấu.
  - Quy luật xoáy nghịch chỉ được kiểm ở góc tới 30° và 45°. Ở góc sượt (từ
    khoảng 55° so với pháp tuyến) mô hình KHÔNG cho góc bật dựng hơn. Quy luật
    90° chỉ được kiểm từ nửa bi trở xuống; chạm 3/4 bi tách 75 đến 78°. Số liệu
    ở D10.
  - Trong lúc làm, ngưỡng "kéo lùi" tôi tự đặt (lùi quá 2 R) không đạt (đo được
    1,4 R); đã đổi thành "nằm sau chỗ va chạm quá 0,5 R" vì quy luật chỉ nói bi
    lùi, không nói lùi bao xa. Ghi lại để người dùng biết ngưỡng đã bị đổi.
  - Cấu hình lõi đã đối chiếu với mã upstream (mô hình băng, bước 1/512 s).
- [x] Bước 3. Bàn mô phỏng 2D. Xong 2026-11-25.
  - `npm run check` đạt: typecheck, 38 test (thêm 10 test cho hình học ngắm,
    tên vùng điểm chạm, nội suy phát lại), build ra `dist/index.html` 118 kB.
  - Đã tự thử trên `npm run dev` ở khung 1280×800 và 390×844: ngắm bằng bấm trên
    bàn, nút tinh chỉnh, chọn điểm chạm, đánh, phát lại, bỏ qua, xem lại, đặt
    lại đều chạy; không tràn ngang; không có lỗi trên console.
  - CHƯA thử: cảm ứng trên điện thoại thật (mới thử bằng chuột trong khung giả
    lập; mã dùng pointer events), chế độ `prefers-reduced-motion`, bàn phím trên
    mặt bi cái.
  - Màn hình dọc hẹp hơn 700 px thì bàn xoay dọc (bi 12 px thay vì 8 px), không
    lật gương. Khi đó phần lực và điểm chạm nằm dưới bàn, phải cuộn xuống.
  - Thanh lực: cách chia nấc ở bước này đã được thay ở bước 4 (D11).
  - Mặt bi cái vẽ đúng tỉ lệ: vùng chọn được chỉ là vòng 0,45 R ở giữa (bán kính
    khoảng 36 px), bấm ngoài vòng thì kéo về mép. Nếu khó bấm trên điện thoại,
    cân nhắc phóng to vùng này.
  - Thêm ngoài PLAN: nút ±0,1° (1° quá thô cho cú chạm mỏng), nút "Về giữa tâm",
    đoạn vàng ngắn chỉ hướng bi mục tiêu, `src/app/dom.ts`, `src/vite-env.d.ts`.
  - Đánh tự do chưa cho kéo bi để xếp thế; bi nằm ở chỗ dừng của cú trước, "Đặt
    lại" đưa về thế đầu.
  - Engine: nới sai số kiểm bi chồng nhau từ 1e-6 lên 1e-3 R, vì vị trí cuối của
    lõi làm tròn float32 và phải dùng lại được làm thế đầu cho cú sau.
  - Cấu hình chạy thử cho Claude nằm ở `../.claude/launch.json` (thư mục cha).
- [x] Bước 4. Định dạng tình huống, bộ chấm, bộ dò lời giải. Xong 2026-11-25.
  - `npm run check` đạt: typecheck, 52 test (thêm 14 cho bộ chấm, thanh lực, bộ
    dò), `scenarios:check` (3 tình huống mẫu đạt, 0,9 giây), build 127 kB.
  - Nghiệm thu tình huống vô nghiệm: thêm tạm một tình huống `gather` bán kính
    0,5 R; lệnh báo LỖI, thoát mã 1 sau 58 giây (7 955 cú thử); đã gỡ ra.
  - Đã tự thử trên `npm run dev` ở 1280×800 và 390×844: ba tình huống mẫu (ghi
    điểm, bi dừng trong ô với 5 lượt thử, chọn điểm chạm có phát cú đánh), gợi
    ý, lời giải thích, hết lượt, thử lại, tiếp theo, xem lại không tính lượt.
  - Bộ dò bắt được lỗi thật ngay lần đầu: mẫu "bi dừng trong ô" không có lời
    giải bền với thanh lực cũ. Vì vậy ĐỔI thanh lực của bước 3: cấp số nhân, bước
    0,5, thêm nút − và + (D11). Mặc định giờ là nấc 50.
  - Thay đổi so với bản nháp định dạng (đã cập nhật `docs/SCENARIO_FORMAT.md`):
    gộp hai dạng `score`; `choice` có thêm `shots`; thêm `level: 0` cho mẫu;
    thêm kiểu `Attempt`; `gather` định nghĩa theo trọng tâm.
  - Tách `src/table/shotTable.ts` dùng chung cho Đánh tự do và màn hình tình
    huống. Điều hướng tạm bằng hash trong `src/main.ts`, bước 5 thay bằng khung app.
  - CHƯA làm: giao diện `markCushion` (bước 7, bộ chấm đã có). Chưa có tình
    huống `gather` hay `score` có `require` nào trong dữ liệu, nên hai loại này
    mới qua test của bộ chấm với kết quả giả, chưa qua bộ dò với thế thật.
  - Giới hạn của bộ dò: xem cuối `docs/SCENARIO_FORMAT.md`.
  - Lưu ý môi trường: `package.json` đã được nâng lên Vite 8, Vitest 5,
    TypeScript 7 lúc 10:05 hôm nay (không phải do các bước này); mọi lệnh ở
    trên chạy trên các bản đó.
- [x] Bước 5. Khung app và sổ tập. Xong 2026-11-25.
  - `npm run check` đạt: typecheck, 68 test (thêm 16 cho lưu trữ, logic mở
    khóa, phân tích đường dẫn), `scenarios:check`, build 149 kB.
  - Đã tự thử trên `npm run dev` ở 1280×800: trang chính 7 cấp, mở cấp 1, bài
    Hiểu, ghi sổ tập (6/10 chưa đạt, 8/10 đạt), xóa một dòng, đạt đủ hai bài
    thì cấp 2 mở, nâng ngưỡng lên 9 thì cấp 2 khóa lại, nút quay lại của trình
    duyệt, tải lại trang vẫn còn dữ liệu, địa chỉ cấp chưa mở và địa chỉ lạ,
    trợ giúp ngắm mặc định áp vào Đánh tự do, xuất file, nhập file sai và file
    đúng, xóa dữ liệu (hủy và đồng ý). Ở 390×844: 8 màn hình không tràn ngang.
  - Việc nhập file thử bằng cách gắn file giả vào ô chọn file qua mã; CHƯA thử
    hộp chọn file thật của hệ điều hành, và chưa thử file tải về mở lại được.
  - Quy tắc đã chọn (ghi ở `src/app/progress.ts`): một bài đạt khi có ÍT NHẤT
    MỘT buổi đạt ngưỡng (tính buổi tốt nhất, không phải buổi gần nhất). Ngưỡng
    riêng của bài = ngưỡng chung trong cài đặt cộng phần điều chỉnh (bài 6 cấp 4
    là −1). Bài không đếm được bằng số quả (bài 2 và 5 của cấp 4) thì tự đánh
    giá Đạt hoặc Chưa đạt. Cấp chưa có bài tập thì không tính là hoàn thành.
  - Cấp chưa mở thì không vào được, kể cả gõ thẳng địa chỉ.
  - Nội dung là GIỮ CHỖ: tên cấp, mô tả và bài kiểm tra lấy từ bảng tổng quan
    của `docs/LEVELS.md`; bài tập cấp 4 lấy đúng 6 bài đã soạn; bài tập các cấp
    khác tôi tự đặt tạm từ cột "Kiểm tra qua cấp" và ghi "(Giữ chỗ)". Cấp 7 chưa
    có bài tập (kiểm tra bằng chuỗi, làm ở bước 8). Chưa cấp nào có tình huống.
  - Ba tình huống mẫu vẫn ở trang "Tình huống mẫu" (`#/mau`), gỡ khi có nội dung thật.
  - Trang "Giới hạn của mô phỏng" có hai ý của SPEC và thêm năm ý cụ thể từ D9, D10.
  - Luật vùng góc: có ô bật tắt và được lưu, chưa có tác dụng (bước 8).
  - Dữ liệu lưu: phiên bản 1, khóa `carom-trainer` trong localStorage. Bước 8
    thêm thống kê chuỗi thì thêm trường mới; `sanitise` tự điền mặc định cho
    trường thiếu nên file sao lưu cũ vẫn nhập được.
  - Khung app không cần framework: mỗi màn hình là một hàm trả về phần tử, dùng
    chung `el`, `button`, `link` và các lớp trong `theme.css`. Chưa thấy rối.
- [x] Bước 6. Nội dung cấp 1 đến 3 (ĐIỂM DỪNG 1). Xong 2026-11-25. Người dùng trả lời "Ổn, làm bước 7", không có góp ý cụ thể.
  - `npm run check` đạt: typecheck, 71 test, `scenarios:check` (30 tình huống:
    27 của cấp 1 đến 3 và 3 mẫu, 0 lỗi, 35 giây), build `dist/index.html` 167 kB.
  - Nội dung: mỗi cấp 3 bài Hiểu (mỗi bài một hình tương tác chạy bằng lõi mô
    phỏng và một ví dụ đời thường), 3 nhóm × 3 tình huống Thử, 2 đến 3 bài Tập
    bàn thật có sơ đồ. Chi tiết ở `docs/LEVELS.md`, nguồn ở `docs/SOURCES.md`.
  - Tra cứu: 12 điều kiến thức đều được nguồn xác nhận. Đã sửa lời văn theo ba
    lưu ý của nguồn: góc 90° thực tế nhỏ hơn vài độ; tốc độ không phải quãng
    đường; số liệu về băng là của bàn lỗ nên app không nêu con số.
  - Đã tự thử trên `npm run dev`: 9 bài Hiểu (bấm hình, bỏ qua), duyệt đủ 27
    tình huống, đánh thật 7 tình huống (có cả trường hợp trượt và đạt, chọn sai
    và đúng, chọn điểm chạm bằng phím mũi tên), 2 trang bài Tập có sơ đồ; 9 màn
    hình ở 390×844 không tràn ngang. CHƯA tự tay giải 20 tình huống còn lại; chúng
    mới được bộ dò xác nhận là có lời giải bền.
  - Thế bi dựng bằng mô phỏng (công cụ tạm, đã xóa): đặt bi đỏ lên đường bi cái
    thật sự đi với cú mẫu. Số liệu của 9 hình minh họa đã đo lại cho khớp chú thích.
  - PHÁT HIỆN về mô hình: cú giữa tâm trong mô phỏng không bao giờ đi đúng đường
    90°; bi cái lệch về trước 4° đến 15° kể cả khi đánh mạnh ở cự ly 4 R. Muốn
    đúng đường 90° phải chạm hơi dưới tâm. Vì vậy cấp 2 chỉ dùng chạm từ nửa bi
    trở về mỏng, bi đỏ đặt gần (9 R), và bài 2.2 nói rõ "gần vuông góc".
  - Bộ chấm không ép dùng trên hay dưới tâm ở cấp 3 nhóm B, C. Còn lời giải
    ngoài ý: nhóm B đánh giữa tâm thật nhẹ; L3-C-01 và L3-C-02 đánh giữa tâm
    mạnh theo hướng khác. Lời giải mẫu đã kiểm là bền.
  - Thêm ngoài PLAN: mục tiêu `stopInZone` có `cushions` (đếm đúng số băng) để
    nhóm B, C của cấp 1 có nghĩa; cài đặt "Mở mọi cấp để xem trước" (mặc định
    tắt) để dùng thử được cấp 2, 3 mà không phải nhập sổ tập giả.
  - Đã gỡ trang "Tình huống mẫu" khỏi giao diện; ba mẫu còn dùng cho test.
  - Trên điện thoại dọc, bàn trong hình minh họa cũng xoay dọc và cao 70% màn
    hình, nên bài Hiểu phải cuộn nhiều.
  - Bài Tập bàn thật là tự soạn (không tìm được nguồn bài tập nhập môn riêng cho
    phăng); khoảng cách xếp bi ghi bằng cm ước lượng, chưa thử trên bàn thật.
- [x] Bước 7. Nội dung cấp 4 (ĐIỂM DỪNG 2). Xong 2026-11-25, ĐANG CHỜ PHẢN HỒI.
  - `npm run check` đạt: typecheck, 77 test, `scenarios:check` (57 tình huống, 0
    lỗi, khoảng 45 giây), build `dist/index.html` 191 kB.
  - Nội dung: 5 bài Hiểu, 9 nhóm A đến I × 3 thế, 6 bài Tập có sơ đồ. Bản thiết
    kế gốc và các điểm khác khi hiện thực: `docs/LEVELS.md`, mục "Ghi chú hiện
    thực (bước 7)". Nguồn: `docs/SOURCES.md`.
  - Nghiệm thu nhóm D và G: nhóm D là bài chọn có cú đánh, bộ dò xác nhận chỉ cú
    của đáp án ghi điểm. Nhóm G có `onlyTip`, bộ dò thử cả chín điểm chạm chuẩn
    và xác nhận chỉ một điểm ghi điểm. Có test cho trường hợp khai sai.
  - Loại mục tiêu và giao diện mới: chấm điểm lên băng (bấm, nhích, chốt, app
    đánh cú mẫu); chồng ba vệt đường; đoán điểm chạm trên lưới 3×3; hình "chín
    điểm chạm" bấm mặt bi là thấy đường đi.
  - Đã tự thử trên `npm run dev`: 5 bài Hiểu, duyệt đủ 27 tình huống, đánh thật
    một thế của mỗi kiểu (A, B, D, F, G, H, I) gồm cả trường hợp sai rồi đúng;
    390×844 không tràn ngang. CHƯA tự tay đánh nhóm C và E (mới qua bộ dò) và
    20 thế còn lại.
  - Tra cứu: 12 điều, phần lớn được xác nhận. Một đính chính đã đưa vào bài 4.4:
    độ lệch của bi cái tự nó không tăng theo lực. Ba điểm chỉ được xác nhận một
    phần (xem SOURCES.md): hướng bật khi đâm thẳng băng không nguồn nào viết
    thành câu (đã có test mô phỏng); "băng trước dùng khi bị che" không có
    nguồn carom; quy tắc "cộng hai tác dụng" chỉ là gần đúng.
  - PHÁT HIỆN về mô hình: xoáy ngang mòn trên đường đi. Ở lực nhẹ và đường dài
    khoảng 40 R, xoáy 0,3 mòn hết trước khi tới băng. Các thế có ê-phê vì vậy
    đều đặt gần băng hoặc dùng lực từ 0,15.
  - Giới hạn: bài 4.4 không mô phỏng được (lõi không có hiện tượng bi cái lệch
    hướng); hình của bài là minh họa và ghi rõ trên hình. Mọi lời giải thích về
    thuận, nghịch trong 27 tình huống đã được đối chiếu với đường đi của mô
    phỏng, chưa đối chiếu với bàn thật.
  - Thế bi tìm bằng dò ngẫu nhiên có hạt giống (công cụ tạm, đã xóa).
  - `Drill.layout` đổi thành `layouts` (mảng) vì bài 6 cần hai sơ đồ.
- [x] Sửa theo góp ý ở điểm dừng 2 (2026-11-25): tách "Đường 90°" và "Đường dự đoán" (D12).
  - `npm run check` đạt: typecheck, 84 test (thêm 3 test quy luật và 4 test cho
    đường dự đoán), `scenarios:check` 57 tình huống, build.
  - Đã tự thử trên `npm run dev` (Đánh tự do và cấp 2): nhãn mới, đường nét đứt
    đổi theo hướng, lực, điểm chạm; ghi chú "đã lăn" và ghi chú "chưa tới được
    bi" hiện đúng lúc; nhóm "không trợ giúp" của cấp 2 không có đường dự đoán.
  - Lưu ý: ngưỡng của test mới đặt trước khi chạy; với đúng nửa bi, cự ly ngắn
    vẫn lệch 12° nên test "sát đường 90°" dùng chạm mỏng hơn (chi tiết ở D12).
  - Người dùng chốt: đường dự đoán bật tắt được, mặc định TẮT. Đã đổi mặc định
    trong lưu trữ và trên bàn; dữ liệu cũ chưa có trường này cũng nhận giá trị tắt.
- [x] Bước 8. Nội dung cấp 5 đến 7 và chế độ đánh chuỗi. Xong 2026-11-25.
  - `npm run check` đạt: typecheck, 98 test (thêm 13 test cho luật chuỗi, vùng
    góc, lưu buổi; 1 test nội dung), `scenarios:check` (84 tình huống, 0 lỗi,
    khoảng 110 giây), build `dist/index.html` 225 kB.
  - Nội dung: mỗi cấp 3 bài Hiểu, 3 nhóm × 3 tình huống, 2 đến 3 bài Tập có sơ
    đồ. Chi tiết và số đo: `docs/LEVELS.md`. Nguồn: `docs/SOURCES.md`.
  - Gom bi: tìm được đủ 18 thế `gather` (cấp 6 và 7) có lời giải bền, nên điều
    kiện dừng của bước 8 không xảy ra. Ghi điểm mà bi còn xa thì không tính đạt.
  - Chế độ Đánh chuỗi và trang Thống kê: xem cuối `docs/LEVELS.md`. Luật vùng
    góc đã tra và ghi ở D8; hiện thực ở `src/app/chain.ts`, có test.
  - Đã tự thử trên `npm run dev`: 9 bài Hiểu; một thế của mỗi nhóm trừ 6B và 7A
    (7 thế, gồm cả trường hợp ghi điểm mà bi tản thì báo chưa đạt); một ván Đánh
    chuỗi 39 lượt rồi lưu; nhập hai buổi bàn thật, kiểm lỗi nhập, xem biểu đồ;
    bật luật vùng góc thì thấy bốn tam giác; 390×844 không tràn ngang.
  - CHƯA thử trên trình duyệt: tình huống phạm luật vùng góc khi đang chơi (mới
    có test đơn vị với đường bi giả lập); 20 thế còn lại của cấp 5 đến 7 (mới
    qua bộ dò); biểu đồ khi có nhiều buổi.
  - Tra cứu: hai điều KHÔNG có nguồn. Cơ chế của cú gom bi (bi thứ nhất đi băng
    rồi về) và cách xử lý bi dạt góc. Bài 6.3, 7.2, 7.3 vì vậy không khẳng định
    kỹ thuật cụ thể, chỉ nêu luật và điều mô phỏng cho thấy. Kích thước vùng góc
    lấy từ Wikipedia, không phải văn bản luật chính thức (PDF không đọc được).
  - Khác PLAN và đơn giản hóa:
    - Cấp 5 nhóm C so "cách nào còn ghi điểm khi ngắm lệch 1°" thay vì "chỉ một
      cách tồn tại", vì dò 300 thế không ra thế nào như vậy. C-03 là C-01 xoay
      nửa vòng.
    - Nhóm "bi trong góc" của cấp 7 không áp luật vùng góc (luật chỉ có ở Đánh
      chuỗi).
    - Đánh chuỗi chỉ có một người tập: sau khi trượt, lượt mới bắt đầu từ thế
      đang có. Sau một lượt kết thúc trong vùng góc, lượt mới được tính như vừa
      vào vùng (luật thật giữ nguyên tình trạng).
    - "Chuỗi" trong lời văn có hai nghĩa gần nhau: chuỗi điểm liên tiếp trong
      một lượt. Bước 9 rà lại thuật ngữ.
  - `scenarios:check` giờ mất gần 2 phút vì bài gom bi phải thử nhiều cú; bộ dò
    đã thử vùng lực nhẹ trước để nhanh hơn (trước là 160 giây).
  - Dữ liệu lưu thêm trường `sessions`; phiên bản dữ liệu vẫn là 1 vì file cũ
    thiếu trường này vẫn nhập được.
- [x] Sửa theo góp ý sau bước 8 (2026-11-25): phân tích cú vừa đánh; đưa bi về thế đầu (D13).
  - `npm run check` đạt: typecheck, 107 test (thêm 9 test cho bộ phân tích),
    `scenarios:check` 84 tình huống, build 232 kB.
  - Đã tự thử trên `npm run dev`: khung phân tích hiện sau khi bi dừng ở hình
    minh họa và ở bài chọn đáp án; nút "Về thế ban đầu"; xem thử lựa chọn khác
    sau khi chọn đúng mà không tăng số lần thử.
  - CHƯA kiểm bằng mắt nhịp chờ 0,7 giây: khung trình duyệt thử nghiệm chạy
    hoạt hình rất chậm khi không hiển thị nên không đo được thời gian.
- [x] Đổi cách chọn lực theo yêu cầu (2026-11-25): kéo cơ sang trái, buông là đánh (D14).
  - Đã tự thử trên `npm run dev` ở 1280×800 bằng thao tác kéo thật: kéo khoảng
    60% rồi buông thì lực ghi 60,0 và bi tự đánh; kéo rồi trả về sát bi thì hủy;
    phím mũi tên và Enter; khung bị khóa khi bi đang lăn.
  - CHƯA thử bằng ngón tay trên điện thoại thật, và chưa nhìn được độ mượt của
    hoạt hình vì khung trình duyệt thử nghiệm đang ẩn.
- [x] Cải thiện chuyển động ra cơ theo góp ý (2026-11-25): mô hình vật lý, có tra cứu (D15).
  - Người dùng chốt giữ hai nút − + và nút Đánh cạnh khung kéo cơ.
  - `npm run check` đạt: typecheck, 116 test (thêm 9 test cho mô hình ra cơ),
    `scenarios:check` 84 tình huống, build.
  - Đã tự thử trên `npm run dev` bằng thao tác kéo thật: trình tự đúng (cơ lao
    tới, bi chạy lúc chạm, cơ theo đà rồi về, cây cơ trên bàn hiện rồi ẩn).
  - CHƯA đánh giá được độ mượt bằng mắt: khung trình duyệt thử nghiệm chỉ chạy
    vài khung hình mỗi giây. Cảm giác thật phải do người dùng thử trên máy và
    điện thoại. Các hằng số nằm một chỗ ở `STROKE` trong `src/table/stroke.ts`.
- [x] Sửa thang lực theo góp ý (2026-11-25): con số lực tỉ lệ với quãng kéo (D16).
  - Người dùng báo: kéo tới 30 mà cú đánh rất nhẹ. Nguyên nhân là thang cấp số
    nhân của D11. Giờ lực hiển thị = phần trăm quãng kéo, power = (lực/100)²;
    nút − + giữ độ mịn 2,4% mỗi lần bấm.
  - `npm run check` đạt: typecheck, 118 test, `scenarios:check` 84 tình huống,
    build. Lời giải của bộ dò không đổi (chỉ đổi cách in con số lực).
  - Đã tự thử trên `npm run dev`: kéo 30% hiện 30,0, kéo 50% hiện 50,0; bấm +
    cho 30,4; cú lực 30 đưa bi cái đi 13 viên bi tới bi vàng và còn đi tiếp
    (thang cũ ở 30 chỉ lăn khoảng 5 viên bi).
  - Sửa kèm: cú ra cơ bị kẹt khi trình duyệt ngừng vẽ khung hình; đã thêm đồng
    hồ dự phòng và thử lại trong đúng tình trạng đó.
  - CHƯA kiểm: cảm giác thật khi kéo bằng tay và trên điện thoại.
- [x] Lực vẫn nhẹ (góp ý lần hai, 2026-11-25): mặc định tỉ lệ thẳng, thêm "Độ mạnh của cơ" trong Cài đặt (D17).
  - `npm run check` đạt: typecheck, 120 test, `scenarios:check` 84 tình huống, build.
  - Đã tự thử trên `npm run dev`: kéo 30% hiện 30,0 và khung phân tích ghi lực
    30,0; Cài đặt có ba mức và lưu được; gợi ý của bài gom bi hiện "khoảng 5" ở
    mức Mạnh và "khoảng 22" ở mức Nhẹ.
  - CHƯA kiểm: cảm giác khi kéo tay thật; các cú rất nhỏ ở mức Mạnh có điều khiển
    nổi bằng tay trên điện thoại không (dự đoán là phải dùng nút − +).
- [x] Hai góp ý nhỏ (2026-11-25): cây cơ trên bàn không vẽ cảnh lùi về (D15); xem lại cú vừa đánh (D18).
  - `npm run check` đạt: typecheck, 120 test, `scenarios:check` 84 tình huống, build.
  - Đã tự thử trên `npm run dev` ở Đánh tự do: đánh một cú (hướng 25°, lực 25,
    trên phải), dòng "Cú vừa đánh" hiện đúng; đặt lại bi thì dòng đó còn, thêm
    đường hướng cũ, vòng điểm chạm cũ và vạch lực cũ; đổi cả ba rồi bấm "Dùng
    lại cú này" thì cả ba về đúng giá trị cũ.
  - CHƯA nhìn được hiệu ứng cây cơ mờ dần trên bàn (khung thử không vẽ khung hình).
- [x] Sửa lại vì hiểu sai (2026-11-25): "Dùng lại cú này" đổi thành "Quay lại trước cú này" (D18).
  - Bản trước chỉ chép hướng, lực, điểm chạm sang thế bi hiện tại; người dùng
    cần trở về đúng thế bi và điều khiển của cú trước để xem lại và chỉnh tiếp.
  - `npm run check` đạt: typecheck, 120 test, `scenarios:check` 84 tình huống, build.
  - Đã tự thử trên `npm run dev`: Đánh tự do (bi về chỗ cũ, hướng 25,0°, lực và
    điểm chạm như cũ, vệt cũ còn, phân tích còn mở; thêm 0,2° thì hiện hướng cũ;
    đánh lại từ đúng thế đó); Đánh chuỗi (số lượt từ 1 về 0 sau khi quay lại);
    tình huống cấp 1 (bi về chỗ cũ, số lần thử giữ nguyên).
- [x] Khóa nút "Quay lại trước cú này" ở Đánh chuỗi theo quyết định của người dùng (2026-11-25, D18).
- [x] Bước 9. Kiểm thử và bàn giao (ĐIỂM DỪNG 3), 2026-11-25
  - `npm run check` đạt: typecheck, 120 test, `scenarios:check` 84 tình huống, build.
  - Thử thủ công trên `npm run dev` ở khung 375x812 và 1280x800: 64 màn hình, 81
    tình huống, lưu, xuất, nhập (kể cả file hỏng), xóa dữ liệu, qua cấp, chuỗi,
    thống kê. Không lỗi.
  - `dist/index.html` mở trực tiếp bằng Edge không giao diện: dựng đủ màn hình.
  - Rà chữ: sửa sáu thông báo lỗi nội bộ viết không dấu; thuật ngữ nhất quán.
  - Viết `docs/HANDOVER.md`: đã kiểm gì, chưa kiểm gì, giới hạn đã biết.
  - Sự cố khi thử: tôi làm mất bản lưu tạm dữ liệu của khung thử trong app
    Claude (cổng 5173), nên sổ tập, tình huống đã đạt và các buổi ở khung đó đã
    bị xóa; cài đặt giữ nguyên. Trình duyệt khác không bị ảnh hưởng.
- [x] Sau bàn giao (2026-11-25): kéo bi để xếp thế ở Đánh tự do (D19).
  - Thêm `src/table/arrange.ts`, chế độ xếp trong `shotTable`, nút "Xếp bi" ở Đánh tự do.
  - Phát hiện và chặn lỗi có sẵn của lõi vật lý khi bi nằm đúng sát băng (D19).
  - `npm run check` đạt (số liệu ở báo cáo cuối lượt).
  - Đã tự thử trên `npm run dev` bằng chuột: kéo bi cái đè lên bi vàng thì dừng
    sát bên; kéo bi đỏ ra ngoài góc thì dừng ở góc; kéo chỗ trống không làm gì;
    xong thì ngắm và đánh được; "Đặt lại" về đúng thế vừa xếp; "Về thế mặc định" chạy.
  - CHƯA kiểm: kéo bằng ngón tay trên điện thoại thật.

## Việc còn mở

- ĐIỂM DỪNG 3: chờ người dùng dùng thử bản bàn giao và phản hồi.
- Các mục "Chưa kiểm" trong `docs/HANDOVER.md`, trước hết là chạm tay trên điện
  thoại thật và đối chiếu mô phỏng với bàn thật.
- Lõi không có squirt: bài 4.4 "Cái giá của ê-phê" chỉ có hình minh họa (D9).
