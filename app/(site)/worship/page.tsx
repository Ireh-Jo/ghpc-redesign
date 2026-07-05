import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';

export const metadata: Metadata = { title: '예배와 교육' };

export default function WorshipPage() {
  return (
    <SubPage
      sectionKey="worship"
      // 예시 이미지(unsplash) — 디자인팀 교체 가이드: 예배 조명·역광 실루엣, 골든아워 톤,
      // 얼굴 식별 불가. 상세: context/components/content/hero-image.md
      heroImage={{
        src: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=80',
        alt: '일출 빛 아래 두 손을 든 실루엣 (예시 이미지)',
        lead: '주일 1·2부와 수요·금요 예배, 그리고 다음세대 교육.',
      }}
    />
  );
}
