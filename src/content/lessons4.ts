// Bai Hieu cua cap 4: bang va e-phe. Loi van va hinh ve tu soan; kien thuc va trinh tu day
// da doi chieu voi nguon ghi o docs/SOURCES.md. So lieu cua ban mo phong lay tu mo phong
// (docs/LEVELS.md). Luu y: loi mo phong KHONG co hien tuong bi cai lech huong khi danh
// e-phe, nen ban cua bai 4.4 la hinh minh hoa (doi huong danh vai do), khong phai mo phong that.
import type { Setup, Shot } from "../engine"
import { sliderToPower } from "../table/power"
import { check, dg, ex, fig, goal, h, key, mistakes, p, steps, type Lesson } from "./blocks"

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
      goal("đoán được bi đi đâu sau khi chạm băng khi không dùng ê-phê, và biết lực làm đường đó đổi thế nào."),
      h("Góc bật gần bằng góc tới"),
      p(
        "Bi không xoáy ngang chạm băng thì bật ra với góc gần bằng góc nó đi tới. Hai góc này đo so với đường vuông góc với băng tại chỗ chạm. Bi tới càng xiên thì bật ra càng xiên."
      ),
      dg({ kind: "mirror" }, "Đường nét đứt vuông góc với băng tại chỗ bi chạm. Góc tới và góc bật nằm hai bên đường đó và gần bằng nhau."),
      p(
        "Cách dùng trên bàn: muốn bi cái bật băng rồi tới một điểm, hãy vẽ trong đầu cả đường đi và tìm điểm trên băng sao cho hai góc bằng nhau. Người mới nên tập đúng việc này: đứng nhìn, đoán điểm chạm băng, rồi mới đánh."
      ),
      h("Chỉ là gần bằng"),
      p(
        "Băng làm bằng cao su: nó lún vào rồi mới đẩy bi ra, và nó có ma sát. Hai thứ làm góc bật đổi. Một là lực: đánh mạnh thì bi bật dựng hơn, tức là gần đường vuông góc hơn; đánh nhẹ thì bật thoải hơn. Hai là bi đang lăn hay đang trượt: bi lăn tới băng (còn xoáy tới) bật dài hơn bi trượt."
      ),
      dg({ kind: "mirror", speed: true }, "Cùng một đường vào, ba mức lực. Hình đã phóng đại để dễ thấy."),
      ex("Giống ném quả bóng nảy xiên vào tường: ném nhẹ thì bóng đi ra thoải, ném mạnh thì bóng bật ngược ra gắt hơn."),
      h("Tự bấm thử"),
      fig(
        "Cùng một bi cái, đổi góc vào băng trên và lực.",
        OBLIQUE,
        [
          { label: "Vào xiên nhiều, lực vừa", shot: shot(30, 60) },
          { label: "Vào 45°, lực vừa", shot: shot(45, 60) },
          { label: "Vào 45°, lực mạnh", shot: shot(45, 76) },
          { label: "Vào dốc, lực vừa", shot: shot(60, 60) },
        ],
        {
          predict: "hai cú cùng vào 45°, một vừa một mạnh. Sau băng hai đường có trùng nhau không?",
          look: "bấm \"So sánh tất cả\". So góc trước và sau băng của từng đường; rồi so riêng hai đường vào 45°.",
          compare: "cue",
        }
      ),
      mistakes(
        "Tin tuyệt đối vào góc tới bằng góc bật. Nó là mốc khởi đầu; lực và độ lăn của bi sẽ kéo lệch.",
        "Ngắm vào mép gỗ của băng. Bi chạm băng bằng mép của nó, nên điểm cần ngắm là chỗ TÂM bi cái nằm lúc chạm, cách mép băng một bán kính bi.",
        "Mang con số của bàn này sang bàn khác. Mỗi bàn một kiểu băng."
      ),
      key(
        "Không ê-phê: góc bật gần bằng góc tới.",
        "Đánh mạnh thì bật dựng hơn, đánh nhẹ thì bật thoải hơn.",
        "Vẽ cả đường đi trong đầu, chọn điểm trên băng, rồi mới cúi xuống đánh."
      ),
      check(
        "Bạn đánh một cú bật băng không ê-phê và bi đi QUÁ DÀI so với đích (bật ra thoải quá). Giữ nguyên hướng ngắm, chỉnh gì?",
        ["Đánh nhẹ hơn", "Đánh mạnh hơn", "Không chỉnh được bằng lực"],
        1,
        "Đánh mạnh hơn thì bi bật dựng hơn, tức là đường sau băng ngắn lại."
      ),
    ],
  },
  {
    id: "4.2",
    title: "Xoáy thuận, xoáy nghịch",
    body: [
      goal("biết ê-phê làm gì ở băng, và tự xác định được một cú xoáy là thuận hay nghịch trong từng thế bi."),
      h("Ê-phê là gì"),
      p(
        "Ê-phê (cũng viết ép phê, áp phê) là xoáy ngang: đầu cơ chạm lệch sang trái hoặc sang phải của tâm bi cái. Điều cần nhớ đầu tiên: ê-phê gần như không đổi đường bi cái khi nó chạm bi khác. Tác dụng của nó hiện ra ở băng."
      ),
      h("Bắt đầu từ cú đâm thẳng vào băng"),
      p(
        "Đây là cách dễ nhất để nhìn thấy ê-phê. Đánh bi cái thẳng góc vào băng. Không ê-phê thì nó bật thẳng về. Chạm bên phải thì nó bật lệch sang phải của bạn; chạm bên trái thì bật lệch sang trái."
      ),
      dg({ kind: "english", mode: "headOn" }, "Ba cú đâm thẳng vào băng, chỉ khác chỗ đầu cơ chạm trên mặt bi cái."),
      fig(
        "Đâm thẳng vào băng trên, ba điểm chạm.",
        HEAD_ON,
        [
          { label: "Xoáy trái", shot: shot(90, 60, -0.6) },
          { label: "Không xoáy", shot: shot(90, 60) },
          { label: "Xoáy phải", shot: shot(90, 60, 0.6) },
        ],
        {
          look: "bấm \"So sánh tất cả\": ba đường bật ra xòe về ba phía.",
          compare: "cue",
        }
      ),
      h("Đâm xéo: thuận và nghịch"),
      p(
        "Khi bi cái tới băng theo đường xéo, nó đang trôi dọc băng về một phía. Xoáy về cùng phía đó gọi là xoáy thuận: góc bật mở rộng ra và bi chạy nhanh hơn sau băng. Xoáy về phía ngược lại gọi là xoáy nghịch: góc bật dựng lại, gần đường vuông góc hơn, và bi bị hãm."
      ),
      dg({ kind: "english", mode: "oblique" }, "Bi cái tới băng và đang trôi sang phải. Ở thế này xoáy phải là thuận, xoáy trái là nghịch."),
      p("Cùng một cú xoáy phải có thể là thuận ở thế này và nghịch ở thế khác. Xác định theo ba bước:"),
      steps(
        "Nhìn đường bi cái tới băng: nó đang trôi dọc băng về bên trái hay bên phải của bạn?",
        "Chạm về cùng bên đó là thuận; chạm bên kia là nghịch.",
        "Cần bi đi dài và thoáng: thuận. Cần bi bật gắt và chậm lại: nghịch."
      ),
      p(
        "Tác dụng của ê-phê mạnh nhất khi bi đâm gần thẳng vào băng và yếu dần khi bi đi sượt dọc băng. Trong mô phỏng này, khi bi đi sượt thì xoáy nghịch gần như không còn tác dụng."
      ),
      ex(
        "Giống bánh xe đang quay chạm vào tường: quay cùng chiều đang đi thì nó lăn dọc theo tường và vọt tới, quay ngược chiều thì nó khựng lại rồi bật ngược ra."
      ),
      fig(
        "Đâm xéo vào băng trên, bi đang trôi sang phải. Ở đây xoáy phải là thuận.",
        OBLIQUE,
        [
          { label: "Xoáy trái (nghịch)", shot: shot(60, 60, -0.6) },
          { label: "Không xoáy", shot: shot(60, 60) },
          { label: "Xoáy phải (thuận)", shot: shot(60, 60, 0.6) },
        ],
        {
          predict: "đường nào đi xa nhất sau băng? Đường nào bật gắt nhất?",
          look: "bấm \"So sánh tất cả\", rồi bấm từng nút để thấy cú thuận chạy nhanh hơn, cú nghịch chậm lại sau băng.",
          compare: "cue",
        }
      ),
      mistakes(
        "Nhớ \"xoáy phải là thuận\". Sai: thuận hay nghịch tùy bi đang trôi về phía nào.",
        "Dùng ê-phê để chỉnh đường bi cái sau khi chạm bi. Việc đó là của trên tâm, dưới tâm (cấp 3).",
        "Ngắm xong rồi mới lệch cả thân người sang bên. Hãy ngắm đường giữa tâm trước, cúi xuống, rồi chỉ dời đầu cơ sang ngang."
      ),
      key(
        "Ê-phê làm việc ở băng, gần như không làm gì khi chạm bi.",
        "Thuận: mở góc, nhanh hơn. Nghịch: dựng góc, chậm lại.",
        "Thuận hay nghịch tùy hướng bi trôi dọc băng."
      ),
      check(
        "Bi cái đi xéo tới băng và đang trôi sang TRÁI của bạn. Bạn chạm bên phải tâm. Đó là xoáy gì, và bi bật ra thế nào?",
        ["Thuận: mở rộng, nhanh hơn", "Nghịch: dựng lại, chậm đi", "Không thuận không nghịch"],
        1,
        "Bi trôi sang trái mà xoáy phải là xoáy ngược phía đang trôi: nghịch. Góc bật dựng lại và bi bị hãm."
      ),
    ],
  },
  {
    id: "4.3",
    title: "Hai kiểu ghi điểm có băng",
    body: [
      goal("nhận ra khi nào cần mượn băng, và đọc được đường đi của hai kiểu cơ bản."),
      h("Khi nào mượn băng"),
      p(
        "Mượn băng khi không có đường thẳng từ bi thứ nhất sang bi thứ hai, hoặc khi đường thẳng quá khó: hai bi đầu quá sát nhau, quá xa nhau, hoặc bi thứ hai nằm ở chỗ đường 90° không với tới. Có hai kiểu cơ bản."
      ),
      dg({ kind: "patterns" }, "Hai kiểu, nhìn từ trên xuống. Số là thứ tự bi cái chạm."),
      h("Kiểu một: bi, băng, bi"),
      p("Bi cái chạm bi thứ nhất, tới băng, bật ra rồi tới bi thứ hai. Đọc theo hai chặng:"),
      steps(
        "Chặng một (cấp 2 và 3): sau khi chạm bi thứ nhất, bi cái đi theo đường nào, tới băng ở chỗ nào?",
        "Chặng hai (bài 4.1 và 4.2): từ chỗ đó, góc bật đưa nó đi đâu? Có cần ê-phê để mở rộng hay dựng lại không?"
      ),
      h("Kiểu hai: băng trước"),
      p(
        "Bi cái chạm băng rồi mới chạm bi thứ nhất. Dùng khi bi thứ nhất bị che khuất, hoặc khi vòng qua băng cho góc chạm thuận hơn. Cách ngắm: chọn một điểm trên băng và coi nó như một viên bi phải đưa bi cái tới."
      ),
      ex(
        "Giống chuyền bóng trong sân futsal: không chuyền thẳng được thì chuyền bật tường, hoặc tự đi bóng bật tường rồi mới chuyền."
      ),
      h("Tự bấm thử"),
      fig(
        "Hai thế mẫu, mỗi nút một thế.",
        { cue: [34.5, -5.8], b1: [26.1, -5], b2: [-1.6, 16.7] },
        [
          { label: "Bi, băng, bi", shot: shot(165.3, 58) },
          {
            label: "Băng trước",
            shot: shot(56, 58),
            balls: { cue: [-20, 0], b1: [5.4, 12.1], b2: [3.6, 6.7] },
          },
        ],
        {
          predict: "trước khi bấm, nhìn thế bi và đoán bi cái sẽ chạm băng ở đâu.",
          look: "thứ tự bi cái chạm: bi nào trước, băng lúc nào, bi nào sau cùng.",
        }
      ),
      mistakes(
        "Chỉ nghĩ tới băng khi hết cách. Nhiều khi đường qua một băng lại dễ hơn đường thẳng, vì bi thứ hai gần băng là mục tiêu to (bài 5.2).",
        "Tính cả hai chặng cùng lúc rồi rối. Hãy chốt chặng một trước, rồi mới tính chặng hai."
      ),
      key(
        "Hai kiểu: bi, băng, bi; và băng trước.",
        "Đọc từng chặng một: tới băng ở đâu, rồi từ đó đi đâu.",
        "Ngắm điểm trên băng như ngắm một viên bi."
      ),
      check(
        "Bi thứ nhất và bi thứ hai nằm sát nhau, thẳng hàng với bi cái, nên không đánh thẳng qua được. Cách nghĩ nào hợp lý?",
        ["Đánh thật mạnh cho bi cái nhảy qua", "Tìm đường bi cái chạm bi thứ nhất, bật một băng rồi quay lại bi thứ hai", "Bỏ lượt"],
        1,
        "Khi đường thẳng không dùng được, kiểu bi, băng, bi là lời giải đầu tiên nên xét."
      ),
    ],
  },
  {
    id: "4.4",
    title: "Cái giá của ê-phê",
    body: [
      goal("biết vì sao dùng ê-phê thì khó ngắm hơn, và cách sống chung với điều đó."),
      h("Bi cái không đi đúng hướng cơ chỉ"),
      p(
        "Khi chạm lệch sang bên, bi cái không đi đúng theo hướng cây cơ đang chỉ. Nó lệch nhẹ về phía ngược với bên chạm: chạm bên phải, bi cái lệch sang trái. Chạm càng xa tâm thì lệch càng nhiều."
      ),
      dg(
        { kind: "squirt" },
        "Nét đứt: hướng cây cơ chỉ. Nét liền: đường bi cái đi thật. Đây là hình vẽ, đã phóng đại; mô phỏng của app không có hiệu ứng này."
      ),
      p(
        "Sau đó bi cái còn cong ngược trở lại một chút về phía bên chạm, nhất là khi đuôi cơ nâng cao hoặc đánh nhẹ. Đánh mạnh thì nó chưa kịp cong về, nên độ lệch nhìn thấy lớn hơn; đánh nhẹ và xa thì hai thứ bù nhau một phần."
      ),
      h("Cách sống chung"),
      steps(
        "Dùng ít ê-phê nhất có thể. Cú nào đánh được bằng cú tự nhiên thì đừng thêm ê-phê.",
        "Khi buộc phải dùng: ngắm bù về phía bên chạm một chút.",
        "Bù bao nhiêu tùy cây cơ, lực và cự ly. Không có con số chung; phải tự tập trên bàn thật mới biết."
      ),
      ex("Giống chèo thuyền một bên mái: thuyền không đi thẳng theo mũi mà lệch dần sang bên kia, nên phải nhắm lệch trước."),
      h("Hình minh họa"),
      fig(
        "Minh họa, đã phóng đại. Mô phỏng của app KHÔNG có hiệu ứng này: ở mọi bài khác bi cái luôn đi đúng hướng ngắm.",
        { cue: [-30, 0], b1: [10, 0] },
        [
          { label: "Giữa tâm: đi đúng hướng ngắm", shot: shot(0, 62) },
          { label: "Xoáy phải mạnh: lệch sang trái", shot: shot(1.6, 62, 0.9) },
        ],
        {
          look: "bấm \"So sánh tất cả\": cú xoáy phải đi lệch khỏi đường của cú giữa tâm, nên chạm bi vàng mỏng hơn dự định.",
          compare: "cue",
        }
      ),
      mistakes(
        "Ngắm như cú giữa tâm rồi thêm ê-phê mạnh: bi cái chạm bi thứ nhất sai độ dày, hỏng cả cú.",
        "Dùng ê-phê mạnh trong khi ê-phê nhẹ đã đủ.",
        "Nâng đuôi cơ khi đánh ê-phê: bi cái cong nhiều hơn và khó đoán hơn."
      ),
      key(
        "Chạm bên nào, bi cái lệch về bên kia.",
        "Ê-phê càng nhiều, ngắm càng khó.",
        "Trên bàn thật phải tự tập độ bù; app không dạy được phần này."
      ),
      check(
        "Bạn ngắm chạm nửa bi vào bên phải bi mục tiêu rồi thêm ê-phê TRÁI mạnh mà không ngắm bù. Trên bàn thật, bi cái dễ chạm thế nào?",
        ["Đúng nửa bi như đã ngắm", "Lệch sang phải, nên chạm mỏng hơn hoặc trượt hẳn", "Lệch sang trái, nên chạm dày hơn"],
        1,
        "Chạm bên trái thì bi cái lệch sang phải. Bạn đang nhắm vào bên phải bi mục tiêu, nên lệch thêm sang phải là chạm mỏng đi."
      ),
    ],
  },
  {
    id: "4.5",
    title: "Chín điểm chạm",
    body: [
      goal("gọi tên được chín điểm chạm và chọn điểm chạm bằng hai câu hỏi."),
      h("Chín điểm"),
      p(
        "Mặt bi cái nhìn từ phía người đánh có chín điểm chạm để gọi tên: giữa tâm, bốn điểm trên, dưới, trái, phải, và bốn điểm chéo. Tất cả nằm trong một vòng giới hạn bằng nửa bán kính bi tính từ tâm; chạm xa hơn dễ trượt đầu cơ."
      ),
      dg({ kind: "tipFace", mode: "nine" }, "Chín điểm chạm. Trái, phải tính theo người đánh."),
      p(
        "Lượng xoáy chia ba mức: sát tâm là nhẹ, khoảng giữa là vừa, gần vòng giới hạn là mạnh. Ở câu lạc bộ người ta hay chia ê-phê thành mức 1, 2, 3, 4 hoặc đếm bằng số đầu cơ, nhưng mỗi người hiểu một kiểu, nên app chỉ dùng ba mức này."
      ),
      h("Hai trục, hai việc khác nhau"),
      dg({ kind: "tipFace", mode: "axes" }, "Trục dọc lo việc sau khi chạm bi. Trục ngang lo việc ở băng. Điểm chéo là làm cả hai việc cùng lúc."),
      p(
        "Trục dọc (cấp 3): trên tâm thì bi cái đi trước đường 90°, dưới tâm thì đi sau. Trục ngang (bài 4.2): thuận thì mở góc bật, nghịch thì dựng góc bật. Điểm chéo cộng hai tác dụng. Đây là cách nghĩ đủ dùng lúc đầu; thật ra trên và dưới tâm cũng làm đường sau băng dài ra hoặc ngắn lại đôi chút."
      ),
      h("Chọn điểm chạm bằng hai câu hỏi"),
      steps(
        "Sau khi chạm bi thứ nhất, bi cái cần đi trước, đúng, hay sau đường 90°? Câu trả lời cho bạn trên, giữa, hay dưới.",
        "Tới băng, bi cái cần bật rộng ra hay dựng lại, và nó đang trôi về phía nào dọc băng? Câu trả lời cho bạn trái, giữa, hay phải.",
        "Ghép hai câu trả lời thành một trong chín điểm. Nếu không cần băng, bỏ câu hỏi thứ hai và đánh không ê-phê."
      ),
      ex(
        "Giống cần điều khiển trò chơi điện tử: đẩy lên xuống là một việc, gạt trái phải là một việc khác, đẩy chéo là làm cả hai cùng lúc."
      ),
      h("Tự bấm thử"),
      {
        type: "explorer",
        explorer: {
          caption:
            "Bấm lên mặt bi cái để đổi điểm chạm. Đường bi cái hiện ngay; hướng và lực giữ nguyên. Thử lần lượt: trên rồi dưới (xem đoạn trước băng đổi thế nào), trái rồi phải (xem đoạn sau băng đổi thế nào).",
          balls: { cue: [7.1, -6.5], b1: [0.1, -12] },
          angleDeg: -132.1,
          power: 0.2057,
        },
      },
      mistakes(
        "Chạm quá xa tâm nên trượt đầu cơ. Luôn ở trong vòng giới hạn và nhớ lau lơ.",
        "Hạ hoặc nâng đuôi cơ không đều giữa các lần đánh, nên cùng một điểm chạm mà kết quả khác nhau.",
        "Dùng điểm chéo khi một trục đã đủ."
      ),
      key(
        "Trên, dưới: việc sau khi chạm bi. Trái, phải: việc ở băng.",
        "Hỏi hai câu, ghép lại thành một điểm chạm.",
        "Luôn ở trong vòng nửa bán kính."
      ),
      check(
        "Bi thứ hai nằm SAU đường 90°, và sau đó bi cái phải bật băng thật RỘNG khi đang trôi sang phải. Chọn điểm chạm nào?",
        ["Trên trái", "Dưới phải", "Dưới trái"],
        1,
        "Sau đường 90° thì chạm dưới. Trôi sang phải và cần mở rộng thì xoáy thuận, tức là phải. Ghép lại: dưới phải."
      ),
    ],
  },
]
