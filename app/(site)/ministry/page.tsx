import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '사역' };

export default function Page() {
  return <StubPage route="/ministry" title="사역" lead="경향교회가 함께하는 기관과 사역들." />;
}
