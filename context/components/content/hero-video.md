---
name: hero-video
category: content
status: shipped
pages: [main]
depends-on:
  design: [color, typography, spacing, motion]
  components: []
  features: []
---

# HeroVideo (`components/content/hero-video.tsx`)

메인 헤로 — 다크 풀블리드 영상(데스크탑) / 정지 이미지(모바일) + 헤드라인 + 예배시간 바.
`context/pages/01-main.md` "hero" 섹션.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `eyebrow` | `string` | 영상 위 작은 라벨 (예: "— 1973년부터") |
| `title` | `ReactNode` | 헤드라인 (줄바꿈은 `<br/>`로 직접 전달) |
| `subtitle` | `string` | 헤드라인 아래 서브카피 |
| `verse` | `string` | 인용 성경구절 본문 |
| `verseRef` | `string` | 구절 출처 |
| `videoSrc` | `string` | 데스크탑 헤로 영상 (mp4, **H.264** — 모든 브라우저용 대체본) |
| `videoSrcHevc` | `string?` | 같은 영상의 **HEVC(H.265)** 판. 있으면 먼저 시도하고, 못 트는 브라우저는 `videoSrc`로 내려간다 (2026-10-08) |
| `posterSrc` | `string` | 영상 poster |
| `mobileImageSrc` / `mobileImageAlt` | `string` | 모바일 정지 이미지 + alt (`guardrails/00-rules.md` DO#8 — placeholder도 의미 있는 alt) |
| `serviceTimes` | `HeroServiceTime[]` | 하단 바 예배시간. 배열 첫 항목만 LIVE 펄스 도트로 강조(`emphasize` 의도상 항상 index 0) |

`HeroServiceTime = { label, time, emphasize?, hideOnMobile? }` — `hideOnMobile`은 좁은 화면에서 우선순위 낮은 항목(예: 2부) 숨김.

## 데이터 소스 (예정)

정적 설정 또는 `service_times` 테이블(`context/03-data-model.md`). 콘텐츠 입수 전까지 `app/(site)/page.tsx`에서 placeholder 상수로 전달.

## 엣지케이스

- 영상 로드 실패 시에도 `poster` + 그라데이션 오버레이로 레이아웃 유지(별도 fallback UI 불필요, `<video>` 자체가 poster를 보여줌)
- `serviceTimes` 5개 초과 시 그리드가 깨질 수 있음 — 데스크탑 5칸/모바일 3칸 그리드 고정, 늘어날 경우 그리드 열 수 재검토 필요

## 2026-10-08 — 실제 영상 연결

디자인팀 메인 영상(`intro_05.mp4`)으로 교체 — 임시 외부 URL(gts.ac.kr)·unsplash 포스터 제거.
파일은 `public/hero/main.mp4`·`main-poster.jpg`·`main-m.jpg`, 규격·재인코딩 기록은 `public/hero/README.md` §메인 영상.
컴포넌트 코드는 그대로다 (모바일 정지 이미지 · 모션 축소 시 포스터만).

### 2026-10-08 — 화질 보강: HEVC 우선 + H.264 대체

2.5Mbps H.264(6.2MB)가 "화질이 구리다"는 피드백 → 같은 장면(6.5초 교인석) 확대 비교로 결정했다.
H.264를 3.8Mbps로 올려도 개선이 작았고, **HEVC 3.8Mbps는 원본에 가까웠다** (둘 다 약 9.3MB, 기준 10MB 미만).

- `<source type='video/mp4; codecs="hvc1"'>`를 먼저 두고 H.264 `<source>`를 뒤에 둔다 — 브라우저는 **재생 가능한 첫 소스 하나만** 받는다
- HEVC 재생: Safari · Chrome/Edge(하드웨어 디코딩되는 Windows·macOS) / 그 밖(일부 Firefox 등)은 H.264
- HEVC 파일은 `hvc1` 태그여야 Safari가 튼다 (`hev1`이면 안 됨). faststart(moov 앞) 필수

### 2026-10-08 — 높이 상한 해제 · 오버레이 경량화 (사용자 요청)

**높이 상한(`max-h-[1000px]`) 제거.** 16:9 영상을 창 가로에 맞춰 키우는 `object-cover`라 히어로가 납작할수록 위아래가
잘린다. 상한 때문에 QHD(2560×1440) 창에서 위아래 31%가 잘렸다 → 상한을 풀면 10% (FHD 11%·맥북 0~2%는 그대로).
히어로를 16:9로 고정하면 0%가 되지만 예배시간 바가 첫 화면 밖으로 밀려 새신자 동선 규칙(`guardrails/02` "주일예배
시간 첫 화면")에 걸려 채택하지 않았다. 근본책은 디자인팀 편집 가이드 — 중요한 피사체를 **위아래 10% 안쪽**에.

**오버레이: 전체를 덮던 어두운 막(위 35% → 가운데 55% → 아래 95%) → 필요한 곳만.** "영상이 탁하다"는 피드백.
- 데스크탑: ① 왼쪽(제목·도입 문구 쪽)만 옅게 누르는 가로 그라데이션 ② 아래 1/3(예배시간 바) ③ 위쪽 띠(투명 헤더 글씨)
- 모바일: 텍스트가 가로 전체에 걸쳐 있어 옅은 단색 막을 한 겹 더 둔다
- 전부 없애지 않는 이유: 영상이 **흰 화면으로 시작하고 끝 장면도 밝아서** 흰 글씨가 묻힌다
- 대신 제목·도입 문구에 **글자 그림자**(`brand-ink` 55%, 18px 번짐)를 줬다 — 영상은 그대로 두고 글자 뒤만 누른다.
  흰 화면 프레임에서 오버레이만으로는 대비가 약 2:1까지 떨어져서(이전 약 4:1) 보강했다

### 2026-10-08 — 모바일 높이 100svh → 75svh (사용자 요청 "너무 길다")

모바일(md 미만)만 화면 높이의 **75%**, 최소 540px (데스크탑은 그대로 100vh·최소 640px).
예배시간 바가 히어로 맨 아래라 첫 화면 노출은 유지되고, 아래 말씀 섹션 머리가 보여 스크롤 유도가 생긴다.

### 2026-10-08 — ffmpeg 2-pass 재인코딩 (기준 11MB)

화질 추가 요청 → 용량 기준 10→11MB(사용자 결정) + 인코더를 macOS AVFoundation에서 **ffmpeg 2-pass**
(x265 `slower`·`aq-mode=3` / x264 `veryslow`)로 교체. HEVC 4.3M 10.3MB · H.264 4.3M 10.4MB.
원본 대비 SSIM 0.934 → **0.988**. 컴포넌트 구조(HEVC 우선 + H.264 대체)는 그대로. 절차: `public/hero/README.md` §메인 영상

### 2026-10-09 — 모바일 영상 **채택** (시험 적용 → 같은 날 사용자 확정)

레퍼런스 `gts.ac.kr`은 모바일에도 PC 영상(19MB)을 그대로 받아 높이 133px 띠로 보여준다 — 데이터는 많이 쓰고
영상은 작다. 우리는 **모바일 전용 세로판**을 따로 만든다: 원본 가운데를 640×1080으로 잘라 HEVC·H.264 각 약 3.5MB.

- props `mobileVideoSrc` · `mobileVideoSrcHevc` — 있으면 md 미만에서도 영상. 없으면 예전처럼 정지 이미지
- 모바일 영상의 poster는 `mobileImageSrc` (같은 크롭 위치에서 뽑아 영상 시작 때 화면이 튀지 않게)
- **안 트는 조건**: `prefers-reduced-motion` · 데이터 절약(`navigator.connection.saveData`). iOS 저전력 모드는 브라우저가
  자동재생을 막아 poster만 보인다 (오류 아님)
- 크롭 위치는 **시간에 따라 움직인다** (첫 시험판의 가운데 고정 크롭은 18초 첨탑이 화면 밖이었다):
  10초까지 가운데(x=640) → **10~17.5초 왼쪽으로 천천히 패닝**(벽화 예수님을 화면 가운데 근처에 두고 따라감) → 끝까지 x=100(첨탑이 왼쪽 1/3)
  - 벽화 장면은 9.5초부터라 10초에 출발해도 앞 장면(실내)은 건드리지 않는다
- 패닝은 **부드럽게** — "버벅인다" 피드백 두 번에 걸쳐 잡았다:
  1. 크롭이 정수·2px 단위라 프레임당 이동폭이 4·6·6px로 들쭉날쭉 → 4배 확대 + yuv444에서 크롭 → **0.25px 단위**
  2. 등속 출발·급정지 → **smoothstep 가감속**
  3. 30fps에서 빠른 패닝은 원래 끊겨 보인다 → 이동 거리 640→540px, 시간 4→7.5초로 **최고 속도 8 → 3.6px/프레임**
  ```bash
  P="clip((t-10)/7.5,0,1)"
  -vf "scale=7680:4320:flags=lanczos,format=yuv444p,crop=2560:4320:'trunc(2560-2160*$P*$P*(3-2*$P))':0,scale=640:1080:flags=lanczos,format=yuv420p"
  ```
  (미리보기를 `-ss`로 뽑을 땐 `-copyts`를 줘야 한다 — 없으면 `t`가 0부터 다시 세져 크롭이 안 움직이는 것처럼 보인다)
  4. 그래도 남은 끊김(30fps 자체의 한계) → **60fps 세로판**. 0~9.5초(항공·교인석·실내)는 프레임을 두 번씩만 넣어 화면이 그대로고,
     9.5초~끝(패닝 구간)만 움직임 보간(`minterpolate` mci)으로 중간 프레임을 만든다 — 나뭇잎·장면 전환·렌즈 플레어 프레임에서 일그러짐 없음 확인.
     60fps 중간 파일을 먼저 만들고(약 2분) 그걸 위 크롭으로 인코딩. 비트레이트 1.4→1.8Mbps로 HEVC 4.3MB · H.264 4.4MB
     ```bash
     ffmpeg -i 원본.mp4 -an -filter_complex "[0:v]split[a][b];[a]trim=0:9.5,setpts=PTS-STARTPTS,fps=60000/1001[a60];[b]trim=start=9.5,setpts=PTS-STARTPTS,minterpolate=fps=60000/1001:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1[b60];[a60][b60]concat=n=2:v=1:a=0,setpts=N/(60000/1001)/TB[out]" -map "[out]" -c:v libx264 -preset fast -crf 10 master60.mp4
     ```
- 남은 약점: 9초 실내 장면은 가운데가 흐린 기둥이다. 다른 영상이 오면 장면별 위치를 다시 잡을 것 — 근본책은 디자인팀 9:16 편집본
- 이전 규칙 "모바일은 영상 대신 정지 이미지"는 이 결정으로 바뀌었다 — `design/05-imagery.md`·`guardrails/05-performance.md` 갱신 완료.
- PC는 30fps 그대로다. 60fps가 필요했던 건 **우리가 덧붙인 크롭 패닝** 때문이고, PC는 원본을 자르지 않아 해당 없다
