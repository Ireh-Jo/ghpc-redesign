import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '자료실' };

export default function Page() {
  return <StubPage route="/church-admin/resources"
      tabs={['자료실', '로고', '별들의 노래', '기관회계보고']} />;
}
