# 01. 디자인 시스템

> 5개 시안이 같은 시스템을 공유해야 일관성이 나온다.  
> 이 문서가 곧 토큰 정의서다. 시안 HTML에서 이 값들만 사용한다.

## 0. 잠금 상태

| 항목 | 상태 | 비고 |
|---|---|---|
| 컬러 팔레트 | **🔓 잠금 해제** — A~D안 비교 실험 중 | 2026-05-19 해제 · 시안 확정 후 재잠금 |
| 분위기 키워드 | 잠금 유지 — 따뜻한 / 환영하는 / 모던한 / 영상 중심 | 2026-05-18 |
| 헤딩 폰트 | 잠금 유지 — Pretendard (세리프 사용 안 함) | 2026-05-18 |
| 헤로 영상 처리 | 잠금 유지 — Unsplash/Pexels 대체 영상 + 모바일 포스터 | 2026-05-18 |
| 연혁 표기 | 잠금 유지 — **SINCE 1973** (로고 기준) | 2026-05-18 |

### 시안별 실험 컬러셋 (비교 검토용)

| 시안 | 팔레트명 | bg | ink | accent | accent-2 |
|---|---|---|---|---|---|
| **A** | 네이비 + 크림슨 (로고 기준) | #F8F9FB | #18253F | #C8252C | #0E1A33 |
| **B** | 웜 아이보리 + 앰버 골드 | #FAF7F2 | #211A0F | #B5761A | #140F08 |
| **C** | 쿨 슬레이트 + 오션 블루 | #F3F6FA | #192840 | #1261A0 | #0C1A2C |
| **D** | 웜 파치먼트 + 포레스트 + 시에나 | #F7F4EE | #1E2B1E | #B45309 | #111A11 |

> 피드백 후 한 팔레트로 재잠금 예정.

## 1. 컬러 팔레트 — 잠금 해제 (시안 비교 실험 중)

경향교회 공식 로고(logo_2022.png)의 색 + 화이트톤 베이스(사랑의교회 같은 깔끔한 인상).  
**구성:** 오프 화이트 (배경) + 딥 네이비 (글자·다크 섹션) + 크림슨 레드 (CTA·강조).  
**느낌:** 깔끔하고 모던한 화이트 위, 신뢰감 있는 네이비, 결정적 순간에만 크림슨.

```
--brand-bg:        #F8F9FB  (off-white — 페이지 바탕, 거의 흰색)
--brand-surface:   #FFFFFF  (카드·표면)
--brand-ink:       #18253F  (logo navy — 본문·헤딩)
--brand-ink-muted: #6B7280  (cool gray — 보조 텍스트)
--brand-accent:    #C8252C  (logo crimson — CTA·배지·강조)
--brand-accent-2:  #0E1A33  (deep navy — 푸터·다크 섹션)
--brand-line:      #E5E7EB  (cool gray line — 보더·디바이더)
```

### 사용 규칙

- 페이지 배경: `--brand-bg` (단, 다크 푸터·헤로 오버레이·다크 섹션은 별도)
- 카드/모달 배경: `--brand-surface`
- 본문·헤딩 텍스트: `--brand-ink`
- 보조 텍스트·라벨·메타: `--brand-ink-muted`
- **1차 CTA·LIVE 인디케이터·강조 배지**: `--brand-accent` (크림슨 레드) — 면적 절제, 키 액션에만
- 푸터·다크 섹션 배경: `--brand-accent-2`
- 보더·디바이더: `--brand-line`

> **금지:** 이 7개 토큰 외 컬러 사용.  
> **레드 사용 가이드:** 한 화면에 레드 면적 합계 5% 이하 권장. 큰 배경에 깔지 말 것 — 점·테두리·작은 칩·CTA 버튼만.

## 2. 타이포그래피

기본 시스템: **Pretendard Variable**. CDN으로 로드.

