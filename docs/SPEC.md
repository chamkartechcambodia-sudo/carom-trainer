# Đặc tả: Công việc và Kết quả mục tiêu cốt lõi

## Công việc

Xây một web app tiếng Việt, dùng được trên điện thoại và máy tính, để một người
tự học bida phăng tự do (libre) từ đầu. Tiến độ lưu ngay trên máy, không cần tài
khoản.

## Ba phần gắn với nhau

1. **Bài học theo cấp độ.** Mỗi cấp có lý thuyết ngắn kèm hình minh họa tương
   tác và một ví dụ đời thường.
2. **Bàn mô phỏng 3 bi.** Người học tự ngắm, chấm điểm chạm trên bi cái, chọn
   lực rồi đánh. Tình huống xếp sẵn theo cấp, có chấm đạt hay chưa.
3. **Sổ tập bàn thật.** Mỗi cấp có bài tập kèm sơ đồ xếp bi để mang ra quán.
   Người học ghi số quả đạt trên 10; đủ ngưỡng thì mở cấp tiếp theo.

## Kết quả mục tiêu

Người học nhìn một thế bi là biết đánh thế nào để vừa ghi điểm vừa gom ba bi lại
gần nhau, và giữ được chuỗi dài hàng chục điểm trên bàn thật.

Phần mềm đo bằng hai chỉ số, ghi sau mỗi buổi: **điểm trung bình mỗi lượt** và
**chuỗi dài nhất**.

## Người dùng

Một người, người lớn mới học bida, đã hiểu qua: bi ma, quy tắc 90°, trên/dưới
tâm, ê-phê. Dùng tiếng Việt. Thích hình minh họa tương tác hơn chữ, và mỗi giải
thích kỹ thuật nên có một ví dụ đời thường.

## Ngoài phạm vi (bản đầu)

- Bida 1 băng, 3 băng, bida lỗ.
- Nhiều người dùng, tài khoản, máy chủ, tiếng Khmer hoặc tiếng Anh.
- App Android gốc.
- Bài học luật chơi và bài học tư thế, cơ thẳng (người dùng yêu cầu bỏ).
- Đấu với máy, chơi mạng, đồ họa 3D.

## Giới hạn phải nói rõ trong app

- Mô phỏng dạy cách đọc thế bi và lên kế hoạch. Cảm giác tay và lực chỉ có ở bàn
  thật, nên việc qua cấp dựa trên sổ tập bàn thật.
- Vật lý trong mô phỏng đủ đúng để học quy luật, không chính xác tuyệt đối, nhất
  là ê-phê và độ nảy của băng. Mô phỏng cho biết hướng thay đổi; mức thay đổi
  phải lấy từ bàn thật.

## Yêu cầu chung

- Sản phẩm cuối: một file `dist/index.html` tự chứa.
- Dùng được bằng chuột và cảm ứng; bố cục co giãn từ màn hình điện thoại dọc đến
  máy tính.
- Tiến độ lưu trong trình duyệt, có xuất và nhập file sao lưu (JSON).
- Cài đặt: ngưỡng qua cấp (mặc định 7/10), luật vùng góc (mặc định tắt), bật tắt
  trợ giúp ngắm (bi ma, đường 90°).
