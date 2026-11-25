// Cap 5 (chon cach danh), 6 (gom bi), 7 (giu chuoi). The bi tim bang do ngau nhien co
// hat giong tren mo phong roi kiem lai; moi tinh huong qua scenarios:check.
// Cap 6 va 7 dung muc tieu `gather`: ghi diem VA ba bi nam gon; ghi diem ma bi con xa
// thi chi dat mot nua.
import type { Setup, Shot } from "../../engine"
import type { Scenario } from "../types"

const CENTRE = { x: 0, y: 0 }
const shot = (angleDeg: number, power: number): Shot => ({ angleDeg, power, tip: CENTRE })

// ====================== Cap 5 ======================

function firstBall(n: number, balls: Setup, yellow: Shot, red: Shot, answer: 0 | 1, explain: string): Scenario {
  return {
    id: `L5-A-0${n}`,
    level: 5,
    group: "A",
    title: `Chạm bi nào trước ${n}`,
    prompt: "Cùng một thế có thể đi qua bi vàng trước hoặc bi đỏ trước. Cách nào ghi được điểm bằng một cú giữa tâm, lực vừa?",
    balls,
    goal: { type: "choice", options: ["Chạm bi vàng trước", "Chạm bi đỏ trước"], answer, shots: [yellow, red] },
    hint: "Với mỗi cách, hình dung bi cái rời bi thứ nhất gần theo đường 90°. Đường đó có đi về phía bi còn lại không?",
    explain,
  }
}

function natural(n: number, balls: Setup, hint: string): Scenario {
  return {
    id: `L5-B-0${n}`,
    level: 5,
    group: "B",
    title: `Tìm lời giải tự nhiên ${n}`,
    prompt: "Tự chọn bi chạm trước và đánh. Thế này có một lời giải rộng rãi bằng cú giữa tâm, lực vừa: hãy tìm nó thay vì ép một cú khó.",
    balls,
    goal: { type: "score" },
    aids: { ghostBall: true, tangentLine: true },
    hint,
    explain:
      "Lời giải tự nhiên là lời giải không cần xoáy mạnh, không cần lực lớn và còn ghi điểm khi ngắm lệch vài độ. Trước khi đánh, thử hình dung cả hai cách (bi vàng trước, bi đỏ trước) rồi chọn cách có đường tới bi thứ hai rộng hơn.",
  }
}

function sturdier(n: number, balls: Setup, direct: Shot, cushion: Shot, answer: 0 | 1, explain: string): Scenario {
  return {
    id: `L5-C-0${n}`,
    level: 5,
    group: "C",
    title: `Lời giải nào chắc hơn ${n}`,
    prompt: "Hai cách đi qua bi vàng: trực tiếp sang bi đỏ, hoặc qua một băng. App đánh mỗi cách với cùng một sai số ngắm 1°. Cách nào vẫn ghi điểm?",
    balls,
    goal: { type: "choice", options: ["Trực tiếp", "Qua một băng"], answer, shots: [direct, cushion] },
    hint: "Cách chắc hơn là cách mà bi thứ hai là mục tiêu to: bi nằm gần băng, hoặc bi cái tới nó theo một góc thoải.",
    explain,
  }
}

const C_BALLS: Setup = { cue: [19.2, 14.9], b1: [22.6, 8.3], b2: [38, -2.6] }

