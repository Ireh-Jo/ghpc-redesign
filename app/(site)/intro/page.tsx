import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';
import { FloorMap } from '@/components/interactive/floor-map';
import { FaqAccordion } from '@/components/content/faq-accordion';

export const metadata: Metadata = { title: '교회소개' };

// placeholder — 담임목사/미디어팀 검토 후 교체 (context/components/content/faq-accordion.md DECISION NEEDED)
const QNA_ITEMS = [
  {
    question: '주차는 어디에 하나요?',
    answer: '지하 1·2층 주차장을 이용하실 수 있습니다. [ 진입로·안내요원 배치 등 상세 정보 입력 예정 ]',
  },
  {
    question: '처음 방문하면 어디로 가야 하나요?',
    answer: '주일 오전 10:20, 새가족 환영의 자리로 안내해 드립니다. 예배 시작 전 안내데스크에서 도와드립니다.',
  },
  {
    question: '아이를 데리고 가도 될까요?',
    answer: '네, 주일학교와 수유실이 마련되어 있습니다. 자세한 위치는 실내 길찾기에서 확인하실 수 있습니다.',
  },
  {
    question: '복장에 특별한 제한이 있나요?',
    answer: '편안한 복장으로 오셔도 괜찮습니다.',
  },
];

export default function IntroPage() {
  return (
    <SubPage
      sectionKey="intro"
      // 디자인팀 배너 (2026-09-18 수령). 규격·용량 규칙: public/hero/README.md
      // PC 2000×625 webp(40KB) · 모바일 750×899 jpg(80KB) — PC/모바일 크롭이 달라 <picture>로 한 장만 받는다.
      // 모바일 전달분은 PNG(782×938)라 JPEG q85로 변환했다 (이 맥에 webp 인코더가 없다).
      heroImage={{
        src: '/hero/intro.webp',
        srcMobile: '/hero/intro-m.jpg',
        alt: '파란 하늘을 배경으로 올려다본 경향교회 본당과 첨탑',
        lead: '1973년부터 가양동에서 — 경향교회의 이야기와 섬기는 사람들을 소개합니다.',
      }}
      overrides={{
        directions: (
          <div className="space-y-8">
            <p className="text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
              서울 강서구 가양동. 9호선 가양역 도보 N분. [ 상세 주소·오시는 길 안내 입력 예정 ]
              <br />
              아래 지도에서 방·시설을 두 번 선택하면 건물 안에서의 이동 경로를 안내합니다.
            </p>
            <FloorMap />
          </div>
        ),
        qna: <FaqAccordion items={QNA_ITEMS} />,
      }}
    />
  );
}
