---
name: directions
category: content
status: wip
client-component: false
pages: [intro]
depends-on:
  design: [color, typography, spacing, iconography]
  components: [interactive/kakao-map]
  features: [wayfinding]
---

# Directions (`components/content/directions.tsx`)

`/intro#directions` 오시는 길 본문 — 지도 · 건물 3곳 · 대중교통. 그 아래 실내 길찾기(`FloorMap`)는 페이지가 붙인다.
출처: 현행 사이트 `Page/Index/36` (2026-10-09 확인 — 주소 3곳 · 좌표 · 지하철 · 버스). 데이터: `lib/directions.ts`.

## 구성

1. **지도** (`KakaoMap`) — 3곳 마커. 키 없음/실패 시 **바로가기 카드**(위치 요약 + 카카오맵 보기 · 카카오 길찾기 · 네이버지도)
2. **지도 앱 버튼 줄** — 지도가 떠 있어도 항상 보인다 (모바일에선 앱이 더 편하다)
3. **건물 카드 3** — 본당(주 건물 강조) · 선교회관 · 교육관: 이름 · 우편번호+주소 · "길찾기"(카카오맵 목적지 링크)
4. **대중교통** — 지하철(노선 배지 + 출구 안내) / 버스(정류장 + 종류별 번호 칩)
5. 주차 — 현행 사이트에 정보가 없다 → "주차 안내 준비 중" 한 줄 (`docs/NEXT.md`)

## 디자인

- 토큰만. 서울 버스 고유색(간선 파랑·지선 초록 등)은 쓰지 않는다 — 종류 라벨로 구분 (`guardrails/02`)
- 9호선 배지는 `brand-accent-2` 원형 + 숫자 (노선색 대신)
