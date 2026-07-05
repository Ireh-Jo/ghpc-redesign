---
name: checkbox
status: shipped
category: primitives
shadcn-base: checkbox
client-component: true
depends-on:
  design: [color, typography]
  components: []
  features: []
used-on-pages: []
---

# Checkbox (`components/primitives/checkbox.tsx`)

shadcn `checkbox`(Radix) 얇은 래퍼(재수출). 개인정보 동의 등 불리언 입력 단일 출처.

- **동의 체크박스 패턴**: 라벨 전체가 클릭 영역이 되도록 `FormLabel`과 연결, 필수 동의는
  zod `literal(true)`로 강제(`context/features/form-handling.md`).
