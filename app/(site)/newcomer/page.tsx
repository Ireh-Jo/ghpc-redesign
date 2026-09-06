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
      heroImage={{
        // 메인 헤로 포스터와 동일 소스 — 영상 재생 전 잠깐만 겹쳐 보임. 실제 사진 교체 시 해소
        src: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1600&q=80',
        alt: '햇살 아래 두 팔을 벌린 실루엣 (예시 이미지)',
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
