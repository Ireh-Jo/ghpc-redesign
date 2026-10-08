import { HeroVideo } from '@/components/content/hero-video';
import { WeeklySermons } from '@/components/content/weekly-sermons';
import { MainBanner } from '@/components/content/main-banner';
import { QuickMenu } from '@/components/content/quick-menu';
import { NoticeList } from '@/components/content/notice-list';
import { NewcomerCard } from '@/components/content/newcomer-card';
import { RelatedOrgs } from '@/components/content/related-orgs';
import { MAIN_BANNERS } from '@/lib/main-banners';
import { NOTICES, MAIN_NOTICE_COUNT } from '@/lib/notices';
import { getServiceArchive } from '@/lib/worship-archive';

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

/**
 * 말씀 3편 = 주일 낮예배 최신순. 유튜브 재생목록 RSS + 시드 병합 (`lib/worship-archive.ts`, 2026-09-27) —
 * 새 설교가 올라오면 최대 10분 뒤 메인에 뜬다. 이 값이 메인 페이지의 재생성 주기다.
 */
export const revalidate = 600; // = FEED_REVALIDATE_SEC (segment config는 리터럴이어야 한다)

export default async function HomePage() {
  const weeklySermons = (await getServiceArchive())[0].videos.slice(0, 3);

  return (
    <>
      <HeroVideo
        eyebrow="— 1973년 부터"
        lead={'개혁주의 신앙으로\n세계복음화의 비전을 실천해가는'}
        title="경향교회"
        titleEn="GYUNG-HYANG PRESBYTERIAN CHURCH"
        // 디자인팀 메인 영상 (2026-10-08, `intro_05.mp4` 19.6초). 원본 123MB(50Mbps·음성 포함)를 ffmpeg 2-pass로
        // 1080p·무음·faststart 재인코딩 — HEVC 4.3Mbps(10.3MB)를 먼저 틀고, 못 트는 브라우저는 H.264 4.3Mbps(10.4MB).
        // 기준 ≤ 11MB (guardrails/05-performance.md). 인코딩 기록·화질 비교: public/hero/README.md §메인 영상
        // 포스터·모바일 정지 이미지는 3초 프레임(첨탑 항공샷) — 0초는 흰 화면으로 시작해 포스터로 못 쓴다.
        // 규격·재인코딩 방법: public/hero/README.md §메인 영상
        videoSrc="/hero/main.mp4"
        videoSrcHevc="/hero/main-hevc.mp4"
        posterSrc="/hero/main-poster.jpg"
        mobileImageSrc="/hero/main-m.jpg"
        mobileImageAlt="노을빛 아래 하늘로 솟은 경향교회 첨탑과 본당"
        serviceTimes={[
          { label: '다음 예배', time: '주일 · 11:00', emphasize: true },
          { label: '1부', time: '9:00' },
          { label: '2부', time: '11:00', hideOnMobile: true },
          { label: '수요', time: '19:30' },
        ]}
      />

      <WeeklySermons sermons={weeklySermons} />

      <MainBanner banners={MAIN_BANNERS} />

      <QuickMenu />

      <NoticeList notices={NOTICES.slice(0, MAIN_NOTICE_COUNT)} />

      <NewcomerCard />

      <RelatedOrgs />
    </>
  );
}
