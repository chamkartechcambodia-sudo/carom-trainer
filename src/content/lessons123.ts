// Bai Hieu cua cap 1, 2, 3. Loi van va hinh ve tu soan; kien thuc va trinh tu day da doi
// chieu voi nguon ghi o docs/SOURCES.md. Moi bai: muc tieu -> tung y nho co hinh ve -> ban
// mo phong de tu bam -> loi hay gap -> ghi nho -> tu kiem tra (D21). So lieu cua ban mo
// phong (huong, luc) lay tu mo phong, xem docs/LEVELS.md.
import type { Setup, Shot } from "../engine"
import { sliderToPower } from "../table/power"
import { check, dg, ex, fig, goal, h, key, mistakes, p, steps, type Lesson } from "./blocks"

export type { Block, Lesson } from "./blocks"

/** Cu danh theo nac thanh luc. */
const shot = (angleDeg: number, slider: number, tipY = 0): Shot => ({
  angleDeg,
  power: sliderToPower(slider),
  tip: { x: 0, y: tipY },
})

export const LESSONS_1: Lesson[] = [
  {
    id: "1.1",
    title: "Lực quyết định quãng đường",
    body: [
      goal("hiểu vì sao thêm một chút lực mà bi lăn xa hơn hẳn, và vì sao người mới nên tập cú nhẹ trước."),
      h("Lực để làm gì"),
      p(
        "Trong phăng, một điểm được ghi khi bi cái chạm cả hai bi kia. Nhưng lực không chỉ để bi cái tới nơi. Lực quyết định ba viên bi nằm ở đâu sau cú đánh, tức là cú tiếp theo dễ hay khó. Đánh mạnh thì cả ba bi chạy tán loạn; đánh vừa đủ thì chúng ở lại gần nhau."
      ),
      h("Tốc độ gấp đôi, quãng đường gấp bốn"),
      p(
        "Khi bi chỉ lăn trên nỉ, quãng đường không tăng đều theo tốc độ. Tốc độ ban đầu gấp đôi thì bi lăn xa gấp khoảng bốn lần; gấp ba thì xa gấp khoảng chín lần."
      ),
      dg({ kind: "speedDistance" }, "Mũi tên là quãng đường bi lăn. Tốc độ tăng đều, còn quãng đường tăng vọt."),
      p(
        "Hệ quả cho tay bạn: ở vùng lực nhẹ, chỉ nhích tay thêm một chút là chỗ bi dừng đã khác rõ. Vì thế cú nhẹ khó đúng hơn cú mạnh, và cần tập nhiều nhất."
      ),
      ex("Giống quãng phanh của xe máy: chạy 40 km/giờ thì xe trôi xa gấp khoảng bốn lần so với 20 km/giờ, không phải gấp đôi."),
      h("Tự bấm thử"),
      fig(
        "Hai cú lăn thẳng, cùng điểm xuất phát. Tốc độ của nút thứ hai gấp đôi nút thứ nhất.",
        { cue: [-42, 0] },
        [
          { label: "Tốc độ ×1", shot: shot(0, 34) },
          { label: "Tốc độ ×2", shot: shot(0, 48.5) },
        ],
        {
          predict: "bấm nút thứ nhất, nhớ chỗ bi dừng. Nút thứ hai sẽ đưa bi tới đâu: gấp đôi quãng đó, hay xa hơn?",
          look: "chỗ bi dừng của hai lần. Lần hai xa gấp khoảng bốn lần, không phải gấp đôi.",
        }
      ),
      mistakes(
        "Đánh mạnh cho chắc tới. Bi tới thật, nhưng ba bi tản ra và cú sau thành cú khó.",
        "Nghĩ rằng thêm một ít lực thì bi đi thêm một ít đường. Thực tế bi đi thêm nhiều hơn bạn tưởng."
      ),
      key(
        "Lực quyết định chỗ ba bi nằm sau cú đánh, không chỉ là tới hay không tới.",
        "Tốc độ gấp đôi thì quãng đường gấp khoảng bốn.",
        "Tập cú nhẹ trước; cú nhẹ cần chính xác nhất."
      ),
      check(
        "Bạn đánh một cú, bi lăn được nửa chiều dài bàn. Lần sau bạn đưa cơ nhanh gấp đôi. Bi sẽ lăn khoảng bao xa (nếu bàn đủ dài)?",
        ["Một chiều dài bàn", "Hai chiều dài bàn", "Ba chiều dài bàn"],
        1,
        "Tốc độ gấp đôi thì quãng đường gấp khoảng bốn: nửa bàn nhân bốn là hai chiều dài bàn."
      ),
    ],
  },
  {
    id: "1.2",
    title: "Băng ăn bớt lực",
    body: [
      goal("biết mỗi lần chạm băng bi mất bao nhiêu sức, để chọn lực cho cú có đi qua băng."),
      h("Băng không trả lại đủ"),
      p(
        "Mỗi lần chạm băng, bi mất một phần tốc độ. Mất nhiều hay ít tùy vào góc bi tới băng. Đâm thẳng vào băng thì mất nhiều nhất. Đi sượt dọc băng thì gần như không mất."
      ),
      dg({ kind: "cushionLoss" }, "Bên trái: bi đâm thẳng, bật ra chậm hẳn. Bên phải: bi đi sượt, bật ra gần như còn nguyên tốc độ."),
      h("Hệ quả khi chọn lực"),
      p(
        "Cùng một quãng đường, cú có qua băng cần lực lớn hơn cú lăn thẳng. Càng qua nhiều băng, càng phải cộng thêm. Và nhớ bài trước: mất một phần tốc độ nghĩa là mất phần quãng đường còn lớn hơn."
      ),
      p(
        "Băng của mỗi bàn nảy khác nhau, bàn mới và bàn cũ cũng khác. Mô phỏng chỉ cho bạn thấy quy luật; mất bao nhiêu thì phải tự đo trên bàn mình tập."
      ),
      ex("Giống ném quả bóng vào tường: bóng bật lại luôn chậm hơn lúc ném tới. Ném xiên sượt qua tường thì bóng gần như không chậm đi."),
      h("Tự bấm thử"),
      fig(
        "Ba mức lực, cùng đâm thẳng vào băng ngắn bên phải.",
        { cue: [-10, 0] },
        [
          { label: "Vừa tới băng", shot: shot(0, 50) },
          { label: "Bật về một đoạn", shot: shot(0, 56) },
          { label: "Bật về tới giữa bàn", shot: shot(0, 62) },
        ],
        {
          predict: "bi đi tới băng mất một quãng. Muốn nó bật về đúng quãng đó thì lực phải gấp đôi, hay hơn nữa?",
          look: "quãng bi đi được SAU khi chạm băng so với quãng trước khi chạm. Bi chạy chậm hẳn sau băng.",
        }
      ),
      mistakes(
        "Chọn lực như cú lăn thẳng cho một cú có qua băng: bi dừng trước khi tới đích.",
        "Tin con số của bàn khác. Mỗi bàn một kiểu băng; lên bàn lạ hãy đánh thử vài cú qua băng trước."
      ),
      key(
        "Mỗi lần chạm băng bi mất một phần tốc độ.",
        "Đâm thẳng mất nhiều, đi sượt mất ít.",
        "Cú qua băng cần lực lớn hơn cú lăn thẳng cùng quãng đường."
      ),
      check(
        "Hai cú cùng đưa bi cái đi một quãng dài như nhau. Cú A lăn thẳng. Cú B đâm thẳng vào băng rồi bật về. Cú nào cần lực lớn hơn?",
        ["Cú A", "Cú B", "Như nhau"],
        1,
        "Cú B mất một phần tốc độ ở băng, nên phải đánh mạnh hơn để bù lại."
      ),
    ],
  },
  {
    id: "1.3",
    title: "Ba mức lực chuẩn của bạn",
    body: [
      goal("có ba mức lực quen tay để từ đó cộng trừ, thay vì đoán lại từ đầu ở mỗi cú."),
      h("Không ai tính lực bằng con số"),
      p(
        "Người chơi lâu năm không nghĩ \"cú này 37 phần trăm\". Họ có sẵn vài mức chuẩn trong tay, rồi nghĩ \"nhẹ hơn mức vừa một chút\". Bạn cần tự tạo các mức chuẩn đó. Ba mức là đủ để bắt đầu."
      ),
      dg({ kind: "threeSpeeds" }, "Ba mức chuẩn đo bằng chính cái bàn: nửa bàn, hết bàn, đi rồi về."),
      steps(
        "Nhẹ: bi lăn nửa chiều dài bàn rồi dừng.",
        "Vừa: bi lăn hết một chiều dài bàn, dừng sát băng ngắn bên kia.",
        "Mạnh: bi tới băng ngắn bên kia rồi quay về gần chỗ xuất phát."
      ),
      h("Lực đến từ đâu"),
      p(
        "Lực không đến từ việc gồng tay. Nó đến từ quãng kéo cơ về sau và độ nhanh khi đưa cơ tới. Muốn nhẹ thì kéo ngắn và đưa chậm; muốn mạnh thì kéo dài hơn. Tay cầm cơ luôn lỏng. Trong app, khung kéo cơ mô phỏng đúng ý này: kéo càng xa thì lực càng lớn."
      ),
      h("Chạm hơi trên tâm khi tập lực"),
      p(
        "Chạm giữa tâm thì bi trượt một đoạn rồi mới lăn (bài 3.3 giải thích kỹ), nên quãng đường giữa các lần đánh dễ lệch nhau. Chạm hơi trên tâm thì bi lăn gần như ngay từ đầu, quãng đường đều hơn."
      ),
      dg({ kind: "tipFace", mode: "high" }, "Mặt bi cái nhìn từ phía người đánh. Chấm đỏ là chỗ đầu cơ chạm khi tập lực."),
      ex("Giống người bán hàng quen tay bốc đúng một lạng: họ không cân từng lần, họ nhớ cảm giác của vài mức chuẩn."),
      h("Tự bấm thử"),
      fig(
        "Ba mức lực trên bàn mô phỏng. Trên bàn thật, bạn tìm ba mức của riêng mình.",
        { cue: [-42, 0] },
        [
          { label: "Nhẹ", shot: shot(0, 45, 0.4) },
          { label: "Vừa", shot: shot(0, 54, 0.4) },
          { label: "Mạnh", shot: shot(0, 66, 0.4) },
        ],
        { look: "chỗ bi dừng của từng mức, so với hình vẽ ba mức ở trên." }
      ),
      mistakes(
        "Gồng tay, bóp chặt cơ để đánh mạnh: bi đi lệch và lực không đều.",
        "Dừng cơ đột ngột ngay khi chạm bi. Hãy đưa cơ đi tiếp qua chỗ bi nằm một đoạn.",
        "Mỗi lần đánh một kiểu kéo cơ khác nhau, nên không bao giờ có mức chuẩn."
      ),
      key(
        "Ba mức chuẩn: nửa bàn, hết bàn, đi rồi về.",
        "Lực đến từ quãng kéo cơ và độ nhanh đưa cơ, không phải từ gồng tay.",
        "Tập lực thì chạm hơi trên tâm để bi lăn đều."
      ),
      check(
        "Bạn cần bi lăn khoảng ba phần tư chiều dài bàn. Nghĩ thế nào là hợp lý nhất?",
        ["Đánh mức mạnh rồi hy vọng", "Lấy mức vừa (hết bàn) rồi bớt đi một chút", "Lấy mức nhẹ (nửa bàn) rồi nhân đôi lực"],
        1,
        "Ba phần tư bàn gần với mức vừa nhất, nên bớt từ mức vừa. Nhân đôi lực của mức nhẹ sẽ đưa bi đi xa gấp bốn, tức hai chiều dài bàn."
      ),
    ],
  },
]

