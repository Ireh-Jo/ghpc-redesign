import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '예배 실황' };

/**
 * 예배 실황 **전체 아카이브** (검색 · 페이지네이션).
 * 2026-09-15부터 GNB에는 없다 — `생방송`(`/worship#live`) 섹션의 "전체 보기"로 들어온다.
 * 최근 영상은 그 섹션이 이미 보여주므로, 이 라우트는 게시판 목록 UI(`docs/NEXT.md` §1-4)를 얹을 자리다.
 */
export default function Page() {
  return (
    <StubPage
      route="/worship/live"
      title="예배 실황"
      lead="주일 낮예배부터 강해·집회까지, 지난 예배 영상 전체를 찾아볼 수 있는 자리입니다."
      tabs={['주일 낮예배', '주일 밤예배', '수요 밤예배', '특별예배', '강해', '집회 · 특강']}
    />
  );
}
