import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { HeroVideo } from '@/components/content/hero-video';
import { SermonCard } from '@/components/content/sermon-card';
import { CampaignBanner } from '@/components/content/campaign-banner';
import { WelcomeCTA } from '@/components/content/welcome-cta';
import { MapEmbed } from '@/components/content/map-embed';
import { LIVE_URL, YOUTUBE_URL } from '@/lib/nav';

/**
 * 메인 페이지 (/) — 조립도: context/pages/01-main.md
 * ⚠️ F안 임시 룩(다크 미니멀). 콘텐츠·이미지는 placeholder — 7월 이후 실데이터/CMS 연결.
 * 그라데이션은 헤로 오버레이만(context/design/01-color.md), 다크 섹션은 solid 오버레이.
 * 섹션은 content 컴포넌트로 분리(HeroVideo·SermonCard·CampaignBanner·WelcomeCTA·MapEmbed).
 * "공동체 가치 3" 그리드와 LIVE 컬럼은 전용 인벤토리 컴포넌트가 없어 인라인 유지
 * (재사용/통합 방향 결정 필요 — 아래 DECISION NEEDED).
 */

const WATCH_URL = 'https://www.youtube.com/watch?v=ngefkWYxH2A';

const PAST_SERMONS = [
  { date: '5/17 · 주일 오후', title: '내가 여기 있나이다\n나를 보내소서', preacher: '김윤식 목사' },
  { date: '5/13 · 수요 저녁', title: '나의 믿음 없는 것을\n도와주소서', preacher: '오태희 강도사' },
  { date: '5/10 · 주일 오전', title: '두려워하지 말라', preacher: '신승욱 담임목사' },
];

const VALUES = [
  {
    no: '01 — 예배',
    tone: 'accent' as const,
    title: '자유로이,\n함께 예배.',
    body: '주일 1·2부와 수요·금요예배. 어떤 형태든, 자유로이 예배합니다.',
    href: '/worship',
  },
  {
    no: '02 — 공동체',
    tone: 'support' as const,
    title: '삶을 나누는\n자리.',
    body: '구역모임과 소그룹에서, 가까운 이웃과 매주 만나 말씀과 삶을 나눕니다.',
    href: '/care',
  },
  {
    no: '03 — 사명',
    tone: 'accent' as const,
    title: '세계를 품은\n사명.',
    body: '가양동 이웃부터 땅끝까지. 한 사람을 세우는 일에 함께합니다.',
    href: '/activity',
  },
];

export default function HomePage() {
  return (
    <>
      <HeroVideo
        eyebrow="— 1973년부터"
        title={
          <>
            자유로이,
            <br />
            예배하라.
          </>
        }
        subtitle="함께, 자유로이."
        verse="네 입을 크게 열라 내가 채우리라"
        verseRef="시편 81:10"
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

      <SermonCard
        youtubeUrl={YOUTUBE_URL}
        featuredWatchUrl={WATCH_URL}
        featuredThumbnailSrc="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80"
        featuredMeta="2026.05.17 · 누가복음 24:44–49"
        featuredTitle="선교하시는 하나님"
        featuredPreacher="신승욱 담임목사"
        pastSermons={PAST_SERMONS}
      />

      <CampaignBanner
        eyebrow="— 2026년 표어"
        quote={
          <>
            &ldquo;네 입을 크게
            <br />
            열라 내가 채우리라&rdquo;
          </>
        }
        verseRef="시편 81:10 · Go & Grow"
        imageSrc="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1920&q=80"
      />

      {/* ── 공동체 가치 3 ── */}
      {/* > DECISION NEEDED (context/pages/01-main.md): 이 섹션을 유지할지, 새가족 환영과 통합할지 */}
      <section className="bg-brand-bg py-20 md:py-28">
        <Container>
          <div className="mb-12 max-w-3xl md:mb-16">
            <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-accent md:text-xs">
              — 우리는
            </p>
            <h2 className="display-lg mb-6">
              함께 자라는
              <br />
              공동체.
            </h2>
            <p className="text-base leading-relaxed text-brand-ink-muted md:text-lg">
              세계를 품은 교회. 1973년부터 한 자리에서 예배하며, 말씀과 삶이 이어지는 평범한
              공동체로 살아갑니다.
            </p>
          </div>

          <div className="grid gap-px border border-brand-line bg-brand-line md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.no} className="flex flex-col bg-brand-bg p-8 md:p-10">
                <span
                  className={`mb-8 text-[10px] font-bold tracking-[0.4em] ${
                    v.tone === 'support' ? 'text-brand-support' : 'text-brand-accent'
                  }`}
                >
                  {v.no}
                </span>
                <h3 className="mb-3 whitespace-pre-line text-2xl font-bold leading-tight md:text-3xl">
                  {v.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-brand-ink-muted">{v.body}</p>
                <Link
                  href={v.href}
                  className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.25em] text-brand-ink transition-colors hover:text-brand-accent"
                >
                  자세히 <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <WelcomeCTA
        eyebrow="— 처음 오셨나요?"
        title={
          <>
            처음 오신
            <br />
            당신을
            <br />
            환영합니다.
          </>
        }
        body="교회가 낯설어도 괜찮습니다. 어떤 모습이든 그대로 오세요. 주일 오전 10:20, 새가족 환영의 자리에서 만나뵙겠습니다."
        imageSrc="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1920&q=80"
        primaryHref="/newcomer"
        primaryLabel="새가족 등록"
        secondaryHref="/intro"
        secondaryLabel="교회 소개"
      />

      {/* ── LIVE + 오시는 길 (2컬럼) ── */}
      <section className="bg-brand-bg py-20 md:py-28">
        <Container>
          <div className="grid gap-px border border-brand-line bg-brand-line md:grid-cols-2">
            {/* LIVE */}
            <div className="bg-brand-bg p-8 md:p-12">
              <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-accent md:text-xs">
                — 생방송 · 다시보기
              </p>
              <h2 className="display-md mb-5">
                생방송으로
                <br />
                함께.
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-brand-ink-muted md:text-base">
                주일 1·2부와 수요·금요예배를 실시간으로. 어디서든 예배의 자리에 함께하세요.
              </p>
              <a href={LIVE_URL} target="_blank" rel="noopener" className="group block">
                <div className="relative aspect-video overflow-hidden bg-brand-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80"
                    alt="생방송 썸네일 (임시)"
                    className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="btn-square flex h-14 w-14 items-center justify-center bg-brand-accent">
                      <Play className="h-6 w-6 text-white" style={{ marginLeft: 3 }} />
                    </div>
                  </div>
                  <div className="btn-square absolute left-3 top-3 inline-flex items-center gap-1.5 bg-brand-surface px-2 py-1 text-[10px] font-bold tracking-[0.2em] text-brand-ink">
                    다음 · 주일 11:00
                  </div>
                </div>
              </a>
            </div>

            {/* VISIT */}
            <div id="directions" className="bg-brand-bg p-8 md:p-12">
              <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-support md:text-xs">
                — 오시는 길
              </p>
              <h2 className="display-md mb-5">
                오시는
                <br />
                길.
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-brand-ink-muted md:text-base">
                서울 강서구 가양동. 9호선 가양역 도보 N분.
              </p>
              <MapEmbed wayfindingHref="/intro#directions" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
