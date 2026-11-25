// Bai Hieu cua cap 1, 2, 3. Loi van tu soan; kien thuc da doi chieu voi nguon ghi o
// docs/SOURCES.md. Moi bai co mot hinh tuong tac chay bang loi mo phong va mot vi du
// doi thuong. So lieu cua hinh (huong, luc) lay tu mo phong, xem docs/LEVELS.md.
import type { Setup, Shot } from "../engine"
import type { Figure } from "../table/figure"
import { sliderToPower } from "../table/power"
import type { TipExplorer } from "../table/tipExplorer"

export type Block =
  | { type: "text"; text: string }
  /** Vi du doi thuong. */
  | { type: "example"; text: string }
  | { type: "figure"; figure: Figure }
  /** Mat bi cai bam duoc, ve ngay duong di. */
  | { type: "explorer"; explorer: TipExplorer }

export interface Lesson {
  /** Vi du "4.1". */
  id: string
  title: string
  body: Block[]
}

const p = (text: string): Block => ({ type: "text", text })
const ex = (text: string): Block => ({ type: "example", text })
const fig = (caption: string, balls: Setup, variants: Figure["variants"]): Block => ({
  type: "figure",
  figure: { caption, balls, variants },
})
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
      p(
        "Trong phăng, lực không chỉ để bi cái tới được hai bi kia. Lực quyết định ba viên bi nằm ở đâu sau cú đánh, tức là cú tiếp theo dễ hay khó. Vì vậy kiểm soát lực là nền của mọi cấp sau."
      ),
      p(
        "Quãng đường bi lăn tăng nhanh hơn lực rất nhiều. Khi bi chỉ lăn trên nỉ, tốc độ ban đầu gấp đôi thì bi lăn xa gấp khoảng bốn lần. Hệ quả: ở vùng lực nhẹ, thêm một chút lực đã đổi chỗ dừng rõ rệt."
      ),
      ex(
        "Giống quãng phanh của xe máy: chạy 40 km/giờ thì xe trôi xa gấp khoảng bốn lần so với 20 km/giờ, không phải gấp đôi."
      ),
      fig("Bấm lần lượt hai nút và so chỗ bi dừng. Lực ở nút thứ hai gấp đôi nút thứ nhất.", { cue: [-42, 0] }, [
        { label: "Lực nhẹ", shot: shot(0, 34) },
        { label: "Lực gấp đôi", shot: shot(0, 48.5) },
      ]),
    ],
  },
  {
    id: "1.2",
    title: "Băng ăn bớt lực",
    body: [
      p(
        "Mỗi lần chạm băng, bi mất một phần tốc độ. Đâm thẳng vào băng thì mất nhiều; đi sượt dọc băng thì mất ít."
      ),
      p(
        "Vì vậy cùng một quãng đường, cú có qua băng cần lực lớn hơn hẳn cú lăn thẳng. Băng của mỗi bàn nảy khác nhau, nên mất bao nhiêu thì bạn phải tự đo trên bàn mình tập; mô phỏng chỉ cho biết quy luật."
      ),
      ex("Giống ném quả bóng vào tường: bóng bật lại luôn chậm hơn lúc ném tới."),
      fig("Ba mức lực, cùng đâm thẳng vào băng ngắn. Xem bi bật về được bao xa.", { cue: [-10, 0] }, [
        { label: "Vừa tới băng", shot: shot(0, 50) },
        { label: "Bật về một đoạn", shot: shot(0, 56) },
        { label: "Bật về tới giữa bàn", shot: shot(0, 62) },
      ]),
    ],
  },
  {
    id: "1.3",
    title: "Ba mức lực chuẩn của bạn",
    body: [
      p(
        "Người chơi không tính lực bằng con số. Họ có sẵn vài mức chuẩn trong tay rồi cộng trừ quanh đó. Hãy tự tạo ba mức: nhẹ là bi lăn nửa chiều dài bàn; vừa là bi lăn hết một chiều dài bàn; mạnh là bi đi tới băng ngắn bên kia rồi quay về gần chỗ xuất phát."
      ),
      p(
        "Khi tập lực, nên chạm hơi trên tâm một chút. Bi sẽ lăn ngay từ đầu thay vì trượt một đoạn rồi mới lăn, nên quãng đường đều hơn giữa các lần đánh."
      ),
      ex(
        "Giống người bán hàng quen tay bốc đúng một lạng: họ không cân từng lần, họ nhớ cảm giác của vài mức chuẩn."
      ),
      fig("Ba mức lực trên bàn mô phỏng. Trên bàn thật, bạn tìm ba mức của riêng mình.", { cue: [-42, 0] }, [
        { label: "Nhẹ", shot: shot(0, 45, 0.4) },
        { label: "Vừa", shot: shot(0, 54, 0.4) },
        { label: "Mạnh", shot: shot(0, 66, 0.4) },
      ]),
    ],
  },
]

