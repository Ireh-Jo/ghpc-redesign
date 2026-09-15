---
name: fade-in
category: layout
status: wip
pages: [worship]
depends-on:
  design: [motion]
  components: []
  features: []
---

# FadeIn (`components/layout/fade-in.tsx`)

스크롤 진입 시 **한 번만** 페이드업하는 래퍼. `context/design/06-motion.md`의 "스크롤 진입 페이드인"
(opacity 0→1, translateY 8px→0, 400ms ease-out, once) 규격을 그대로 구현한 것 — 페이지마다 다시 짜지 않기 위해 컴포넌트로 고정.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `children` | `ReactNode` | 감쌀 내용 |
| `delay` | `number` | (선택) ms. 형제 요소를 60ms 간격으로 계단식 노출할 때만 사용. 200ms 초과 금지 |
| `className` | `string` | (선택) |

## 규칙

- `IntersectionObserver` + `disconnect()` — **반복 재생 금지**
- `prefers-reduced-motion: reduce`면 transition 0ms (전역 CSS가 처리)
- JS 없이도 내용은 보여야 한다 → 요소에 `data-fade`를 달고, `app/(site)/layout.tsx`의 `<noscript>` 스타일이
  `[data-fade]{opacity:1;transform:none}`로 되돌린다 (JS 꺼진 브라우저에서 콘텐츠가 통째로 사라지는 사고 방지)
