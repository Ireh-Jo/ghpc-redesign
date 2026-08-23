import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';

export const metadata: Metadata = { title: '영상뉴스' };

export default function Page() {
  return <StubPage route="/activity/video-news"
      tabs={['경향뉴스', '홍보영상', '교구친선리그']} />;
}
