import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';
import { FadeIn } from '@/components/layout/fade-in';
import { ServiceTimeTable } from '@/components/content/service-time-table';
import { LivePanel } from '@/components/content/live-panel';
import { VideoArchive } from '@/components/content/video-archive';
import { SERVICE_TABLES } from '@/lib/worship-services';
import { SERVICE_ARCHIVE, SPECIAL_ARCHIVE, YOUTUBE_CHANNEL_ID } from '@/lib/worship-videos';
import { getLiveBroadcast, LIVE_REVALIDATE_SEC } from '@/lib/youtube-live';

export const metadata: Metadata = { title: '예배와 교육' };

/**
 * 생방송 상태를 1분마다 다시 확인한다 (`lib/youtube-live.ts`).
 * 나머지 콘텐츠는 정적이라 이 값이 이 페이지의 재생성 주기를 정한다.
 */
export const revalidate = LIVE_REVALIDATE_SEC;

export default async function WorshipPage() {
  // 채널이 지금 방송 중이면 그 영상 ID — 아니면 null (패널이 안내 화면으로 내려앉는다)
  const live = await getLiveBroadcast(YOUTUBE_CHANNEL_ID);

  return (
    <SubPage
      sectionKey="worship"
      // 디자인팀 배너 (2026-09-18 재전달 — 9/15 분을 교체). 규격·용량 규칙: public/hero/README.md
      // PC 2000×625 webp(60KB) · 모바일 750×899 jpg(84KB). 모바일 전달분은 PNG(782×938)라 JPEG q85로 변환.
      // 구 `worship.jpg`(1920×540)는 삭제했다.
      // 문구는 2026-09-18 예배 화면 시안 그대로 — GNB 라벨("예배와 교육")과 다르므로 오버라이드한다.
      heroImage={{
        src: '/hero/worship.webp',
        srcMobile: '/hero/worship-m.jpg',
        alt: '파란 하늘 아래 올려다본 경향교회 본당과 "세계를 품은 교회" 표지',
        eyebrow: '— 예배와 교육 - 예배',
        title: '예배',
        lead: '주일예배와 주중예배 안내',
        titleEn: 'GYUNG - HYANG PRESBYTERIAN CHURCH',
      }}
      // `times` 섹션은 표 3종이 각자 제목을 갖는다 — 섹션 h2("예배 및 모임 안내")와 첫 표 제목이
      // 같은 문구로 두 번 나와서 섹션 h2를 숨기고 표 제목을 h2로 올렸다 (2026-09-18 시안).
      bareSections={['times']}
      // 하단 "교육" 바로가기 카드 제거 — `/education`이 독립 페이지로 완성됐다 (2026-09-18 사용자 지시).
      // GNB의 교육 항목은 그대로 `/education#*`로 간다.
      hideOutboundGroups={['교육']}
      overrides={{
        /* ── 예배 시간 안내 — 표 3종 (디자인팀 시안 2026-09-15) ── */
        times: (
          <div className="space-y-12 md:space-y-16">
            {SERVICE_TABLES.map((table, i) => (
              <FadeIn key={table.id} delay={i * 60}>
                <ServiceTimeTable table={table} headingLevel="h2" />
              </FadeIn>
            ))}
          </div>
        ),

        /* ── 생방송 = 실시간 중계 + 예배 실황 다시보기 (2026-09-15 시안 확인) ── */
        live: (
          <FadeIn>
            <LivePanel live={live} />
            <div className="mt-12 md:mt-16">
              <h3 className="mb-6 text-[18px] font-bold text-brand-ink md:text-[22px]">
                예배 실황 다시보기
              </h3>
              <VideoArchive categories={SERVICE_ARCHIVE} label="예배 실황 분류" />
            </div>
          </FadeIn>
        ),

        /* ── 특별순서 — 생방송 탭과 같은 구조 (특송 · 간증) ── */
        special: (
          <FadeIn>
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
              주일 예배의 특송과 신앙 간증을 다시 보실 수 있습니다.
            </p>
            <VideoArchive categories={SPECIAL_ARCHIVE} label="특별순서 분류" />
          </FadeIn>
        ),
      }}
    />
  );
}
