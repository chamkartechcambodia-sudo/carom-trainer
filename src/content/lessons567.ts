// Bai Hieu cua cap 5 (chon cach danh), 6 (gom bi), 7 (giu chuoi). Loi van tu soan;
// kien thuc da doi chieu voi nguon ghi o docs/SOURCES.md, cho nao nguon khong xac
// nhan thi bai chi neu dieu mo phong cho thay. So lieu cua hinh lay tu mo phong.
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
const shot = (angleDeg: number, slider: number, y = 0): Shot => ({
  angleDeg,
  power: sliderToPower(slider),
  tip: { x: 0, y },
})
const raw = (angleDeg: number, power: number): Shot => ({ angleDeg, power, tip: { x: 0, y: 0 } })

export const LESSONS_5: Lesson[] = [
  {
    id: "5.1",
    title: "Một thế, nhiều lời giải",
    body: [
      p(
        "Gần như thế bi nào cũng có hơn một cách ghi điểm. Hai câu hỏi đầu tiên luôn là: chạm bi nào trước, và đi thẳng sang bi thứ hai hay mượn băng."
      ),
      p(
        "Người mới thường thấy một cách rồi đánh luôn. Hãy tập thói quen dừng lại hai giây, hình dung ít nhất hai cách, rồi mới chọn. Cấp này chỉ luyện đúng việc đó."
      ),
      ex("Giống tìm đường trên bản đồ: có đường ngắn mà hẹp, có đường vòng mà rộng. Người lái quen sẽ nhìn cả hai rồi mới rẽ."),
      fig("Cùng một thế, hai cách: chạm bi vàng trước và chạm bi đỏ trước.", { cue: [17.1, 5.7], b1: [13.9, 13.9], b2: [5.9, 13.8] }, [
        { label: "Bi vàng trước", shot: raw(118.9, 0.1177) },
        { label: "Bi đỏ trước", shot: raw(136.1, 0.1177) },
      ]),
    ],
  },
  {
    id: "5.2",
    title: "Lời giải chắc là gì",
    body: [
      p(
        "Lời giải chắc là lời giải vẫn ghi điểm khi bạn ngắm lệch một chút hoặc đánh hơi quá tay. Đo bằng độ rộng của khoảng ngắm: có cú chỉ đúng trong nửa độ, có cú rộng tới bốn năm độ."
      ),
      p(
        "Ba dấu hiệu của một lời giải chắc. Một: bi thứ hai là mục tiêu to. Bi nằm gần băng là mục tiêu to, vì bi cái trượt qua nó một chút vẫn bật băng quay lại chạm. Hai: cú đánh tự nhiên, ít hoặc không xoáy ngang, lực vừa. Ba: bi cái đi quãng ngắn."
      ),
      ex("Giống ném bóng vào rổ có bảng: ném hơi lệch, bóng chạm bảng vẫn rơi vào. Bi nằm sát băng cũng có 'tấm bảng' như vậy."),
      fig(
        "Hai cách cùng đi qua bi vàng, mỗi cách cố ý ngắm lệch 1°. Cách nào vẫn ghi điểm?",
        { cue: [19.2, 14.9], b1: [22.6, 8.3], b2: [38, -2.6] },
        [
          { label: "Trực tiếp, lệch 1°", shot: raw(-48.6, 0.0977) },
          { label: "Qua băng, lệch 1°", shot: raw(-52.1, 0.1417) },
        ]
      ),
    ],
  },
  {
    id: "5.3",
    title: "Thứ tự chọn",
    body: [
      p(
        "Một thứ tự kiểm tra ngắn, dùng cho mọi thế. Bước một: với bi vàng trước, bi cái rời đi về phía nào, có gặp bi đỏ không? Bước hai: hỏi lại như vậy với bi đỏ trước. Bước ba: nếu cả hai đều được, chọn cách có khoảng ngắm rộng hơn. Bước bốn: chỉ khi không có đường thẳng mới nghĩ tới băng và xoáy."
      ),
      p(
        "Từ cấp 6 sẽ thêm một bước nữa: trong các cách ghi được điểm, cách nào để ba bi nằm gần nhau sau cú đánh. Nhưng bước đó chỉ có nghĩa khi bạn đã ghi được điểm một cách chắc chắn."
      ),
      ex("Giống nấu ăn theo thứ tự quen tay: có gì trong tủ, món nào làm được, rồi mới tới món nào ngon. Không ai bắt đầu từ món khó nhất."),
      fig("Một lời giải tự nhiên: giữa tâm, lực vừa, bi vàng trước.", { cue: [-18.4, 2.7], b1: [-23.7, -10.2], b2: [-32.1, -11.9] }, [
        { label: "Xem cú tự nhiên", shot: shot(-116.8, 54) },
      ]),
    ],
  },
]

