# Nhật ký quyết định

Mỗi quyết định: bối cảnh, lựa chọn, lý do, hệ quả. Thêm mục mới ở cuối.

## D1. Lõi vật lý: dùng tailuge/billiards (hướng B)

- Bối cảnh: ba hướng được cân nhắc. A: tự viết vật lý 2D. B: dùng lõi có sẵn,
  tự làm lớp dạy học. C: chỉ làm sổ tập, không có mô phỏng tự đánh.
- Chọn: B. Người dùng chốt ngày 2026-11-25.
- Lý do: mục tiêu là gom bi và đánh chuỗi, phụ thuộc nhiều vào lực, băng, xoáy.
  Mô phỏng sai sẽ tạo thói quen sai. Phần bật băng có xoáy là bài toán khó mà
  upstream đã đầu tư nhiều năm.
- Hệ quả: dự án phải theo GPL-3.0 (xem D2). Chỉ lấy lõi vật lý, không lấy giao
  diện 3D, chơi mạng, luật pool và snooker.
- Đã kiểm: lõi chạy không cần giao diện trên bàn libre 3 bi; kết quả đổi theo
  điểm chạm. CHƯA kiểm độ đúng của từng con số (việc của bước 2).

## D2. Giấy phép GPL-3.0-or-later

- Bối cảnh: `LICENSE`, `package.json` và README của upstream đều ghi GPL-3.0
  (trang itch.io của tác giả ghi LGPL, nhưng kho mã là nguồn chính).
- Hệ quả: dùng cá nhân thì không ảnh hưởng. Nếu phát hành cho người khác, toàn bộ
  app phải công khai mã nguồn theo GPL-3.0. Cần ý kiến pháp lý trước khi thương
  mại hóa.

## D3. Công nghệ

- TypeScript + Vite, giao diện 2D bằng SVG, không dùng framework giao diện.
- Phụ thuộc chạy: chỉ `three` (dùng lớp `Vector3` mà lõi vật lý cần).
- Đóng gói một file bằng `vite-plugin-singlefile`.
- Lý do: KISS. App một người dùng, không backend. Lõi vật lý vốn là TypeScript.
- Ghi chú: người dùng quen React/Vite + Supabase. Nếu khung app ở bước 5 trở nên
  rối khi không có framework, đề xuất lại với người dùng trước khi thêm.

## D4. Lưu trữ

- `localStorage`, bọc try/catch, có xuất/nhập JSON. Không máy chủ.

## D5. Lộ trình 7 cấp

- Người dùng yêu cầu bỏ cấp "Làm quen" (luật) và cấp "Tư thế và cơ thẳng".
- Hệ quả đã báo người dùng: app không phân biệt được ngắm sai với đưa cơ lệch.

## D6. Cấp 4 có bài "9 điểm chạm"

- Người dùng yêu cầu cấp băng và ê-phê bao gồm điểm chạm kết hợp (trên trái,
  dưới phải...). Từ cấp 4, điểm chạm được chấm tự do trên mặt bi cái.

## D7. Qua cấp dựa trên bàn thật

- Ngưỡng mặc định 7/10 cho mỗi bài tập bàn thật (bài 6 của cấp 4 là 6/10), chỉnh
  được trong cài đặt. Mô phỏng không chặn lên cấp.

## D8. Luật vùng góc

- Bối cảnh: luật thi đấu phăng giới hạn số điểm ghi liên tiếp khi hai bi mục tiêu
  nằm trong góc; chơi phong trào thường bỏ qua. Là tùy chọn, mặc định tắt.
- Luật đã tra (bước 8, 2026-11-25) và cách app hiện thực (`src/app/chain.ts`):
  - **Hình dạng:** mỗi góc bàn có một tam giác, cạnh dọc băng dài 71 cm và cạnh
    dọc băng ngắn 35,5 cm trên bàn thi đấu 2,84 m × 1,42 m, tức 1/4 chiều dài và
    1/4 chiều rộng mặt chơi. App dùng đúng tỉ lệ 1/4 này.
  - **Chỉ tính hai bi mục tiêu** (bi vàng và bi đỏ); vị trí bi cái không tính.
  - **Trình tự:** khi cả hai bi mục tiêu dừng trong cùng một vùng góc sau khi ở
    chỗ khác (hoặc sau khi một bi ra rồi vào lại) thì là "vào vùng" (entré).
    Người chơi được ghi một điểm mà cả hai bi vẫn ở trong (dedans). Cú kế tiếp
    phải đưa ít nhất một bi mục tiêu ra khỏi vùng; bi đó được phép quay lại ngay,
    khi ấy tính là vào vùng lần mới.
  - **Phạm luật:** nếu không bi nào ra, điểm không được tính và hết lượt.
  - **Bi nằm đúng trên vạch:** tính bất lợi cho người đánh, tức là trong vùng.
- Nguồn: điều 41, 52 đến 54 và 61 của bản luật carom kiểu CEB/UMB đăng ở
  https://ebc-billiard.com/rules/carom (trình tự, bi trên vạch, phạm luật);
  https://nl.wikipedia.org/wiki/Libre_(biljarten) và
  https://de.wikipedia.org/wiki/Freie_Partie (kích thước 71 × 35,5 cm).
- Giới hạn của việc tra cứu:
  - Kích thước 71 × 35,5 cm lấy từ Wikipedia tiếng Hà Lan và tiếng Đức, không phải
    từ văn bản chính thức: mọi file PDF luật của CEB, KNBB, FFB, UMB đều không
    đọc được. Bản luật đọc được chỉ nói vùng được vẽ theo một sơ đồ kèm theo.
  - Luật kiểu Mỹ (crotch) cho ba điểm trước khi phải đưa bi ra; app theo luật
    kiểu châu Âu.
  - Bàn nhỏ và hạng thấp dùng vùng góc khác (ví dụ tam giác cân cạnh 17 cm); app
    chỉ có một kiểu vùng.
  - Không tìm được nguồn nào viết thẳng rằng chơi phong trào bỏ qua luật này; có
    dấu hiệu là hạng thấp dùng vùng nhỏ hơn hoặc không dùng.
