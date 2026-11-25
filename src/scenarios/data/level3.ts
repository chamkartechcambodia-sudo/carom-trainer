// Cap 3: tren tam, duoi tam. The bi duoc dung tu mo phong, moi tinh huong qua scenarios:check.
// Nhom A: danh thang, huong va luc khoa, chi chon diem cham. Nhom B, C: bi do nam
// truoc / sau duong 90 do; voi cung huong va luc, cu giua tam khong ghi diem.
import type { Setup } from "../../engine"
import type { Scenario, Zone } from "../types"

const STRAIGHT: Setup = { cue: [-24, -8], b1: [-17.4, -5.6] }

function straight(n: number, title: string, prompt: string, power: number, zone: Zone, hint: string, explain: string): Scenario {
  return {
    id: `L3-A-0${n}`,
    level: 3,
    group: "A",
    title,
    prompt,
    balls: STRAIGHT,
    goal: { type: "stopInZone", ball: "cue", zone },
    locked: { angleDeg: 20, power },
    hint,
    explain,
  }
}

function carom(group: "B" | "C", n: number, balls: Setup): Scenario {
  const follow = group === "B"
  return {
    id: `L3-${group}-0${n}`,
    level: 3,
    group,
    title: follow ? `Bi đỏ trước đường 90° ${n}` : `Bi đỏ sau đường 90° ${n}`,
    prompt: follow
      ? "Bi đỏ nằm phía trước đường 90°. Chọn điểm chạm, hướng và lực để bi cái chạm bi vàng rồi tới bi đỏ."
      : "Bi đỏ nằm phía sau đường 90°. Chọn điểm chạm, hướng và lực để bi cái chạm bi vàng rồi tới bi đỏ.",
    balls,
    goal: { type: "score" },
    aids: { ghostBall: true, tangentLine: true },
    hint: follow
      ? "Chạm trên tâm để bi cái cong về phía trước đường 90°. Lực vừa phải thì bi cong sớm."
      : "Chạm dưới tâm sâu và đánh đủ mạnh để xoáy lui còn nguyên khi tới bi vàng. Bi cái sẽ cong về phía sau đường 90°.",
    explain: follow
      ? "Bi cái rời bi vàng theo đường 90° rồi xoáy tới kéo nó cong về trước. Đánh giữa tâm với cùng hướng và lực thì bi cái đi sau lưng bi đỏ."
      : "Xoáy lui kéo bi cái cong ngược về phía người đánh. Xoáy lui mòn dần trên đường đi, nên bi vàng càng xa thì càng phải chạm thấp và đánh mạnh hơn.",
  }
}

export const LEVEL3: Scenario[] = [
  straight(
    1,
    "Đánh thẳng: đẩy theo",
    "Hướng và lực đã khóa. Chọn điểm chạm để bi cái đi theo bi vàng và dừng trong ô.",
    0.2057,
    { cx: 8.9, cy: 4, r: 4 },
    "Chạm trên tâm. Càng cao, bi cái đi theo càng xa.",
    "Bi cái còn xoáy tới lúc chạm nên sau khi đứng khựng lại, nó tự tăng tốc đi tiếp theo bi vàng."
  ),
  straight(
    2,
    "Đánh thẳng: dừng bi",
    "Hướng và lực đã khóa. Chọn điểm chạm để bi cái dừng ngay chỗ chạm bi vàng.",
    0.2057,
    { cx: -19.3, cy: -6.3, r: 1.5 },
    "Giữa tâm chưa đủ: bi cái đã kịp lăn. Hạ điểm chạm xuống dưới tâm một chút.",
    "Muốn dừng bi, bi cái phải hết xoáy đúng lúc chạm. Xoáy lui vừa đủ sẽ bị nỉ mài hết trên đường đi, tới nơi bi cái không còn xoáy gì."
  ),
  straight(
    3,
    "Đánh thẳng: kéo lùi",
    "Hướng và lực đã khóa (mạnh hơn hai bài trước). Chọn điểm chạm để bi cái lùi về dừng trong ô.",
    0.2719,
    { cx: -35.3, cy: -12.1, r: 8 },
    "Chạm dưới tâm thật sâu, gần vòng giới hạn.",
    "Chỉ khi xoáy lui còn dư lúc chạm thì bi cái mới lùi. Chạm chưa đủ thấp, xoáy lui mòn hết và bi cái chỉ dừng lại."
  ),
  carom("B", 1, { cue: [-20, -6], b1: [-14, -6], b2: [-7.5, 3.3] }),
  carom("B", 2, { cue: [10, 6], b1: [15.8, 7.4], b2: [24.5, -0.3] }),
  carom("B", 3, { cue: [-34, 4], b1: [-26, 2], b2: [-13.4, 10.1] }),
  carom("C", 1, { cue: [0, -8], b1: [5, -8], b2: [1.5, 0.2] }),
  carom("C", 2, { cue: [-18, 8], b1: [-13.4, 10], b2: [-11.6, 1.4] }),
  carom("C", 3, { cue: [24, -4], b1: [19, -4], b2: [25.1, -11] }),
]
