import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';
import { FadeIn } from '@/components/layout/fade-in';
import { CareClubs, CareDistrict, CareEvangelism, type StudyVideo } from '@/components/content/care-sections';
import { DISTRICT_STUDY } from '@/lib/care';
import { getPlaylistFeed } from '@/lib/youtube-feed';

export const metadata: Metadata = { title: '목양' };

/** 구역공과 최신 영상 — 유튜브 재생목록 RSS 캐시와 같은 주기 (`lib/youtube-feed.ts`) */
export const revalidate = 600;

/**
 * 목양 (`/care`) — `목양과 사역 > 목양` 섹션(구역모임 · 전도회 · 집사회 · 권사회 · 동호회).
 *
 * 2026-10-09: `예배와 교육`처럼 **목양은 `/care`, 사역은 `/ministry`로 완전히 나눴다** (사용자 지시).
 * 전에는 이 페이지 아래에 사역 기관 바로가기 카드 6개가 붙어 있었다 — 걷어냈다(`hideOutboundGroups`).
 * 히어로 제목도 GNB 라벨 "목양과 사역" 대신 "목양" (`/worship`이 "예배"인 것과 같은 꼴).
 *
 * 2026-10-09 교역자 원고(`사역1(소모임)`) 반영 — 구역모임 · 전도회(청년회 포함) · 동호회. 데이터: `lib/care.ts`.
 * 집사회·권사회는 원고가 아직 없어 "준비 중" 그대로다.
 */
export default async function CarePage() {
  const feed = await getPlaylistFeed(DISTRICT_STUDY.playlistId);
  // 재생목록 RSS는 최신 업로드가 위에 온다
  const latest: StudyVideo | null = feed[0]
    ? {
        // 제목 `구역공과 2026-10-09 | 소요리문답(57)`에서 꼬리의 채널명만 떼어 그대로 보여준다
        title: feed[0].title.replace(/\s*\|\s*경향교회\s*$/, ''),
        url: `https://www.youtube.com/watch?v=${feed[0].videoId}`,
      }
    : null;

  return (
    <SubPage
      sectionKey="care"
      heroImage={{
        src: '/hero/care.webp',
        srcMobile: '/hero/care-m.jpg',
        alt: '하늘을 향해 선 경향교회 종탑과 십자가',
        eyebrow: '— 목양과 사역 - 목양',
        title: '목양',
        // 사역(기관)을 뺐으니 리드도 목양만 말한다
        lead: '구역모임과 전도회, 동호회로 함께 자라고 섬깁니다.',
      }}
      hideOutboundGroups={['사역']}
      overrides={{
        district: (
          <FadeIn>
            <CareDistrict latest={latest} />
          </FadeIn>
        ),
        evangelism: (
          <FadeIn>
            <CareEvangelism />
          </FadeIn>
        ),
        clubs: (
          <FadeIn>
            <CareClubs />
          </FadeIn>
        ),
      }}
    />
  );
}
