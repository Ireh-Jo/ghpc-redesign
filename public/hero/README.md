# 서브페이지 히어로 배너

디자인팀 전달분을 **이 폴더에 이 이름 그대로** 넣는다. 파일명 = 라우트 키.

| 라우트 | PC (1920×540~3840×1080) | 모바일 (750×899 세로) |
|---|---|---|
| `/worship` | `worship.webp` ✅ (2000×625) | `worship-m.jpg` ✅ (750×899) |
| `/intro` | `intro.webp` ✅ (2000×625) | `intro-m.jpg` ✅ (750×899) |
| `/education` | `education.webp` ✅ (2000×625) | `education-m.jpg` ✅ (750×899) |
| `/care` | `care.webp` ✅ (2000×625) | `care-m.jpg` ✅ (750×899) |
| `/activity` | `activity.webp` | `activity-m.webp` |
| `/newcomer` | `newcomer.webp` ✅ (2000×625) | `newcomer-m.jpg` ✅ (750×899) |

- **PC**: 표시 1920×540 기준. 2026-09-18 재전달분은 2000×625 webp로 왔고 그대로 쓴다 (2x면 더 좋다).
- **모바일: 세로 크롭이 기준이다** (2026-09-18 확정). 전달분 `/worship`·`/intro`가 둘 다 **750×899 세로 사진**이라
  히어로를 그 기준으로 맞췄다 — 박스 **440px** · 크롭 **아래쪽 기준**(`object-bottom`) · **텍스트 가운데 정렬**.
- 그래서 **모바일 크롭은 위쪽 1/2을 비우고(하늘·여백) 피사체를 아래쪽에 둬야 한다.**
  피사체가 위에 오면 제목과 겹친다. 이 조건을 디자인팀 요청서에 넣을 것.
  (근거·결정 기록: `context/components/content/hero-image.md` §모바일 조판 결정)
- `<picture>`로 뷰포트에 맞는 **한 장만** 내려받는다 (`components/content/hero-image.tsx`).
  이 경로는 Next 이미지 최적화를 타지 않으므로 **PC 400KB · 모바일 150KB 이하**로 저장할 것.
- **확장자는 실제 포맷과 반드시 일치해야 한다.** PNG 파일 이름만 `.webp`로 바꾸면 서버가 `image/webp`로
  내려보내는데 내용은 PNG라 브라우저·CDN에 따라 깨진다 (2026-09-15에 실제로 그렇게 들어와서 변환했다).
- 이 맥에는 webp 인코더가 없어(`sips`·ImageIO 모두 미지원) **JPEG q85**로 변환해 쓰고 있다.
  webp로 가려면 디자인팀이 webp로 내보내 주거나, `brew install webp` 후 `cwebp`로 변환한다.
- 파일 확장자를 바꾸면 `app/(site)/<라우트>/page.tsx`의 `heroImage.src`·`srcMobile`도 같이 고친다.