- Đơn giản hóa trong app:
  - Tính theo tâm bi lúc bi dừng. Một bi mục tiêu "ra khỏi vùng" khi tâm của nó
    nằm ngoài tam giác tại bất kỳ thời điểm lấy mẫu nào trong cú đánh.
  - Sau một lượt kết thúc (trượt hoặc phạm luật) mà hai bi vẫn trong vùng, lượt
    mới được tính như vừa vào vùng. Luật thật giữ nguyên tình trạng cho người
    đánh kế tiếp; app chỉ có một người tập nên chọn cách dễ hơn.

## D9. Lớp bọc vật lý: thang lực, điểm chạm, bước thời gian (bước 2, 2026-11-25)

- **Cấu hình lõi:** gọi đúng như upstream gọi cho luật `libre` (đã đối chiếu mã
  upstream tại commit `555bc72`): `TableGeometry.configureForRule("libre")`, mô
  hình băng mặc định `bounceHanBlend`, không đổi hằng số nào, bước thời gian cố
  định 1/512 giây (bằng `Container.step` của upstream).
- **Đơn vị:** API của engine dùng bán kính bi. Mặt chơi 92,36 × 46,18 R (tỉ lệ
  2:1), tâm bi đi được trong ±45,18 × ±22,09 R. Lõi dùng R = 32,75 mm, lớn hơn
  bi carom thật (30,75 mm); vì mọi thứ tính theo R nên hình học đúng tỉ lệ, chỉ
  quãng đường quy ra mét là dài hơn thật khoảng 6,5%.
- **Thang lực:** `power` 0..1 tuyến tính sang tốc độ, 1,0 = `maxPower` của
  upstream = 160 R/giây (5,24 m/s). Lý do: dùng lại giới hạn mà tác giả lõi đã
  cân chỉnh thay vì tự đặt số mới. Đo được với bi cái một mình, chạm giữa tâm,
  đánh dọc bàn:

  | power | quãng đường (chiều dài bàn) | số băng |
  |---|---|---|
  | 0,05 | 0,18 | 0 |
  | 0,1 | 0,56 | 1 |
  | 0,2 | 1,22 | 1 |
  | 0,3 | 1,77 | 2 |
  | 0,5 | 2,62 | 3 |
  | 0,75 | 3,71 | 4 |
  | 1,0 | 4,51 | 5 |

  Hệ quả: phần lớn cú đánh phăng nằm trong khoảng power 0,05 đến 0,3. Cách
  thanh lực chia nấc: xem D11. Nếu người dùng thấy 1,0 quá mạnh hoặc
  quá yếu so với bàn thật, chỉ cần đổi `MAX_SPEED_MPS` (và dò lại tình huống).
- **Điểm chạm:** `tip` được kéo về trong vòng tròn đơn vị; `tip` = 1 ứng với lệch
  0,45 R (`offCenterLimit` của upstream).
- **Dấu trục đã xác minh bằng test:** `tip.y` cùng dấu với `offset.y` của lõi
  (dương = trên tâm, bi lăn theo). `tip.x` NGƯỢC dấu với `offset.x` của lõi: lõi
  coi `offset.x` dương là xoáy trái. Engine đảo dấu để `tip.x` dương = xoáy phải
  (đâm thẳng băng thì bật sang phải người đánh), đúng như
  `docs/SCENARIO_FORMAT.md`.
- **Lõi không mô phỏng:** lệch hướng bi cái do ê-phê (squirt) và đường cong do
  nâng đuôi cơ. Bi cái luôn xuất phát đúng hướng ngắm. Ảnh hưởng tới bài 4.4.

## D10. Sai lệch của mô hình so với quy luật dạy học (đo ở bước 2)

Các quy luật trong `tests/engine.laws.test.ts` đều đạt ở điều kiện thông thường.
Ba chỗ mô hình lệch khỏi cách diễn đạt đơn giản, cần nhớ khi soạn nội dung:

1. **Chạm dày thì góc tách nhỏ hơn 90°.** Không xoáy, cự ly ngắn: lệch tâm 1 R
   (nửa bi) tách 81 đến 84°; 1,4 R: 84 đến 86°; 1,8 R: 86 đến 88°; nhưng lệch
   0,5 R (khoảng 3/4 bi) chỉ 75 đến 78°. Nguyên nhân: va chạm bi trong lõi không
   đàn hồi hoàn toàn, bi cái còn giữ một phần tốc độ tới. Ảnh hưởng: cấp 2 không
   nên dựng tình huống "đúng 90°" với chạm dày hơn nửa bi.
2. **Xoáy nghịch ở góc sượt không làm góc bật dựng hơn.** Góc tới đo từ pháp
   tuyến của băng, power 0,3, góc bật (nghịch mạnh / nghịch vừa / không xoáy):
   30°: 4 / 16 / 24; 45°: 26 / 35 / 38; 50°: 34 / 43 / 44; 55°: 44 / 50 / 49;
   60°: 52 / 57 / 55; 70°: 69 / 71 / 67. Tức là tới khoảng 45° thì xoáy nghịch
   dựng góc rõ; từ khoảng 55° trở lên (bi đi sượt dọc băng) xoáy nghịch gần như
   không đổi góc, có khi rộng hơn 2 đến 4°. Xoáy thuận thì luôn mở góc ở mọi góc
   tới. Ảnh hưởng: tình huống cấp 4 về xoáy nghịch (nhóm A, D, H) chỉ dựng với
   góc tới không quá 45° từ pháp tuyến.
3. **Kéo lùi yếu khi đánh nhẹ.** Bi cái cách bi mục tiêu 4 R, power 0,2: chạm
   dưới tâm 0,5 thì bi cái gần như dừng tại chỗ; 0,8 lùi 1,4 R; 1,0 lùi 6,3 R.
   Hợp với thực tế (xoáy lùi mất dần trên đường đi) nhưng tình huống cấp 3 cần
   cho lực đủ lớn.

Chưa đối chiếu với bàn thật. Mọi con số trên là của mô hình.

## D11. Thanh lực theo cấp số nhân; "lời giải bền" tính theo bước của giao diện (bước 4, 2026-11-25)

- Bối cảnh: ở bước 3 thanh lực là số nguyên 1..100 đổi sang power theo bình
  phương. Bộ dò ở bước 4 cho thấy cách này quá thô ở vùng nhẹ: quanh nấc 20 mỗi
  nấc đổi lực 10%, tức khoảng 20% quãng đường, nên bài "bi dừng trong ô" gần
  như không có lời giải bền.
