import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '경향의 일주일' };

export default function Page() {
  return <StubPage route="/activity/weekly" />;
}
