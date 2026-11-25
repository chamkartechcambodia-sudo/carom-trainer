// Bai Hieu cua cap 4: bang va e-phe. Loi van tu soan; kien thuc da doi chieu voi nguon
// ghi o docs/SOURCES.md. So lieu cua hinh lay tu mo phong (docs/LEVELS.md).
// Luu y: loi mo phong KHONG co hien tuong bi cai lech huong khi danh e-phe, nen hinh
// cua bai 4.4 la hinh minh hoa ve tay (doi huong danh vai do), khong phai mo phong that.
import type { Setup, Shot } from "../engine"
import type { Figure } from "../table/figure"
import { sliderToPower } from "../table/power"
import type { Block, Lesson } from "./lessons123"

const p = (text: string): Block => ({ type: "text", text })
const ex = (text: string): Block => ({ type: "example", text })
const fig = (caption: string, balls: Setup, variants: Figure["variants"]): Block => ({
  type: "figure",
  figure: { caption, balls, variants },
})
const shot = (angleDeg: number, slider: number, x = 0, y = 0): Shot => ({
  angleDeg,
  power: sliderToPower(slider),
  tip: { x, y },
})

const OBLIQUE: Setup = { cue: [-12, 6] }
const HEAD_ON: Setup = { cue: [0, 10] }