- Chọn: thanh lực 1..100, bước 0,5, đổi sang power theo cấp số nhân (nấc 1 =
  0,01; nấc 100 = 1). Mỗi nấc tăng lực khoảng 4,8%; mỗi bước 0,5 khoảng 2,4%,
  tức khoảng 5% quãng đường lăn, đều nhau ở mọi vùng lực. Thêm nút − và + cạnh
  thanh lực để chỉnh từng bước. (Thanh trượt đã được thay bằng khung kéo cơ ở
  D14; thang lực và hai nút giữ nguyên.) Mặc định nấc 50 (power 0,1). Mã ở
  `src/table/power.ts`.
- Lời giải bền: còn đạt khi lệch hướng ±0,3° và lệch một bước thanh lực về mỗi
  phía. Lý do: người học chỉnh hướng theo bước 0,1° và lực theo bước 0,5 nấc,
  nên một lời giải chỉ đúng ở đúng một vị trí là không công bằng.
- Hệ quả cho cấp 1: ô đích cần bán kính cỡ 12% quãng đường trở lên thì mới có
  ba vị trí thanh lực liên tiếp cùng đạt (ví dụ ô 5 R ở cách 40 R).
- Công cụ: `scripts/check-scenarios.ts` chạy bằng `node` (Node 22.18 trở lên tự
  bỏ kiểu TypeScript) và nạp mã dự án qua máy chủ Vite không mở cổng, nên không
  thêm phụ thuộc nào.

## D12. Tách "Đường 90°" khỏi "Đường dự đoán" (2026-11-25)

- Bối cảnh: người dùng báo trợ giúp "Đường 90°" gây hiểu lầm. Nó chỉ đúng khi bi
  cái còn trượt lúc chạm, nhưng app vẽ nó như thể đó là đường bi cái sẽ đi. Số đo
  ở bước 6 cũng cho thấy cú giữa tâm luôn lệch về trước đường này 4° đến 15°.
- Chọn:
  1. Đổi nhãn thành "Đường 90° (khi bi cái còn trượt)". Vẫn vẽ bằng nét chấm.
  2. Thêm trợ giúp "Đường dự đoán (bi cái sẽ đi thật)", nét đứt. App gọi engine
     mô phỏng cú đang chọn (hướng, lực, điểm chạm) và vẽ đường bi cái từ chỗ chạm
     bi đầu tiên tới sự kiện kế tiếp của bi cái (băng hoặc bi). Cập nhật mỗi khi
     đổi ngắm, lực hoặc điểm chạm; nhiều thay đổi liên tiếp được gộp vào một
     khung hình. Mã ở `src/table/predict.ts`.
  3. Khi bi cái đã lăn lúc chạm, hiện ghi chú "Bi cái đã lăn khi chạm nên sẽ đi
     quá về phía trước đường 90°." Engine báo điều này qua trường `aRolling` của
     sự kiện chạm bi (trạng thái Rolling của lõi ngay trước va chạm).
  4. Thêm test quy luật: cùng một thế đánh xéo, cự ly ngắn thì sát đường 90°,
     cự ly dài với lực vừa thì lệch về trước.
- Quyết định kèm theo (tôi tự chọn, người dùng chưa duyệt):
  - Đường dự đoán chỉ vẽ chặng đầu sau va chạm, dừng ở băng hoặc bi kế tiếp. Lý
    do: vẽ cả đường qua băng sẽ làm các bài "bi, băng, bi" của cấp 4 thành bài
    chỉ việc dò cho đường trúng bi đỏ.
  - Bật tắt được, MẶC ĐỊNH TẮT (người dùng chốt ngày 2026-11-25; bản đầu tôi để
    mặc định bật). Bật tắt ngay trên bàn trong mục Trợ giúp ngắm, hoặc đặt mặc
    định trong Cài đặt. Tình huống có thể ép tắt bằng `aids.predictedPath`;
    nhóm "Tự ngắm, không trợ giúp" của cấp 2 ép tắt. Khi người học tự bật, các
    bài ghi điểm trực tiếp dễ hơn: dò hướng tới khi đường nét đứt đi qua bi đỏ.
  - Ghi chú "đã lăn" vẫn hiện khi chỉ bật Đường 90°, vì nó giải thích tại sao
    đường 90° lúc đó không đúng.
  - Thêm ghi chú thứ hai "Với lực này bi cái chưa tới được bi mục tiêu." khi
    đường ngắm chỉ vào một bi mà mô phỏng cho thấy bi cái dừng trước khi tới.
- Giới hạn:
  - Ghi chú "đã lăn" dựa trên trạng thái Rolling của lõi. Bi còn trượt nhưng đã
    gần lăn thì không có ghi chú, dù vẫn lệch khỏi đường 90°; đường dự đoán thì
    luôn đúng với mô phỏng.
  - Test "sát đường 90°" (dưới 10°) chỉ đặt cho chạm mỏng hơn nửa bi (lệch tâm
    1,4 R: đo được 3,6°). Với đúng nửa bi, cự ly ngắn đã lệch khoảng 12° (giới
    hạn chạm dày ở D10 mục 1), nên ở đó test chỉ kiểm chiều thay đổi: cự ly dài
    lệch nhiều hơn cự ly ngắn ít nhất 5° (đo được 12° và 21°).
  - "Đúng" ở đây là đúng với mô phỏng, chưa đối chiếu với bàn thật.

## D13. Phân tích cú vừa đánh; đưa bi về thế đầu trước mỗi cú mới (2026-11-25)

- Bối cảnh: người dùng góp ý sau bước 8. (1) Cần một chức năng phân tích kết quả
  vừa đánh để hiểu tại sao có kết quả đó. (2) Đã đánh "Đầy" mà muốn đánh "3/4 bi"
  thì bi phải về trạng thái ban đầu trước; tương tự ở các bàn mô phỏng khác.
- Kiểm trước khi sửa: cú mới vốn đã bắt đầu từ thế đầu, nhưng app nhảy thẳng vào
  cú mới nên người xem không kịp thấy bi về chỗ cũ; và trong bài chọn đáp án,
  sau khi chọn đúng thì các lựa chọn bị khóa, phải bấm "Thử lại" mới xem được
  cách khác.
