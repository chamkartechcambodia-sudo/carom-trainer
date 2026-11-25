// Ba tinh huong mau cua buoc 4: chung minh ca chuoi (du lieu, bo do, bo cham,
// man hinh) hoat dong. Noi dung that cua tung cap duoc soan tu buoc 6.
import type { Scenario } from "../types"

export const SAMPLES: Scenario[] = [
  {
    id: "M-A-01",
    level: 0,
    group: "A",
    title: "Ghi điểm trực tiếp",
    prompt: "Đánh bi cái chạm bi vàng rồi sang bi đỏ để ghi điểm.",
    balls: { cue: [-20, -6], b1: [0, 0], b2: [9, 9] },
    goal: { type: "score" },
    aids: { ghostBall: true, tangentLine: true },
    hint: "Bật đường 90° và xoay hướng ngắm tới khi đường chấm đi qua bi đỏ.",
    explain:
      "Sau khi chạm bi vàng, bi cái không xoáy tách ra gần theo đường 90°. Đặt bi ma sao cho đường 90° chỉ vào bi đỏ là ghi điểm.",
  },
  {
    id: "M-B-01",
    level: 0,
    group: "B",
    title: "Bi dừng trong ô",
    prompt: "Chỉ chỉnh lực: cho bi cái dừng trong ô tròn.",
    balls: { cue: [-30, 0] },
    goal: { type: "stopInZone", ball: "cue", zone: { cx: 10, cy: 0, r: 5 } },
    locked: { angleDeg: 0, tip: { x: 0, y: 0 } },
    maxAttempts: 5,
    hint: "Bi dừng trước ô thì tăng lực một chút, lăn quá ô thì giảm.",
    explain: "Quãng đường bi lăn tăng nhanh theo lực. Ở vùng lực nhẹ, một chút lực thêm đã đổi quãng đường rõ rệt.",
  },
  {
    id: "M-C-01",
    level: 0,
    group: "C",
    title: "Chọn điểm chạm",
    prompt:
      "Bi cái chạm mỏng bi vàng rồi lên băng trên. Hướng và lực giữ nguyên. Điểm chạm nào đưa bi cái về tới bi đỏ?",
    balls: { cue: [-15, 2], b1: [-9.2, 8.6], b2: [1.5, 2] },
    goal: {
      type: "choice",
      options: ["Xoáy trái", "Giữa tâm, không xoáy", "Xoáy phải"],
      answer: 2,
      shots: [
        { angleDeg: 60, power: 0.2, tip: { x: -0.6, y: 0 } },
        { angleDeg: 60, power: 0.2, tip: { x: 0, y: 0 } },
        { angleDeg: 60, power: 0.2, tip: { x: 0.6, y: 0 } },
      ],
    },
    explain:
      "Bi đỏ nằm bên phải chỗ bi cái chạm băng, nên bi cái cần bật rộng sang phải. Xoáy phải ở đây là xoáy thuận: nó mở góc bật. Không xoáy thì bật gần thẳng xuống, xoáy trái thì bật lệch sang trái.",
  },
]
