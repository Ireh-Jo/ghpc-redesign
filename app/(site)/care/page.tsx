import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';
import { NewcomerForm } from '@/components/interactive/newcomer-form';

export const metadata: Metadata = { title: '목양과 사역' };

export default function CarePage() {
  return (
    <SubPage
      sectionKey="care"
      overrides={{
        // 새가족 등록 폼 임베드 (context/features/form-handling.md — /newcomer와 공용)
        newfamily: (
          <div className="space-y-8">
            <p className="max-w-xl text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
              경향교회에 처음 오셨나요? 아래 양식을 남겨주시면 담당 교역자가 따뜻하게
              안내해드립니다.
            </p>
            <NewcomerForm />
          </div>
        ),
      }}
    />
  );
}
