// Cap 4: bang va e-phe. Chin nhom A den I theo docs/LEVELS.md. The bi duoc dung tu mo
// phong (tim ngau nhien co hat giong roi kiem lai), moi tinh huong qua scenarios:check.
// Ghi nho ve chieu xoay: tip.x > 0 la xoay phai. Thuan hay nghich tuy bi dang troi ve
// phia nao doc bang, nen moi tinh huong ghi ro trong loi giai thich.
import { TABLE, type Setup, type Shot, type Vec2 } from "../../engine"
import type { Tip } from "../../table/tipZone"
import { NINE_NAMES, NINE_TIPS } from "../tips"
import type { Scenario, Zone } from "../types"

const CENTRE: Tip = { x: 0, y: 0 }
const LEFT: Tip = { x: -0.6, y: 0 }
const RIGHT: Tip = { x: 0.6, y: 0 }
const TOP = TABLE.centreLimitY
const BOTTOM = -TABLE.centreLimitY

// ---------- A: chi co bi cai, ngam bu theo xoay ----------

const A_CUE: Vec2 = [-12, 6]
const A_ZONE: Zone = { cx: 28.1, cy: -20.2, r: 4.5 }

function aim(n: number, title: string, tip: Tip, power: number, spin: string, explain: string): Scenario {
  return {
    id: `L4-A-0${n}`,
    level: 4,
    group: "A",
    title,
    prompt: `Điểm chạm và lực đã khóa (${spin}). Chỉ chỉnh hướng: cho bi cái chạm băng trên một lần rồi dừng trong ô.`,
    balls: { cue: A_CUE },
    goal: { type: "stopInZone", ball: "cue", zone: A_ZONE, cushions: 1 },
    locked: { tip, power },
    hint: "Kéo trên bàn để đổi chỗ bi cái chạm băng. Đánh thử, xem bi dừng lệch về phía nào rồi dời điểm chạm băng.",
    explain,
  }
}

// ---------- B: doan diem cham bang ----------

function mark(n: number, balls: Setup, target: Vec2, shot: Shot, spin: string, explain: string): Scenario {
  return {
    id: `L4-B-0${n}`,
    level: 4,
    group: "B",
    title: `Đoán điểm chạm băng ${n}`,
    prompt: `Cú mẫu đánh lực vừa, ${spin}. Bi cái cần chạm băng ở đâu để bật tới bi vàng? Chấm lên băng.`,
    balls,
    goal: { type: "markCushion", target, tolerance: 1, shot },
    hint: "Không xoáy thì góc bật gần bằng góc tới: điểm chạm băng nằm gần giữa hai bi nếu chúng cách băng như nhau. Xoáy thuận mở góc, xoáy nghịch dựng góc.",
    explain,
  }
}

// ---------- C, E: ghi diem co bang ----------

function cushionCarom(group: "C" | "E", n: number, balls: Setup, hint: string): Scenario {
  const first = group === "E"
  return {
    id: `L4-${group}-0${n}`,
    level: 4,
    group,
    title: first ? `Băng trước ${n}` : `Bi, băng, bi ${n}`,
    prompt: first
      ? "Ghi điểm kiểu băng trước: bi cái chạm băng rồi mới chạm bi."
      : "Ghi điểm kiểu bi, băng, bi: bi cái chạm một bi, bật băng, rồi tới bi còn lại.",
    balls,
    goal: { type: "score", require: first ? "cushionFirst" : "cushionBeforeSecond" },
    aids: { ghostBall: true, tangentLine: !first },
    hint,
    explain: first
      ? "Băng trước dùng khi không có đường thẳng tới bi thứ nhất, hoặc khi đi qua băng cho góc chạm đẹp hơn. Ngắm điểm trên băng như ngắm một viên bi: không xoáy thì góc bật gần bằng góc tới."
      : "Bi cái rời bi thứ nhất gần theo đường 90°, tới băng rồi bật ra. Đọc cú này theo hai chặng: đường 90° đưa bi cái tới chỗ nào trên băng, và từ chỗ đó góc bật có đưa nó tới bi thứ hai không.",
  }
}

// ---------- D, F: chon dap an co cu danh ----------