- Chọn, phần phân tích (`src/table/analysis.ts`, có test):
  - Mỗi bàn có khung "Phân tích cú vừa đánh" (mặc định đóng, bấm để mở), hiện
    sau khi bi dừng ở Đánh tự do, Đánh chuỗi, tình huống và hình minh họa.
  - Nội dung là các câu dựng từ số đo của chính cú đó: lực và điểm chạm; quãng
    đường tới bi đầu tiên và bi cái còn trượt hay đã lăn; độ dày chạm và góc bi
    mục tiêu chạy lệch; hai bi chia tốc độ thế nào; bi cái rời đi sát, trước hay
    sau đường 90° và vì sao; góc tới và góc bật ở băng đầu tiên; kết quả (ghi
    điểm, hoặc lúc gần nhất còn cách bi kia bao xa); độ tản của ba bi.
  - Tác dụng của xoáy ngang ở băng được xác định bằng cách mô phỏng thêm một cú
    y hệt nhưng không xoáy ngang rồi so góc bật, không suy từ quy tắc. Nhờ vậy
    câu "ở đây là xoáy thuận" hay "xoáy đã mòn trên đường đi" luôn khớp mô phỏng.
- Chọn, phần đưa bi về thế đầu (`src/table/shotTable.ts`):
  - Khi bàn vừa quay về thế đầu mà người xem chưa kịp nhìn, bàn giữ thế đó cho
    đủ 0,7 giây rồi mới cho bi chạy. Nếu người học đã nhìn thế đầu lâu hơn thế
    (ví dụ vừa chỉnh ngắm) thì không chờ thêm. Đánh tự do và Đánh chuỗi không áp
    dụng vì ở đó bi nằm lại chỗ dừng là có chủ ý.
  - Hình minh họa có thêm nút "Về thế ban đầu".
  - Bài chọn đáp án có cú đánh: sau khi chọn đúng vẫn bấm được các lựa chọn khác
    để xem thử; không tính thêm lần thử.
- Giới hạn:
  - Phân tích nói về mô phỏng, không phải bàn thật. Số "chia tốc độ" đo trong
    0,04 giây ngay sau va chạm nên chỉ là gần đúng; nửa bi cho khoảng 76% và 46%,
    thấp hơn con số lý thuyết 87% và 50% (bài 2.3 đã ghi chú).
  - Phân tích chỉ xét bi cái: lần chạm bi đầu tiên và băng đầu tiên. Nó không
    giải thích các va chạm sau đó, cũng không gợi ý cách sửa cú đánh.
  - Ý thứ hai của người dùng có thể hiểu theo hai cách (lỗi cần sửa, hoặc yêu
    cầu về cách hiển thị). Tôi làm theo cách hiểu thứ hai sau khi kiểm thấy
    không có lỗi về vị trí bi. Người dùng đã xác nhận đúng ý (2026-11-25).

## D14. Chọn lực bằng cách kéo cơ, buông là đánh (2026-11-25)

- Bối cảnh: người dùng yêu cầu bỏ thanh trượt lực 1 đến 100. Thay vào đó là một
  cây cơ kéo từ phải sang trái: kéo càng xa càng mạnh, kéo hết cỡ là 100%, phải
  mượt và giống thật hơn; kéo rồi buông là bi tự đánh, không cần bấm Đánh.
- Chọn (`src/table/cuePull.ts`):
  - Khung kéo cơ nằm chỗ thanh trượt cũ: viên bi ở bên phải, cây cơ nằm ngang,
    đầu cơ chạm bi. Đặt tay vào khung, kéo sang trái là lui cơ; số lực hiện ngay
    phía trên và cập nhật liên tục. Buông tay thì cơ lao tới viên bi (90 mili
    giây) rồi cú đánh bắt đầu.
  - Hành trình kéo bằng 78% bề rộng khung và tính từ chỗ đặt tay, nên đặt tay ở
    đâu trong khung cũng được; kéo hết hành trình là 100.
  - Trong lúc kéo, cây cơ cũng hiện trên bàn phía sau bi cái theo hướng đang
    ngắm và lui theo tay; đường dự đoán (nếu bật) cập nhật theo lực.
  - Kéo dưới 3% hành trình rồi buông thì coi như hủy: không đánh, lực quay về giá
    trị trước đó. Đây cũng là cách đổi ý: kéo trả cơ về sát viên bi rồi buông.
  - Thang lực giữ nguyên (D11): 1 đến 100 theo cấp số nhân, làm tròn nửa nấc.
    Vì vậy lời giải của bộ dò và mọi con số lực trong gợi ý vẫn đúng.
- Giữ lại bên cạnh (người dùng đã đồng ý giữ, 2026-11-25):
  - Hai nút − và + chỉnh từng nửa nấc và nút Đánh đánh với lực đang ghi. Lý do:
    khung rộng khoảng 300 px thì mỗi nấc chỉ là 2 đến 3 px tay kéo; bài cấp 1 và
    bài gom bi có cửa sổ lực chỉ một hai nấc, và bộ dò coi lời giải là bền khi
    lệch nửa nấc vẫn đạt. Không có nút tinh chỉnh thì những bài đó thành may rủi.
  - Bàn phím: mũi tên trái, phải chỉnh nửa nấc; Enter hoặc phím cách để đánh.
  - Khi tình huống khóa lực thì không có khung kéo cơ, chỉ có nút Đánh.
- Giới hạn:
  - Chưa thử bằng ngón tay trên điện thoại thật. Trên màn hình hẹp, đặt tay sát
    mép trái thì không đủ chỗ kéo hết hành trình; phải đặt tay gần viên bi.
  - Chỉ quãng kéo quyết định lực; tốc độ kéo và tốc độ buông tay không tính.

## D15. Chuyển động ra cơ theo mô hình vật lý (2026-11-25)

- Bối cảnh: sau D14 người dùng nhận xét cú ra cơ chưa có cảm giác thật, yêu cầu
  nghiên cứu thêm và cải thiện. Bản đầu cho cơ lao tới viên bi trong đúng 90 mili
  giây với mọi mức lực, không theo đà, rồi cú đánh mới bắt đầu.
