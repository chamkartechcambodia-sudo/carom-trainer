// Noi dung 7 cap (soan o buoc 6, 7, 8). Chi tiet thiet ke: docs/LEVELS.md.
import type { Setup } from "../engine"
import { LEVEL1 } from "../scenarios/data/level1"
import { LEVEL2 } from "../scenarios/data/level2"
import { LEVEL3 } from "../scenarios/data/level3"
import { LEVEL4 } from "../scenarios/data/level4"
import { LEVEL5, LEVEL6, LEVEL7 } from "../scenarios/data/level567"
import type { Scenario, Zone } from "../scenarios/types"
import { LESSONS_1, LESSONS_2, LESSONS_3, type Lesson } from "./lessons123"
import { LESSONS_4 } from "./lessons4"
import { LESSONS_5, LESSONS_6, LESSONS_7 } from "./lessons567"

export type { Lesson } from "./lessons123"

export interface Drill {
  /** Vi du "L4-T3". */
  id: string
  title: string
  how: string
  passWhen: string
  /**
   * "count": ghi so qua dat tren 10, so voi nguong qua cap.
   * "check": tu danh gia dat hay chua (bai khong dem duoc bang so qua).
   */
  kind: "count" | "check"
  /** Cong vao nguong chung trong cai dat (vi du -1 cho bai kho hon). */
  thresholdDelta?: number
  /** Cac so do xep bi (thuong mot; bai co hai the thi hai). Chua co thi man hinh ghi ro. */
  layouts?: { balls: Setup; zone?: Zone }[]
}

export interface Level {
  id: number
  title: string
  learns: string
  exam: string
  /** Luu y hien o dau man hinh cap. */
  note?: string
  lessons: Lesson[]
  scenarios: Scenario[]
  drills: Drill[]
}

