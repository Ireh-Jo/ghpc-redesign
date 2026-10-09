---
name: kakao-map
category: interactive
status: wip
client-component: true
pages: [intro]
depends-on:
  design: [color, typography]
  components: []
  features: [wayfinding]
---

# KakaoMap (`components/interactive/kakao-map.tsx`)

카카오맵 JavaScript SDK로 그리는 지도 — 여러 지점에 마커 + 이름표. 첫 사용처 `/intro#directions`(본당·선교회관·교육관).
2026-10-09 사용자 결정(지도 방식 `DECISION NEEDED` 해소 — 현행 사이트와 같은 카카오맵). 외부 스크립트 기록: `guardrails/03`.

## Props

```ts
interface KakaoMapProps {
  center: { lat: number; lng: number };
  points: { name: string; lat: number; lng: number }[];
  /** 키가 없거나 로드 실패 시 대신 그릴 노드 (서버에서 렌더해 넘긴다) */
  fallback: React.ReactNode;
  /** 확대 수준 — 데스크탑 / 모바일 (카카오 level, 작을수록 확대) */
  level?: { desktop: number; mobile: number };
}
```

## 동작

- 키: `NEXT_PUBLIC_KAKAO_MAP_KEY`. **없으면 처음부터 `fallback`** — 스크립트를 부르지 않는다
- 섹션이 화면 근처(뷰포트 + 300px)에 오면 SDK를 로드한다 (`IntersectionObserver`) — 첫 화면 무게에 안 들어간다
- `autoload=false` + `kakao.maps.load()`로 초기화. 실패(키·도메인 미등록·네트워크)하면 `fallback`으로 바꾼다
- **스크롤을 가두지 않는다**: 마우스 휠 확대 끔(`setZoomable(false)` 대신 줌 컨트롤 제공) · 터치 기기(`pointer: coarse`)는 드래그도 끔 —
  페이지를 내리다 지도에 손가락이 걸려 멈추는 일을 막는다. 대신 아래 "카카오맵에서 보기"로 앱에서 자유롭게
- 이름표는 `CustomOverlay`로 그린다 — 토큰 색(`brand-ink` 배경 · 흰 글씨)

## 접근성

- 지도 상자는 `role="img"` + `aria-label`(지점 이름 나열). 주소·교통 정보는 지도 밖 텍스트로 따로 있어 지도를 못 봐도 정보 손실 없음
