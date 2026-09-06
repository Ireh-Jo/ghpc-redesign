import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '온라인 헌금' };

export default function Page() {
  return <StubPage route="/giving" />;
}