export const LEVEL5: Scenario[] = [
  firstBall(
    1,
    { cue: [17.1, 5.7], b1: [13.9, 13.9], b2: [5.9, 13.8] },
    shot(118.9, 0.1177),
    shot(136.1, 0.1177),
    0,
    "Chạm bi vàng trước thì đường 90° đưa bi cái sang trái, đúng về phía bi đỏ, và còn ghi điểm trong một khoảng ngắm rộng khoảng 5°. Chạm bi đỏ trước thì bi cái bị bẻ đi hướng khác, không có cú giữa tâm nào quay lại được bi vàng."
  ),
  firstBall(
    2,
    { cue: [1.2, -11.1], b1: [14.7, -15.5], b2: [8.1, -18.1] },
    shot(-25.9, 0.1177),
    shot(-38.4, 0.1177),
    1,
    "Bi đỏ nằm gần hơn và chếch về phía bi vàng: chạm nó trước, bi cái lăn tiếp sang bi vàng trong một khoảng ngắm rộng khoảng 7°. Chạm bi vàng trước thì bi cái đi ra xa bi đỏ."
  ),
  firstBall(
    3,
    { cue: [-25.4, 1.3], b1: [-16.6, 4.3], b2: [-11, 16.1] },
    shot(26.7, 0.1177),
    shot(40.5, 0.1177),
    0,
    "Bi vàng nằm giữa đường: chạm nó trước, bi cái rời theo hướng lên phía bi đỏ, rộng khoảng 7,5°. Chạm bi đỏ trước là một cú xa và mỏng, bi cái không quay về bi vàng được."
  ),

  natural(1, { cue: [1.4, -1.6], b1: [11.1, 2.8], b2: [12.2, 12.7] }, "Chạm bi vàng trước, hơi mỏng về phía dưới. Bi cái rời lên phía bi đỏ."),
  natural(2, { cue: [-18.4, 2.7], b1: [-23.7, -10.2], b2: [-32.1, -11.9] }, "Chạm bi vàng trước. Bi đỏ nằm ngay sau nó, hơi lệch trái."),
  natural(3, { cue: [-1, -13.4], b1: [7.5, 2.8], b2: [0.9, -0.2] }, "Bi đỏ gần hơn và nằm trên đường tới bi vàng: chạm bi đỏ trước."),

  sturdier(
    1,
    C_BALLS,
    shot(-48.6, 0.0977),
    shot(-52.1, 0.1417),
    1,
    "Đường trực tiếp có, nhưng chỉ ghi điểm trong một khe khoảng nửa độ: lệch 1° là trượt. Qua băng ngắn thì khoảng ngắm rộng tới 4°, vì bi đỏ nằm gần băng nên bi cái bật ra là gặp nó. Đây là ý 'bi to': bi gần băng là mục tiêu lớn hơn."
  ),
  sturdier(
    2,
    { cue: [1.4, -1.6], b1: [11.1, 2.8], b2: [12.2, 12.7] },
    shot(31.3, 0.2484),
    shot(27.8, 0.1707),
    0,
    "Bi đỏ nằm ngay trên đường bi cái rời bi vàng: đi trực tiếp rộng khoảng 6°, lệch 1° vẫn ghi điểm. Vòng qua băng ở thế này chỉ làm đường đi dài thêm và không tới được bi đỏ."
  ),
  sturdier(
    3,
    { cue: [-19.2, -14.9], b1: [-22.6, -8.3], b2: [-38, 2.6] },
    shot(131.4, 0.0977),
    shot(127.9, 0.1417),
    1,
    "Thế này là bài 1 xoay nửa vòng: cùng một quy luật ở góc bàn đối diện. Bi đỏ gần băng ngắn nên đường qua băng rộng, đường trực tiếp chỉ là một khe hẹp."
  ),
]

// ====================== Cap 6 va 7 ======================

type GatherRow = [group: string, balls: Setup, radius: number, hint: string]

function gather(level: 6 | 7, titles: Record<string, string>, prompts: Record<string, string>, explains: Record<string, string>, rows: GatherRow[]): Scenario[] {
  const counters: Record<string, number> = {}
  return rows.map(([group, balls, radius, hint]) => {
    const n = (counters[group] = (counters[group] ?? 0) + 1)
    return {
      id: `L${level}-${group}-0${n}`,
      level,
      group,
      title: `${titles[group]} ${n}`,
      prompt: prompts[group],
      balls,
      goal: { type: "gather", radius },
      aids: { ghostBall: true, tangentLine: true },
      hint,
      explain: explains[group],
    }
  })
}

const SOFT = "Lực rất nhẹ (khoảng {{luc:0.0464}} trên 100), chạm giữa tâm."

export const LEVEL6: Scenario[] = gather(
  6,
  { A: "Giữ bi gần", B: "Kéo bi lại gần", C: "Gom từ xa" },
  {
    A: "Ba bi đang nằm gần nhau. Ghi điểm sao cho sau cú đánh chúng vẫn nằm gọn (đạt cả hai mới tính là đạt).",
    B: "Ba bi hơi rời nhau. Ghi điểm và để chúng dừng gần nhau hơn lúc đầu.",
    C: "Ba bi nằm xa nhau. Ghi điểm và gom chúng lại trong một vùng nhỏ.",
  },
  {
    A: "Khi bi đã gần nhau, kẻ thù là lực thừa. Đánh vừa đủ để bi cái tới bi thứ hai; bi thứ nhất chỉ nên nhích đi một đoạn ngắn.",
    B: "Nghĩ trước một cú: bi thứ nhất sẽ chạy đi đâu, bi cái sẽ dừng ở đâu. Chạm mỏng thì bi thứ nhất gần như ở lại; chạm dày thì nó chạy xa còn bi cái ở lại.",
    C: "Gom từ xa cần cả ba thứ cùng đúng: bi chạm trước, độ dày chạm và lực. Thường bi cái phải đi một quãng tới hai bi kia, nên chọn lực sao cho nó tới bi thứ hai rồi gần hết đà.",
  },
  [
    ["A", { cue: [-5, -8.3], b1: [-1.2, -2.5], b2: [-4.1, -3.4] }, 5, `Chạm bi vàng trước. ${SOFT}`],
    ["A", { cue: [-23.6, -1.2], b1: [-19.4, -4.2], b2: [-18.4, -1.3] }, 5, `Chạm bi vàng trước. ${SOFT}`],
    ["A", { cue: [17.6, -5.3], b1: [24.1, -6], b2: [23.2, -8.9] }, 5, `Chạm bi vàng trước. ${SOFT}`],
    ["B", { cue: [-8.5, -2.7], b1: [-0.4, -5.7], b2: [2.8, -2.3] }, 6, `Chạm bi vàng trước. ${SOFT}`],
    ["B", { cue: [23.6, 2.8], b1: [25.7, -10], b2: [26.7, -2.7] }, 6, `Chạm bi vàng trước (bi xa hơn), để bi cái dừng gần bi đỏ. ${SOFT}`],
    ["B", { cue: [19.2, 3.7], b1: [12.2, -8.8], b2: [12.1, -3.9] }, 6, `Chạm bi đỏ trước. ${SOFT}`],
    ["C", { cue: [-1.3, -2.5], b1: [-2.5, 11.2], b2: [-8.2, 13.3] }, 7, "Chạm bi vàng trước, lực nhẹ (khoảng {{luc:0.0559}}), giữa tâm."],
    ["C", { cue: [2.9, -3.6], b1: [-10.5, 2.2], b2: [-9.4, 9.2] }, 7, "Chạm bi vàng trước, lực khoảng {{luc:0.0977}}, chạm dưới tâm để bi cái không chạy quá bi đỏ."],
    ["C", { cue: [-27.5, 14.9], b1: [-20.1, 0.8], b2: [-14.3, -0.1] }, 7, "Chạm bi vàng trước, lực nhẹ (khoảng {{luc:0.0674}}), giữa tâm."],
  ]
)

