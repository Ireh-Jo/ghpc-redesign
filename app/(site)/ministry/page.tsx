import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '사역' };

export default function Page() {
  return (
    <StubPage
      route="/ministry"
      title="사역"
      lead="경향교회가 함께하는 기관과 사역들."
      // 디자인팀 배너 (2026-10-03) — 기관 콘텐츠보다 먼저 와서 스텁 위에 얹었다.
      // PC 2000×626 webp(32KB) · 모바일 PNG 782×939 → JPEG q85 750×900(80KB).
      // 아이브로우는 `예배와 교육 - 예배/교육`과 같은 꼴로 `목양과 사역 - 사역`. 시안의 `-예배와 교육 - 교육`은
      // 교육 배너에서 복사된 것으로 보여 따르지 않았다. 리드는 시안대로 — 교육 배너와 같은 문장이라 확인 요청 중.
      heroImage={{
        src: '/hero/ministry.webp',
        srcMobile: '/hero/ministry-m.jpg',
        alt: '푸른 하늘 아래 올려다본 경향교회 원통형 건물과 교회 이름',
        eyebrow: '— 목양과 사역 - 사역',
        titleEn: 'GYUNG - HYANG PRESBYTERIAN CHURCH',
        lead: '영아부터 어르신까지, 한 말씀 위에서 자라는 사람들',
      }}
    />
  );
}
