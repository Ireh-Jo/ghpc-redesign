---
name: toast
status: shipped
category: primitives
shadcn-base: sonner
client-component: true
depends-on:
  design: [color, typography, iconography]
  components: []
  features: []
used-on-pages: [all]
---

# Toast (`components/primitives/toast.tsx`)

sonner 래퍼. `<Toaster />`는 루트 레이아웃(`app/(site)/layout.tsx`)에 1회 마운트, 호출은
`toast.success('...')` / `toast.error('...')`.

- shadcn 기본 sonner 래퍼의 `next-themes` 의존은 제거함(사이트 라이트 고정,
  다크모드 미지원 — `context/design/01-color.md`). `theme="light"` 하드코딩.
- 아이콘은 lucide(CircleCheck·Info·TriangleAlert·OctagonX·LoaderCircle) — 이모지 금지 원칙 준수.
- 폼 제출 실패 등 일시 피드백에만 사용. 성공 상태는 토스트가 아니라 영구 표시(성공 카드)가 원칙
  (`context/features/form-handling.md`).
