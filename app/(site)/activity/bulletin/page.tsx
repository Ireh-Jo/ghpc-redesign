import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '주보' };

export default function Page() {
  return <StubPage route="/activity/bulletin" />;
}