export const LESSONS_2: Lesson[] = [
  {
    id: "2.1",
    title: "Độ dày chạm",
    body: [
      goal("gọi tên được năm độ dày chạm, biết ngắm vào đâu để có từng độ dày, và đoán được bi mục tiêu chạy về hướng nào."),
      h("Độ dày chạm là gì"),
      p(
        "Hãy đứng sau bi cái và nhìn theo hướng đánh. Lúc hai bi chạm nhau, bi cái che lên bi mục tiêu một phần. Phần bị che đó là độ dày chạm (người chơi gọi tắt là độ dày, hoặc đánh dày, đánh mỏng)."
      ),
      dg(
        { kind: "thickness" },
        "Năm mức hay dùng. Nửa bi là mốc dễ ngắm nhất: tâm bi cái nhắm đúng vào mép bi mục tiêu."
      ),
      h("Ngắm bằng bi ma"),
      p(
        "Bi ma là một viên bi tưởng tượng: chỗ bi cái sẽ nằm đúng lúc nó chạm bi mục tiêu. Bạn không ngắm vào bi mục tiêu; bạn đưa bi cái tới chỗ bi ma. Muốn chạm dày thì đặt bi ma che nhiều; muốn chạm mỏng thì đặt nó lệch ra ngoài."
      ),
      dg({ kind: "ghost" }, "Nhìn từ trên xuống. Vòng nét đứt là bi ma. Bi vàng luôn chạy theo đường nối tâm bi ma với tâm của nó."),
      p(
        "Từ hình trên có một quy tắc chắc chắn: bi mục tiêu chạy theo đường nối hai tâm lúc chạm. Chạm đầy thì nó chạy thẳng theo hướng đánh. Chạm càng mỏng thì nó chạy càng lệch sang bên: 3/4 bi lệch khoảng 15°, nửa bi đúng 30°, 1/4 bi khoảng 49°."
      ),
      ex(
        "Giống hai người đi ngược chiều va vai nhau: va chính diện thì người kia bị đẩy thẳng ra sau, sượt vai thì người kia chỉ bị hất nhẹ sang bên."
      ),
      h("Tự bấm thử"),
      fig(
        "Cùng lực, năm độ dày chạm vào bi vàng.",
        { cue: [-12, 0], b1: [-5, 0] },
        [
          { label: "Đầy", shot: shot(0, 64) },
          { label: "3/4 bi", shot: shot(4.1, 64) },
          { label: "Nửa bi", shot: shot(8.2, 64) },
          { label: "1/4 bi", shot: shot(12.4, 64) },
          { label: "Mỏng", shot: shot(15.3, 64) },
        ],
        {
          predict: "chạm càng mỏng thì bi vàng chạy lệch nhiều hơn hay ít hơn? Chạy nhanh hơn hay chậm hơn?",
          look: "bấm \"So sánh tất cả\" để thấy năm đường của bi vàng xòe ra như nan quạt. Chạm càng mỏng, bi vàng càng lệch và càng chậm.",
          compare: "b1",
        }
      ),
      mistakes(
        "Ngắm thẳng vào chỗ muốn chạm trên bi mục tiêu. Phải ngắm tâm bi cái tới tâm bi ma.",
        "Hai bi càng xa nhau thì càng khó chạm đúng độ dày. Người mới nên tập ở cự ly gần trước.",
        "Nhiều người cắt bên trái chuẩn hơn bên phải hoặc ngược lại. Hãy tập cả hai bên."
      ),
      key(
        "Độ dày chạm là phần bi cái che lên bi mục tiêu, nhìn theo hướng đánh.",
        "Ngắm bằng bi ma: đưa tâm bi cái tới tâm bi ma.",
        "Bi mục tiêu chạy theo đường nối hai tâm. Nửa bi thì lệch 30°."
      ),
      check(
        "Muốn chạm nửa bi, bạn nhắm tâm bi cái vào đâu?",
        ["Vào tâm bi mục tiêu", "Vào đúng mép ngoài của bi mục tiêu", "Ra ngoài bi mục tiêu một viên bi"],
        1,
        "Nhắm tâm bi cái vào mép bi mục tiêu thì bi cái che đúng một nửa bi mục tiêu lúc chạm."
      ),
    ],
  },
  {
    id: "2.2",
    title: "Đường 90°",
    body: [
      goal("đoán được bi cái đi hướng nào sau khi chạm bi thứ nhất. Đây là việc quan trọng nhất của phăng, vì bi cái còn phải tới bi thứ hai."),
      h("Hai bi tách nhau vuông góc"),
      p(
        "Bài trước cho biết bi mục tiêu chạy theo đường nối hai tâm. Còn bi cái? Khi bi cái tới nơi mà không xoáy tới cũng không xoáy lui, nó rời đi theo đường vuông góc với đường nối tâm. Đường đó gọi là đường 90°. Đỉnh của góc vuông nằm ở tâm bi ma."
      ),
      dg({ kind: "ghost", tangent: true }, "Bi vàng đi một đường, bi cái đi đường vuông góc với nó. Dấu góc vuông nằm ở tâm bi ma."),
      p("Cách dựng trong đầu, ba bước:"),
      steps(
        "Tìm bi ma: chỗ bi cái sẽ nằm lúc chạm.",
        "Vạch đường từ tâm bi ma qua tâm bi mục tiêu: bi mục tiêu chạy theo đường này.",
        "Từ tâm bi ma, vạch đường vuông góc với đường vừa rồi, về phía bi cái đang lệch sang: đó là đường 90°."
      ),
      h("Điều kiện: bi cái còn trượt lúc chạm"),
      p(
        "Đường 90° chỉ đúng khi bi cái không còn xoáy tới hay xoáy lui lúc chạm. Đánh giữa tâm thì bi chỉ trượt một đoạn rồi tự lăn, và một viên bi đang lăn là đang xoáy tới. Khi đó bi cái rời theo đường 90° một quãng ngắn rồi cong về phía trước."
      ),
      dg(
        { kind: "ghost", tangent: true, paths: ["follow"] },
        "Đường chấm là đường 90°. Bi cái đã lăn lúc chạm thì đi đường cong: lệch về phía trước đường 90°."
      ),
      p(
        "Nói gọn: bi mục tiêu ở gần và lực đủ thì bi cái bám sát đường 90°. Bi mục tiêu ở xa hoặc đánh nhẹ thì bi cái lệch về phía trước, trong mô phỏng này khoảng 10°. Trên bàn thật góc tách cũng thường nhỏ hơn 90° vài độ, chạm càng dày càng rõ."
      ),
      ex("Giống quả bóng bowling: vừa ném ra nó trượt một đoạn trên sàn rồi mới bám sàn và lăn."),
      h("Hai đường trợ giúp trên bàn mô phỏng"),
      p(
        "Đường chấm là đường 90°: chỉ là mốc hình học. Đường nét đứt là đường dự đoán, mặc định tắt, bật trong mục Trợ giúp ngắm: app đánh thử cú bạn đang chọn và vẽ đường bi cái sẽ đi thật. Hai đường càng xa nhau thì bi cái càng đã lăn nhiều lúc chạm."
      ),
      h("Tự bấm thử"),
      fig(
        "Cùng một hướng ngắm vào bi vàng, hai mức lực. Đường chấm mảnh là đường 90°.",
        { cue: [-20, 6], b1: [-15, 6] },
        [
          { label: "Đủ lực: còn trượt", shot: shot(-15.1, 76) },
          { label: "Đánh nhẹ: đã lăn", shot: shot(-15.1, 48) },
        ],
        {
          predict: "cú nào bám sát đường chấm hơn: cú mạnh hay cú nhẹ?",
          look: "bấm \"So sánh tất cả\". Cú đủ lực đi sát đường chấm; cú nhẹ tách khỏi đường chấm về phía trước.",
          compare: "cue",
          tangent: true,
        }
      ),
      mistakes(
        "Coi đường 90° là đường bi cái chắc chắn đi. Nó chỉ là mốc; lực và điểm chạm sẽ kéo bi cái ra trước hoặc ra sau mốc đó.",
        "Dựng đường 90° từ tâm bi mục tiêu. Phải dựng từ tâm bi ma.",
        "Quên rằng đánh nhẹ thì bi đã lăn lúc tới nơi."
      ),
      key(
        "Bi cái không xoáy tới, không xoáy lui lúc chạm thì rời đi vuông góc với đường bi mục tiêu chạy.",
        "Đường 90° dựng từ tâm bi ma.",
        "Bi cái đã lăn lúc chạm thì lệch về phía trước đường 90°."
      ),
      check(
        "Bi thứ hai nằm phía trước đường 90° một chút. Với cú giữa tâm, bạn nên làm gì để bi cái tới đó?",
        ["Đánh mạnh hơn", "Đánh nhẹ hơn để bi kịp lăn trước khi chạm", "Không có cách nào"],
        1,
        "Đánh nhẹ hơn thì bi cái đã lăn lúc chạm và lệch về phía trước đường 90°. Đánh mạnh thì nó bám sát đường 90° và đi sau bi thứ hai."
      ),
    ],
  },
  {
    id: "2.3",
    title: "Chia tốc độ",
    body: [
      goal("biết sau va chạm bi nào chạy xa, bi nào ở lại, chỉ bằng cách chọn độ dày chạm."),
      h("Va chạm chia tốc độ cho hai bi"),
      p(
        "Tốc độ của bi cái lúc tới được chia cho hai bi. Chạm càng dày, bi mục tiêu nhận càng nhiều và bi cái còn càng ít. Chạm càng mỏng thì ngược lại: bi cái giữ gần hết, bi mục tiêu chỉ nhích đi."
      ),
      dg(
        { kind: "speedSplit" },
        "Thanh vàng: phần tốc độ bi vàng nhận. Thanh trắng: phần bi cái còn giữ. Số lý thuyết cho cú không xoáy; mô phỏng và bàn thật thấp hơn một chút."
      ),
      p(
        "Mốc dễ nhớ là nửa bi: bi cái còn khoảng một nửa tốc độ. Trong mô phỏng, khung Phân tích cú vừa đánh cho con số thật của từng cú (với nửa bi khoảng 76% và 46%), thấp hơn lý thuyết vì va chạm không nảy hoàn toàn."
      ),
      h("Tốc độ không phải quãng đường"),
      p(
        "Nhớ bài 1.1: quãng đường tăng theo bình phương tốc độ. Viên bi còn một nửa tốc độ chỉ lăn được khoảng một phần tư quãng đường. Vì vậy chênh lệch quãng đường giữa hai bi lớn hơn nhiều so với con số phần trăm ở hình trên."
      ),
      h("Dùng để làm gì"),
      p(
        "Đây là công cụ chính để gom bi ở các cấp sau. Muốn bi mục tiêu ở lại gần thì chạm mỏng. Muốn bi cái ở lại gần thì chạm dày. Muốn cả hai đi một đoạn gần bằng nhau thì chạm khoảng nửa bi."
      ),
      ex("Giống chia một ca nước sang hai ly: rót nhiều sang ly này thì ly kia còn ít."),
      h("Tự bấm thử"),
      fig(
        "Cùng lực, ba độ dày. Vệt trắng là bi cái, vệt vàng là bi vàng.",
        { cue: [-30, 0], b1: [-25, 0] },
        [
          { label: "Dày", shot: shot(5.7, 64) },
          { label: "Nửa bi", shot: shot(11.5, 64) },
          { label: "Mỏng", shot: shot(19.9, 64) },
        ],
        {
          predict: "ở cú nào bi cái đi xa nhất? Ở cú nào bi vàng đi xa nhất?",
          look: "độ dài của vệt trắng và vệt vàng trong từng cú. Sau mỗi cú, mở Phân tích cú vừa đánh để xem tốc độ chia thế nào.",
        }
      ),
      mistakes(
        "Chạm dày khi muốn bi mục tiêu ở lại: nó nhận gần hết lực và chạy mất.",
        "Chạm mỏng với lực của cú chạm dày: bi cái giữ gần hết tốc độ nên chạy quá xa."
      ),
      key(
        "Chạm dày: bi mục tiêu chạy, bi cái ở lại.",
        "Chạm mỏng: bi mục tiêu ở lại, bi cái đi tiếp.",
        "Nửa bi: bi cái còn khoảng nửa tốc độ, tức khoảng một phần tư quãng đường."
      ),
      check(
        "Bi vàng đang nằm rất đẹp, sát bên bi đỏ. Bạn phải chạm bi vàng trước. Nên chạm thế nào để nó ít bị xê dịch?",
        ["Chạm dày", "Chạm mỏng", "Dày hay mỏng đều như nhau"],
        1,
        "Chạm mỏng truyền rất ít tốc độ cho bi vàng, nên nó gần như ở nguyên chỗ."
      ),
    ],
  },
]