```html
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

### 헤딩 스케일 (모바일 → 데스크탑)

| 토큰 | 모바일 | 데스크탑 | weight | 용도 |
|---|---|---|---|---|
| `display` | 36px / 1.15 | 64px / 1.1 | 700 | 헤로 메인 카피 |
| `h1` | 28px / 1.2 | 44px / 1.15 | 700 | 페이지 타이틀 |
| `h2` | 22px / 1.3 | 32px / 1.2 | 700 | 섹션 헤더 |
| `h3` | 18px / 1.4 | 22px / 1.3 | 600 | 카드/서브섹션 |
| `body` | 15px / 1.65 | 16px / 1.7 | 400 | 본문 |
| `small` | 13px / 1.5 | 14px / 1.5 | 400 | 캡션·메타 |

> **세리프 미사용.** 후보 A로 잠겼으므로 모든 텍스트는 Pretendard. Noto Serif KR 로드하지 않는다.

## 3. 간격 (Spacing) 토큰

8px 베이스 그리드. Tailwind 기본값 활용:
- 섹션 사이: `py-20 md:py-28` (80px → 112px)
- 컨테이너 좌우 패딩: `px-5 md:px-8`
- 카드 내부 패딩: `p-6 md:p-8`
- 컴포넌트 간 간격: `gap-6 md:gap-8`

## 4. 컨테이너 최대 너비

`max-w-[1200px] mx-auto` — 전체 페이지 공통.

## 5. 라운드/그림자

- 라운드: `rounded-xl` (12px) 기본, 카드는 `rounded-2xl` (16px)
- 그림자: 절제. 카드는 `shadow-sm` 또는 `shadow-none + border`
- Warm Earth 팔레트는 따뜻한 그림자(`shadow-sm` 정도) 또는 `--brand-line` 보더 위주. 차가운 그림자(blue cast) 금지.

## 6. 컴포넌트 토큰

5개 시안에 반복 등장하는 컴포넌트. 한 번 만들면 그대로 복붙.

| 컴포넌트 | 용도 | 핵심 클래스 |
|---|---|---|
| `Header` | 상단 GNB (드롭다운) | sticky, 백드롭블러, 5개 메뉴 |
| `HeroVideo` | 메인 헤로 (영상) | 100vh-header, 영상 위 텍스트 오버레이 |
| `SectionHeader` | 섹션 타이틀 + 부제 | 좌측정렬, 위 작은 라벨 |
| `Card` | 카드 (사역/소식 등) | 이미지 상단, 텍스트 하단, 라운드, 보더 |
| `CTAButton` | 주요 버튼 | accent 컬러 배경, 흰 텍스트, rounded |
| `Footer` | 푸터 (교회정보) | dark, 4컬럼 (주소/연락처/SNS/링크) |
| `AnchorNav` | 페이지 내 앵커 메뉴 | sticky, 활성섹션 하이라이트 |

## 7. 모션 (절제)

- 헤로 영상: 자연재생 루프
- 스크롤 진입 페이드인: 기본 200ms, 한 번만
- 호버: `transition-colors duration-200`
- **금지:** 패럴랙스, 무거운 GSAP, 자동 캐러셀 (접근성 저하)

## 8. 아이콘

`lucide` (CDN) 또는 인라인 SVG. 두께 1.5, 24x24 기본.  
유니콘·이모지 아이콘 금지. 단색 라인 아이콘만.

## 9. 반응형 브레이크포인트

Tailwind 기본:
- `sm` 640px
- `md` 768px (태블릿)
- `lg` 1024px (데스크탑 기준선)
- `xl` 1280px

모바일 360px 깨짐 없어야 함.

## 10. 이미지·영상 — LOCKED

### 헤로 영상 처리

- **데스크탑 (md 이상):** Unsplash/Pexels의 햇빛·교회·자연 영상을 `<video autoplay muted loop playsinline>` 으로 루프 재생
- **모바일 (md 미만):** `<video>` 대신 정적 포스터 이미지(`poster` 속성 또는 별도 `<img>`)로 대체 — 모바일 자동재생 정책·트래픽 고려
- **소스 URL:** 시안엔 placeholder URL로 박고, 실제 영상은 추후 사용자가 교체
- **오버레이:** 영상 위에 항상 `bg-black/30` 또는 `bg-gradient-to-b from-transparent to-black/40` 으로 텍스트 가독성 확보

### 사진 가이드

- 인물(목사님·교인): 실루엣 SVG placeholder 또는 Unsplash 추상 이미지. **얼굴 사진·AI 생성 인물 사용 금지.**
- 풍경: Unsplash 키워드 — `church interior warm light`, `sunlight cathedral`, `community worship`, `wooden cross sunlight`
- 톤: 따뜻한 색온도(주황·황금빛 자연광). 차가운 푸른 톤 이미지 회피 — Warm Earth 팔레트와 충돌.
- 모든 이미지는 `rounded-xl` 또는 `rounded-2xl`. 정사각 카드는 `aspect-square`, 와이드는 `aspect-[16/9]`.
