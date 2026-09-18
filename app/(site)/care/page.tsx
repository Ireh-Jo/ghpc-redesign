import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';

export const metadata: Metadata = { title: '목양과 사역' };

export default function CarePage() {
  return (
    <SubPage
      sectionKey="care"
      // 예시 이미지(unsplash) — 디자인팀 교체 가이드: 소그룹 테이블·나눔·봉사 손길,
      // 얼굴 식별 불가. 상세: context/components/content/hero-image.md
      // 디자인팀 배너 (2026-09-18). 규격·용량: public/hero/README.md
      heroImage={{
        src: '/hero/care.webp',
        srcMobile: '/hero/care-m.jpg',
        alt: '하늘을 향해 선 경향교회 종탑과 십자가',
        lead: '구역모임과 전도회부터 교회가 함께 섬기는 기관까지.',
      }}
      // 2026-08-23: `newfamily` 앵커가 2차 목차 승계로 사라졌고(새가족 안내는 `/newcomer` 교차링크),
      // 온라인 등록 폼도 1차 오픈 범위에서 빠져 override를 제거했다.
    />
  );
}