const STRAIGHT: Setup = { cue: [-24, -8], b1: [-17.4, -5.6] }

export const LESSONS_3: Lesson[] = [
  {
    id: "3.1",
    title: "Đánh thẳng: theo, dừng, lùi",
    body: [
      goal("hiểu chạm trên tâm và dưới tâm làm bi cái quay thế nào, và vì sao bi cái đi theo, dừng lại hay lùi về sau khi chạm đầy."),
      h("Chạm cao hay thấp là cho bi cái quay"),
      p(
        "Đầu cơ chạm trên tâm thì bi cái vừa đi vừa quay về phía trước: xoáy tới. Chạm dưới tâm thì bi cái đi tới nhưng quay ngược về phía sau: xoáy lui. Người chơi gọi độ cao điểm chạm là cao cơ, thấp cơ."
      ),
      dg(
        { kind: "spinTriple" },
        "Hàng trên: chỗ đầu cơ chạm. Hàng giữa: bi cái quay thế nào trên đường đi. Hàng dưới: bi cái làm gì sau khi chạm đầy vào bi vàng."
      ),
      h("Vì sao lại theo, dừng, lùi"),
      p(
        "Khi chạm đầy, bi cái trao gần hết tốc độ đi tới cho bi mục tiêu và gần như đứng lại. Nhưng nó vẫn còn đang quay. Chính cái quay đó quyết định bước tiếp theo: đang xoáy tới thì nó bám nỉ lăn tiếp về trước, gọi là đẩy theo (cu-lê); đang xoáy lui thì nó bám nỉ chạy ngược về, gọi là kéo lùi (rê-trô, hay nói tắt là trô, kéo); không quay gì thì nó đứng yên tại chỗ."
      ),
      h("Xoáy lui mòn dần trên đường đi"),
      p(
        "Nỉ luôn cọ vào đáy bi và kéo nó về trạng thái lăn tự nhiên. Vì thế xoáy lui bị mòn dần: bi mục tiêu càng xa hoặc đánh càng nhẹ thì lúc tới nơi càng ít xoáy lui. Muốn kéo lùi ở cự ly xa phải chạm thấp hơn và đánh nhanh hơn. Cũng vì thế cú dừng bi phải chạm dưới tâm một chút, không phải giữa tâm: phần xoáy lui nhỏ đó mòn vừa hết lúc tới nơi."
      ),
      ex(
        "Giống ném một cái vòng lắc eo ra sàn kèm xoáy ngược: vòng trượt ra xa, chậm dần rồi tự lăn ngược về phía người ném."
      ),
      h("Tự bấm thử"),
      fig(
        "Cùng một cú đánh thẳng vào bi vàng, bốn điểm chạm.",
        STRAIGHT,
        [
          { label: "Trên tâm", shot: shot(20, 66, 0.6) },
          { label: "Giữa tâm", shot: shot(20, 66) },
          { label: "Dưới tâm vừa", shot: shot(20, 66, -0.6) },
          { label: "Dưới tâm sâu, mạnh hơn", shot: shot(20, 72, -1) },
        ],
        {
          predict: "với cú giữa tâm, bi cái có dừng hẳn không? Hay vẫn nhích theo một chút?",
          look: "bi cái ngay SAU khi chạm bi vàng: đi theo, đứng lại, hay lùi về, và lùi được bao xa.",
        }
      ),
      mistakes(
        "Muốn kéo lùi mà giật cơ lại ngay khi chạm. Phải đưa cơ đi xuyên qua chỗ bi nằm, đều và dài.",
        "Nâng đuôi cơ khi chạm thấp. Giữ cơ càng nằm ngang càng tốt.",
        "Đánh nhẹ ở cự ly xa rồi chờ bi lùi: xoáy lui đã mòn hết trước khi tới nơi.",
        "Chạm quá thấp, sát mép bi: trượt đầu cơ. Trong app, vòng nét đứt trên mặt bi cái là giới hạn an toàn."
      ),
      key(
        "Trên tâm: xoáy tới, bi cái đi theo (cu-lê).",
        "Dưới tâm: xoáy lui, bi cái lùi về (rê-trô), nhưng xoáy lui mòn dần theo quãng đường.",
        "Hết xoáy đúng lúc chạm đầy: bi cái dừng tại chỗ."
      ),
      check(
        "Bạn muốn kéo lùi sau khi chạm đầy một bi ở xa. Lần đầu bạn chạm dưới tâm, lực nhẹ: bi cái không lùi mà gần như đứng lại. Lần sau sửa thế nào?",
        ["Đánh nhẹ hơn nữa", "Chạm thấp hơn và đưa cơ nhanh hơn", "Chuyển sang chạm trên tâm"],
        1,
        "Bi đứng lại nghĩa là xoáy lui đã mòn vừa hết trên đường đi. Chạm thấp hơn cho nhiều xoáy lui hơn, đánh nhanh hơn để nó chưa kịp mòn."
      ),
    ],
  },
  {
    id: "3.2",
    title: "Đánh xéo: bi cái cong khỏi đường 90°",
    body: [
      goal("biết chọn chạm trên tâm hay dưới tâm để bi cái tới được bi thứ hai khi nó không nằm đúng trên đường 90°."),
      h("Vẫn là đường 90°, rồi mới cong"),
      p(
        "Khi đánh xéo, bi cái luôn rời bi mục tiêu theo đường 90° trước. Sau đó phần quay còn lại mới lên tiếng: xoáy tới kéo nó cong về phía trước, xoáy lui kéo nó cong về phía sau."
      ),
      dg(
        { kind: "ghost", tangent: true, paths: ["follow", "draw"] },
        "Đường chấm là đường 90°. Trên tâm thì bi cái cong về phía trước (cùng phía với hướng đánh); dưới tâm thì cong về phía sau."
      ),
      h("Cách dùng: bi thứ hai nằm ở đâu so với đường 90°"),
      steps(
        "Dựng đường 90° từ bi ma (bài 2.2).",
        "Bi thứ hai nằm trước đường đó: chạm trên tâm.",
        "Bi thứ hai nằm sau đường đó: chạm dưới tâm.",
        "Bi thứ hai nằm đúng trên đường đó: để bi cái hết xoáy lúc chạm (dưới tâm một chút, lực đủ)."
      ),
      h("Lực quyết định cong sớm hay muộn"),
      p(
        "Đánh càng mạnh, bi cái chạy dọc đường 90° càng xa rồi mới cong. Đánh nhẹ thì nó cong gần như ngay. Cùng một điểm chạm, đổi lực là đổi chỗ bi cái đi qua."
      ),
      h("Mốc 30° của bi đang lăn"),
      p(
        "Một mốc rất hay dùng: bi cái đang lăn tự nhiên, chạm trong khoảng từ 1/4 đến 3/4 bi, thì đổi hướng khoảng 30° so với hướng cũ. Vì góc này gần như không đổi dù chạm dày mỏng hơi khác nhau, đây là kiểu chạm dễ tính nhất."
      ),
      ex("Giống quả bóng sút xoáy: lúc đầu bay thẳng, được một đoạn mới bẻ cong."),
      h("Tự bấm thử"),
      fig(
        "Cùng hướng ngắm và lực, bốn điểm chạm. Đường chấm mảnh là đường 90°.",
        { cue: [-20, -6], b1: [-14, -6] },
        [
          { label: "Trên tâm", shot: shot(9.6, 66, 0.6) },
          { label: "Giữa tâm", shot: shot(9.6, 66) },
          { label: "Dưới tâm nhẹ: hết xoáy lúc chạm", shot: shot(9.6, 66, -0.5) },
          { label: "Dưới tâm sâu", shot: shot(9.6, 66, -1) },
        ],
        {
          predict: "cú nào đi sát đường chấm nhất? Cú giữa tâm có đi đúng trên đường chấm không?",
          look: "bấm \"So sánh tất cả\". Bốn đường xòe ra hai bên đường chấm: trên tâm và giữa tâm ở phía trước, dưới tâm sâu ở phía sau, dưới tâm nhẹ sát đường chấm nhất.",
          compare: "cue",
          tangent: true,
        }
      ),
      mistakes(
        "Tưởng chạm giữa tâm là bi cái đi đúng đường 90°. Ở cự ly này bi đã kịp lăn một phần, nên nó đi trước đường 90°.",
        "Chọn đúng trên tâm hay dưới tâm nhưng quên lực: đánh quá mạnh thì bi cái đi quá xa rồi mới cong, trượt bi thứ hai."
      ),
      key(
        "Bi cái rời theo đường 90° trước, rồi mới cong.",
        "Bi thứ hai ở trước đường 90°: trên tâm. Ở sau: dưới tâm.",
        "Đánh mạnh thì cong muộn, đánh nhẹ thì cong sớm."
      ),
      check(
        "Bạn dựng đường 90° và thấy bi thứ hai nằm phía sau đường đó (về phía bạn đang đứng). Chọn điểm chạm nào?",
        ["Trên tâm", "Dưới tâm", "Giữa tâm, đánh thật nhẹ"],
        1,
        "Xoáy lui kéo bi cái cong về phía sau đường 90°. Đánh giữa tâm thật nhẹ thì bi đã lăn và sẽ lệch về phía trước, càng xa bi thứ hai."
      ),
    ],
  },
  {
    id: "3.3",
    title: "Bi tự lăn và cú tự nhiên",
    body: [
      goal("hiểu vì sao cùng một cú giữa tâm lại cho kết quả khác nhau ở cự ly khác nhau, và biết cú tự nhiên là gì."),
      h("Trượt trước, lăn sau"),
      p(
        "Đánh giữa tâm, bi cái rời đầu cơ mà chưa quay: nó trượt trên nỉ. Nỉ cọ vào đáy bi làm nó quay dần, cho tới khi lăn tự nhiên. Từ lúc đó nó cư xử y như một cú trên tâm nhẹ: nó đang xoáy tới."
      ),
      dg({ kind: "slideToRoll" }, "Cùng một viên bi ở bốn thời điểm liên tiếp. Mũi tên cong là chiều quay."),
      p(
        "Đoạn trượt dài hay ngắn tùy lực: đánh càng mạnh, bi trượt càng xa rồi mới lăn. Đánh nhẹ thì nó lăn gần như ngay."
      ),
      h("Hệ quả"),
      p(
        "Cùng một cú giữa tâm: bi mục tiêu ở gần và lực đủ thì bi cái còn trượt lúc chạm, nên nó gần như dừng lại (đánh thẳng) hoặc đi sát đường 90° (đánh xéo). Bi mục tiêu ở xa hoặc đánh nhẹ thì bi cái đã lăn, nên nó đi theo (đánh thẳng) hoặc lệch về phía trước đường 90° (đánh xéo)."
      ),
      ex("Giống xe phanh gấp trên đường ướt: bánh trượt một đoạn rồi mới bám đường và lăn lại."),
      h("Cú tự nhiên"),
      p(
        "Trong cách dạy phăng truyền thống, cú đầu tiên phải thuộc là cú tự nhiên: chạm khoảng nửa bi, điểm chạm hơi trên tâm, không ê-phê, lực vừa đủ. Bi cái lăn tự nhiên, đổi hướng theo mốc 30° của bài trước, và chạm dày mỏng lệch một chút vẫn gần như đi đúng đường đó. Gặp thế bi nào cũng nên hỏi trước: có đánh được bằng cú tự nhiên không?"
      ),
      h("Tự bấm thử"),
      fig(
        "Cùng lực, cùng chạm giữa tâm, cùng đánh thẳng. Chỉ khác khoảng cách tới bi vàng.",
        { cue: [-38, -12], b1: [-31.4, -9.6] },
        [
          { label: "Bi vàng ở gần", shot: shot(20, 66) },
          { label: "Bi vàng ở xa", shot: shot(19.9, 66), balls: { cue: [-38, -12], b1: [-7.9, -1.1] } },
        ],
        {
          predict: "ở cú nào bi cái đi theo bi vàng xa hơn?",
          look: "bi cái đi được bao xa SAU khi chạm. Gần: chỉ nhích theo một đoạn ngắn. Xa: đi theo xa gấp mấy lần, vì nó đã kịp lăn.",
        }
      ),
      mistakes(
        "Nghĩ chạm giữa tâm là bi cái không xoáy. Điều đó chỉ đúng ở đoạn đầu.",
        "Tập một cú ở cự ly gần rồi mang nguyên điểm chạm đó ra cự ly xa."
      ),
      key(
        "Cú giữa tâm: trượt một đoạn rồi tự lăn. Đánh mạnh thì trượt lâu hơn.",
        "Bi đã lăn là bi đang xoáy tới.",
        "Cú tự nhiên: nửa bi, hơi trên tâm, không ê-phê. Luôn xét nó trước."
      ),
      check(
        "Bạn muốn bi cái DỪNG LẠI sau khi chạm đầy một bi ở xa. Chạm giữa tâm với lực vừa có được không?",
        ["Được, giữa tâm là không xoáy", "Không: tới nơi bi đã lăn nên sẽ đi theo. Phải chạm dưới tâm một chút", "Không: phải chạm trên tâm"],
        1,
        "Ở cự ly xa, cú giữa tâm đã chuyển sang lăn trước khi tới nơi. Chạm dưới tâm một chút để phần xoáy lui đó mòn vừa hết đúng lúc chạm."
      ),
    ],
  },
]
