import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';

export const metadata: Metadata = { title: '목양과 사역' };

export default function CarePage() {
  return <SubPage sectionKey="care" />;
}