// Mot kim cuong tren bang = 11,5 R (khoang 35 cm). O tap ban that: ve bang phan mot
// vong tron duong kinh khoang 35 cm (dai hon to giay A4 mot chut).
const D = 11.545
/** Khoang cach tu tam ban toi duong tam bi cham bang dai. */
const TABLE_EDGE = 22.09

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Kiểm soát lực",
    learns: "Đánh nhẹ, vừa, mạnh để bi dừng đúng vùng.",
    exam: "Bi cái dừng trong ô đánh dấu khi lăn thẳng, sau 1 băng, sau 2 băng.",
    lessons: LESSONS_1,
    scenarios: LEVEL1,
    drills: [
      {
        id: "L1-T1",
        title: "Lăn thẳng vào ô",
        how: "Chỉ dùng bi cái. Đặt bi ở ngang kim cương thứ nhất, giữa bề rộng bàn. Vẽ bằng phấn một ô tròn đường kính khoảng 35 cm ở chính giữa bàn. Đánh cho bi lăn thẳng tới dừng trong ô, không chạm băng.",
        passWhen: "Tâm bi dừng trong ô.",
        kind: "count",
        layouts: [{ balls: { cue: [-3 * D, 0] }, zone: { cx: 0, cy: 0, r: D / 2 } }],
      },
      {
        id: "L1-T2",
        title: "Một băng rồi vào ô",
        how: "Bi cái đặt như bài 1. Vẽ ô tròn ngang kim cương thứ sáu. Đánh thẳng vào băng ngắn bên kia cho bi bật về dừng trong ô.",
        passWhen: "Bi chạm đúng một băng và tâm bi dừng trong ô.",
        kind: "count",
        layouts: [{ balls: { cue: [-3 * D, 0] }, zone: { cx: 2 * D, cy: 0, r: D / 2 } }],
      },
      {
        id: "L1-T3",
        title: "Hai băng rồi vào ô",
        how: "Bi cái đặt ở giữa bàn. Vẽ ô tròn ngang kim cương thứ hai. Đánh thẳng vào băng ngắn bên kia, bi bật về qua suốt chiều dài bàn, chạm băng ngắn bên này rồi dừng trong ô.",
        passWhen: "Bi chạm đúng hai băng và tâm bi dừng trong ô.",
        kind: "count",
        thresholdDelta: -1,
        layouts: [{ balls: { cue: [0, 0] }, zone: { cx: -2 * D, cy: 0, r: D / 2 } }],
      },
    ],
  },
  {
    id: 2,
    title: "Độ dày chạm và quy tắc 90°",
    learns: "Chạm đầy, 3/4, nửa bi, 1/4, mỏng; đoán đường bi cái.",
    exam: "Ghi điểm trực tiếp khi bi thứ hai nằm trên đường 90°.",
    lessons: LESSONS_2,
    scenarios: LEVEL2,
    drills: [
      {
        id: "L2-T1",
        title: "Ghi điểm theo đường 90°, chạm vừa",
        how: "Xếp theo sơ đồ: bi cái cách bi vàng khoảng 15 cm; bi đỏ cách bi vàng khoảng 30 cm, lệch sang bên gần vuông góc với đường ngắm. Chạm giữa tâm, lực vừa (bi vàng lăn được khoảng một chiều dài bàn). Sau mỗi quả, xếp lại đúng thế.",
        passWhen: "Ghi điểm.",
        kind: "count",
        layouts: [{ balls: { cue: [-20, 6], b1: [-15, 6], b2: [-11.9, -2.5] } }],
      },
      {
        id: "L2-T2",
        title: "Ghi điểm theo đường 90°, chạm mỏng",
        how: "Xếp theo sơ đồ: bi vàng nằm chếch phía trước bi cái khoảng 15 cm; bi đỏ nằm xa hơn, gần sát hướng đánh. Chạm giữa tâm, chạm mỏng bi vàng để bi cái gần như đi tiếp sang bi đỏ.",
        passWhen: "Ghi điểm.",
        kind: "count",
        layouts: [{ balls: { cue: [-30, -2], b1: [-25.5, 0], b2: [-18.2, -5.5] } }],
      },
    ],
  },
  {
    id: 3,
    title: "Trên tâm, dưới tâm",
    learns: "Đẩy theo, kéo lùi, dừng bi.",
    exam: "Dừng bi khi đánh thẳng; ghi điểm khi bi thứ hai nằm trước hoặc sau đường 90°.",
    lessons: LESSONS_3,
    scenarios: LEVEL3,
    drills: [
      {
        id: "L3-T1",
        title: "Dừng bi",
        how: "Bi cái cách bi vàng khoảng 15 cm, đánh thẳng chính diện với lực vừa. Đánh dấu chỗ bi cái chạm bi vàng bằng một chấm phấn.",
        passWhen: "Bi cái dừng cách chấm phấn không quá một viên bi.",
        kind: "count",
        layouts: [{ balls: { cue: [-24, -8], b1: [-17.4, -5.6] } }],
      },
      {
        id: "L3-T2",
        title: "Đẩy theo để ghi điểm",
        how: "Xếp theo sơ đồ: bi đỏ nằm phía trước đường 90°. Chạm trên tâm, lực vừa.",
        passWhen: "Ghi điểm.",
        kind: "count",
        layouts: [{ balls: { cue: [-20, -6], b1: [-14, -6], b2: [-7.5, 3.3] } }],
      },
      {
        id: "L3-T3",
        title: "Kéo lùi để ghi điểm",
        how: "Xếp theo sơ đồ: bi đỏ nằm phía sau đường 90°, gần về phía bạn đứng. Chạm dưới tâm sâu, đánh dứt khoát.",
        passWhen: "Ghi điểm.",
        kind: "count",
        thresholdDelta: -1,
        layouts: [{ balls: { cue: [0, -8], b1: [5, -8], b2: [1.5, 0.2] } }],
      },
    ],
  },
  {
    id: 4,
    title: "Băng và ê-phê",
    learns: "Thuận, nghịch, ghi điểm qua băng, 9 điểm chạm.",
    exam: "6 bài tập bàn thật.",
    note: "Đây là cấp mà mô phỏng kém chính xác nhất so với bàn thật: độ nảy của băng và tác dụng của ê-phê mỗi bàn một khác, và mô phỏng không có hiện tượng bi cái lệch hướng khi đánh ê-phê. Hãy dùng mô phỏng để hiểu hướng thay đổi, rồi đo mức thay đổi trên bàn thật bằng bài tập 1 và 2.",
    lessons: LESSONS_4,
    scenarios: LEVEL4,
    drills: [
      {
        id: "L4-T1",
        title: "Đâm thẳng băng",
        how: "Chỉ dùng bi cái. Đặt một viên phấn lơ trên băng dài bên mình làm đích, lệch khoảng một kim cương sang phải. Đánh thẳng vào băng dài đối diện với xoáy phải sao cho bi bật về qua sát viên phấn. Làm 10 quả, rồi đổi phấn sang trái và đánh xoáy trái 10 quả; ghi buổi nào kém hơn.",
        passWhen: "Bi qua cách viên phấn không quá một viên bi.",
        kind: "count",
        layouts: [{ balls: { cue: [0, -10] }, zone: { cx: D, cy: -TABLE_EDGE, r: 2 } }],
      },
      {
        id: "L4-T2",
        title: "Đâm xéo",
        how: "Chỉ dùng bi cái, một đường vào băng cố định như sơ đồ. Đánh ba kiểu với cùng lực: không xoáy, xoáy thuận, xoáy nghịch. Mỗi kiểu đánh dấu bằng phấn chỗ bi chạm băng thứ hai.",
        passWhen: "Ba dấu tách rõ nhau và lặp lại được khi đánh lại.",
        kind: "check",
        layouts: [{ balls: { cue: [-12, 6] } }],
      },
      {
        id: "L4-T3",
        title: "Bi, băng, bi",
        how: "Xếp theo sơ đồ. Chạm mỏng bi vàng, không xoáy, cho bi cái lên băng dài rồi bật về bi đỏ.",
        passWhen: "Ghi điểm.",
        kind: "count",
        layouts: [{ balls: { cue: [34.5, -5.8], b1: [26.1, -5], b2: [-1.6, 16.7] } }],
      },
      {
        id: "L4-T4",
        title: "Băng trước",
        how: "Xếp theo sơ đồ. Đánh bi cái lên băng dài trước, bật xuống chạm bi vàng rồi sang bi đỏ.",
        passWhen: "Ghi điểm và bi cái chạm băng trước khi chạm bi.",
        kind: "count",
        layouts: [{ balls: { cue: [-20, 0], b1: [5.4, 12.1], b2: [3.6, 6.7] } }],
      },
      {
        id: "L4-T5",
        title: "Một cột ba điểm",
        how: "Dùng lại thế của bài 3. Đánh ba cú với cùng hướng và lực: trên phải, giữa phải, dưới phải. Trước khi đánh, nói ra thứ tự ba chỗ chạm băng từ trái sang phải; đánh dấu từng chỗ bằng phấn rồi so.",
        passWhen: "Nói trước thứ tự ba dấu và đúng.",
        kind: "check",
        layouts: [{ balls: { cue: [34.5, -5.8], b1: [26.1, -5] } }],
      },
      {
        id: "L4-T6",
        title: "Thế bắt buộc điểm chéo",
        how: "Hai thế theo hai sơ đồ, mỗi thế 5 quả. Thế thứ nhất cần trên phải, thế thứ hai cần trên trái. Trên bàn thật điểm chạm đúng có thể lệch so với mô phỏng: hãy tự tìm lại.",
        passWhen: "Ghi điểm.",
        kind: "count",
        thresholdDelta: -1,
        layouts: [
          { balls: { cue: [-11.8, -7.2], b1: [-10.6, 0.2], b2: [35, 14] } },
          { balls: { cue: [-31.4, 12.9], b1: [-32.9, 6.7], b2: [-3.1, -9.7] } },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Chọn cách đánh",
    learns: "Một thế có 2 đến 3 lời giải, chọn lời giải chắc nhất.",
    exam: "Nói trước bi chạm trước và cách đánh, rồi ghi điểm đúng như đã nói.",
    lessons: LESSONS_5,
    scenarios: LEVEL5,
    drills: [
      {
        id: "L5-T1",
        title: "Nói trước bi chạm trước",
        how: "Xếp theo sơ đồ. Trước mỗi quả, nói to bi nào chạm trước, rồi đánh giữa tâm, lực vừa. Chỉ tính đạt khi ghi điểm đúng theo cách đã nói.",
        passWhen: "Ghi điểm theo đúng cách đã nói.",
        kind: "count",
        layouts: [{ balls: { cue: [17.1, 5.7], b1: [13.9, 13.9], b2: [5.9, 13.8] } }],
      },
      {
        id: "L5-T2",
        title: "Trực tiếp hay qua băng",
        how: "Xếp theo sơ đồ: bi đỏ nằm gần băng ngắn. Đánh 10 quả theo cách bạn cho là chắc hơn (trực tiếp hoặc qua băng ngắn). Sau đó đánh thử 10 quả theo cách còn lại và so số quả đạt; chỉ ghi vào sổ kết quả của cách bạn chọn.",
        passWhen: "Ghi điểm.",
        kind: "count",
        layouts: [{ balls: { cue: [19.2, 14.9], b1: [22.6, 8.3], b2: [38, -2.6] } }],
      },
    ],
  },
  {
    id: 6,
    title: "Gom bi",
    learns: "Ghi điểm xong ba bi nằm ở đâu; điều khiển cả bi chạm trước.",
    exam: "Ghi điểm và để ba bi dừng trong một vòng tròn nhỏ.",
    lessons: LESSONS_6,
    scenarios: LEVEL6,
    drills: [
      {
        id: "L6-T1",
        title: "Giữ bi gần",
        how: "Xếp ba bi gần nhau theo sơ đồ. Ghi điểm sao cho sau cú đánh cả ba bi nằm gọn trong một vòng tròn đường kính khoảng 30 cm (đặt được một tờ giấy A4 che cả ba tâm bi). Sau mỗi quả, xếp lại đúng thế.",
        passWhen: "Ghi điểm và ba bi nằm trong vòng tròn.",
        kind: "count",
        layouts: [{ balls: { cue: [-5, -8.3], b1: [-1.2, -2.5], b2: [-4.1, -3.4] } }],
      },
      {
        id: "L6-T2",
        title: "Kéo bi lại gần",
        how: "Xếp theo sơ đồ: ba bi hơi rời nhau. Ghi điểm và để ba bi dừng trong vòng tròn đường kính khoảng 35 cm.",
        passWhen: "Ghi điểm và ba bi nằm trong vòng tròn.",
        kind: "count",
        layouts: [{ balls: { cue: [-8.5, -2.7], b1: [-0.4, -5.7], b2: [2.8, -2.3] } }],
      },
      {
        id: "L6-T3",
        title: "Gom từ xa",
        how: "Xếp theo sơ đồ: bi cái cách hai bi kia khoảng 40 cm. Ghi điểm và để ba bi dừng trong vòng tròn đường kính khoảng 45 cm.",
        passWhen: "Ghi điểm và ba bi nằm trong vòng tròn.",
        kind: "count",
        thresholdDelta: -1,
        layouts: [{ balls: { cue: [-1.3, -2.5], b1: [-2.5, 11.2], b2: [-8.2, 13.3] } }],
      },
    ],
  },
  {
    id: 7,
    title: "Giữ chuỗi",
    learns: "Đánh nhỏ, nhẹ, giữ bi gần nhau; xử lý bi dạt góc, sát băng.",
    exam: "Chuỗi dài nhất và điểm trung bình mỗi lượt, ghi ở trang Thống kê sau mỗi buổi.",
    note: "Cấp cuối không có cấp sau để mở. Thước đo là hai con số ở trang Thống kê: điểm trung bình mỗi lượt và chuỗi dài nhất trên bàn thật. Hãy ghi lại sau mỗi buổi tập.",
    lessons: LESSONS_7,
    scenarios: LEVEL7,
    drills: [
      {
        id: "L7-T1",
        title: "Ba điểm liên tiếp từ thế gom",
        how: "Xếp ba bi gần nhau theo sơ đồ. Đánh cho tới khi trượt, rồi xếp lại. Làm 10 lượt như vậy; một lượt đạt khi ghi được từ 3 điểm liên tiếp trở lên.",
        passWhen: "Lượt có từ 3 điểm liên tiếp.",
        kind: "count",
        layouts: [{ balls: { cue: [16.3, -4.3], b1: [12.1, -2.1], b2: [15.6, -1.5] } }],
      },
      {
        id: "L7-T2",
        title: "Giữ bi dọc băng",
        how: "Xếp theo sơ đồ: hai bi nằm sát băng dài. Ghi điểm bằng cú nhỏ sao cho cả ba bi vẫn nằm trong vòng tròn đường kính khoảng 35 cm và không bi nào bật ra giữa bàn.",
        passWhen: "Ghi điểm và ba bi vẫn nằm gọn sát băng.",
        kind: "count",
        layouts: [{ balls: { cue: [-5.8, 14.7], b1: [-7.9, 19.8], b2: [-3.8, 21.8] } }],
      },
    ],
  },
]
