// Bai Hieu cua cap 5 (chon cach danh), 6 (gom bi), 7 (giu chuoi). Loi van va hinh ve tu
// soan; kien thuc va trinh tu day da doi chieu voi nguon ghi o docs/SOURCES.md, cho nao
// nguon khong xac nhan thi bai chi neu dieu mo phong cho thay. So lieu cua ban mo phong
// lay tu mo phong.
import type { Setup, Shot } from "../engine"
import { sliderToPower } from "../table/power"
import { check, dg, ex, fig, goal, h, key, mistakes, p, steps, type Lesson } from "./blocks"

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
      goal("có thói quen nhìn ra ít nhất hai cách ghi điểm trước khi cúi xuống đánh."),
      h("Thế nào cũng có hơn một cách"),
      p(
        "Gần như thế bi nào cũng có hơn một cách ghi điểm. Người mới thường thấy một cách rồi đánh luôn, và cách thấy đầu tiên ít khi là cách dễ nhất. Cấp này không dạy cú đánh mới; nó dạy cách chọn."
      ),
      h("Hai câu hỏi đầu tiên"),
      steps(
        "Chạm bi nào trước: bi vàng hay bi đỏ? Mỗi lựa chọn cho một đường 90° khác, tức là một hướng đi khác của bi cái.",
        "Từ bi thứ nhất sang bi thứ hai: đi thẳng, hay mượn một băng?"
      ),
      p(
        "Hai câu hỏi, mỗi câu hai đáp án, là bốn cách để xét. Phần lớn sẽ bị loại ngay vì bi cái rời đi về phía không có bi nào. Việc của bạn là xét đủ rồi mới loại."
      ),
      ex("Giống tìm đường trên bản đồ: có đường ngắn mà hẹp, có đường vòng mà rộng. Người lái quen sẽ nhìn cả hai rồi mới rẽ."),
      h("Tự bấm thử"),
      fig(
        "Cùng một thế, hai cách đều ghi điểm: chạm bi vàng trước và chạm bi đỏ trước.",
        { cue: [17.1, 5.7], b1: [13.9, 13.9], b2: [5.9, 13.8] },
        [
          { label: "Bi vàng trước", shot: raw(118.9, 0.1177) },
          { label: "Bi đỏ trước", shot: raw(136.1, 0.1177) },
        ],
        {
          predict: "nhìn thế bi. Với mỗi cách, bi cái sẽ rời bi thứ nhất về phía nào?",
          look: "bấm \"So sánh tất cả\" để thấy hai đường bi cái trên cùng một bàn. Cách nào bi cái phải đi ít hơn?",
          compare: "cue",
        }
      ),
      mistakes(
        "Thấy một cách là đánh ngay.",
        "Luôn chạm bi gần hơn trước. Bi gần chưa chắc cho đường đi tốt hơn.",
        "Đứng một chỗ mà chọn. Hãy đi một vòng quanh bàn; nhìn từ phía bi thứ hai thường thấy đường rõ hơn."
      ),
      key(
        "Trước mỗi cú: chạm bi nào trước, đi thẳng hay qua băng.",
        "Xét ít nhất hai cách rồi mới chọn."
      ),
      check(
        "Bạn thấy ngay một cách ghi điểm khá khó. Việc nên làm tiếp theo là gì?",
        ["Đánh luôn kẻo quên", "Hỏi thêm: nếu chạm bi kia trước thì sao, nếu qua một băng thì sao", "Đánh thật mạnh để tăng cơ hội"],
        1,
        "Cách thấy đầu tiên ít khi là cách dễ nhất. Xét đủ hai câu hỏi rồi mới chọn."
      ),
    ],
  },
  {
    id: "5.2",
    title: "Lời giải chắc là gì",
    body: [
      goal("so được hai cách ghi điểm xem cách nào chịu được sai số của tay mình tốt hơn."),
      h("Chắc nghĩa là chịu được sai"),
      p(
        "Không ai ngắm đúng tuyệt đối. Lời giải chắc là lời giải vẫn ghi điểm khi bạn ngắm lệch một chút hoặc đánh hơi quá tay. Có cú chỉ đúng trong nửa độ; có cú rộng tới bốn năm độ. Chọn cú rộng."
      ),
      h("Dấu hiệu một: bi thứ hai là bi to"),
      p(
        "Bi nằm giữa bàn là mục tiêu nhỏ: bi cái đi lệch ra ngoài là trượt. Bi nằm gần băng hoặc trong góc là mục tiêu to: bi cái đi lệch ra ngoài một chút vẫn chạm băng rồi bật lại vào nó. Người chơi gọi đó là bi to."
      ),
      dg({ kind: "bigBall" }, "Cùng một mức ngắm lệch (nét đứt). Bên trái trượt; bên phải vẫn ghi điểm nhờ băng."),
      h("Dấu hiệu hai: cú tự nhiên"),
      p(
        "Cú tự nhiên (bài 3.3: khoảng nửa bi, hơi trên tâm, không ê-phê) là cú chịu sai tốt nhất, vì chạm dày mỏng hơi lệch thì bi cái vẫn đi gần đúng đường cũ. Mỗi thứ thêm vào, ê-phê, kéo lùi sâu, lực mạnh, đều làm khoảng ngắm hẹp lại."
      ),
      h("Dấu hiệu ba: đường đi ngắn"),
      p(
        "Cùng lệch một độ, đi càng xa thì trật càng nhiều. Bi cái đi quãng ngắn thì sai số chưa kịp lớn. Điều này đúng cho cả quãng từ bi cái tới bi thứ nhất lẫn quãng từ bi thứ nhất tới bi thứ hai."
      ),
      ex("Giống ném bóng vào rổ có bảng: ném hơi lệch, bóng chạm bảng vẫn rơi vào. Bi nằm sát băng cũng có 'tấm bảng' như vậy."),
      h("Tự bấm thử"),
      fig(
        "Hai cách cùng đi qua bi vàng, mỗi cách cố ý ngắm lệch 1°.",
        { cue: [19.2, 14.9], b1: [22.6, 8.3], b2: [38, -2.6] },
        [
          { label: "Trực tiếp, lệch 1°", shot: raw(-48.6, 0.0977) },
          { label: "Qua băng, lệch 1°", shot: raw(-52.1, 0.1417) },
        ],
        {
          predict: "bi đỏ đang nằm gần băng. Cách nào còn ghi điểm khi đã ngắm lệch 1°?",
          look: "bi cái có chạm được bi đỏ không, và chạm bằng cách nào.",
          compare: "cue",
        }
      ),
      mistakes(
        "Chọn cú đẹp thay vì cú chắc.",
        "Thêm ê-phê theo thói quen, kể cả khi cú tự nhiên đã tới.",
        "Bỏ qua lời giải qua băng vì nghĩ băng là khó. Nếu bi thứ hai là bi to thì qua băng có khi dễ hơn."
      ),
      key(
        "Lời giải chắc: vẫn ghi điểm khi ngắm lệch một chút.",
        "Ba dấu hiệu: bi thứ hai là bi to, cú tự nhiên, đường đi ngắn."
      ),
      check(
        "Hai cách đều ghi được điểm. Cách A: cú tự nhiên, bi thứ hai nằm trong góc bàn. Cách B: phải dùng ê-phê mạnh, bi thứ hai nằm giữa bàn. Chọn cách nào?",
        ["Cách A", "Cách B", "Như nhau"],
        0,
        "Cách A có hai dấu hiệu của lời giải chắc: cú tự nhiên và bi thứ hai là bi to. Cách B thì ê-phê làm khó ngắm, lại nhắm vào bi nhỏ."
      ),
    ],
  },
  {
    id: "5.3",
    title: "Thứ tự chọn",
    body: [
      goal("có một thứ tự kiểm tra ngắn, dùng được cho mọi thế bi."),
      h("Ghi điểm trước, vị trí sau"),
      p(
        "Nguyên tắc xuyên suốt: ghi được điểm luôn là việc số một. Để ba bi nằm đẹp cho cú sau là việc số hai, và chỉ có nghĩa khi việc số một đã chắc. Khi hai việc mâu thuẫn, chọn ghi điểm."
      ),
      h("Bốn bước"),
      steps(
        "Với bi vàng trước: bi cái rời đi về phía nào? Có tới được bi đỏ bằng cú tự nhiên không?",
        "Hỏi lại như vậy với bi đỏ trước.",
        "Nếu cả hai đều được: chọn cách chắc hơn (bi to, đường ngắn, bài 5.2).",
        "Chỉ khi không có đường thẳng dùng được (hai bi đầu quá sát hoặc quá xa, bi thứ hai ở chỗ không với tới) mới nghĩ tới một băng, rồi mới tới ê-phê."
      ),
      p(
        "Từ cấp 6 sẽ thêm bước thứ năm: trong các cách ghi điểm chắc, cách nào để ba bi nằm gần nhau sau cú đánh."
      ),
      ex("Giống nấu ăn theo thứ tự quen tay: có gì trong tủ, món nào làm được, rồi mới tới món nào ngon. Không ai bắt đầu từ món khó nhất."),
      h("Tự bấm thử"),
      fig(
        "Một lời giải tự nhiên: không ê-phê, lực vừa, bi vàng trước.",
        { cue: [-18.4, 2.7], b1: [-23.7, -10.2], b2: [-32.1, -11.9] },
        [{ label: "Xem cú tự nhiên", shot: shot(-116.8, 54) }],
        {
          predict: "áp dụng bước một: chạm bi vàng trước thì bi cái rời đi về phía nào? Có gặp bi đỏ không?",
          look: "bi cái đổi hướng bao nhiêu sau khi chạm bi vàng, và nó tới bi đỏ mà không cần băng hay ê-phê.",
        }
      ),
      mistakes(
        "Nghĩ tới vị trí cho cú sau khi cú này còn chưa chắc ghi điểm.",
        "Nhảy thẳng tới băng và ê-phê mà chưa xét hai cú trực tiếp."
      ),
      key(
        "Ghi điểm trước, vị trí sau.",
        "Thứ tự: bi vàng trước, bi đỏ trước, chọn cách chắc, rồi mới tới băng và ê-phê."
      ),
      check(
        "Cách A ghi điểm rất chắc nhưng để bi hơi tản. Cách B có thể gom bi đẹp nhưng chỉ ghi được điểm khoảng một nửa số lần. Người mới nên chọn cách nào?",
        ["Cách A", "Cách B"],
        0,
        "Ghi điểm là việc số một. Trượt thì hết lượt, và thế bi đẹp đó thành của đối thủ."
      ),
    ],
  },
]

