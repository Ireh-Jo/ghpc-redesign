import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';
import { NewcomerForm } from '@/components/interactive/newcomer-form';

export const metadata: Metadata = { title: '목양과 사역' };

export default function CarePage() {
  return (
    <SubPage
      sectionKey="care"
      // 예시 이미지(unsplash) — 디자인팀 교체 가이드: 소그룹 테이블·나눔·봉사 손길,
      // 얼굴 식별 불가. 상세: context/components/content/hero-image.md
      heroImage={{
        src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80',
        alt: '따뜻한 불빛 아래 함께 모인 사람들 (예시 이미지)',
        lead: '구역모임부터 시니어스쿨까지 — 삶을 나누는 자리.',
      }}
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
