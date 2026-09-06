import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '교육' };

export default function Page() {
  return <StubPage route="/education" title="교육" lead="주일학교부터 평생교육원까지 — 연령별·과정별 교육기관." />;
}
