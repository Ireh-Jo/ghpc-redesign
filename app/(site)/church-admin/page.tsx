import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: 'e교회행정' };

/**
 * e교회행정 허브 — 2차 개편안 PPT 슬라이드 4 `교회소개 > 교회정보`의 한 줄이 여기로 온다.
 * GNB엔 `e교회행정` 한 줄만 두고, 공지사항·자료실·신청 서식·시설 예약은 이 페이지에서 갈라진다
 * (`lib/nav.ts`의 `children`). 현행 사이트에서 대메뉴 한 칸을 차지하던 것을 한 줄로 접은 것.
 */
export default function ChurchAdminPage() {
  return (
    <StubPage
      route="/church-admin"
      lead="교회 기관·부서 실무에 필요한 공지와 서식입니다. 로그인 없이 누구나 볼 수 있습니다."
    />
  );
}
