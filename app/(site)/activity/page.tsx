import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';

export const metadata: Metadata = { title: '교회 활동' };

export default function ActivityPage() {
  return (
    <SubPage
      sectionKey="activity"
      // 예시 이미지(unsplash) — 디자인팀 교체 가이드: 행사 분위기(따뜻한 보케 조명·야외),
      // 특정 개인 클로즈업 회피. 상세: context/components/content/hero-image.md
      heroImage={{
        src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80',
        alt: '꽃과 식기가 정갈하게 준비된 행사 테이블 (예시 이미지)',
        lead: '교회 일정과 소식, 주보를 한 곳에서.',
      }}
    />
  );
}
