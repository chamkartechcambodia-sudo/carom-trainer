// Test bo phan tich cu vua danh: moi cau phai khop voi dieu mo phong thuc su cho ra.
import { describe, expect, it } from "vitest"
import { simulate, type Setup, type Shot } from "../src/engine"
import { analyseShot } from "../src/table/analysis"
import { fillForce, forceToPower, nudgePower, powerToForce, powerToSlider, setForceCurve, sliderToPower } from "../src/table/power"

const shot = (angleDeg: number, power: number, x = 0, y = 0): Shot => ({ angleDeg, power, tip: { x, y } })
const analyse = (balls: Setup, s: Shot) => analyseShot(balls, s, simulate(balls, s)).join("\n")

describe("powerToSlider", () => {
  it("la ham nguoc cua sliderToPower", () => {
    for (const s of [1, 20, 46.5, 80, 100]) expect(powerToSlider(sliderToPower(s))).toBeCloseTo(s, 6)
  })
})

describe("thang luc hien thi", () => {
  it("mac dinh (manh): con so bang dung phan tram luc toi da", () => {
    expect(forceToPower(30)).toBeCloseTo(0.3, 9)
    expect(forceToPower(50)).toBeCloseTo(0.5, 9)
    expect(forceToPower(100)).toBe(1)
    expect(forceToPower(0)).toBe(0)
  })

  it("ba do manh cua co: keo het luon la 100%, doi qua lai khong mat so", () => {
    try {
      const at30 = [1, 1.5, 2].map((c) => {
        setForceCurve(c as 1 | 1.5 | 2)
        expect(forceToPower(100)).toBe(1)
        for (const f of [5, 30, 62.5, 100]) expect(powerToForce(forceToPower(f))).toBeCloseTo(f, 9)
        return forceToPower(30)
      })
      expect(at30[0]).toBeCloseTo(0.3, 9)
      expect(at30[1]).toBeCloseTo(0.1643, 3)
      expect(at30[2]).toBeCloseTo(0.09, 9)
    } finally {
      setForceCurve(1)
    }
  })

  it("fillForce doi cho ghi luc trong loi van theo do manh cua co dang dung", () => {
    try {
      expect(fillForce("lực khoảng {{luc:0.09}}, rồi {{luc:0.25}}")).toBe("lực khoảng 9, rồi 25")
      setForceCurve(2)
      expect(fillForce("lực khoảng {{luc:0.09}}, rồi {{luc:0.25}}")).toBe("lực khoảng 30, rồi 50")
      expect(fillForce("không có chỗ ghi")).toBe("không có chỗ ghi")
    } finally {
      setForceCurve(1)
    }
  })

  it("moi lan bam + tang luc khoang 2,4% o moi vung luc, va - dua ve dung cho cu", () => {
    for (const p of [0.002, 0.02, 0.09, 0.4]) {
      expect(nudgePower(p, 1) / p).toBeCloseTo(1.0235, 3)
      expect(nudgePower(nudgePower(p, 1), -1)).toBeCloseTo(p, 9)
    }
    expect(nudgePower(1, 5)).toBeCloseTo(1, 9)
  })
})

describe("analyseShot", () => {
  it("dong dau neu luc tren thanh luc va ten diem cham", () => {
    const text = analyse({ cue: [0, 0] }, shot(0, forceToPower(46), 0.4, 0.4))
    expect(text).toContain("lực 46,0 trên 100")
    expect(text).toContain("trên phải")
  })

  it("chi co bi cai: neu quang duong va so bang, khong co dong ket qua ghi diem", () => {
    const text = analyse({ cue: [-35, 0] }, shot(0, sliderToPower(40)))
    expect(text).toContain("chạm 0 băng")
    expect(text).toContain("không chạm bi nào")
    expect(text).not.toContain("Kết quả")
  })

  it("nua bi, cu ly ngan: con truot, do day khoang nua bi, bi vang lech khoang 30 do", () => {
    const text = analyse({ cue: [-4, 1], b1: [0, 0] }, shot(0, 0.3))
    expect(text).toContain("còn trượt")
    expect(text).toContain("khoảng nửa bi")
    expect(text).toMatch(/chạy lệch khoảng (2[89]|3[01])°/)
    expect(text).toContain("Chia tốc độ")
  })

  it("cham mong, cu ly ngan: sat duong 90 do; cu ly dai luc vua: da lan va lech ve phia truoc", () => {
    const near = analyse({ cue: [-4, 1.4], b1: [0, 0] }, shot(0, 0.3))
    expect(near).toContain("sát đường 90°")
    const far = analyse({ cue: [-40, 1.4], b1: [0, 0] }, shot(0, 0.12))
    expect(far).toContain("đã lăn tự nhiên")
    expect(far).toContain("phía trước đường 90°")
    expect(far).toContain("đã lăn (còn xoáy tới) lúc chạm")
  })

  it("danh thang: tren tam di theo, duoi tam sau va manh thi lui", () => {
    const balls: Setup = { cue: [-24, -8], b1: [-17.4, -5.6] }
    expect(analyse(balls, shot(20, 0.2057, 0, 0.6))).toContain("đi theo bi vàng")
    expect(analyse(balls, shot(20, 0.2719, 0, -1))).toContain("lùi về")
    expect(analyse(balls, shot(20, 0.2057, 0, -0.6))).toContain("gần như dừng tại chỗ")
  })

  it("dam thang bang: xoay phai bat lech sang phai", () => {
    const text = analyse({ cue: [0, 10] }, shot(90, 0.1556, 0.6))
    expect(text).toContain("Đâm gần thẳng băng")
    expect(text).toContain("bật lệch sang phải")
  })

  it("dam xeo bang, bi troi sang phai: xoay phai la thuan, xoay trai la nghich, khong xoay thi gan bang goc toi", () => {
    const balls: Setup = { cue: [-12, 6] }
    expect(analyse(balls, shot(60, 0.1556, 0.6))).toContain("xoáy thuận: góc bật mở rộng")
    expect(analyse(balls, shot(60, 0.1556, -0.6))).toContain("xoáy nghịch: góc bật dựng lại")
    expect(analyse(balls, shot(60, 0.1556))).toMatch(/Không xoáy ngang/)
  })

  it("ket qua: ghi diem, hoac truot kem khoang cach gan nhat toi bi chua cham", () => {
    const scored = analyse({ cue: [-10, 0], b1: [0, 1.9], b2: [8, -0.5] }, shot(0, 0.3))
    expect(scored).toContain("ghi điểm")
    const miss = analyse({ cue: [-10, 0], b1: [0, 0], b2: [0, 15] }, shot(0, 0.15))
    expect(miss).toContain("chưa ghi điểm")
    expect(miss).toMatch(/còn cách bi đỏ [0-9]+,[0-9] viên bi/)
    expect(miss).toContain("bán kính")
  })
})
