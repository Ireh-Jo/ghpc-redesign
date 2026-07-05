---
name: select
status: shipped
category: primitives
shadcn-base: select
client-component: true
depends-on:
  design: [color, typography, spacing, iconography]
  components: []
  features: []
used-on-pages: []
---

# Select (`components/primitives/select.tsx`)

shadcn `select`(Radix) 얇은 래퍼(재수출). 연령대·장소 선택 등 옵션 선택 단일 출처.

- 옵션 5개 이하 + 단일 선택이면 RadioGroup(미도입, 필요 시 추가)도 검토 — 모바일에서 더 빠름.
- 폼에서는 `FormControl`+`SelectTrigger` 조합, 트리거 높이는 Input과 동일 기준.