const KEEP: Setup = { cue: [-5, -8.3], b1: [-1.2, -2.5], b2: [-4.1, -3.4] }

export const LESSONS_6: Lesson[] = [
  {
    id: "6.1",
    title: "Nghĩ trước một cú",
    body: [
      p(
        "Trong phăng, ghi điểm chỉ là một nửa việc. Nửa còn lại là ba bi nằm ở đâu sau cú đánh. Ba bi gần nhau thì cú sau dễ; ba bi tản ra thì cú sau là một cú khó, và chuỗi đứt."
      ),
      p(
        "Người chơi giỏi có chuỗi dài không phải vì họ làm được cú khó, mà vì họ ít khi để mình phải đánh cú khó. Trước mỗi cú, họ tự hỏi: đánh xong, bi thứ nhất chạy đi đâu, bi cái dừng ở đâu?"
      ),
      ex("Giống chơi cờ: nước đi hay không chỉ là nước ăn được quân, mà là nước để lại thế tốt cho nước sau."),
      fig("Cùng một hướng ngắm, hai mức lực. Cả hai đều ghi điểm; so chỗ ba bi dừng.", KEEP, [
        { label: "Lực nhẹ", shot: shot(56.5, 30) },
        { label: "Lực mạnh", shot: shot(56.5, 56) },
      ]),
    ],
  },
  {
    id: "6.2",
    title: "Bi nào ở lại, bi nào chạy",
    body: [
      p(
        "Hai thứ quyết định ba bi nằm đâu. Thứ nhất là lực: lực nhỏ thì cả ba ở lại gần chỗ cũ. Thứ hai là độ dày chạm: chạm dày thì bi thứ nhất nhận gần hết tốc độ và chạy xa, bi cái ở lại; chạm mỏng thì bi thứ nhất chỉ nhích đi, bi cái đi tiếp."
      ),
      p(
        "Từ đó có một quy tắc đơn giản: muốn bi nào ở lại thì đừng truyền tốc độ cho nó. Bi thứ nhất đang nằm đẹp thì chạm mỏng. Bi thứ nhất nằm xa hai bi kia thì chạm dày hơn để đẩy nó về phía chúng."
      ),
      ex("Giống đẩy xích đu: chạm nhẹ vào cạnh thì xích đu gần như đứng yên còn tay bạn đi tiếp; đẩy chính giữa thì xích đu văng đi còn bạn đứng lại."),
      fig("Cùng lực, chạm dày và chạm mỏng. Xem bi vàng chạy bao xa.", { cue: [-30, 0], b1: [-25, 0] }, [
        { label: "Chạm dày", shot: shot(5.7, 50) },
        { label: "Chạm mỏng", shot: shot(19.9, 50) },
      ]),
    ],
  },
  {
    id: "6.3",
    title: "Gom bi từ xa",
    body: [
      p(
        "Khi ba bi đã tản ra, cú gom bi là cú vừa ghi điểm vừa đưa chúng về gần nhau. Trong sách tiếng Anh nó được gọi là gather shot."
      ),
      p(
        "Cách nghĩ: bi thứ hai thường là bi ít di chuyển nhất, nên hãy coi chỗ nó nằm là điểm hẹn. Chọn lực và độ dày chạm sao cho bi cái tới điểm hẹn vừa hết đà, và bi thứ nhất hoặc ở lại gần đó, hoặc đi một vòng rồi quay về gần đó."
      ),
      p(
        "Cú gom bi khó vì phải đúng ba thứ cùng lúc. Đừng ép: nếu không thấy cách gom, hãy ghi điểm chắc trước, gom ở cú sau."
      ),
      ex("Giống hẹn bạn ở quán cà phê: ai cũng đi đường của mình, miễn là tới cùng một chỗ vào cùng một lúc."),
      fig("Cùng một thế, cùng hướng ngắm. Cú thứ nhất ghi điểm và gom được bi; cú thứ hai quá lực, bi cái chạy vượt bi đỏ: vừa trượt vừa làm bi tản ra.", { cue: [2.9, -3.6], b1: [-10.5, 2.2], b2: [-9.4, 9.2] }, [
        { label: "Dưới tâm, lực vừa", shot: shot(152, 50, -0.6) },
        { label: "Giữa tâm, mạnh hơn", shot: shot(152, 62) },
      ]),
    ],
  },
]