const KEEP: Setup = { cue: [-5, -8.3], b1: [-1.2, -2.5], b2: [-4.1, -3.4] }

export const LESSONS_6: Lesson[] = [
  {
    id: "6.1",
    title: "Nghĩ trước một cú",
    body: [
      goal("hiểu vì sao chỗ ba bi nằm sau cú đánh quan trọng ngang với việc ghi điểm."),
      h("Ghi điểm chỉ là một nửa việc"),
      p(
        "Trong phăng, ghi điểm xong bạn được đánh tiếp. Ba bi nằm gần nhau thì cú sau dễ; ba bi tản ra thì cú sau là một cú khó, và chuỗi đứt ở đó."
      ),
      dg({ kind: "cluster" }, "Hai kết quả của cùng một điểm vừa ghi. Bên trái còn đánh tiếp dài; bên phải sắp hết lượt."),
      p(
        "Người có chuỗi dài không phải vì họ làm được cú khó, mà vì họ ít khi để mình phải đánh cú khó. Trước mỗi cú, họ tự hỏi thêm hai câu."
      ),
      steps(
        "Đánh xong, bi thứ nhất chạy đi đâu và dừng ở đâu?",
        "Bi cái dừng ở đâu so với hai bi kia?"
      ),
      h("Công cụ đầu tiên: lực"),
      p(
        "Cách đơn giản nhất để giữ ba bi gần nhau là đánh vừa đủ lực để ghi điểm. Mọi phần lực thừa đều biến thành quãng đường thừa của cả ba bi (bài 1.1: lực thừa một chút, đường thừa nhiều)."
      ),
      ex("Giống chơi cờ: nước đi hay không chỉ là nước ăn được quân, mà là nước để lại thế tốt cho nước sau."),
      h("Tự bấm thử"),
      fig(
        "Cùng một hướng ngắm, hai mức lực. Cả hai đều ghi điểm.",
        KEEP,
        [
          { label: "Lực nhẹ", shot: shot(56.5, 30) },
          { label: "Lực mạnh", shot: shot(56.5, 56) },
        ],
        {
          predict: "cả hai cú đều ghi điểm. Vậy chúng khác nhau ở đâu?",
          look: "chỗ ba bi dừng sau mỗi cú. Hỏi mình: từ thế đó, cú tiếp theo dễ hay khó?",
        }
      ),
      mistakes(
        "Ghi điểm xong mới nhìn xem bi nằm đâu.",
        "Đánh mạnh cho chắc ăn: điểm thì có, thế bi thì mất.",
        "Lo vị trí tới mức đánh hụt điểm. Ghi điểm vẫn là việc số một."
      ),
      key(
        "Trước mỗi cú, hỏi: đánh xong ba bi nằm ở đâu?",
        "Công cụ đầu tiên là lực vừa đủ."
      ),
      check(
        "Hai cú cùng ghi điểm. Cú thứ nhất để ba bi trong một khoảng bằng bàn tay. Cú thứ hai để ba bi mỗi viên một góc bàn. Cú nào tốt hơn cho chuỗi?",
        ["Cú thứ nhất", "Cú thứ hai", "Như nhau vì cùng được một điểm"],
        0,
        "Điểm thì bằng nhau, nhưng cú thứ nhất để lại một cú dễ, cú thứ hai để lại một cú khó."
      ),
    ],
  },
  {
    id: "6.2",
    title: "Bi nào ở lại, bi nào chạy",
    body: [
      goal("dùng độ dày chạm để quyết định bi nào ở lại gần, bi nào bị đẩy đi."),
      h("Hai thứ quyết định chỗ bi nằm"),
      p(
        "Thứ nhất là lực (bài trước). Thứ hai là độ dày chạm, vì nó chia tốc độ cho hai bi (bài 2.3). Chạm dày: bi thứ nhất nhận gần hết tốc độ và chạy xa, bi cái ở lại. Chạm mỏng: bi thứ nhất chỉ nhích đi, bi cái đi tiếp."
      ),
      dg({ kind: "whoStays" }, "Mũi tên dài là bi chạy xa, mũi tên ngắn là bi ở lại gần."),
      h("Quy tắc: muốn bi nào ở lại thì đừng truyền tốc độ cho nó"),
      steps(
        "Bi thứ nhất đang nằm đẹp, gần bi thứ hai: chạm mỏng để nó ở yên.",
        "Bi thứ nhất nằm xa hai bi kia: chạm dày hơn để đẩy nó về phía chúng.",
        "Bi thứ hai hầu như không dời chỗ nếu bi cái tới nó vừa hết đà: cố để bi cái chạm nó thật nhẹ."
      ),
      p(
        "Kiểu chơi này trong sách dạy phăng gọi là đặt bi: không cố đưa bi về từ xa, chỉ làm sao cho hai bi mục tiêu ít bị xê dịch nhất và bi cái dừng ngay cạnh chúng."
      ),
      ex("Giống đẩy xích đu: chạm nhẹ vào cạnh thì xích đu gần như đứng yên còn tay bạn đi tiếp; đẩy chính giữa thì xích đu văng đi còn bạn đứng lại."),
      h("Tự bấm thử"),
      fig(
        "Cùng lực, chạm dày và chạm mỏng vào bi vàng.",
        { cue: [-30, 0], b1: [-25, 0] },
        [
          { label: "Chạm dày", shot: shot(5.7, 50) },
          { label: "Chạm mỏng", shot: shot(19.9, 50) },
        ],
        {
          predict: "ở cú nào bi vàng chạy xa hơn?",
          look: "bấm \"So sánh tất cả\": hai đường của bi vàng, một dài một rất ngắn. Rồi bấm từng nút để xem bi cái đi bao xa.",
          compare: "b1",
        }
      ),
      mistakes(
        "Chạm dày vào một bi đang nằm đẹp: nó chạy mất.",
        "Chạm mỏng mà giữ lực của cú chạm dày: bi cái chạy quá xa.",
        "Để bi cái đập mạnh vào bi thứ hai: bi thứ hai cũng bị đẩy khỏi chỗ đẹp."
      ),
      key(
        "Chạm dày: bi thứ nhất chạy, bi cái ở lại.",
        "Chạm mỏng: bi thứ nhất ở lại, bi cái đi tiếp.",
        "Bi cái nên tới bi thứ hai vừa hết đà."
      ),
      check(
        "Bi vàng nằm xa, bi đỏ nằm gần bi cái. Bạn chạm bi vàng trước và muốn nó chạy về phía bi đỏ. Chạm thế nào?",
        ["Chạm mỏng", "Chạm dày hơn", "Độ dày không liên quan"],
        1,
        "Chạm dày truyền nhiều tốc độ cho bi vàng, đủ để nó đi được quãng xa về phía bi đỏ."
      ),
    ],
  },
  {
    id: "6.3",
    title: "Gom bi từ xa",
    body: [
      goal("hiểu ý tưởng của cú gom bi và biết khi nào nên thử, khi nào không."),
      h("Cú gom bi là gì"),
      p(
        "Khi ba bi đã tản ra, cú gom bi là cú vừa ghi điểm vừa đưa chúng về gần nhau. Ở câu lạc bộ gọi là gom bi (ví dụ \"một băng gom\"); sách tiếng Pháp gọi là rappel, tiếng Anh là gather shot."
      ),
      h("Cách nghĩ: điểm hẹn"),
      p(
        "Bi thứ hai (bi ghi điểm) thường là bi ít di chuyển nhất, nên hãy coi chỗ nó nằm là điểm hẹn. Việc của cú gom là đưa bi thứ nhất quay về gần điểm hẹn đó, đi thẳng hoặc đi vòng qua một, hai băng, trong khi bi cái cũng tới đó để ghi điểm."
      ),
      dg({ kind: "meeting" }, "Vòng nét đứt quanh bi đỏ là điểm hẹn. Bi cái và bi vàng đi hai đường khác nhau nhưng cùng kết thúc ở đó."),
      h("Ba câu hỏi trước khi thử"),
      steps(
        "Đường của bi thứ nhất có thể tới được vùng điểm hẹn không? Nếu không thì đừng cố gom ở cú này.",
        "Cần độ dày nào để bi thứ nhất đủ đà đi hết quãng đó mà bi cái vẫn tới được bi thứ hai? Độ dày vừa quyết định hướng, vừa chia tốc độ.",
        "Hai bi có đụng nhau giữa đường không? Hãy để bi cái tới điểm hẹn trước bi thứ nhất. Hai bi đụng nhau giữa đường là hỏng cú; người chơi gọi là bị đá."
      ),
      p(
        "Cú gom bi khó vì phải đúng ba thứ cùng lúc: hướng, độ dày, lực. Khi yêu cầu ghi điểm và yêu cầu gom mâu thuẫn nhau, ghi điểm thắng. Không thấy cách gom thì ghi điểm chắc trước, hoặc dùng kiểu đặt bi của bài 6.2, rồi gom ở cú sau."
      ),
      ex("Giống hẹn bạn ở quán cà phê: ai cũng đi đường của mình, miễn là tới cùng một chỗ, và đừng tông nhau giữa đường."),
      h("Tự bấm thử"),
      fig(
        "Cùng một thế, cùng hướng ngắm, hai cách đánh.",
        { cue: [2.9, -3.6], b1: [-10.5, 2.2], b2: [-9.4, 9.2] },
        [
          { label: "Dưới tâm, lực vừa", shot: shot(152, 50, -0.6) },
          { label: "Giữa tâm, mạnh hơn", shot: shot(152, 62) },
        ],
        {
          predict: "cú nào để ba bi gần nhau hơn? Cú nào có nguy cơ trượt bi đỏ?",
          look: "cú thứ nhất ghi điểm và ba bi dừng gần nhau. Cú thứ hai quá lực: bi cái chạy vượt bi đỏ, vừa trượt vừa làm bi tản ra.",
          compare: "cue",
        }
      ),
      mistakes(
        "Cố gom ở mọi cú, kể cả khi đường của bi thứ nhất không thể về tới điểm hẹn.",
        "Chỉ tính đường bi cái, quên rằng bi thứ nhất cũng đang chạy và có thể cắt ngang đường đó.",
        "Đánh quá lực: bi thứ nhất về tới nơi rồi lại chạy tiếp."
      ),
      key(
        "Gom bi: đưa bi thứ nhất về gần bi thứ hai trong lúc ghi điểm.",
        "Coi chỗ bi thứ hai nằm là điểm hẹn.",
        "Ghi điểm vẫn là việc số một; không gom được thì đặt bi."
      ),
      check(
        "Bạn thấy một đường gom bi, nhưng bi thứ nhất sẽ đi ngang qua đúng đường bi cái đang tới bi thứ hai. Nên làm gì?",
        ["Cứ đánh, đụng nhau là chuyện may rủi", "Đổi lực hoặc độ dày để bi cái tới trước, hoặc chọn cách khác", "Đánh mạnh hơn để hai bi qua nhanh"],
        1,
        "Hai bi đụng nhau giữa đường thì mất điểm. Phải sắp xếp để bi cái tới điểm hẹn trước, hoặc bỏ cách đó."
      ),
    ],
  },
]

