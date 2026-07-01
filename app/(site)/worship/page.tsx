import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';

export const metadata: Metadata = { title: '예배와 교육' };

export default function WorshipPage() {
  return <SubPage sectionKey="worship" />;
}