export const LESSONS_2: Lesson[] = [
  {
    id: "2.1",
    title: "Độ dày chạm",
    body: [
      p(
        "Độ dày chạm là phần bi cái che lên bi mục tiêu lúc hai bi chạm nhau, nhìn theo hướng đánh. Chạm đầy: che hết. Nửa bi: tâm bi cái nhắm đúng mép bi mục tiêu. Chạm mỏng: chỉ sượt qua mép."
      ),
      p(
        "Độ dày quyết định bi mục tiêu chạy lệch bao nhiêu so với hướng đánh: chạm đầy thì 0°, chạm 3/4 bi khoảng 15°, nửa bi đúng 30°, chạm 1/4 bi khoảng 49°. Bi mục tiêu luôn chạy theo đường nối tâm bi ma với tâm của nó."
      ),
      ex(
        "Giống hai người đi ngược chiều va vai nhau: va chính diện thì cả hai khựng lại, sượt vai thì mỗi người gần như đi tiếp đường của mình."
      ),
      fig("Cùng lực, năm độ dày. Xem bi vàng chạy lệch dần sang bên.", { cue: [-12, 0], b1: [-5, 0] }, [
        { label: "Đầy", shot: shot(0, 64) },
        { label: "3/4 bi", shot: shot(4.1, 64) },
        { label: "Nửa bi", shot: shot(8.2, 64) },
        { label: "1/4 bi", shot: shot(12.4, 64) },
        { label: "Mỏng", shot: shot(15.3, 64) },
      ]),
    ],
  },
  {
    id: "2.2",
    title: "Đường 90°",
    body: [
      p(
        "Khi bi cái tới nơi mà không xoáy tới cũng không xoáy lui, hai bi tách nhau gần vuông góc. Bi mục tiêu đi theo đường nối hai tâm; bi cái đi theo đường vuông góc với đường đó, gọi là đường 90°. Đỉnh góc nằm ở vị trí bi ma."
      ),
      p(
        "Trên bàn thật góc này thường nhỏ hơn 90° vài độ vì bi không nảy hoàn hảo; chạm càng dày càng thấy rõ. Trong app, từ nửa bi trở về mỏng có thể coi là 90°."
      ),
      p(
        "Điều kiện: bi cái phải còn trượt lúc chạm. Đánh giữa tâm thì bi chỉ trượt một đoạn rồi tự lăn. Muốn dùng đường 90° với cú giữa tâm, bi mục tiêu phải ở gần và lực phải đủ. Đánh nhẹ hoặc đánh xa, bi cái sẽ lệch về phía trước đường 90° thêm khoảng 10°."
      ),
      p(
        "Trên bàn mô phỏng có hai đường trợ giúp khác nhau. Đường chấm là đường 90°: nó chỉ là mốc hình học, đúng khi bi cái còn trượt. Đường nét đứt là đường dự đoán, mặc định tắt, bật được trong mục Trợ giúp ngắm: app đánh thử cú bạn đang chọn (hướng, lực, điểm chạm) và vẽ đường bi cái sẽ đi thật. Hai đường càng xa nhau thì bi cái càng đã lăn nhiều lúc chạm."
      ),
      ex("Giống quả bóng bowling: vừa ném ra nó trượt một đoạn trên sàn rồi mới bám sàn và lăn."),
      fig("Cùng một hướng ngắm, hai mức lực. So đường bi cái rời bi vàng.", { cue: [-20, 6], b1: [-15, 6] }, [
        { label: "Đủ lực: còn trượt", shot: shot(-15.1, 76) },
        { label: "Đánh nhẹ: đã lăn", shot: shot(-15.1, 48) },
      ]),
    ],
  },
  {
    id: "2.3",
    title: "Chia tốc độ",
    body: [
      p(
        "Va chạm chia tốc độ của bi cái cho hai bi. Chạm dày: bi mục tiêu nhận gần hết, bi cái còn rất chậm. Chạm mỏng: bi cái giữ gần hết, bi mục tiêu chỉ nhích đi. Nửa bi không xoáy: theo lý thuyết bi mục tiêu nhận khoảng 87% tốc độ, bi cái còn khoảng 50%. Trong mô phỏng, khung Phân tích cú vừa đánh cho số thấp hơn một chút (khoảng 76% và 46%) vì va chạm không nảy hoàn toàn."
      ),
      p(
        "Tốc độ không phải quãng đường. Vì quãng đường tăng theo bình phương tốc độ, viên bi còn một nửa tốc độ chỉ lăn được khoảng một phần tư quãng đường."
      ),
      p(
        "Trong phăng, đây là công cụ gom bi: muốn bi mục tiêu ở lại gần thì chạm mỏng; muốn bi cái ở lại gần thì chạm dày."
      ),
      ex("Giống chia một ca nước sang hai ly: rót nhiều sang ly này thì ly kia còn ít."),
      fig("Cùng lực, ba độ dày. So quãng đường của bi cái (vệt trắng) và bi vàng.", { cue: [-30, 0], b1: [-25, 0] }, [
        { label: "Dày", shot: shot(5.7, 64) },
        { label: "Nửa bi", shot: shot(11.5, 64) },
        { label: "Mỏng", shot: shot(19.9, 64) },
      ]),
    ],
  },
]

