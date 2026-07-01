---
name: map-embed
category: content
status: shipped
pages: [main, intro]
depends-on:
  design: [color, typography, iconography]
  components: [interactive/floor-map]
  features: [wayfinding]
---

# MapEmbed (`components/content/map-embed.tsx`)

지도 placeholder + "건물 내 길찾기"(→ `interactive/floor-map`) 진입 버튼.
`context/pages/01-main.md` "live-visit" 섹션의 오시는 길 컬럼 일부(주소 안내 문구·헤딩은 페이지에서 조립).

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `wayfindingHref` | `string` | 실내 길찾기 진입 링크. 현재 `/intro#directions` (`lib/nav.ts` 단일 출처와 정합) |

## DECISION NEEDED

> `> DECISION NEEDED:` 실제 지도 임베드 방식(카카오맵/네이버맵/정적 이미지) — `context/pages/01-main.md`.
> 확정 전까지 `[지도 placeholder]` 문구 유지(`guardrails/02-design-consistency.md` "placeholder 텍스트에 `[ ]` 명시").
