// Cap 1: kiem soat luc. Chi co bi cai; huong va diem cham bi khoa, nguoi hoc chi chinh luc.
// The bi va o dich duoc dung tu mo phong (xem docs/LEVELS.md), moi tinh huong qua scenarios:check.
import type { Vec2 } from "../../engine"
import type { Scenario } from "../types"

const CENTRE = { x: 0, y: 0 }

const GROUPS = {
  A: {
    title: "Lăn thẳng",
    cushions: 0,
    prompt: "Chỉ chỉnh lực: cho bi cái lăn tới dừng trong ô, không chạm băng.",
    hint: "Bi dừng trước ô thì tăng lực; lăn quá ô thì giảm. Kéo cơ để đánh thử; muốn chính xác thì bấm − hoặc + để chỉnh từng chút rồi bấm Đánh.",
    explain:
      "Quãng đường tăng nhanh hơn lực: ở đây mỗi lần bấm − hoặc + đổi lực 2,4% và đổi quãng đường khoảng 5%. Bi càng phải đi xa, một chút lệch lực càng đẩy nó ra xa đích.",
  },
  B: {
    title: "Một băng",
    cushions: 1,
    prompt: "Chỉ chỉnh lực: cho bi cái chạm đúng một băng rồi dừng trong ô.",
    hint: "Băng ăn bớt lực. Cùng một quãng đường mà có qua băng thì cần lực lớn hơn lăn thẳng.",
    explain:
      "Sau khi chạm băng, bi chậm hẳn lại. Ước lượng lực cho cú có băng bằng cách nghĩ: lực để tới băng, cộng thêm phần băng ăn mất, cộng lực cho quãng về.",
  },
  C: {
    title: "Hai băng",
    cushions: 2,
    prompt: "Chỉ chỉnh lực: cho bi cái chạm đúng hai băng rồi dừng trong ô.",
    hint: "Thử một lực, xem bi dừng ở đâu so với ô, rồi chỉnh từng chút bằng − và +. Hai băng thì sai số cộng dồn.",
    explain:
      "Qua hai băng, bi mất lực hai lần nên một chút lệch lực ở đầu cú đánh thành một khoảng lệch lớn ở cuối. Đây là lý do người chơi phăng giỏi thích cú ngắn, ít băng.",
  },
}

type Row = [group: keyof typeof GROUPS, cue: Vec2, angleDeg: number, zone: [number, number, number]]

const ROWS: Row[] = [
  ["A", [-35, 0], 0, [-11, 0, 3]],
  ["A", [-40, -12], 15, [3.7, -0.3, 4.5]],
  ["A", [38, 14], 195, [-19.1, -1.3, 6]],
  ["B", [10, 0], 0, [31.7, 0, 3]],
  ["B", [-5, -10], 20, [27.7, 16, 4]],
  ["B", [-25, 8], 0, [17.8, 8, 5.5]],
  ["C", [20, 0], 0, [-40.7, 0, 4]],
  ["C", [-30, -10], 40, [37.9, -8.8, 5.5]],
  ["C", [0, -15], 60, [40.8, -17.9, 4.5]],
]

const counters: Record<string, number> = {}

export const LEVEL1: Scenario[] = ROWS.map(([group, cue, angleDeg, [cx, cy, r]]) => {
  const g = GROUPS[group]
  const n = (counters[group] = (counters[group] ?? 0) + 1)
  return {
    id: `L1-${group}-0${n}`,
    level: 1,
    group,
    title: `${g.title} ${n}`,
    prompt: g.prompt,
    balls: { cue },
    goal: { type: "stopInZone", ball: "cue", zone: { cx, cy, r }, cushions: g.cushions },
    locked: { angleDeg, tip: CENTRE },
    hint: g.hint,
    explain: g.explain,
  }
})