const STRAIGHT: Setup = { cue: [-24, -8], b1: [-17.4, -5.6] }

export const LESSONS_3: Lesson[] = [
  {
    id: "3.1",
    title: "Đánh thẳng: theo, dừng, lùi",
    body: [
      p(
        "Chạm trên tâm làm bi cái xoáy tới; chạm dưới tâm làm nó xoáy lui. Khi đánh thẳng chính diện: bi cái còn xoáy tới lúc chạm thì đi theo bi mục tiêu; không còn xoáy gì thì dừng tại chỗ; còn xoáy lui thì lùi về."
      ),
      p(
        "Xoáy lui mòn dần trên đường đi vì nỉ cọ vào bi. Bi mục tiêu càng xa hoặc đánh càng nhẹ thì phải chạm càng thấp, hoặc đánh mạnh hơn, mới còn xoáy lui lúc tới nơi. Vì thế cú dừng bi cũng phải chạm dưới tâm một chút, không phải giữa tâm."
      ),
      ex(
        "Giống ném một cái vòng lắc eo ra sàn kèm xoáy ngược: vòng trượt ra xa, chậm dần rồi tự lăn ngược về phía người ném."
      ),
      fig("Cùng một cú đánh thẳng, bốn điểm chạm. Xem bi cái làm gì sau khi chạm bi vàng.", STRAIGHT, [
        { label: "Trên tâm", shot: shot(20, 66, 0.6) },
        { label: "Giữa tâm", shot: shot(20, 66) },
        { label: "Dưới tâm vừa", shot: shot(20, 66, -0.6) },
        { label: "Dưới tâm sâu, mạnh hơn", shot: shot(20, 72, -1) },
      ]),
    ],
  },
  {
    id: "3.2",
    title: "Đánh xéo: bi cái cong khỏi đường 90°",
    body: [
      p(
        "Khi đánh xéo, bi cái vẫn rời bi mục tiêu theo đường 90° trước. Sau đó xoáy tới kéo nó cong về phía trước; xoáy lui kéo nó cong về phía sau. Đánh càng mạnh, bi cái đi dọc đường 90° càng xa rồi mới cong."
      ),
      p(
        "Cách dùng: bi thứ hai nằm trước đường 90° thì chạm trên tâm; nằm sau đường 90° thì chạm dưới tâm; nằm đúng trên đường thì để bi cái không xoáy lúc chạm."
      ),
      p(
        "Một mốc dễ nhớ: bi cái đang lăn tự nhiên, chạm trong khoảng từ 1/4 đến 3/4 bi, thì lệch khỏi hướng cũ khoảng 30°."
      ),
      ex("Giống quả bóng sút xoáy: lúc đầu bay thẳng, được một đoạn mới bẻ cong."),
      fig("Cùng hướng và lực, bốn điểm chạm. So đường bi cái sau khi chạm bi vàng.", { cue: [-20, -6], b1: [-14, -6] }, [
        { label: "Trên tâm", shot: shot(9.6, 66, 0.6) },
        { label: "Giữa tâm", shot: shot(9.6, 66) },
        { label: "Dưới tâm nhẹ: hết xoáy lúc chạm", shot: shot(9.6, 66, -0.5) },
        { label: "Dưới tâm sâu", shot: shot(9.6, 66, -1) },
      ]),
    ],
  },
  {
    id: "3.3",
    title: "Bi tự lăn",
    body: [
      p(
        "Đánh giữa tâm, bi cái xuất phát ở trạng thái trượt. Nỉ cọ vào đáy bi làm nó quay dần, cho tới khi lăn tự nhiên. Từ lúc đó nó cư xử như một cú trên tâm nhẹ."
      ),
      p(
        "Vì vậy cùng một cú giữa tâm: bi mục tiêu ở gần và lực đủ thì bi cái gần như dừng lại (hoặc đi theo đường 90° nếu đánh xéo); bi mục tiêu ở xa hoặc đánh nhẹ thì bi cái đi theo."
      ),
      ex("Giống xe phanh gấp trên đường ướt: bánh trượt một đoạn rồi mới bám đường và lăn lại."),
      fig(
        "Cùng lực, cùng chạm giữa tâm. Chỉ khác khoảng cách tới bi vàng.",
        { cue: [-38, -12], b1: [-31.4, -9.6] },
        [
          { label: "Bi vàng ở gần", shot: shot(20, 66) },
          { label: "Bi vàng ở xa", shot: shot(19.9, 66), balls: { cue: [-38, -12], b1: [-7.9, -1.1] } },
        ]
      ),
    ],
  },
]
