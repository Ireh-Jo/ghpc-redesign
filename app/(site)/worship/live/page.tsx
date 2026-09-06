import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '예배 실황' };

export default function Page() {
  return <StubPage route="/worship/live"
      tabs={['주일 낮예배', '주일 밤예배', '수요밤예배', '특별예배', '금요밤기도회', '강해 · 집회 · 특강']} />;
}
