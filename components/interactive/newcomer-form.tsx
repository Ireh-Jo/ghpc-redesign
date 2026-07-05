'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
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
import { AGE_GROUPS, newcomerSchema, type NewcomerInput } from '@/lib/schemas/newcomer';
import { submitNewcomer } from '@/app/_actions/newcomer';

/**
 * 새가족 등록 폼 — 스펙: context/components/interactive/newcomer-form.md
 * 검증 단일 출처: lib/schemas/newcomer.ts (클라이언트 + Server Action 재검증)
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

export function NewcomerForm() {
  const [submitted, setSubmitted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const loadedAtRef = useRef(Date.now());

  const form = useForm<NewcomerInput>({
    resolver: zodResolver(newcomerSchema),
    defaultValues: {
      name: '',
      phone: '',
      referral: '',
      note: '',
      consentPrivacy: false,
      consentMarketing: false,
    },
  });

  async function onSubmit(values: NewcomerInput) {
    const result = await submitNewcomer(values, {
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
        className="max-w-xl rounded-2xl border border-brand-line bg-brand-surface p-6 md:p-8"
      >
        <CheckCircle2 aria-hidden className="mb-4 h-8 w-8 text-brand-support" />
        <h3 className="mb-2 text-lg font-bold">등록이 접수되었습니다</h3>
        <p className="text-[15px] leading-relaxed text-brand-ink-muted">
          담당 교역자가 확인 후 곧 연락드리겠습니다. 감사합니다.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
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

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이름 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  연락처 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="010-1234-5678"
                    autoComplete="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ageGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                소속 <RequiredMark />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AGE_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referral"
          render={({ field }) => (
            <FormItem>
              <FormLabel>알게 된 경로</FormLabel>
              <FormControl>
                <Input placeholder="예: 지인 소개, 유튜브, 근처 거주" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>남기실 말씀</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consentPrivacy"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="font-medium">
                    개인정보 수집·이용에 동의합니다 <RequiredMark />
                  </FormLabel>
                  <FormDescription>
                    {/* DECISION NEEDED: 개인정보 처리방침 페이지(/privacy) 준비 후 링크 연결 */}
                    수집 항목: 이름·연락처 · 이용 목적: 새가족 안내 연락 · 보유 기간: 1년
                  </FormDescription>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consentMarketing"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="font-medium">교회 소식 연락 수신에 동의합니다 (선택)</FormLabel>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <Loader2 aria-hidden className="mr-2 h-4 w-4 animate-spin" />
          )}
          등록 신청
        </Button>
      </form>
    </Form>
  );
}
