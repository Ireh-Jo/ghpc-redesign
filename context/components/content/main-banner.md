---
name: main-banner
category: content
status: wip
pages: [main]
depends-on:
  design: [color, spacing, motion, imagery]
  components: []
  features: [admin-ui]
---

# MainBanner (`components/content/main-banner.tsx`)

메인 중앙의 풀블리드 이미지 배너. **관리자(미디어팀)가 넣고 빼는 두 영역 중 하나**
(나머지 하나는 `NoticeList`) — 2026-09-16 사용자 지시.

근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai` (2026-09-16) — 2026 표어 배너 자리.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `banners` | `MainBanner[]` | `lib/main-banners.ts`. 비면 아무것도 렌더하지 않는다 |

`MainBanner` = `{ id, src, srcMobile?, alt, href? }`.

## 데이터·운영

- 지금: `lib/main-banners.ts` (목업 · 파일 수정 = 배너 교체)
- 이후: Supabase `banners` 테이블 + `/admin/banners` 업로드 화면 (`context/features/admin-ui.md`).
  컴포넌트는 배열만 받으므로 **데이터 출처만 갈아끼우면 된다**
- ⚠️ 배너 테이블은 **아직 스키마에 없다** (`context/03-data-model.md` DECISION NEEDED · 2026-09-16)
- 이미지 규칙: PC 2400×750(3.2:1) JPEG q82 · 400KB 이하 · `public/banners/<id>.jpg`.
  디자인팀 원본은 11339×3543(10MB)이라 반드시 축소해서 커밋한다

## 반응형

| 뷰포트 | 비율 | 비고 |
|---|---|---|
| `md` 이상 | `32/10` (= 3.2:1) | 전달받은 원본 비율 그대로 |
| `md` 미만 | `16/9` 가운데 크롭 | **임시** — 시안 모바일은 2줄로 다시 조판한 별도 크롭이다 |

> DECISION NEEDED: 모바일 전용 배너(`srcMobile`, 예: 750×780) 전달 여부.
> 받기 전까지는 PC 배너를 16:9로 잘라 쓰므로 양 끝 그래픽이 잘린다.

## 인터랙션·모션

- **자동 슬라이드 없음** — `context/design/06-motion.md`의 "자동재생 캐러셀 금지"
- 좌우 원형 버튼(44px 이상) + 하단 점. 배너가 1장이면 컨트롤을 렌더하지 않는다
- 전환: `translateX` 500ms ease-out, `motion-reduce:transition-none`
- 점은 시각적으로 10px이지만 클릭 영역은 44px를 확보한다 (`context/design/03-spacing.md`)

## 접근성

- 배너 문구가 이미지에 박혀 있어 **`alt`가 유일한 접근 경로**다. 데이터에 이미지 안 문구를 그대로 적는다
- 현재 슬라이드가 아닌 칸은 `aria-hidden`, 그 안의 링크는 `tabIndex={-1}`
- 섹션은 `aria-label="교회 배너"`
