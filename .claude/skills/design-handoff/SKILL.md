---
name: design-handoff
description: 디자인팀 시안(.ai/.png/.jpg)을 본 개발에 반영하는 절차. 시안 파일을 받았거나 "시안 반영", "이대로 만들어줘", "디자인 전달받았어" 같은 요청이 오면 이 절차를 따른다. 실측 → 차이표 → 컴포넌트 등록 → 구현 → 브라우저 검증 → 문서 갱신.
---

# 디자인 시안 반영

> 이 프로젝트는 시안이 **여러 번 나눠서** 온다 (예배 2026-09-15, 메인 2026-09-16, 이후 서브페이지들).
> 매번 같은 결과가 나오게 하려고 절차를 고정해 둔다. 시안이 바뀌어도 **토큰·모션·컴포넌트 규칙은 그대로**고,
> 바뀌는 건 조판뿐이다.

## 0. 먼저 확인

- 모드: **본 개발** (`prototypes/`는 건드리지 않는다)
- 읽을 것: `context/design/*` · `context/components/00-inventory.md` · `guardrails/02-design-consistency.md`
- 시안은 **결정된 조판**이고, 토큰·접근성·모션 규칙은 **우리 쪽이 단일 출처**다. 충돌하면 §3처럼 기록하고 우리 규칙을 따른다.

## 1. 실측 (추측 금지)

`.ai`는 대부분 PDF 호환이라 그대로 못 읽는다. 함께 온 PNG/JPG를 자른다 — 이 맥에는 ImageMagick·PIL이 없고 `sips`만 있다.

```bash
sips -g pixelWidth -g pixelHeight 시안.png                 # 아트보드 크기
cp 시안.png /tmp/band.png && sips -c 860 1920 --cropOffset 1 0 /tmp/band.png   # 세로 구간 자르기
```

- `--cropOffset <y> <x>`는 **위에서부터**. 단 `0`을 주면 가운데 정렬로 잘리니 `1`부터 쓴다.
- 잘라낸 밴드를 Read로 확인하면서 다음을 적는다: 아트보드 크기 · **콘텐츠 폭** · 섹션 순서 · 모서리 반경 · 주요 폰트 크기.
- 콘텐츠 폭은 우리 `max-w-container`(1200 - `px-8` = 1136)와 비교한다. 지금까지 시안은 늘 1138 내외였다 → 그대로 간다.

## 2. 자산 처리

- 배너·히어로 원본은 크다(1만 px, 10MB). **그대로 커밋하지 않는다.**
  ```bash
  sips -Z 2400 -s format jpeg -s formatOptions 82 원본.jpeg --out public/banners/<id>.jpg
  ```
- 규격·용량 규칙: `public/hero/README.md`(히어로) · `lib/main-banners.ts` 주석(배너). PC 400KB 이하.
- 파일명이 내용과 맞는지 **눈으로 확인**한다 (행사배너1/2가 뒤바뀐 적 있음).
- PC/모바일 크롭이 다르면 `<picture>` + `srcMobile` 패턴 (`components/content/hero-image.tsx` 참고).

## 3. 차이표 먼저, 코드는 그 다음

시안을 그대로 못 옮기는 자리가 매번 나온다. **구현 전에** 표로 적고, 그 표가 검토 문서의 핵심이 된다.

| 지점 | 시안 | 구현 | 이유 |
|---|---|---|---|

바꿔야 하는 전형적 사유 (지금까지 실제로 나온 것들):
- 모바일에서 본문이 14px 아래로 내려감 → 표를 카드로 전환 (`service-time-table`)
- 제목이 잘려 뜻이 사라짐 → 모바일만 2줄 허용 (`notice-list`)
- 시안 아이콘이 뜻과 무관(ⓘ·말풍선) → 의미 맞는 lucide로 교체 (`quick-menu`)
- 유튜브 썸네일 검은 띠 → 카드 비율을 16:9로 (`weekly-sermons`)
- 막다른 길(전체 목록 진입점 없음) → "더보기" 추가

