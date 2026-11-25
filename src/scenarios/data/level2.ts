// Cap 2: do day cham va duong 90 do. Diem cham khoa o giua tam.
// The bi duoc dung tu mo phong: bi do dat tren duong bi cai thuc su di (lech duong 90
// do ly thuyet duoi 10 do), moi tinh huong qua scenarios:check.
import type { Setup } from "../../engine"
import type { Scenario } from "../types"

const CENTRE = { x: 0, y: 0 }

// --- Nhom A: chon do day cham (app danh cu ung voi lua chon) ---

const THICKNESS = ["Chạm dày (3/4 bi)", "Nửa bi", "Chạm mỏng"]

function thickness(n: number, balls: Setup, angles: number[], power: number, answer: number): Scenario {
  return {
    id: `L2-A-0${n}`,
    level: 2,
    group: "A",
    title: `Chọn độ dày chạm ${n}`,
    prompt: "Lực giữ nguyên, hướng ngắm đổi theo độ dày bạn chọn. Chạm dày thế nào thì bi cái sang được bi đỏ?",
    balls,
    goal: {
      type: "choice",
      options: THICKNESS,
      answer,
      shots: angles.map((angleDeg) => ({ angleDeg, power, tip: CENTRE })),
    },
    hint: "Tưởng tượng đường nối tâm bi ma với tâm bi vàng. Bi cái rời đi gần vuông góc với đường đó.",
    explain:
      "Chạm càng mỏng, bi vàng càng chạy lệch sang bên và bi cái càng ít đổi hướng. Chạm càng dày, bi cái càng bị bẻ ngang và càng chậm.",
  }
}

// --- Nhom B, C: tu ngam de ghi diem ---

function carom(group: "B" | "C", n: number, balls: Setup): Scenario {
  const aided = group === "B"
  return {
    id: `L2-${group}-0${n}`,
    level: 2,
    group,
    title: aided ? `Ghi điểm theo đường 90° ${n}` : `Tự ngắm, không trợ giúp ${n}`,
    prompt: aided
      ? "Chạm giữa tâm (đã khóa). Ngắm sao cho bi cái chạm bi vàng rồi sang bi đỏ. Bi đỏ nằm gần đường 90°."
      : "Chạm giữa tâm (đã khóa). Bi ma, đường 90° và đường dự đoán đã tắt: tự hình dung rồi ngắm để ghi điểm.",
    balls,
    goal: { type: "score" },
    locked: { tip: CENTRE },
    // Nhom B de duong du doan theo cai dat cua nguoi hoc; nhom C tat han.
    aids: aided ? { ghostBall: true, tangentLine: true } : { ghostBall: false, tangentLine: false, predictedPath: false },
    hint: aided
      ? "Đường chấm 90° chỉ đúng khi bi cái còn trượt: đánh lực từ khoảng {{luc:0.2257}} trở lên. Nếu vẫn trượt bi đỏ, bật thêm Đường dự đoán trong Trợ giúp ngắm để xem bi cái sẽ đi thật thế nào với lực đang chọn."
      : "Bi ma nằm sát bi vàng, ở phía đối diện hướng bi vàng sẽ chạy. Đường 90° vuông góc với đường nối hai tâm.",
    explain:
      "Đường 90° chỉ đúng khi bi cái còn trượt lúc chạm: bi vàng ở gần và lực đủ. Đánh nhẹ, bi cái đã lăn nên lệch về phía trước đường 90° và trượt qua trước mặt bi đỏ.",
  }
}

export const LEVEL2: Scenario[] = [
  thickness(1, { cue: [-12, 0], b1: [-5, 0], b2: [5.4, 14] }, [4.1, 8.2, 13.2], 0.1874, 1),
  thickness(2, { cue: [8, -6], b1: [13, -6], b2: [18.4, -15.6] }, [-5.7, -11.5, -18.7], 0.2257, 2),
  thickness(3, { cue: [20, 6], b1: [25, 6], b2: [32.7, -12.3] }, [-5.7, -11.5, -18.7], 0.2257, 1),
  carom("B", 1, { cue: [6, 8], b1: [10.6, 6], b2: [10.5, -3.1] }),
  carom("B", 2, { cue: [-20, 6], b1: [-15, 6], b2: [-11.9, -2.5] }),
  carom("B", 3, { cue: [10, -10], b1: [14.5, -8], b2: [13.5, 0.9] }),
  carom("C", 1, { cue: [-30, -2], b1: [-25.5, 0], b2: [-18.2, -5.5] }),
  carom("C", 2, { cue: [0, 12], b1: [-4.6, 10], b2: [-3, 1.2] }),
  carom("C", 3, { cue: [20, -6], b1: [25, -6], b2: [28.1, 2.5] }),
]
