import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';

export const metadata: Metadata = { title: '교회 활동' };

export default function ActivityPage() {
  return (
    <SubPage
      sectionKey="activity"
      // 디자인팀 배너 (2026-10-03). PC 2000×626 webp(44KB) · 모바일 PNG 782×938 → JPEG q85 750×900(92KB).
      // 첫 전달분은 로고·메뉴·제목이 박힌 시안 캡처라 쓰지 못했고, 같은 날 글자 없는 원본으로 재전달받았다.
      // 아이브로우는 모바일 시안의 `-경향교회`(= 기본값). PC 시안의 `-예배와 교육 - 교육`은 교육 배너에서 복사된 것으로
      // 보여 따르지 않았다. 리드 문구도 교육 배너와 같은 문장이라 확인 요청 중 (`docs/NEXT.md` §2).
      heroImage={{
        src: '/hero/activity.webp',
        srcMobile: '/hero/activity-m.jpg',
        alt: '푸른 하늘 아래 올려다본 경향교회 본당과 종탑, 목자 벽화',
        title: '교회활동',
        titleEn: 'GYUNG - HYANG PRESBYTERIAN CHURCH',
        lead: '영아부터 어르신까지, 한 말씀 위에서 자라는 사람들',
      }}
    />
  );
}
