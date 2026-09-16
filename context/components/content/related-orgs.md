---
name: related-orgs
category: content
status: wip
pages: [main]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: [layout/section-header, layout/container, layout/fade-in]
  features: []
---

# RelatedOrgs (`components/content/related-orgs.tsx`)

메인 하단 "바른 신앙, 따뜻한 사랑이 있는 공동체" — 관련 기관 6칸.

근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai`·`… 모바일.ai` (2026-09-16).
시안에서는 **푸터 안** 블록이었지만 푸터 교체가 이번 범위 밖이라 페이지 섹션으로 뺐다 (2026-09-16 사용자 요청).
나중에 시안 푸터를 적용할 때 이 컴포넌트를 그대로 옮기면 된다.

## 데이터 (`lib/related-orgs.ts`)

| 기관 | 링크 | 비고 |
|---|---|---|
| 경향키즈놀이학원 | `/ministry#childcare` | 고정 URL 없음 (현행은 네이버 카페 개별 글) |
| 제네바신학대학원대학교 | `gts.ac.kr` | 외부 |
| 성민종합사회복지기관 | `http://smw.or.kr` | 외부. **https 미지원**(인증서 없음)이라 http |
| 경향복지재단 | `/ministry#welfare` | 공식 URL 미확인 |
| 경복여자고등학교 | `kb.sen.hs.kr` | 외부 |
| 경복비즈니스고등학교 | `kbb.sen.hs.kr` | 외부 |

URL 출처: `docs/meetings/2026-08-09-화면시안-분석-작업플랜.md` §유형 A. 외부 링크는 `target="_blank"` +
`rel="noopener"` + 스크린리더용 "(새 창으로 열림)".

## 모션 — 카드 뒤집기

hover/포커스 시 `rotateX(180deg)` 500ms. 앞면 = 기관명, 뒷면 = 한 줄 소개 + `바로가기 ↗`.

- `prefers-reduced-motion`: 회전을 끄고 **앞면 색 반전**(회색 → accent)만 남긴다. 뒷면은 숨긴다
- 터치 기기에는 hover가 없어 **앞면만 보인다** — 그래서 뒷면에는 앞면에 없는 필수 정보를 두지 않는다
  (뒷면 문구는 전부 보조 설명이고, 어디로 가는지는 기관명만으로 알 수 있다)
- 포커스도 뒤집히게 `group-focus-visible`을 같이 건다 — 키보드 사용자도 같은 정보를 본다

## 반응형

- PC 3열 · 모바일 2열 (시안 동일), 타일 높이 88px / 104px
