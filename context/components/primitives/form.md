---
name: form
status: shipped
category: primitives
shadcn-base: form (react-hook-form) + label
client-component: true
depends-on:
  design: [color, typography, spacing]
  components: [primitives/input, primitives/textarea, primitives/select, primitives/checkbox, primitives/button]
  features: [form-handling]
used-on-pages: []
---

# Form (`components/primitives/form.tsx`)

shadcn `form`(react-hook-form 바인딩) + `label` 래퍼(재수출). 모든 폼의 골격 단일 출처.

## 규칙 (`context/features/form-handling.md` · `guardrails/00-rules.md` DO#5)

- 검증은 **zod 스키마 단일 출처**(`lib/schemas/`) — `zodResolver`로 클라이언트, Server Action에서
  같은 스키마로 서버 재검증.
- 에러 메시지는 `FormMessage`(필드 바로 아래). 필수 표시는 라벨에 `*`.
- 제출 중 버튼 disabled, 제출 성공 시 폼 자리를 성공 카드로 교체(토스트만으로 끝내지 않음).

## 구성 요소

`Form`(FormProvider) · `FormField`(Controller) · `FormItem` · `FormLabel` · `FormControl` ·
`FormDescription` · `FormMessage` · `Label`
