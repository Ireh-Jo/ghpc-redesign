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
      // 디자인팀 배너 (2026-09-15 수령). 규격·용량 규칙: public/hero/README.md
      // 전달분이 PNG(1920×540 · 375×175, 1x)라 JPEG q85로 변환해 넣었다 — 560KB → 107KB.
      // 2x(3840×1080 · 750×344) 원본을 받으면 같은 이름으로 교체.
      heroImage={{
        src: '/hero/worship.jpg',
        srcMobile: '/hero/worship-m.jpg',
        alt: '하늘과 구름을 배경으로 선 십자가',
        lead: '주일 1·2·3부와 수요·금요 예배, 그리고 다음세대 교육.',
      }}
      overrides={{
        /* ── 예배 시간 안내 — 표 3종 (디자인팀 시안 2026-09-15) ── */
        times: (
          <div className="space-y-12 md:space-y-16">
            {SERVICE_TABLES.map((table, i) => (
              <FadeIn key={table.id} delay={i * 60}>
                <ServiceTimeTable table={table} />
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
