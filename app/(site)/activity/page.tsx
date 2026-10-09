import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { SubPage } from '@/components/layout/sub-page';
import { FadeIn } from '@/components/layout/fade-in';
import { VideoArchive } from '@/components/content/video-archive';
import { getWeeklyArchive } from '@/lib/worship-archive';

export const metadata: Metadata = { title: '교회 활동' };

/** 경향의 일주일 최신 영상 — 유튜브 재생목록 RSS 캐시와 같은 주기 (`lib/youtube-feed.ts`) */
export const revalidate = 600;

/** 유튜브 `경향의일주일` 재생목록 (매주 갱신) — RSS를 못 읽었을 때 내려앉는 자리 */
const WEEKLY_PLAYLIST = 'https://www.youtube.com/playlist?list=PLX5x3I1V2lX-JO2NQ3dHOkL9niS4d8j8c';
const WEEKLY_LEGACY = 'https://www.ghpc.or.kr/Board/Index/11297';

/**
 * 교회 활동 (`/activity`) — **`일정` 그룹만** 보여주는 페이지 (교회 일정 · 경향의 일주일).
 *
 * 2026-10-09: 페이지마다 자기 콘텐츠만 두고 뎁스를 줄였다 (사용자 지시).
 * - 전에는 교회 일정 하나 + 경향의 일주일·주보·교회소식·교단소식 **바로가기 카드**가 붙은 허브였다.
 * - `소식 · 자료`(주보·교회소식·교단소식)는 각자 독립 페이지로 GNB에서 바로 간다 → 카드 제거(`hideOutboundGroups`).
 * - `경향의 일주일`은 독립 스텁(`/activity/weekly`)이던 것을 이 페이지 섹션으로 들였다 → 앵커 2개라 좌측 패널이 생긴다.
 * 교회 일정 달력은 데이터 출처(구글 캘린더 vs 어드민) 결정 대기 (`docs/NEXT.md` §2).
 *
 * 2026-10-09: 경향의 일주일 = `/worship`의 생방송·특별순서와 **같은 구성**(`VideoArchive` — 큰 플레이어 + 지난 영상 3편).
 * 유튜브 재생목록 RSS에서 최신 영상을 자동으로 가져온다 (`getWeeklyArchive`, 10분 캐시).
 */
export default async function ActivityPage() {
  const weekly = await getWeeklyArchive();
  const hasWeekly = weekly[0]?.videos.length > 0;

  return (
    <SubPage
      sectionKey="activity"
      // 디자인팀 배너 (2026-10-03). PC 2000×626 webp(44KB) · 모바일 PNG 782×938 → JPEG q85 750×900(92KB).
      // 첫 전달분은 로고·메뉴·제목이 박힌 시안 캡처라 쓰지 못했고, 같은 날 글자 없는 원본으로 재전달받았다.
      // 아이브로우는 모바일 시안의 `-경향교회`(= 기본값). PC 시안의 `-예배와 교육 - 교육`은 교육 배너에서 복사된 것으로
      // 보여 따르지 않았다. 리드도 시안은 교육 배너와 같은 문장이라 **이전 문구로 되돌렸다** (2026-10-03 사용자 지시 —
      // 배너끼리 문구가 같으면 안 된다).
      heroImage={{
        src: '/hero/activity.webp',
        srcMobile: '/hero/activity-m.jpg',
        alt: '푸른 하늘 아래 올려다본 경향교회 본당과 종탑, 목자 벽화',
        title: '교회활동',
        titleEn: 'GYUNG - HYANG PRESBYTERIAN CHURCH',
        lead: '교회 일정과 소식, 주보를 한 곳에서.',
      }}
      hideOutboundGroups={['소식 · 자료']}
      overrides={{
        weekly: hasWeekly ? (
          <FadeIn>
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
              한 주 동안의 교회 소식을 영상으로 전해 드립니다.
            </p>
            <VideoArchive categories={weekly} label="경향의 일주일" />
          </FadeIn>
        ) : (
          // 유튜브 RSS를 못 읽었을 때 — 빈 자리 대신 재생목록으로 보낸다
          <div>
            <p className="max-w-2xl text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
              한 주 동안의 교회 소식을 영상으로 전해 드립니다. 유튜브에서 보실 수 있습니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={WEEKLY_PLAYLIST}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-round inline-flex items-center gap-1.5 bg-brand-accent px-4 py-2.5 text-[13px] font-bold text-white transition-colors duration-200 hover:bg-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              >
                경향의 일주일 영상 보기
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">(새 창으로 열림)</span>
              </a>
              <a
                href={WEEKLY_LEGACY}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-round inline-flex items-center gap-1.5 border border-brand-line bg-brand-surface px-4 py-2.5 text-[13px] font-bold text-brand-ink transition-colors duration-200 hover:border-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              >
                현재 홈페이지에서 보기
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">(새 창으로 열림)</span>
              </a>
            </div>
          </div>
        ),
      }}
    />
  );
}