- Điều tra cứu được (nguồn ở cuối mục):
  - Tốc độ bi cái / tốc độ cơ lúc chạm giữa tâm = (1 + e) / (1 + m_bi / m_cơ),
    với độ nảy đầu cơ da e khoảng 0,73 (đo bằng quay phim tốc độ cao). Cơ carom
    500 g và bi 210 g cho tỉ số khoảng 1,22; cơ giữ lại khoảng 0,48 tốc độ.
  - Cú ra cơ thật KHÔNG tăng tốc đều. Gia tốc tăng dần, đạt đỉnh trước khi chạm
    và gần về 0 lúc chạm: cơ chạm bi ở tốc độ lớn nhất. Mô hình "con lắc": tốc độ
    theo nửa đường cosin, thời gian ra cơ = 2 × quãng lui / tốc độ lúc chạm.
  - Quãng lui dài hơn cho cú mạnh hơn (khoảng 18 cm ở cú vừa, khoảng 30 cm ở cú
    rất mạnh). Suy ra thời gian ra cơ: cú nhẹ 0,5 đến 0,7 giây, cú vừa 0,3 đến
    0,4 giây, cú mạnh 0,2 giây trở xuống.
  - Đầu cơ chạm bi chỉ khoảng 1 mili giây. Theo đà dài cỡ 0,8 quãng lui (đo được
    14 cm với quãng lui 18 cm); cơ dừng lại êm trong 0,1 đến 0,2 giây.
  - Người đánh tốt giữ cơ đứng yên sau cú đánh, không giật về ngay.
- Chọn (`src/table/stroke.ts`, có test; `src/table/cuePull.ts`):
  - Cơ đi theo mô hình con lắc: khởi động êm, tăng tốc dần, đạt tốc độ lớn nhất
    đúng lúc chạm bi. Thời gian ra cơ tính từ quãng kéo và lực: kéo hết cỡ mất
    0,14 giây, cú vừa khoảng 0,35 giây, cú nhẹ tới 0,45 giây.
  - Bi bắt đầu chạy ĐÚNG lúc đầu cơ chạm, không phải sau khi hoạt hình xong.
    Viên bi trong khung kéo cơ bị đẩy đi lúc đó, nhanh hơn với cú mạnh hơn.
  - Sau khi chạm, cơ còn 48% tốc độ, theo đà một đoạn, đứng yên 0,22 giây rồi
    mới về chỗ nghỉ trong 0,35 giây.
  - Cây cơ trên bàn chuyển động khớp với khung kéo cơ cho tới hết đoạn theo đà,
    rồi mờ đi tại chỗ trong 0,16 giây. Nó không vẽ cảnh cơ lùi về (người dùng
    yêu cầu bỏ, 2026-11-25); chỉ khung kéo cơ mới về chỗ cũ để kéo cú sau.
  - Cú đánh được mô phỏng sẵn ngay lúc buông tay (mất 10 đến 14 mili giây trên
    máy thử), để lúc chạm bi không có khung hình nào bị khựng. Ở bản trước việc
    này xảy ra đúng lúc chạm.
  - Kéo quá hết hành trình thì cơ nhích thêm một chút rồi cứng lại; lực vẫn 100.
  - Điện thoại có hỗ trợ thì rung nhẹ lúc chạm, mạnh hơn với cú mạnh hơn.
- Chỗ cố ý khác thực tế:
  - Thời gian ra cơ bị kẹp trong 0,12 đến 0,45 giây. Cú rất nhẹ ngoài đời còn
    chậm hơn, nhưng chờ lâu hơn nửa giây sau khi buông tay thì khó chịu.
  - Theo đà trên màn hình bị giới hạn ở 18% hành trình vì hết chỗ trong khung.
  - Không có nhịp dừng cuối quãng lui: người dùng tự điều khiển quãng lui bằng tay.
  - Chỉ quãng kéo quyết định lực; tốc độ tay kéo và lúc buông không tính.
- Nguồn (tra ngày 2026-11-25; viết tắt DD = https://drdavepoolinfo.com):
  DD/technical_proofs/new/TP_A-30.pdf (tỉ số tốc độ, phần cơ giữ lại);
  DD/technical_proofs/new/TP_B-4.pdf (các mô hình ra cơ, thời gian);
  DD/technical_proofs/new/TP_A-9.pdf (đo gia tốc kế trên cơ của một tuyển thủ ba
  băng); DD/faq/stroke/acceleration/ ; DD/faq/stroke/follow-through/ ;
  DD/faq/cue-tip/contact-time/ ; DD/faq/speed/typical/ ; DD/faq/stroke/pause/ ;
  https://commons.nmu.edu/isbs/vol38/iss1/58 (quãng lui 17,8 cm, theo đà 14 cm,
  tốc độ đầu cơ 1,51 m/s; ba con số này lấy từ đoạn trích kết quả tìm kiếm,
  trang tóm tắt chỉ xác nhận có nghiên cứu).
- Giới hạn của việc tra cứu: số liệu là của bida lỗ, trừ bản đo gia tốc kế.
  Tỉ số 1,22 và 0,48 là tôi tính từ công thức với khối lượng cơ và bi carom,
  giả định đầu cơ carom nảy như đầu cơ bida lỗ. Một số con số đọc từ đồ thị,
  sai số cỡ 20%.

## D16. Con số lực tỉ lệ với quãng kéo; độ mịn giao cho nút − và + (2026-11-25)

- Bối cảnh: người dùng kéo cơ tới 30 và thấy cú đánh rất nhẹ, khó chịu. Nguyên
  nhân là thiết kế, không phải cảm giác: con số lực đang là "nấc" của thang cấp
  số nhân ở D11 (đặt ra để chỉnh mịn cú nhẹ), nên 30 chỉ cho 3,8% tốc độ tối đa
  và 50 mới cho 10%. Với một cây cơ kéo bằng tay thì con số đó trái trực giác.
- Chọn (`src/table/power.ts`):
  - **Lực hiển thị** 0 đến 100 = phần trăm quãng kéo, và power = (lực / 100)².
    Kéo 30 cho 9% tốc độ tối đa (trước là 3,8%): bi lăn khoảng nửa bàn. Kéo 50
    cho 25%, kéo 70 cho 49%, kéo hết là 100%. Mặc định khi mở bàn là 30.
  - Vì sao bình phương chứ không tuyến tính: tuyến tính thì toàn bộ các cú nhỏ
    của phăng (lực dưới 10% tốc độ tối đa) dồn vào 10% đầu của quãng kéo, không
    điều khiển được bằng tay. Số đo ở D15 cũng cho thấy ngoài đời tốc độ tăng
    nhanh hơn quãng lui (quãng lui 18 cm cho khoảng 1,2 m/s, 30 cm cho trên 4 m/s).
  - **Độ mịn** không còn nằm trong con số. Hai nút − và + đổi lực 2,4% mỗi lần
    bấm ở mọi vùng lực (đúng bằng nửa nấc của thang cũ), con số hiện một chữ số
    thập phân (30,0 rồi 30,4). Bộ dò lời giải vẫn làm việc trên thang cũ và vẫn
    coi lời giải là bền khi lệch một lần bấm còn đạt, nên 84 tình huống đã kiểm
    không đổi.
  - Các con số lực trong gợi ý đã đổi sang thang mới (ví dụ "khoảng 34" thành
    "khoảng 22"). Khung phân tích và báo cáo của `scenarios:check` cũng in theo
    thang mới. Các từ "nấc", "nửa nấc" trong lời văn đã bỏ.