function choice(
  group: "D" | "F",
  n: number,
  balls: Setup,
  angleDeg: number,
  power: number,
  answer: number,
  explain: string
): Scenario {
  const side = group === "D"
  const tips = side ? [LEFT, CENTRE, RIGHT] : [{ x: 0.45, y: 0.45 }, RIGHT, { x: 0.45, y: -0.45 }]
  return {
    id: `L4-${group}-0${n}`,
    level: 4,
    group,
    title: side ? `Thuận hay nghịch ${n}` : `Ba điểm chạm, một thế ${n}`,
    prompt: side
      ? "Hướng và lực giữ nguyên. Bi cái chạm bi vàng rồi tới băng. Xoáy nào đưa nó tới bi đỏ?"
      : "Hướng và lực giữ nguyên, ba điểm chạm ở bên phải. Xem đủ ba đường bi cái, rồi chọn đường ghi điểm.",
    balls,
    goal: {
      type: "choice",
      options: side ? ["Xoáy trái", "Không xoáy", "Xoáy phải"] : ["Trên phải", "Giữa phải", "Dưới phải"],
      answer,
      shots: tips.map((tip) => ({ angleDeg, power, tip })),
      overlay: !side,
    },
    hint: side
      ? "Xem bi cái trôi về phía nào dọc băng. Xoáy cùng phía đó là xoáy thuận, mở góc bật; xoáy ngược lại là xoáy nghịch, dựng góc bật."
      : "Cả ba cùng xoáy phải nên khác nhau ở trục dọc: trên tâm kéo bi cái về trước đường 90°, dưới tâm kéo nó về sau, nên bi cái tới băng ở ba chỗ khác nhau.",
    explain,
  }
}

// ---------- G: chi mot diem cheo ----------

function onlyTip(n: number, balls: Setup, angleDeg: number, power: number, tip: Tip, name: string): Scenario {
  return {
    id: `L4-G-0${n}`,
    level: 4,
    group: "G",
    title: `Tìm đúng góc ${n}`,
    prompt: "Hướng và lực đã khóa. Trong chín điểm chạm chuẩn chỉ một điểm chéo ghi được điểm. Tìm nó trong tối đa 3 lần thử.",
    balls,
    goal: { type: "score", onlyTip: tip },
    locked: { angleDeg, power },
    maxAttempts: 3,
    hint: "Hỏi hai câu: sau khi chạm bi vàng, bi cái cần đi trước hay sau đường 90° (trên hay dưới tâm)? Tới băng cần bật rộng ra hay dựng lại (thuận hay nghịch)?",
    explain: `Điểm ghi điểm là ${name}. Trục dọc quyết định bi cái làm gì sau khi chạm bi; trục ngang quyết định nó làm gì khi chạm băng. Điểm chéo là cộng hai tác dụng đó.`,
  }
}

// ---------- H: chinh luong xoay ----------

function amount(n: number, side: string, level: string, zone: Zone): Scenario {
  return {
    id: `L4-H-0${n}`,
    level: 4,
    group: "H",
    title: `Chỉnh lượng xoáy ${n}`,
    prompt: `Hướng và lực đã khóa: bi cái đâm thẳng vào băng trên. Đánh ${side} và chọn lượng xoáy để bi dừng trong ô.`,
    balls: { cue: [0, 10] },
    goal: { type: "stopInZone", ball: "cue", zone },
    locked: { angleDeg: 90, power: 0.1556 },
    hint: "Giữ điểm chạm trên đường ngang qua tâm. Càng xa tâm, bi bật càng lệch sang bên. Bi dừng chưa tới ô thì thêm xoáy, quá ô thì bớt.",
    explain: `Ô này cần lượng xoáy ${level}. Khi đâm thẳng băng, độ lệch sang bên tăng gần đều theo khoảng cách từ điểm chạm tới tâm; xoáy phải bật sang phải, xoáy trái bật sang trái.`,
  }
}

// ---------- I: doc nguoc ----------

// Ca ba bai dung chung mot the: bi cai cham bi vang roi xuong bang duoi khi dang troi
// sang trai, nen tac dung cua truc ngang (o bang) va truc doc (quang duong) deu thay ro.
const READ_BALLS: Setup = { cue: [7.1, -6.5], b1: [0.1, -12] }
const READ_ANGLE = -132.1
const READ_POWER = 0.2057

function readBack(n: number, balls: Setup, angleDeg: number, power: number, answer: number, explain: string): Scenario {
  return {
    id: `L4-I-0${n}`,
    level: 4,
    group: "I",
    title: `Đọc ngược ${n}`,
    prompt: "Bấm Xem cú đánh (xem lại bao nhiêu lần cũng được). Nhìn đường bi cái sau khi chạm bi vàng và sau khi chạm băng, rồi đoán điểm chạm đã dùng.",
    balls,
    goal: { type: "choice", options: NINE_NAMES, answer, replay: { angleDeg, power, tips: NINE_TIPS } },
    maxAttempts: 3,
    hint: "Đọc hai thứ. Ở băng: bi cái bật rộng ra (thuận), bình thường (không xoáy ngang) hay dựng lại, bật ngược (nghịch)? Sau đó: nó còn chạy xa (trên tâm), vừa phải (giữa) hay chậm và dừng sớm (dưới tâm)? Ở thế này bi cái trôi sang trái dọc băng dưới, nên xoáy phải là thuận.",
    explain,
  }
}

