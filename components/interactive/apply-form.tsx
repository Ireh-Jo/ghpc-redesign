'use client';

import { useRef, useState } from 'react';
import { useForm, type FieldValues, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/primitives/form';
import { Input } from '@/components/primitives/input';
import { Textarea } from '@/components/primitives/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/select';
import { Checkbox } from '@/components/primitives/checkbox';
import { Button } from '@/components/primitives/button';
import { toast } from '@/components/primitives/toast';
import { submitApply } from '@/app/_actions/apply';
import { FORM_DEFS, type FieldDef, type FormId } from '@/lib/forms/definitions';

/**
 * 신청 폼 렌더러 — 폼 id를 받아 정의(`lib/forms/definitions.ts`)를 꺼내 화면을 만든다.
 *
 * 정의 객체를 서버 컴포넌트에서 prop으로 받지 않는 이유: 정의 안의 zod 스키마가 클래스 인스턴스라
 * RSC 직렬화 경계를 넘지 못한다. 그래서 페이지는 문자열 id만 넘긴다.
 *
 * 신청서가 4종인데 생김새·검증·제출 흐름이 전부 같아 폼마다 JSX를 복붙하지 않는다.
 * 필드가 바뀌면 정의 배열과 zod 스키마만 고치면 되고, 접근성·봇 방지·에러 표시는 여기 한 곳에서 관리된다.
 * 시각 언어는 `components/interactive/newcomer-form.tsx`와 맞춘다.
 */

/** 필수 라벨 표시 — 별표는 장식(aria-hidden), 스크린리더엔 "(필수)" */
function RequiredMark() {
  return (
    <>
      <span aria-hidden className="text-brand-point">
        *
      </span>
      <span className="sr-only">(필수)</span>
    </>
  );
}

export function ApplyForm({ id }: { id: FormId }) {
  const def = FORM_DEFS[id];
  const [submitted, setSubmitted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const loadedAtRef = useRef(Date.now());

  // 폼마다 스키마가 달라 제네릭을 고정할 수 없다 — 값 타입은 런타임에 zod가 보증한다
  const form = useForm<FieldValues>({
    resolver: zodResolver(def.schema) as Resolver<FieldValues>,
    defaultValues: def.defaults,
  });

  async function onSubmit(values: FieldValues) {
    const result = await submitApply(def.id, values, {
      website: honeypotRef.current?.value ?? '',
      formLoadedAt: loadedAtRef.current,
    });
    if (result.ok) setSubmitted(true);
    else toast.error(result.error);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="max-w-2xl rounded-2xl border border-brand-line bg-brand-surface p-6 md:p-8"
      >
        <CheckCircle2 aria-hidden className="mb-4 h-8 w-8 text-brand-support" />
        <h3 className="mb-2 text-lg font-bold">신청이 접수되었습니다</h3>
        <p className="text-[15px] leading-relaxed text-brand-ink-muted">{def.successNote}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {def.notice && (
        <ul className="mb-8 space-y-2 border-l-2 border-brand-line pl-4">
          {def.notice.map((line) => (
            <li key={line} className="text-[13px] leading-relaxed text-brand-ink-muted">
              {line}
            </li>
          ))}
        </ul>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* honeypot — 사람에게 안 보임, 봇이 채우면 서버에서 거부 (form-handling.md 봇 방지) */}
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          {/* half 필드는 2열로 묶고, groupLabel이 붙은 필드부터 새 묶음을 시작한다 */}
          {groupFields(def.fields).map((group, gi) => (
            <fieldset key={group.label ?? gi} className="space-y-4">
              {group.label && (
                <legend className="mb-1 text-[12px] font-bold tracking-[0.2em] text-brand-ink-muted">
                  {group.label}
                </legend>
              )}
              <div className="grid gap-5 md:grid-cols-2">
                {group.fields.map((f) => (
                  <div key={f.name} className={f.half ? '' : 'md:col-span-2'}>
                    <FieldRenderer def={f} form={form} />
                  </div>
                ))}
              </div>
            </fieldset>
          ))}

          <FormField
            control={form.control}
            name="consentPrivacy"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="font-medium">
                      개인정보 수집·이용에 동의합니다 <RequiredMark />
                    </FormLabel>
                    <FormDescription>{def.consentNote}</FormDescription>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 aria-hidden className="mr-2 h-4 w-4 animate-spin" />
              )}
              {def.submitLabel}
            </Button>
            {def.legacy && (
              <a
                href={def.legacy}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-[13px] text-brand-ink-muted"
              >
                현재 홈페이지 신청서
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

/** groupLabel을 기준으로 필드를 묶는다 (첫 묶음은 라벨 없음) */
function groupFields(fields: FieldDef[]): { label?: string; fields: FieldDef[] }[] {
  const groups: { label?: string; fields: FieldDef[] }[] = [];
  for (const f of fields) {
    if (f.groupLabel || groups.length === 0) {
      groups.push({ label: f.groupLabel, fields: [f] });
    } else {
      groups[groups.length - 1].fields.push(f);
    }
  }
  return groups;
}

function FieldRenderer({
  def,
  form,
}: {
  def: FieldDef;
  form: ReturnType<typeof useForm<FieldValues>>;
}) {
  return (
    <FormField
      control={form.control}
      name={def.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {def.label} {def.required && <RequiredMark />}
          </FormLabel>

          {def.kind === 'select' ? (
            <Select onValueChange={field.onChange} value={(field.value as string) ?? ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="선택해주세요" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {def.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : def.kind === 'checkboxGroup' ? (
            <div className="grid gap-3 pt-1 sm:grid-cols-2">
              {def.options?.map((option) => {
                const selected: string[] = Array.isArray(field.value) ? field.value : [];
                return (
                  <label key={option} className="flex items-center gap-3 text-[15px]">
                    <Checkbox
                      checked={selected.includes(option)}
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked ? [...selected, option] : selected.filter((v) => v !== option)
                        )
                      }
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          ) : def.kind === 'textarea' ? (
            <FormControl>
              <Textarea rows={4} placeholder={def.placeholder} {...field} />
            </FormControl>
          ) : def.kind === 'money' ? (
            <FormControl>
              <div className="flex items-center gap-2">
                <Input inputMode="numeric" placeholder="0" {...field} />
                <span className="shrink-0 text-[14px] text-brand-ink-muted">원</span>
              </div>
            </FormControl>
          ) : (
            <FormControl>
              <Input
                type={def.kind === 'text' ? 'text' : def.kind}
                inputMode={def.kind === 'tel' ? 'tel' : undefined}
                placeholder={def.placeholder}
                {...field}
              />
            </FormControl>
          )}

          {def.hint && <FormDescription>{def.hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
