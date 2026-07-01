import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';

export const metadata: Metadata = { title: '교회 활동' };

export default function ActivityPage() {
  return <SubPage sectionKey="activity" />;
}