export const LESSONS_7: Lesson[] = [
  {
    id: "7.1",
    title: "Đánh nhỏ",
    body: [
      goal("đổi cách nghĩ khi ba bi đã nằm gần nhau: từ ghi một điểm sang giữ nguyên thế bi."),
      h("Mục tiêu đổi hẳn"),
      p(
        "Khi ba bi đã nằm gần nhau, bạn đang có thứ quý nhất của phăng. Mục tiêu không còn là ghi một điểm đẹp, mà là ghi điểm theo cách ít làm xáo trộn nhất: bi cái đi vài phân, hai bi kia gần như không nhúc nhích. Sau cú đánh, thế bi phải gần giống trước cú đánh."
      ),
      dg({ kind: "smallGame" }, "Cùng một thế ba bi gần nhau, hai cách đánh. Cả hai có thể cùng ghi điểm; chỉ một cách còn đánh tiếp được."),
      h("Kỹ thuật"),
      steps(
        "Kéo cơ thật ngắn, đưa cơ chậm và đều. Lực của cú nhỏ đến từ quãng kéo ngắn, không phải từ việc hãm tay.",
        "Chạm mỏng vào bi thứ nhất để nó ít dời chỗ (bài 6.2).",
        "Để bi cái tới bi thứ hai vừa hết đà.",
        "Đánh xong, nhìn lại: thế bi còn giống lúc nãy không?"
      ),
      p(
        "Kiểu chơi này gọi là nuôi bi. Những chuỗi kỷ lục hàng trăm điểm trong lịch sử phăng đều đến từ rất nhiều cú nhỏ lặp lại, không phải từ cú khó. Luật vùng góc (bài 7.3) và các lối chơi có kẻ vạch ra đời chính là để hạn chế kiểu đánh đó."
      ),
      ex("Giống tâng bóng: người tâng được trăm lần không đá mạnh lần nào, họ chỉ chạm vừa đủ để quả bóng ở nguyên chỗ."),
      h("Tự bấm thử"),
      fig(
        "Ba bi rất gần nhau. Cùng hướng ngắm, cú nhỏ và cú quá tay.",
        { cue: [16.3, -4.3], b1: [12.1, -2.1], b2: [15.6, -1.5] },
        [
          { label: "Cú nhỏ", shot: shot(145.4, 18) },
          { label: "Quá tay", shot: shot(145.4, 46) },
        ],
        {
          predict: "sau cú quá tay, ba bi còn nằm trong một khoảng nhỏ không?",
          look: "so thế bi TRƯỚC và SAU mỗi cú. Bấm \"Về thế ban đầu\" để nhìn lại thế cũ.",
        }
      ),
      mistakes(
        "Ba bi đang gần mà vẫn đánh với lực quen tay của cú thường.",
        "Hãm cơ lại giữa chừng để đánh nhẹ: cú đánh giật và lệch. Hãy kéo ngắn rồi đưa cơ trọn vẹn.",
        "Chạm dày vào bi thứ nhất: nó bị đẩy ra khỏi cụm."
      ),
      key(
        "Ba bi gần nhau: giữ thế quan trọng hơn ghi điểm đẹp.",
        "Kéo cơ ngắn, chạm mỏng, bi cái tới nơi vừa hết đà.",
        "Chuỗi dài là rất nhiều cú nhỏ."
      ),
      check(
        "Ba bi nằm trong một khoảng bằng bàn tay. Bạn có hai cách cùng ghi điểm: một cú nhẹ, bi cái đi vài phân; và một cú mạnh, đẹp mắt, bi cái đi một vòng bàn. Chọn cú nào?",
        ["Cú nhẹ", "Cú mạnh", "Như nhau"],
        0,
        "Cú nhẹ giữ nguyên thế bi nên còn đánh tiếp được nhiều cú dễ. Cú mạnh làm ba bi tản ra."
      ),
    ],
  },
  {
    id: "7.2",
    title: "Bi sát băng",
    body: [
      goal("biết lợi dụng băng để giữ bi, và tránh được kiểu đánh làm bi văng ra giữa bàn."),
      h("Băng vừa giúp vừa hại"),
      p(
        "Giúp: bi nằm gần băng là bi to (bài 5.2), và nó không chạy xa được vì băng chặn lại. Hại: đánh quá lực, hoặc đánh thẳng góc vào một bi đang dính băng, thì nó bật mạnh ra giữa bàn và thế đang đẹp tan mất."
      ),
      dg({ kind: "railBall" }, "Cùng một bi vàng sát băng. Bên trái: đánh vuông góc, bi bật ra xa. Bên phải: đánh nhẹ dọc băng, bi ở lại."),
      h("Cách đánh"),
      steps(
        "Hai bi nằm dọc băng: đánh dọc theo băng, với lực nhỏ nhất còn ghi được điểm.",
        "Một bi dính sát băng: tránh đánh thẳng góc vào nó. Nó không có chỗ đi nên sẽ bật ngược ra.",
        "Muốn đẩy một bi về phía băng: đẩy xiên và nhẹ, để băng hãm nó lại thay vì bật nó ra."
      ),
      p(
        "Kiểu nuôi bi nổi tiếng nhất trong lịch sử phăng là giữ hai bi mục tiêu sát một băng rồi nhích chúng từng chút dọc theo băng đó, mỗi cú lại trả về gần đúng thế cũ. App không dạy kỹ thuật này; ở đây bạn chỉ cần hiểu vì sao băng là chỗ giữ bi tốt."
      ),
      ex("Giống dắt xe máy sát lề đường: đi chậm thì lề giữ cho xe thẳng, đi nhanh mà chạm lề thì xe bật ra."),
      h("Tự bấm thử"),
      fig(
        "Hai bi nằm sát băng trên. Cùng hướng ngắm, hai mức lực.",
        { cue: [-5.8, 14.7], b1: [-7.9, 19.8], b2: [-3.8, 21.8] },
        [
          { label: "Lực nhỏ", shot: shot(91.6, 26) },
          { label: "Lực lớn", shot: shot(91.6, 52) },
        ],
        {
          predict: "với lực lớn, hai bi còn ở gần băng không?",
          look: "hai bi mục tiêu sau mỗi cú: còn nằm sát băng, hay đã bật ra giữa bàn.",
        }
      ),
      mistakes(
        "Đánh thẳng góc vào bi dính băng.",
        "Dùng lực của cú giữa bàn cho cú sát băng: băng trả lực lại và bi văng ra.",
        "Quên rằng chính bi cái cũng bật băng: tính xem sau khi bật nó dừng ở đâu."
      ),
      key(
        "Bi gần băng là bi to và khó chạy xa.",
        "Đánh dọc băng, lực nhỏ.",
        "Tránh đánh thẳng góc vào bi dính băng."
      ),
      check(
        "Bi vàng đang dính sát băng. Bạn phải chạm nó trước. Hướng chạm nào dễ làm nó văng ra giữa bàn nhất?",
        ["Chạm mỏng, bi cái đi dọc theo băng", "Chạm đầy, thẳng góc vào băng", "Hai cách như nhau"],
        1,
        "Chạm đầy thẳng góc: bi vàng bị ép vào băng, không có chỗ đi, nên băng đẩy nó bật ngược ra."
      ),
    ],
  },
  {
    id: "7.3",
    title: "Vùng góc và luật",
    body: [
      goal("hiểu luật vùng góc của phăng tự do và biết bật nó trong app."),
      h("Vì sao có luật này"),
      p(
        "Góc bàn là chỗ giữ bi dễ nhất: hai băng chặn hai phía, hai bi mục tiêu gần như không đi đâu được. Vì quá dễ, người giỏi có thể ghi hàng trăm điểm mà bi không rời góc. Luật thi đấu phăng tự do đặt giới hạn cho việc đó."
      ),
      h("Bốn tam giác"),
      dg({ kind: "cornerZones" }, "Mỗi góc bàn có một tam giác. Phần còn lại của bàn không có giới hạn nào."),
      p("Cạnh dọc băng dài bằng một phần tư chiều dài bàn (71 cm), cạnh dọc băng ngắn bằng một phần tư chiều rộng (35,5 cm)."),
      h("Luật, từng bước"),
      steps(
        "Khi CẢ HAI bi mục tiêu cùng nằm trong một tam giác, bạn được ghi thêm một điểm mà chúng vẫn ở trong.",
        "Cú tiếp theo phải đưa ít nhất một bi mục tiêu ra khỏi tam giác. Bi đó được phép quay lại ngay trong cùng cú đánh.",
        "Không đưa ra được thì điểm của cú đó không tính và hết lượt.",
        "Bi nằm đúng trên vạch tính là ở trong. Vị trí bi cái không tính."
      ),
      p(
        "Chơi phong trào thường bỏ luật này. App để nó là tùy chọn: bật trong Cài đặt, rồi vào Đánh chuỗi sẽ thấy bốn tam giác và lời nhắc khi bi vào vùng."
      ),
      ex("Giống luật ba giây trong bóng rổ: không ai cấm bạn vào khu vực dưới rổ, chỉ cấm đứng lì ở đó."),
      h("Tự bấm thử"),
      fig(
        "Hai bi mục tiêu trong góc. Một cú nhỏ ghi điểm mà cả hai bi vẫn ở trong góc.",
        { cue: [42.7, -13.4], b1: [38, -21.6], b2: [38, -18.4] },
        [{ label: "Xem cú đánh", shot: shot(243, 28) }],
        {
          predict: "nếu luật vùng góc đang bật, sau cú này bạn còn được ghi thêm điểm nào trong góc nữa không?",
          look: "hai bi mục tiêu vẫn ở trong góc sau cú đánh. Theo luật, cú kế tiếp phải đưa ít nhất một bi ra ngoài.",
        }
      ),
      mistakes(
        "Tưởng luật cấm đánh trong góc. Luật chỉ giới hạn số điểm ghi liên tiếp khi hai bi mục tiêu cùng ở trong một góc.",
        "Tính cả bi cái. Chỉ vị trí của hai bi mục tiêu mới tính.",
        "Đưa bi ra bằng cú mạnh làm tan cả thế. Chỉ cần một bi ra khỏi vạch rồi quay lại."
      ),
      key(
        "Bốn tam giác ở bốn góc: 71 cm và 35,5 cm.",
        "Hai bi mục tiêu cùng trong một tam giác: được một điểm, cú sau phải đưa một bi ra.",
        "Bi ra rồi được quay lại ngay."
      ),
      check(
        "Luật vùng góc đang bật. Hai bi mục tiêu cùng trong một tam giác, bạn vừa ghi một điểm và cả hai vẫn ở trong. Cú tiếp theo bạn ghi điểm nhưng không bi mục tiêu nào ra khỏi tam giác. Kết quả?",
        ["Được thêm một điểm", "Điểm đó không tính và hết lượt", "Được điểm nhưng bị cảnh cáo"],
        1,
        "Sau một điểm trong vùng, cú kế tiếp phải đưa ít nhất một bi mục tiêu ra. Không đưa ra được thì điểm không tính và hết lượt."
      ),
    ],
  },
]