export const LESSONS_4: Lesson[] = [
  {
    id: "4.1",
    title: "Bật băng không xoáy",
    body: [
      p(
        "Bi không xoáy ngang chạm băng thì bật ra với góc gần bằng góc tới, giống tia sáng gặp gương. Chỉ là gần bằng: băng có ma sát và có độ lún, nên góc bật luôn lệch một chút."
      ),
      p(
        "Hai thứ làm góc bật đổi. Một là lực: đánh mạnh thì bi bật dựng hơn, tức là gần với hướng vuông góc với băng hơn; đánh nhẹ thì bật thoải hơn. Hai là bi đang lăn hay đang trượt: bi lăn tới băng (còn xoáy tới) bật dài hơn bi trượt."
      ),
      ex("Giống ném quả bóng nảy xiên vào tường: ném nhẹ thì bóng đi ra thoải, ném mạnh thì bóng bật ngược ra gắt hơn."),
      fig("Cùng một bi cái, đổi góc vào băng và lực. So góc bật với góc tới.", OBLIQUE, [
        { label: "Vào 30°, lực vừa", shot: shot(60, 60) },
        { label: "Vào 45°, lực vừa", shot: shot(45, 60) },
        { label: "Vào 45°, lực mạnh", shot: shot(45, 76) },
        { label: "Vào 60°, lực vừa", shot: shot(30, 60) },
      ]),
    ],
  },
  {
    id: "4.2",
    title: "Xoáy thuận, xoáy nghịch",
    body: [
      p(
        "Ê-phê là xoáy ngang: chạm lệch sang trái hoặc phải của tâm bi cái. Khi chạm bi khác, xoáy ngang gần như không đổi đường bi cái. Tác dụng chính của nó hiện ra ở băng."
      ),
      p(
        "Đâm thẳng vào băng: xoáy phải làm bi bật sang phải của người đánh, xoáy trái làm bi bật sang trái. Tác dụng này mạnh nhất khi đâm gần vuông góc và yếu dần khi bi đi sượt dọc băng."
      ),
      fig("Đâm thẳng vào băng trên, ba điểm chạm.", HEAD_ON, [
        { label: "Xoáy trái", shot: shot(90, 60, -0.6) },
        { label: "Không xoáy", shot: shot(90, 60) },
        { label: "Xoáy phải", shot: shot(90, 60, 0.6) },
      ]),
      p(
        "Đâm xéo vào băng: xoáy cùng chiều với hướng bi đang trôi dọc băng gọi là xoáy thuận. Nó mở rộng góc bật và bi chạy nhanh hơn sau băng. Xoáy ngược chiều gọi là xoáy nghịch: góc bật dựng lại (gần hướng vuông góc với băng hơn) và bi bị hãm."
      ),
      p(
        "Cùng một cú xoáy phải có thể là thuận ở thế này và nghịch ở thế khác. Luôn hỏi trước: bi cái tới băng thì đang trôi sang trái hay sang phải?"
      ),
      ex(
        "Giống bánh xe đang quay chạm vào tường: quay cùng chiều đang đi thì nó lăn dọc theo tường và vọt tới, quay ngược chiều thì nó khựng lại rồi bật ngược ra."
      ),
      fig("Đâm xéo vào băng trên, bi trôi sang phải. Ở đây xoáy phải là thuận.", OBLIQUE, [
        { label: "Xoáy trái (nghịch)", shot: shot(60, 60, -0.6) },
        { label: "Không xoáy", shot: shot(60, 60) },
        { label: "Xoáy phải (thuận)", shot: shot(60, 60, 0.6) },
      ]),
    ],
  },
  {
    id: "4.3",
    title: "Hai kiểu ghi điểm có băng",
    body: [
      p(
        "Khi không có đường thẳng từ bi thứ nhất sang bi thứ hai, ta mượn băng. Có hai kiểu cơ bản."
      ),
      p(
        "Bi, băng, bi: bi cái chạm bi thứ nhất, tới băng, bật ra rồi tới bi thứ hai. Đọc theo hai chặng: đường 90° đưa bi cái tới chỗ nào trên băng, rồi từ đó góc bật đưa nó đi đâu."
      ),
      p(
        "Băng trước: bi cái chạm băng rồi mới chạm bi. Dùng khi bi thứ nhất bị che, hoặc khi vòng qua băng cho góc chạm tốt hơn. Ngắm điểm trên băng như ngắm một viên bi."
      ),
      ex(
        "Giống chuyền bóng trong sân futsal: không chuyền thẳng được thì chuyền bật tường, hoặc tự đi bóng bật tường rồi mới chuyền."
      ),
      fig("Hai thế mẫu. Xem bi cái chạm gì trước, chạm gì sau.", { cue: [34.5, -5.8], b1: [26.1, -5], b2: [-1.6, 16.7] }, [
        { label: "Bi, băng, bi", shot: shot(165.3, 58) },
        {
          label: "Băng trước",
          shot: shot(56, 58),
          balls: { cue: [-20, 0], b1: [5.4, 12.1], b2: [3.6, 6.7] },
        },
      ]),
    ],
  },
  {
    id: "4.4",
    title: "Cái giá của ê-phê",
    body: [
      p(
        "Đánh ê-phê thì bi cái không đi đúng hướng cây cơ đang chỉ. Nó lệch nhẹ về phía ngược với bên chạm: chạm bên phải, bi cái lệch sang trái. Chạm càng xa tâm thì lệch càng nhiều."
      ),
      p(
        "Sau đó bi cái còn cong ngược trở lại một chút về phía bên chạm, nhất là khi đuôi cơ nâng cao hoặc đánh nhẹ. Đánh mạnh thì nó chưa kịp cong về, nên độ lệch nhìn thấy lớn hơn; đánh nhẹ và xa thì hai thứ bù nhau một phần."
      ),
      p(
        "Cách sống chung: dùng ít xoáy nhất có thể; khi buộc phải dùng thì ngắm bù về phía bên chạm một chút. Bù bao nhiêu tùy cây cơ và phải tự tập mới biết, không có con số chung."
      ),
      ex("Giống chèo thuyền một bên mái: thuyền không đi thẳng theo mũi mà lệch dần sang bên kia, nên phải nhắm lệch trước."),
      fig(
        "Hình minh họa, đã phóng đại. Mô phỏng của app KHÔNG có hiệu ứng này: ở mọi bài khác bi cái luôn đi đúng hướng ngắm.",
        { cue: [-30, 0], b1: [10, 0] },
        [
          { label: "Giữa tâm: đi đúng hướng ngắm", shot: shot(0, 62) },
          { label: "Xoáy phải mạnh: lệch sang trái", shot: shot(1.6, 62, 0.9) },
        ]
      ),
    ],
  },
  {
    id: "4.5",
    title: "Chín điểm chạm",
    body: [
      p(
        "Gọi tên điểm chạm theo mặt đồng hồ: 12 giờ là trên, 3 giờ là phải, 6 giờ là dưới, 9 giờ là trái. Bốn điểm chéo nằm giữa: trên phải, dưới phải, dưới trái, trên trái. Thêm giữa tâm là chín điểm."
      ),
      p(
        "Lượng xoáy chia ba mức: sát tâm (nhẹ), khoảng giữa (vừa), gần vòng giới hạn (mạnh). Giới hạn an toàn là nửa bán kính bi tính từ tâm; xa hơn dễ trượt đầu cơ. Cách đếm bằng số đầu cơ mỗi người hiểu một kiểu, nên app dùng ba mức này."
      ),
      p(
        "Trục dọc quyết định bi cái làm gì sau khi chạm bi: trên tâm đi trước đường 90°, dưới tâm đi sau. Trục ngang quyết định bi cái làm gì khi chạm băng: thuận thì mở góc, nghịch thì dựng góc. Điểm chéo là cộng hai tác dụng. Đây là cách nghĩ đủ dùng lúc đầu; thật ra trên và dưới tâm cũng làm góc bật ở băng dài ra hoặc ngắn lại đôi chút."
      ),
      p(
        "Chọn điểm chạm bằng hai câu hỏi. Một: sau khi chạm bi thứ nhất, bi cái cần đi trước, đúng, hay sau đường 90°? Hai: tới băng cần bật rộng ra hay dựng lại, và bi đang trôi về phía nào dọc băng?"
      ),
      p(
        "Ba lỗi hay gặp: chạm quá xa tâm nên trượt đầu cơ; hạ hoặc nâng đuôi cơ không đều giữa các lần đánh; dùng xoáy mạnh trong khi xoáy nhẹ đã đủ."
      ),
      ex(
        "Giống cần điều khiển trò chơi điện tử: đẩy lên xuống là một việc, gạt trái phải là một việc khác, đẩy chéo là làm cả hai cùng lúc."
      ),
      {
        type: "explorer",
        explorer: {
          caption: "Bấm lên mặt bi cái để đổi điểm chạm. Đường bi cái hiện ngay; hướng và lực giữ nguyên.",
          balls: { cue: [7.1, -6.5], b1: [0.1, -12] },
          angleDeg: -132.1,
          power: 0.2057,
        },
      },
    ],
  },
]
