/**
 * Form primitive — shadcn `form`(react-hook-form 통합) + `label` 래퍼 (guardrails/00-rules.md DO#4).
 * 모든 폼은 zod 스키마(lib/schemas/)와 이 컴포넌트 조합으로만 구성 (guardrails/00-rules.md DO#5).
 * 스펙: context/components/primitives/form.md
 */
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
export { Label } from '@/components/ui/label';
