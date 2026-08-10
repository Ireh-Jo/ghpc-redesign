import type { Metadata } from 'next';
import { GnbLab } from '@/components/dev/gnb-lab';

/**
 * GNB 검토 랩 — 개발 내부용 임시 화면. 공개 라우트 아님 (GNB·사이트맵에 미노출, noindex).
 * 결정 확정 후 app/dev/ 와 components/dev/ 는 삭제한다.
 */
export const metadata: Metadata = {
  title: 'GNB 검토 랩',
  robots: { index: false, follow: false },
};

export default function DevGnbPage() {
  return <GnbLab />;
}