- Hệ quả:
  - Cú nhỏ nằm ở vùng lực 14 đến 25, tức 32 đến 58 px tay kéo trên khung 230 px:
    kéo tay cho ước lượng, bấm − + cho chính xác.
  - Thời gian ra cơ (D15) tự nhiên hơn với thang này: kéo hết 0,14 giây, kéo 50
    là 0,28 giây, kéo 30 trở xuống chạm trần 0,45 giây.
- Kèm theo: cú ra cơ có đồng hồ dự phòng. Nếu trình duyệt tạm ngừng vẽ khung
  hình (tab bị ẩn), cú đánh vẫn nổ đúng giờ và khung kéo cơ không bị kẹt ở trạng
  thái đang ra cơ. Phát hiện lỗi kẹt này khi thử trong khung trình duyệt bị ẩn.
- Thay thế phần "thang lực" của D11 và D14 ở mặt hiển thị; thang cấp số nhân của
  D11 còn dùng nội bộ cho nút tinh chỉnh, bộ dò, và dữ liệu hình minh họa.

## D17. Lực tỉ lệ thẳng với quãng kéo là mặc định; độ mạnh của cơ chọn được (2026-11-25)

- Bối cảnh: sau D16 (lực = bình phương quãng kéo) người dùng vẫn thấy nhẹ. Đây
  là lần thứ hai, nên thay vì đoán tiếp một đường cong, tôi chọn mức mạnh nhất
  còn hợp lý làm mặc định và cho người dùng tự chỉnh.
- Chọn (`src/table/power.ts`, cài đặt `cueCurve`):
  - power = (lực / 100) ^ số mũ, số mũ chọn trong Cài đặt, mục "Kéo cơ":
    - 1, "Mạnh", MẶC ĐỊNH: con số bằng đúng phần trăm lực tối đa. Kéo 30 là 30%
      (bi đi gần hai chiều dài bàn), kéo 50 là 50%.
    - 1,5, "Vừa": kéo 30 là 16%, kéo 50 là 35%.
    - 2, "Nhẹ, dễ chỉnh cú nhỏ": kéo 30 là 9%, kéo 50 là 25% (chính là D16).
  - Kéo hết cỡ luôn là 100% ở mọi lựa chọn. Lực mặc định khi mở bàn là 10% lực
    tối đa, hiện thành con số nào tùy lựa chọn.
  - Con số lực trong gợi ý được ghi trong dữ liệu dưới dạng `{{luc:0.0464}}` và
    đổi ra con số hiển thị lúc vẽ (`fillForce`), nên gợi ý luôn khớp với con số
    trên màn hình dù chọn mức nào.
  - Thời gian ra cơ (D15) giờ tính từ lực thật chứ không từ quãng kéo trên màn
    hình: quãng lui thật = 30 cm × lực^0,4 (khớp hai số đo 18 cm ở 1,2 m/s và
    30 cm ở 4,3 m/s). Nhờ vậy cú nhẹ vẫn ra cơ chậm, cú mạnh vẫn nhanh, ở mọi
    lựa chọn. Nếu tính từ quãng kéo thì với mức "Mạnh" mọi cú đều mất 0,14 giây.
  - Ngưỡng hủy cú kéo giảm từ 3% xuống 1,5% quãng kéo.
- Người dùng thử mức "Mạnh" và xác nhận lực đã đủ (2026-11-25).
- Cái giá của mức "Mạnh", đã ghi ngay dưới ô chọn trong Cài đặt:
  - Các cú rất nhỏ của cấp 6 và 7 (lực 2% đến 5% lực tối đa) nằm ở 2 đến 5 trên
    100, tức 5 đến 12 px tay kéo. Kéo tay chỉ còn để ước lượng; phải dùng nút −
    và + (mỗi lần 2,4%) mới chính xác. Gợi ý của các bài đó hiện "khoảng 5 trên
    100" ở mức này và "khoảng 22 trên 100" ở mức "Nhẹ".
  - Bộ dò lời giải không phụ thuộc lựa chọn này (nó làm việc trên lực thật), nên
    mọi tình huống vẫn giải được ở cả ba mức.

## D18. Quay lại trước cú vừa đánh để xem lại và chỉnh tiếp (2026-11-25)

- Bối cảnh: người dùng yêu cầu, ngoài bước đặt lại bi, phải xem lại được hướng
  vừa ngắm, lực vừa đánh và điểm chạm.
- Bản đầu của tôi HIỂU SAI: tôi làm nút "Dùng lại cú này", chỉ chép hướng, lực
  và điểm chạm sang thế bi hiện tại. Ở Đánh tự do và Đánh chuỗi bi đã chạy đi
  chỗ khác, nên việc đó vô nghĩa. Người dùng nói rõ lại: mục đích là trở về đúng
  giao diện của cú trước để phân tích và học lại, hoặc khi thấy "hồi nãy ngắm
  thiếu một chút, chỉ cần thêm 0,1 hay 0,2 độ" thì chỉnh rồi đánh lại, không
  phải làm lại từ đầu.
- Chọn (`src/table/shotTable.ts`), áp dụng cho mọi bàn người học tự đánh:
  - Dòng "Cú vừa đánh: hướng X°, lực Y/100, điểm chạm Z" hiện ngay khi đánh.
  - Nút "Quay lại trước cú này": ba bi về đúng chỗ trước cú đó; hướng, lực và
    điểm chạm về đúng như lúc đó (phần nào tình huống đã khóa thì giữ nguyên).
  - Để so sánh trong lúc chỉnh: đường bi cái của cú đó còn lại dưới dạng vệt nét
    đứt; khung "Phân tích cú vừa đánh" vẫn mở được; khi đổi hướng thì hướng cũ
    hiện thành một đường nét đứt mảnh; vòng nét đứt trên mặt bi cái và vạch nét
    đứt trong khung kéo cơ đánh dấu điểm chạm và lực cũ.
  - Đánh chuỗi: KHÔNG có nút quay lại (người dùng chốt, 2026-11-25). Lý do: quay
    lại cho phép đánh lại một cú trượt, làm chuỗi và điểm trung bình ghi vào
    Thống kê đẹp hơn thực lực. Dòng "Cú vừa đánh" và khung phân tích vẫn có.
  - Tình huống: quay lại không trả lại lượt thử đã dùng.
