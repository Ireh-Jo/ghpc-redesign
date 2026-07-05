---
name: input
status: shipped
category: primitives
shadcn-base: input
client-component: false
depends-on:
  design: [color, typography, spacing]
  components: []
  features: []
used-on-pages: []
---

# Input (`components/primitives/input.tsx`)

shadcn `input` 얇은 래퍼(재수출). 텍스트 입력 단일 출처.

- 높이 h-10(40px) — 모바일 터치 타깃 기준(≥44px 권장, `guardrails/02-design-consistency.md`)에
  살짝 못 미침 → 폼에서 `className="h-11"`로 올려 쓰거나 시안 확정 시 래퍼에서 기본값 조정.
- 폼 안에서는 반드시 `primitives/form`의 `FormControl`로 감싸 접근성 배선(aria-describedby 등) 자동화.
