import { HeroVideo } from '@/components/content/hero-video';
import { WeeklySermons } from '@/components/content/weekly-sermons';
import { MainBanner } from '@/components/content/main-banner';
import { QuickMenu } from '@/components/content/quick-menu';
import { NoticeList } from '@/components/content/notice-list';
import { NewcomerCard } from '@/components/content/newcomer-card';
import { RelatedOrgs } from '@/components/content/related-orgs';
import { MAIN_BANNERS } from '@/lib/main-banners';
import { NOTICES, MAIN_NOTICE_COUNT } from '@/lib/notices';
import { SERVICE_ARCHIVE } from '@/lib/worship-videos';

/**
 * 메인 페이지 (/) — 조립도: context/pages/01-main.md
 *
 * ── 2026-09-16 디자인팀 메인 시안 반영 ──
 * 근거: `홈페이지 메인 디자인 전달용.ai`(PC) · `홈페이지 메인 디자인 모바일.ai`.
 * 검토·미결 사항: `docs/2026-09-16-메인-디자인시안-반영.md`.
 *
 * 시안 순서 = 헤로 → 말씀 → 배너 → 퀵메뉴 → 공지사항 → 새가족 → (관련 기관) → 푸터.
 * 관련 기관 6종은 시안에서 푸터 안에 있던 블록인데, 푸터를 안 건드리기로 해서 페이지 섹션으로 뺐다
 * (2026-09-16 사용자 요청).
 * F안 임시 룩의 세 섹션(공동체 가치 3 · 표어 배너 · LIVE+오시는 길)은 **시안에 없어 내렸다**
 * (2026-09-16 사용자 확정). 컴포넌트 파일(CampaignBanner·WelcomeCTA·MapEmbed)은 서브페이지
 * 재사용분이라 지우지 않았다.
 *
 * 헤로는 **영상 그대로 두고 문구만 시안으로 교체**했다 (사용자 지시). 영상·포스터는 디자인팀 Phase 1 대기.
 * 관리자(미디어팀)가 넣고 빼는 영역은 **배너 · 공지사항** 둘 — 지금은 `lib/main-banners.ts`·`lib/notices.ts`,
 * Supabase 연결 뒤 어드민으로 이관한다.
 */

/** 말씀 3편 = 주일 낮예배 최신순 (Supabase/유튜브 동기화 전까지 `lib/worship-videos.ts`) */
const WEEKLY_SERMONS = SERVICE_ARCHIVE[0].videos.slice(0, 3);

export default function HomePage() {
  return (
    <>
      <HeroVideo
        eyebrow="— 1973년 부터"
        lead={'개혁주의 신앙으로\n세계복음화의 비전을 실천해가는'}
        title="경향교회"
        titleEn="GYUNG-HYANG PRESBYTERIAN CHURCH"
        videoSrc="https://gts.ac.kr/UserData/gtshp/Layouts/gtshp_Layout/Images/20250605.mp4"
        posterSrc="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1920&q=80"
        mobileImageSrc="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1080&q=80"
        mobileImageAlt="햇살 아래 두 팔을 벌린 실루엣 — 경향교회 헤로 배경 (임시)"
        serviceTimes={[
          { label: '다음 예배', time: '주일 · 11:00', emphasize: true },
          { label: '1부', time: '9:00' },
          { label: '2부', time: '11:00', hideOnMobile: true },
          { label: '수요', time: '19:30' },
        ]}
      />

      <WeeklySermons sermons={WEEKLY_SERMONS} />

      <MainBanner banners={MAIN_BANNERS} />

      <QuickMenu />

      <NoticeList notices={NOTICES.slice(0, MAIN_NOTICE_COUNT)} />

      <NewcomerCard />

      <RelatedOrgs />
    </>
  );
}
