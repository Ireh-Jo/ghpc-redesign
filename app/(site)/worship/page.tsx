import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';
import { FadeIn } from '@/components/layout/fade-in';
import { ServiceTimeTable } from '@/components/content/service-time-table';
import { LivePanel } from '@/components/content/live-panel';
import { VideoArchive } from '@/components/content/video-archive';
import { SERVICE_TABLES } from '@/lib/worship-services';
import { SERVICE_ARCHIVE, SPECIAL_ARCHIVE } from '@/lib/worship-videos';

export const metadata: Metadata = { title: '예배와 교육' };

export default function WorshipPage() {
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
            <LivePanel />
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