export const LEVEL4: Scenario[] = [
  aim(
    1,
    "Ngắm băng, không xoáy",
    CENTRE,
    0.1556,
    "giữa tâm, không xoáy",
    "Không xoáy: góc bật gần bằng góc tới. Đây là đường chuẩn để so với hai bài sau."
  ),
  aim(
    2,
    "Ngắm băng, xoáy thuận",
    RIGHT,
    0.1417,
    "xoáy phải, ở đây là xoáy thuận",
    "Bi trôi sang phải dọc băng nên xoáy phải là thuận: góc bật mở rộng và bi chạy xa hơn. Muốn về cùng một ô, phải cho bi chạm băng sớm hơn (gần bi cái hơn) so với cú không xoáy."
  ),
  aim(
    3,
    "Ngắm băng, xoáy nghịch",
    LEFT,
    0.1485,
    "xoáy trái, ở đây là xoáy nghịch",
    "Xoáy trái ở đây là nghịch: góc bật dựng lại (gần hướng vuông góc với băng hơn) và bi bị hãm. Muốn về cùng một ô, phải cho bi chạm băng muộn hơn so với cú không xoáy."
  ),

  mark(
    1,
    { cue: [-25, -8], b1: [0.5, 10.7] },
    [-7.6, TOP],
    { angleDeg: 60, power: 0.1417, tip: CENTRE },
    "không xoáy",
    "Không xoáy, góc bật gần bằng góc tới (ở lực vừa bật hơi dựng hơn một chút). Chấm vàng là chỗ cú mẫu chạm băng."
  ),
  mark(
    2,
    { cue: [10, -12], b1: [-23.9, 12.2] },
    [-13.9, TOP],
    { angleDeg: 125, power: 0.1417, tip: LEFT },
    "xoáy trái (ở đây là xoáy thuận)",
    "Bi trôi sang trái dọc băng nên xoáy trái là thuận: góc bật mở rộng. Vì thế điểm chạm băng nằm gần bi cái hơn so với cú không xoáy."
  ),
  mark(
    3,
    { cue: [-5, 8], b1: [29.6, -11.6] },
    [20.2, BOTTOM],
    { angleDeg: -50, power: 0.1556, tip: RIGHT },
    "xoáy phải (ở đây là xoáy nghịch)",
    "Nhìn theo hướng đánh xuống băng dưới, bi trôi sang trái của người đánh, nên xoáy phải là nghịch: góc bật dựng lại. Điểm chạm băng nằm xa bi cái hơn so với cú không xoáy."
  ),

  cushionCarom("C", 1, { cue: [34.5, -5.8], b1: [26.1, -5], b2: [-1.6, 16.7] }, "Chạm mỏng phía dưới bi vàng, không xoáy, lực vừa. Bi cái lên băng trên rồi bật về phía bi đỏ."),
  cushionCarom("C", 2, { cue: [19.2, 14.9], b1: [22.6, 8.3], b2: [38, -2.6] }, "Chạm khoảng nửa bi, không xoáy. Bi cái sang băng ngắn bên phải rồi bật về bi đỏ."),
  cushionCarom("C", 3, { cue: [-28.8, 3.2], b1: [-33.1, 7.4], b2: [-30.2, 11.2] }, "Không xoáy thì bi cái bật thẳng ngược ra và trượt bi đỏ. Thêm xoáy phải để góc bật mở về phía bi đỏ."),

  choice(
    "D",
    1,
    { cue: [7.1, -6.5], b1: [0.1, -12], b2: [1.7, -6.1] },
    -132.1,
    0.2057,
    0,
    "Bi cái trôi sang trái dọc băng dưới, còn bi đỏ nằm ngược về bên phải. Cần góc bật dựng ngược lại: xoáy nghịch, ở đây là xoáy trái."
  ),
  choice(
    "D",
    2,
    { cue: [7.1, -6.5], b1: [0.1, -12], b2: [-5.1, -6.7] },
    -132.1,
    0.2057,
    1,
    "Bi đỏ nằm đúng trên đường bật tự nhiên. Thêm xoáy nào cũng làm bi cái lệch khỏi nó: xoáy trái dựng góc, xoáy phải mở góc."
  ),
  choice(
    "D",
    3,
    { cue: [7.1, -6.5], b1: [0.1, -12], b2: [-5, -15.6] },
    -132.1,
    0.2057,
    2,
    "Bi đỏ nằm sát băng, xa về bên trái. Cần góc bật mở rộng: xoáy thuận, ở đây là xoáy phải vì bi cái đang trôi sang trái dọc băng dưới."
  ),

  cushionCarom("E", 1, { cue: [-20, 0], b1: [5.4, 12.1], b2: [3.6, 6.7] }, "Ngắm lên băng trên, khoảng giữa bi cái và bi vàng. Không xoáy, lực vừa."),
  cushionCarom("E", 2, { cue: [15, 6], b1: [-8.5, -10], b2: [-14.1, -10.4] }, "Ngắm xuống băng dưới. Hai bi nằm ngang nhau: cho bi cái bật vào bi vàng trước rồi lăn tiếp sang bi đỏ."),
  cushionCarom("E", 3, { cue: [-35, -10], b1: [39.1, 14.4], b2: [39.5, 8.7] }, "Cú dài chéo bàn lên băng trên. Góc vào thoải nên góc bật cũng thoải."),

  choice(
    "F",
    1,
    { cue: [-8.2, 13.3], b1: [-3.4, 7.8], b2: [33.5, 0.5] },
    -38.6,
    0.2057,
    0,
    "Trên phải: xoáy tới kéo bi cái về trước đường 90° nên nó tới băng ở chỗ khác hẳn hai cú kia, rồi bật về đúng bi đỏ."
  ),
  choice(
    "F",
    2,
    { cue: [10.4, 3.9], b1: [1.9, 5.3], b2: [-42.4, -16.9] },
    180.7,
    0.2057,
    2,
    "Dưới phải: xoáy lui kéo bi cái về sau đường 90°, nên nó xuống băng dưới sớm hơn và bật theo một đường riêng tới bi đỏ."
  ),
  choice(
    "F",
    3,
    { cue: [-8.2, 13.3], b1: [-3.4, 7.8], b2: [33.6, 2.9] },
    -38.6,
    0.2057,
    1,
    "Giữa phải. Thế này giống hệt bài 1, chỉ dời bi đỏ hơn một viên bi: chừng đó đã đủ để điểm chạm đúng đổi từ trên phải sang giữa phải."
  ),

  onlyTip(1, { cue: [-11.8, -7.2], b1: [-10.6, 0.2], b2: [35, 14] }, 73.9, 0.2057, { x: 0.45, y: 0.45 }, "trên phải"),
  onlyTip(2, { cue: [-31.4, 12.9], b1: [-32.9, 6.7], b2: [-3.1, -9.7] }, -95.5, 0.1874, { x: -0.45, y: 0.45 }, "trên trái"),
  onlyTip(3, { cue: [22.9, 10.1], b1: [27.1, 17.7], b2: [15.6, 17.2] }, 66.4, 0.2057, { x: -0.45, y: -0.45 }, "dưới trái"),

  amount(1, "xoáy phải", "vừa", { cx: 14.5, cy: -20.3, r: 3.5 }),
  amount(2, "xoáy phải", "mạnh", { cx: 23.3, cy: -19.5, r: 3.5 }),
  amount(3, "xoáy trái", "nhẹ", { cx: -6, cy: -20.6, r: 3.5 }),

  readBack(
    1,
    READ_BALLS,
    READ_ANGLE,
    READ_POWER,
    3,
    "Điểm chạm là Trái. Bi cái tới băng dưới khi đang trôi sang trái; không xoáy thì nó bật tiếp sang trái. Ở đây nó bật ngược về bên phải, tức góc bật bị dựng quá mức: xoáy nghịch, ở thế này là xoáy trái. Sau băng nó chạy xa như một cú giữa tâm, nên trục dọc ở giữa."
  ),
  readBack(
    2,
    READ_BALLS,
    READ_ANGLE,
    READ_POWER,
    8,
    "Điểm chạm là Dưới phải. Ở băng, bi cái bật rộng hẳn sang trái: xoáy thuận, ở thế này là xoáy phải. Nhưng nó đi chậm và dừng sớm, không lên tới băng trên: xoáy lui đã lấy bớt tốc độ ngay sau khi chạm bi vàng, tức là dưới tâm."
  ),
  readBack(
    3,
    READ_BALLS,
    READ_ANGLE,
    READ_POWER,
    0,
    "Điểm chạm là Trên trái. Ở băng, bi cái bật gần thẳng đứng thay vì trôi tiếp sang trái: góc bật dựng lại, xoáy nghịch (xoáy trái). Nó giữ nhiều tốc độ, chạy lên tới băng trên rồi còn quay ngược lại: xoáy tới, tức là trên tâm."
  ),
]
