import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';

export const metadata: Metadata = { title: '교회소개' };

export default function IntroPage() {
  return <SubPage sectionKey="intro" />;
}