## 4. 컴포넌트 등록 → 코드 (절대규칙 2)

1. `context/components/00-inventory.md`에 행 추가
2. `context/components/<카테고리>/<이름>.md` 작성 (`TEMPLATE.md` 복사, frontmatter `depends-on` 채우기)
3. 그 다음에 `components/<카테고리>/<이름>.tsx`

순서를 어기면 `.claude/hooks/design-guard.mjs`가 경고한다. 섹션 머리(아이브로우+제목+리드+액션)는
**새로 만들지 말고** `layout/SectionHeader`를 쓴다.

## 5. 모션은 공용 유틸로만

`context/design/06-motion.md`에 등재된 것만 쓴다. 새 효과가 필요하면 **문서에 먼저 등재**하고 유틸로 만든다.

| 효과 | 쓰는 법 |
|---|---|
| 진입 페이드업 | `<FadeIn delay={i * 60}>` (카드 그룹은 stagger) |
| 색 채우기 | 부모 `group relative overflow-hidden` + `<span aria-hidden className="fill-wipe fill-wipe-up bg-brand-ink" />` |
| 밑줄 와이프 | 링크에 `link-wipe` |
| 카드 뒤집기 | `group flip-scene` > `flip-card` > `flip-face` / `flip-face flip-back` |
| 호버 리프트 | `group-hover:-translate-y-1 group-hover:shadow-md motion-reduce:transform-none` |
| 썸네일 줌 | `group-hover:scale-[1.04]` + 컨테이너 `overflow-hidden` |

금지: 자동재생 캐러셀 · 패럴랙스 · 스크롤 잭킹 · 풀스크린 Lottie.
뒤집기는 **작은 타일 전용**이고 뒷면엔 보조 정보만 (터치 기기엔 hover가 없다).

## 6. 검증 (스크린샷으로 끝내지 않는다)

- **dev 서버를 새로 띄우지 않는다.** 이미 떠 있는 포트를 찾아 거기 붙는다:
  `lsof -nP -iTCP:3000 -iTCP:3001 -sTCP:LISTEN` → `navigate`.
  **`next build`는 dev 서버가 떠 있는 동안 돌리지 않는다** (같은 `.next`를 덮어써서 청크가 깨진다 — 두 번 사고).
  빌드 검증은 `npx tsc --noEmit` + `npx next lint`로 대신한다.
- PC(1440)·모바일(375) 둘 다 본다. `read_console_messages`로 에러 0 확인.
- 계산된 스타일이 필요하면 `javascript_tool`로 `getComputedStyle` 확인 (브라우저 패널이 닫혀 있어도 된다).

## 7. 문서 갱신 (빼먹으면 다음 사람이 헤맨다)

| 문서 | 무엇을 |
|---|---|
| `docs/<날짜>-<대상>-디자인시안-반영.md` | 실측 · 그대로 쓴 것 · 차이표(§3) · 결정 · **디자인팀 회신 요청** · 구현 결과 |
| `context/pages/<n>-*.md` | `composes` 섹션 목록 · 내린 섹션 · 데이터 출처 |
| `context/components/**` | 인벤토리 행 + 각 컴포넌트 `.md` |
| `context/design/*` | 토큰이 바뀐 경우만 (라운드·색·모션) — **코드보다 문서가 먼저** |
| `docs/NEXT.md` | 완료분 삭제 · 새 대기 항목 추가 · 갱신일 |

## 8. 참고 모토 — 사랑의교회 (sarang.org)

인터랙션의 기준점으로 삼는다. 실제로 쓰는 건 절제된 것들뿐이다:
버튼 호버 리프트(`translateY(-0.15rem)` + 옅은 그림자) · 링크 밑줄 와이프(`scaleX` 0→1) ·
흰 카드 + 네이비 아이콘 타일 · 원형 캐러셀 화살표 · 점 인디케이터.
**색·라운드·타이포는 우리 토큰**이고, 가져오는 건 움직임의 성격(짧고, 한 방향이고, 과하지 않음)이다.