export const LEVEL7: Scenario[] = gather(
  7,
  { A: "Bi sát băng", B: "Bi trong góc", C: "Đánh nhỏ" },
  {
    A: "Hai trong ba bi nằm sát băng dài. Ghi điểm và giữ cả ba bi nằm gọn.",
    B: "Cả hai bi mục tiêu nằm trong vùng góc. Ghi điểm và giữ ba bi nằm gọn.",
    C: "Ba bi rất gần nhau. Ghi điểm bằng một cú thật nhỏ để chúng vẫn nằm trong một vùng chỉ bằng bốn viên bi.",
  },
  {
    A: "Băng vừa là chỗ dựa vừa là cái bẫy. Bi sát băng không chạy xa được, nên dễ giữ thế; nhưng nếu đánh quá lực, nó bật băng văng ra và phá thế. Luôn dùng lực nhỏ nhất còn ghi được điểm.",
    B: "Trong góc bi rất dễ giữ gần nhau, nhưng theo luật thi đấu bạn chỉ được ghi thêm một điểm rồi phải đưa ít nhất một bi mục tiêu ra khỏi vùng góc. Bật luật vùng góc trong Cài đặt và tập ở chế độ Đánh chuỗi để quen với việc này.",
    C: "Chuỗi dài không đến từ cú khó mà từ rất nhiều cú nhỏ: bi cái đi vài phân, hai bi kia gần như không nhúc nhích. Mỗi cú chỉ có một việc: ghi điểm mà không làm thế bi xấu đi.",
  },
  [
    ["A", { cue: [3.8, -19.1], b1: [-3.4, -20.7], b2: [-5.3, -18.6] }, 5.5, `Chạm bi vàng trước. ${SOFT}`],
    ["A", { cue: [-5.8, 14.7], b1: [-7.9, 19.8], b2: [-3.8, 21.8] }, 5.5, `Chạm bi vàng trước. ${SOFT}`],
    ["A", { cue: [-29.9, -19.5], b1: [-26.7, -15.8], b2: [-21.8, -19.6] }, 5.5, `Chạm bi vàng trước. ${SOFT}`],
    ["B", { cue: [42.7, -13.4], b1: [38, -21.6], b2: [38, -18.4] }, 6, `Chạm bi vàng trước. ${SOFT}`],
    ["B", { cue: [-35.2, -11.9], b1: [-35.2, -17.5], b2: [-41.5, -18.5] }, 6, `Chạm bi vàng trước. ${SOFT}`],
    ["B", { cue: [35.1, -19], b1: [41.9, -15.6], b2: [36.9, -21.1] }, 6, `Chạm bi đỏ trước. ${SOFT}`],
    ["C", { cue: [16.3, -4.3], b1: [12.1, -2.1], b2: [15.6, -1.5] }, 4, `Chạm bi vàng trước. ${SOFT}`],
    ["C", { cue: [-1.4, 4.6], b1: [-1.8, 9.4], b2: [1.8, 10.5] }, 4, `Chạm bi vàng trước. ${SOFT}`],
    ["C", { cue: [17, -9.9], b1: [14.8, -14.3], b2: [12, -11.4] }, 4, `Chạm bi vàng trước. ${SOFT}`],
  ]
)