- Người dùng xác nhận chỉ cần quay lại MỘT cú gần nhất (2026-11-25). Không có
  danh sách nhiều cú; rời màn hình là mất.
- Giới hạn: muốn xem lại và chỉnh một cú của ván chuỗi thì phải sang Đánh tự do
  xếp lại thế đó bằng tay (chức năng "Xếp bi", D19).

## D19. Kéo bi để xếp thế ở Đánh tự do; lưới an toàn cho bi sát băng (2026-11-25)

- Bối cảnh: người dùng yêu cầu kéo được bi để tự xếp thế ở Đánh tự do.
- Chọn một chế độ riêng thay vì cho kéo bi lúc nào cũng được: trên bàn, chạm và
  rê tay vốn là để ngắm, và người học hay chạm thẳng vào bi mục tiêu để ngắm vào
  nó. Nếu chạm vào bi mà thành kéo bi thì hai thao tác giẫm lên nhau.
  - Nút "Xếp bi" bật chế độ xếp: kéo từng bi tới chỗ mới; không ngắm, không đánh
    được. Nút đổi thành "Xong, đánh thế này"; có thêm "Về thế mặc định".
  - Bấm xong thì thế vừa xếp thành thế ban đầu: "Đặt lại" đưa bi về đúng thế đó,
    để tập đi tập lại một thế.
  - Vào chế độ xếp thì dòng "Cú vừa đánh", vệt và khung phân tích của thế cũ bị
    bỏ, vì chúng không còn ứng với thế trên bàn.
- Luật đặt bi (`src/table/arrange.ts`, có test trong `tests/table.test.ts`):
  - Chạm trong vòng 2,5 bán kính bi quanh tâm bi là nắm được bi (ngón tay che mất bi).
  - Tâm bi không ra khỏi mặt bàn; kéo ra ngoài thì bi dừng sát băng.
  - Bi không đè lên nhau: kéo đè lên bi khác thì bi trượt quanh bi đó, cách nhau
    một khe 0,02 bán kính bi. Không tìm được chỗ thì bi đứng yên.
- Phát hiện khi viết test: lõi vật lý ném lỗi "Depth exceeded resolving
  collisions" khi một bi nằm ĐÚNG giới hạn sát băng rồi đánh dọc theo băng, và
  trong một trường hợp ở sát góc (cách hai băng 0,005 bán kính bi, đánh 90°, lực
  0,3). Đây là lỗi có sẵn của lõi, không phải do chức năng mới; nó cũng có thể
  xảy ra khi một bi tình cờ dừng đúng sát băng sau một cú đánh.
- Xử lý, không sửa công thức trong `src/vendor`:
  - Bi xếp tay luôn cách băng 0,02 bán kính bi (khoảng 0,6 mm, không nhìn thấy).
    Đã thử 2016 cú từ các chỗ sát băng và sát góc ở khe này: không lỗi.
  - `simulate` trong `src/engine` bắt đúng lỗi đó, dời các bi sát băng vào trong
    tối đa 0,05 bán kính bi (khoảng 1,5 mm) rồi tính lại một lần. Vẫn lỗi thì ném
    lỗi gốc. Có test trong `tests/engine.api.test.ts`.
- Giới hạn: chỉ xếp được ở Đánh tự do; không lưu được thế đã xếp qua lần mở sau;
  không nhập được tọa độ bằng số. Trong trường hợp phải tính lại, bi bắt đầu lệch
  tối đa 1,5 mm so với chỗ đang hiển thị.

## D20. Bố cục điện thoại: bàn và điều khiển chính trong một màn hình (2026-11-25)

- Bối cảnh: người dùng mở bản GitHub Pages trên điện thoại và báo thiết kế rất tệ:
  phải cuộn xuống mới tới khung kéo cơ và nút Đánh, lúc đó bàn bị che, đánh mà
  không thấy gì; nhiều chức năng khác cũng vậy. Nguyên nhân: bàn dọc rộng hết
  màn hình thì cao hơn cả màn hình, còn mọi điều khiển xếp thành một cột bên dưới.
  Ở bước 9 tôi chỉ kiểm "không lỗi, không tràn ngang" ở khung điện thoại mà không
  kiểm việc dùng được trong một màn hình; đó là thiếu sót của tôi.
- Chọn: trên màn hình hẹp và dọc (rộng tối đa 700 px), ba màn hình chơi (tình
  huống, Đánh tự do, Đánh chuỗi) xếp lại thành một khung vừa đúng một màn hình:
  - Trên cùng: một dòng gồm nút quay lại, vị trí, tên. Thanh điều hướng chung ẩn
    ở ba màn hình này.
  - Giữa: bàn bên trái, cao bằng phần màn hình còn lại; cột bên phải có mặt bi
    chọn điểm chạm, bốn nút nhích hướng ngắm, và nút phụ (Đặt lại, Xếp bi, Thử
    lại, Tiếp theo).
  - Dưới: ô thông báo cao cố định ba dòng (lời giao việc, rồi kết quả), nút đáp
    án nếu có, khung kéo cơ có số lực nằm bên trong, hàng nút − + Đánh Xem lại.
  - Phần còn lại (gợi ý, lời giải thích, cú vừa đánh, phân tích, trợ giúp ngắm,
    thống kê chuỗi) nằm bên dưới, cuộn xuống mới thấy.
- Cách làm: `shotTable.hud()` trả về khung chứa bàn; khi màn hình hẹp và dọc nó
  dời các điều khiển sẵn có vào khung (để lại dấu giữ chỗ), khi rộng thì trả về
  chỗ cũ. Không có bản điều khiển thứ hai, và bố cục máy tính giữ nguyên. Chiều
  cao bàn tính bằng mã từ chiều cao màn hình thật, tính lại khi màn hình đổi cỡ.
