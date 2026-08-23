import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '교회소식' };

export default function Page() {
  return <StubPage route="/activity/news" />;
}
