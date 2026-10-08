# 서브페이지 히어로 배너

디자인팀 전달분을 **이 폴더에 이 이름 그대로** 넣는다. 파일명 = 라우트 키.

| 라우트 | PC (1920×540~3840×1080) | 모바일 (750×899 세로) |
|---|---|---|
| `/worship` | `worship.webp` ✅ (2000×625) | `worship-m.jpg` ✅ (750×899) |
| `/intro` | `intro.webp` ✅ (2000×625) | `intro-m.jpg` ✅ (750×899) |
| `/education` | `education.webp` ✅ (2000×625) | `education-m.jpg` ✅ (750×899) |
| `/care` | `care.webp` ✅ (2000×625) | `care-m.jpg` ✅ (750×899) |
| `/activity` | `activity.webp` ✅ (2000×626) | `activity-m.jpg` ✅ (750×900) |
| `/ministry` (사역) | `ministry.webp` ✅ (2000×626) | `ministry-m.jpg` ✅ (750×900) |
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

## 글자 없는 원본으로 받을 것 (2026-10-03)

배너 사진에는 **로고·메뉴·제목·문구가 없어야 한다.** 글자는 코드가 사진 위에 얹는다 — 시안 캡처(글자 박힌 이미지)를
넣으면 화면에 글자가 두 번 나온다. 2026-10-03 교회활동 PC·모바일, 사역 PC가 캡처본으로 와서 재요청했고 같은 날 원본을 받았다.

## 메인 영상 (`/` 헤로, 2026-10-08)

| 파일 | 내용 |
|---|---|
| `main-hevc.mp4` | 데스크탑 루프 영상 **우선판** — 1920×1080 **HEVC** 4.3Mbps · **무음** · faststart · `hvc1` 태그, 19.6초 · 10.3MB |
| `main.mp4` | 같은 영상의 **H.264 대체본** (HEVC 못 트는 브라우저용) — 4.3Mbps · 10.4MB |
| `main-poster.jpg` | 영상 로딩 전·모션 축소 사용자용 포스터 — 3초 프레임 1920×1080 (368KB) |
| `main-m-hevc.mp4` | **모바일 세로 영상** (2026-10-09 채택) — 640×1080 HEVC **60fps** 1.8Mbps · 4.3MB |
| `main-m.mp4` | 같은 모바일 영상의 H.264 대체본 · 4.4MB |
| `main-m.jpg` | 모바일 정지 이미지(모바일 영상의 poster 겸용) — 3초 프레임을 영상과 같은 위치로 세로 크롭 640×1080 (70KB) |

- 기준 **≤ 11MB** (`guardrails/05-performance.md`, 2026-10-08 10→11MB). 원본(`intro_05.mp4`)은 123MB·50Mbps.
- **ffmpeg 2-pass**로 만든다 (Homebrew `ffmpeg`, 약 6~7분). 목표 비트레이트 = 11MB 이내 → 4300k (19.6초 기준).
  ```bash
  # HEVC (우선판) — slower 프리셋, aq-mode=3(어두운 부분·하늘 그라데이션 뭉개짐 완화), Safari용 hvc1 태그
  ffmpeg -y -i 원본.mp4 -an -c:v libx265 -preset slower -b:v 4300k -pix_fmt yuv420p -tag:v hvc1 -x265-params "pass=1:stats=x265.log:aq-mode=3" -f null /dev/null
  ffmpeg -y -i 원본.mp4 -an -c:v libx265 -preset slower -b:v 4300k -pix_fmt yuv420p -tag:v hvc1 -x265-params "pass=2:stats=x265.log:aq-mode=3" -movflags +faststart main-hevc.mp4
  # H.264 (대체본) — veryslow 프리셋
  ffmpeg -y -i 원본.mp4 -an -c:v libx264 -preset veryslow -b:v 4300k -pix_fmt yuv420p -profile:v high -pass 1 -passlogfile x264 -f null /dev/null
  ffmpeg -y -i 원본.mp4 -an -c:v libx264 -preset veryslow -b:v 4300k -pix_fmt yuv420p -profile:v high -pass 2 -passlogfile x264 -movflags +faststart main.mp4
  ```
- **화질 기록 (원본 대비 SSIM, 1.0 = 동일)** — macOS AVFoundation 인코더보다 ffmpeg가 같은 용량대에서 확연히 낫다:

  | 인코딩 | 용량 | SSIM |
  |---|---|---|
  | AVFoundation H.264 2.5M (최초) | 6.1MB | 0.921 |
  | AVFoundation HEVC 3.8M | 9.3MB | 0.934 |
  | **ffmpeg H.264 4.3M 2-pass** | 10.4MB | 0.984 |
  | **ffmpeg HEVC 4.3M 2-pass** | 10.3MB | **0.988** |

- 영상은 **0초가 흰 화면**(페이드인)이라 포스터는 3초 프레임을 쓴다. 새 영상이 오면 포스터 프레임부터 다시 고를 것.
- 모바일은 **PC 영상을 받지 않고** 세로판(`main-m*.mp4`)만 받는다. 세로판은 장면마다 크롭 위치를 옮기고 패닝 구간을 60fps로 보간해 만든다 —
  절차: `context/components/content/hero-video.md` §모바일 영상. 새 영상이 오면 디자인팀에 **9:16 세로 편집본**도 함께 요청할 것
