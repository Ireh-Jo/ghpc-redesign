---
name: textarea
status: shipped
category: primitives
shadcn-base: textarea
client-component: false
depends-on:
  design: [color, typography, spacing]
  components: []
  features: []
used-on-pages: []
---

# Textarea (`components/primitives/textarea.tsx`)

shadcn `textarea` 얇은 래퍼(재수출). 여러 줄 입력 단일 출처. 폼에서는 `FormControl`로 감싸 사용.
글자수 제한은 zod 스키마(max)와 함께 UI에도 명시(예: "500자 이내").