- Cái giá: bàn nhỏ đi. Trước đây bàn rộng hết màn hình, viên bi khoảng 16 px; nay
  bàn phải thấp hơn màn hình nên viên bi khoảng 9 px ở màn hình 390x700. Mặt bi
  chọn điểm chạm cũng nhỏ đi (khoảng 110 px thay vì 168 px). Tôi chọn như vậy vì
  thấy được bàn lúc đánh quan trọng hơn bi to.
- Kèm theo: bàn nằm ngang không bao giờ cao hơn màn hình; bàn trong hình minh
  họa của bài học thấp lại để hàng nút nằm ngay dưới bàn.
- Giới hạn: điện thoại xoay ngang chưa có bố cục riêng (bàn vừa màn hình nhưng
  điều khiển vẫn ở dưới). Bài có nhiều nút đáp án thì bàn thấp hơn (ít nhất 240
  px); nếu vẫn không đủ chỗ thì khung dài hơn màn hình. Hình minh họa trong bài
  học vẫn theo bố cục cũ, chỉ thấp lại.

## D21. Viết lại toàn bộ phần Hiểu: hình vẽ, từng bước, tự kiểm tra (2026-11-25)

- Bối cảnh: người dùng báo phần Hiểu làm rất hời hợt, xem xong không hiểu gì
  hoặc rất khó hình dung. Xem lại thì đúng: mỗi bài chỉ có hai đến bốn đoạn chữ
  dày đặc, một ví dụ và một bàn có nút bấm. Khái niệm (độ dày chạm, bi ma, đường
  90°, điểm chạm, thuận, nghịch) được dùng mà không có hình nào vẽ ra; bàn mô
  phỏng không nói người học phải nhìn vào đâu; không có chỗ tự kiểm tra.
- Tra cứu thêm (ghi ở `docs/SOURCES.md`, mục "Viết lại phần Hiểu"). Nguồn chính
  là "Cahier technique du joueur débutant" của Liên đoàn bida Pháp (99 trang) và
  vài trang dạy phăng tiếng Việt. Rút ra: mỗi ý đi kèm một hình; vẽ viên bi ở
  các thời điểm liên tiếp để giải thích trượt và lăn; dạy cú tự nhiên trước, ê-phê
  sau, kéo lùi sau cùng; ghi điểm luôn đứng trước vị trí; bi gần băng là bi to;
  cú gom là đưa bi thứ nhất về gần bi thứ hai và tránh hai bi đụng nhau.
- Chọn: mỗi bài đi theo một trình tự cố định (`src/content/blocks.ts`):
  mục tiêu, từng ý nhỏ có tiêu đề và hình vẽ, bàn mô phỏng để tự bấm, ví dụ đời
  thường, lỗi hay gặp, ghi nhớ, tự kiểm tra. Test trong `tests/app.test.ts` giữ
  trình tự này cho cả 23 bài.
- Hình vẽ (`src/table/diagram.ts`): 20 loại sơ đồ tự dựng bằng SVG, có chú thích
  và mô tả cho trình đọc màn hình. Là sơ đồ, không phải mô phỏng; chỗ nào phóng
  đại thì ghi rõ. Không sao chép hình của nguồn nào.
- Bàn mô phỏng trong bài (`src/table/figure.ts`) thêm: câu "Đoán trước khi bấm",
  dòng "Nhìn gì", nút "So sánh tất cả" vẽ chồng đường đi của mọi nút lên một bàn
  (mỗi nút một kiểu nét, có mẫu nét trên nút), và đường 90° làm mốc ở các bài
  nói về nó.
- Nội dung thêm so với trước: bi ma và cách ngắm; cách dựng đường 90° ba bước;
  vì sao bi cái theo, dừng, lùi; cú tự nhiên; cách xác định thuận hay nghịch ba
  bước; ghi điểm trước, vị trí sau; đặt bi; ba câu hỏi trước cú gom; từ người
  chơi hay dùng (cu-lê, rê-trô, ê-phê, cao cơ, thấp cơ, bi to, gom bi, bị đá).
- Kiểm số liệu: các câu khẳng định có con số hoặc có chiều (xa gấp bốn, lệch
  trước hay sau đường 90°, mạnh thì bật dựng hơn, gần thì nhích ít, xa thì theo
  xa) đã được đo lại bằng mô phỏng. Hai câu không khớp đã sửa: câu tự kiểm tra
  của bài 3.1 và lời tả cú gần ở bài 3.3.
- Chỗ nguồn không thống nhất, bài giữ con số đã kiểm bằng mô phỏng: sách của
  liên đoàn Pháp vẽ góc lệch của cú tự nhiên khoảng 45°, Dr. Dave đo khoảng 30
  đến 34°; app dùng mốc 30°.
- Giới hạn:
  - Chưa có người chơi phăng có kinh nghiệm đọc lại nội dung.
  - App vẫn không dạy tư thế, cầu tay và cách đưa cơ (sách của liên đoàn Pháp
    dạy những thứ này trước tiên); đây là phần ngoài phạm vi ở `docs/SPEC.md`.
  - Bài 5.1 và 5.3 không có hình vẽ riêng: hình của chúng là bàn mô phỏng và
    danh sách bước.
  - Câu tự kiểm tra không được lưu vào tiến độ.
- Bổ sung cùng ngày, theo góp ý "không đoán được hướng bi cái khi đánh 3/4, nửa
  bi, 1/4 và mỏng": bài 2.1 trước chỉ vẽ hướng bi vàng theo độ dày, còn bi cái
  thì dồn sang bài 2.2 và nói chung chung. Đã thêm vào 2.1 mục "Còn bi cái thì
  đi đâu": hình bốn ô (mỗi độ dày một ô, vẽ cả bi vàng, bi cái còn trượt và bi
  cái đã lăn), bốn bước đoán nhanh, và hai bàn bấm thử có "So sánh tất cả".
  - Con số trong hình là số đo trên mô phỏng (thế bi ghi trong bài): còn trượt
    55°, 49°, 35°, 22°; đã lăn 32°, 37°, 30°, 19°; cho 3/4, nửa bi, 1/4, mỏng.
  - Lý thuyết với bi nảy hoàn hảo cho bi còn trượt: 75°, 60°, 41°, 26°. Mô
    phỏng thấp hơn nhiều ở chạm dày (D10, mục 1). Bài nói rõ hai bộ số và rằng
    bàn thật thường nằm giữa; chưa ai đo trên bàn thật.
  - Vệt "So sánh tất cả" của hai bàn này dừng ở lần chạm băng đầu tiên
    (`compareCut`) để hình không rối.