export const LESSONS_7: Lesson[] = [
  {
    id: "7.1",
    title: "Đánh nhỏ",
    body: [
      p(
        "Khi ba bi đã nằm gần nhau, mục tiêu đổi hẳn: không phải ghi một điểm đẹp, mà ghi điểm theo cách ít làm xáo trộn nhất. Bi cái đi vài phân, hai bi kia gần như không nhúc nhích."
      ),
      p(
        "Kỹ thuật này gọi là nuôi bi. Những chuỗi kỷ lục hàng trăm điểm trong lịch sử phăng đều đến từ rất nhiều cú nhỏ lặp lại dọc theo băng, không phải từ cú khó. Luật vùng góc và các lối chơi có kẻ vạch ra đời chính là để hạn chế kiểu đánh đó."
      ),
      ex("Giống tâng bóng: người tâng được trăm lần không đá mạnh lần nào, họ chỉ chạm vừa đủ để quả bóng ở nguyên chỗ."),
      fig("Ba bi rất gần nhau. Cùng hướng ngắm, cú nhỏ và cú quá tay.", { cue: [16.3, -4.3], b1: [12.1, -2.1], b2: [15.6, -1.5] }, [
        { label: "Cú nhỏ", shot: shot(145.4, 18) },
        { label: "Quá tay", shot: shot(145.4, 46) },
      ]),
    ],
  },
  {
    id: "7.2",
    title: "Bi sát băng",
    body: [
      p(
        "Băng vừa giúp vừa hại. Giúp: bi nằm sát băng là mục tiêu to, và nó không chạy xa được vì băng chặn lại. Hại: đánh quá lực thì bi bật băng văng ngược ra giữa bàn, phá thế đang đẹp."
      ),
      p(
        "Khi hai bi nằm dọc băng, hãy đánh dọc theo băng với lực nhỏ nhất còn ghi được điểm. Khi một bi dính sát băng, tránh đánh thẳng vào nó theo hướng vuông góc với băng: nó không có chỗ đi và sẽ bật lại mạnh."
      ),
      ex("Giống dắt xe máy sát lề đường: đi chậm thì lề giữ cho xe thẳng, đi nhanh mà chạm lề thì xe bật ra."),
      fig("Hai bi nằm sát băng trên. Cùng hướng ngắm, hai mức lực.", { cue: [-5.8, 14.7], b1: [-7.9, 19.8], b2: [-3.8, 21.8] }, [
        { label: "Lực nhỏ", shot: shot(91.6, 26) },
        { label: "Lực lớn", shot: shot(91.6, 52) },
      ]),
    ],
  },
  {
    id: "7.3",
    title: "Vùng góc và luật",
    body: [
      p(
        "Góc bàn là chỗ giữ bi dễ nhất: hai băng chặn hai phía. Vì quá dễ nên luật thi đấu phăng tự do vẽ một tam giác ở mỗi góc. Cạnh dọc băng dài bằng một phần tư chiều dài bàn (71 cm), cạnh dọc băng ngắn bằng một phần tư chiều rộng (35,5 cm)."
      ),
      p(
        "Khi cả hai bi mục tiêu cùng nằm trong một tam giác, bạn được ghi thêm một điểm mà chúng vẫn ở trong. Cú tiếp theo phải đưa ít nhất một bi mục tiêu ra khỏi tam giác; nó được phép quay lại ngay. Không đưa ra được thì điểm đó không tính và hết lượt. Bi nằm đúng trên vạch tính là ở trong. Vị trí bi cái không tính."
      ),
      p(
        "Chơi phong trào thường bỏ luật này. App để nó là tùy chọn: bật trong Cài đặt, rồi vào Đánh chuỗi sẽ thấy bốn tam giác và lời nhắc khi bi vào vùng."
      ),
      ex("Giống luật ba giây trong bóng rổ: không ai cấm bạn vào khu vực dưới rổ, chỉ cấm đứng lì ở đó."),
      fig("Hai bi mục tiêu trong góc. Một cú nhỏ ghi điểm mà cả hai bi vẫn ở trong góc.", { cue: [42.7, -13.4], b1: [38, -21.6], b2: [38, -18.4] }, [
        { label: "Xem cú đánh", shot: shot(243, 28) },
      ]),
    ],
  },
]
