# Học bida phăng (carom-trainer)

Web app tiếng Việt để tự học bida phăng tự do: bài học theo 7 cấp, bàn mô phỏng
3 bi, và sổ tập bàn thật.

## Dùng ngay

Mở https://chamkartechcambodia-sudo.github.io/carom-trainer/ trên máy tính hoặc
điện thoại. Trang được build và đưa lên GitHub Pages mỗi khi nhánh `main` thay
đổi (`.github/workflows/pages.yml`).

## Bắt đầu

```
npm install
npm run check
npm run dev
```

## Làm tiếp bằng Claude Code

Mở thư mục này trong Claude Code rồi gõ `/buoc-tiep`. Mỗi lần gõ, Claude Code
thực thi một bước trong `docs/PLAN.md` và cập nhật `docs/PROGRESS.md`.

## Giấy phép

GPL-3.0-or-later. Lõi vật lý trong `src/vendor/billiards` lấy từ
[tailuge/billiards](https://github.com/tailuge/billiards) (GPL-3.0), xem
`src/vendor/billiards/UPSTREAM.md`.
