# 서브페이지 히어로 배너

디자인팀 전달분을 **이 폴더에 이 이름 그대로** 넣는다. 파일명 = 라우트 키.

| 라우트 | PC (3840×1080) | 모바일 (750×344) |
|---|---|---|
| `/worship` | `worship.jpg` ✅ | `worship-m.jpg` ✅ |
| `/intro` | `intro.webp` | `intro-m.webp` |
| `/care` | `care.webp` | `care-m.webp` |
| `/activity` | `activity.webp` | `activity-m.webp` |
| `/newcomer` | `newcomer.webp` | `newcomer-m.webp` |

- 표시 크기는 PC 1920×540 · 모바일 375×172 이고, 위 수치는 **2x(레티나)** 기준이다.
  **2026-09-15 수령분은 1x(1920×540 · 375×175)** — 레티나에서 약간 부드럽게 보인다. 2x 재전달 요청 중.
- `<picture>`로 뷰포트에 맞는 **한 장만** 내려받는다 (`components/content/hero-image.tsx`).
  이 경로는 Next 이미지 최적화를 타지 않으므로 **PC 400KB · 모바일 150KB 이하**로 저장할 것.
- **확장자는 실제 포맷과 반드시 일치해야 한다.** PNG 파일 이름만 `.webp`로 바꾸면 서버가 `image/webp`로
  내려보내는데 내용은 PNG라 브라우저·CDN에 따라 깨진다 (2026-09-15에 실제로 그렇게 들어와서 변환했다).
- 이 맥에는 webp 인코더가 없어(`sips`·ImageIO 모두 미지원) **JPEG q85**로 변환해 쓰고 있다.
  webp로 가려면 디자인팀이 webp로 내보내 주거나, `brew install webp` 후 `cwebp`로 변환한다.
- 파일 확장자를 바꾸면 `app/(site)/<라우트>/page.tsx`의 `heroImage.src`·`srcMobile`도 같이 고친다.
