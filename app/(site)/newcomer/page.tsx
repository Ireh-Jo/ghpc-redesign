import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';
// import { NewcomerForm } from '@/components/interactive/newcomer-form';

export const metadata: Metadata = { title: '새가족' };

export default function NewcomerPage() {
  return (
    <SubPage
      sectionKey="newfamily"
      // 예시 이미지(unsplash) — 디자인팀 교체 가이드: 환영 느낌의 밝은 공간·햇살·열린 문,
      // 기쁨의 실루엣 OK, 얼굴 식별 불가. 상세: context/components/content/hero-image.md
      // 디자인팀 배너 (2026-09-18). 규격·용량: public/hero/README.md
      heroImage={{
        src: '/hero/newcomer.webp',
        srcMobile: '/hero/newcomer-m.jpg',
        alt: '푸른 하늘 아래 바라본 경향교회 본당 전경',
        lead: '처음 오셨나요? 등록부터 예배 안내까지 차근차근 도와드립니다.',
      }}
      // 온라인 새가족 등록 폼은 1차 오픈 범위에서 제외 (2026-08-09 결정).
      // 온라인 접점은 카카오채널·전화가 대신한다 → `/newcomer#channels`.
      // 폼 코드·스키마·서버액션은 보존돼 있다. 되살리려면 위 import 주석을 풀고 아래를 복원:
      //   overrides={{ register: <NewcomerForm /> }}
      // (되살릴 때 `lib/nav.ts` 새가족 그룹에 `새가족 등록` 항목도 함께 추가해야 한다)
    />
  );
}
