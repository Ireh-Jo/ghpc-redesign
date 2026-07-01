import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin, Navigation, Play } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { LIVE_URL, YOUTUBE_URL } from '@/lib/nav';

/**
 * 메인 페이지 (/) — 조립도: context/pages/01-main.md
 * ⚠️ F안 임시 룩(다크 미니멀). 콘텐츠·이미지는 placeholder — 7월 이후 실데이터/CMS 연결.
 * 그라데이션은 헤로 오버레이만(context/design/01-color.md), 다크 섹션은 solid 오버레이.
 * TODO: 섹션들을 content 컴포넌트(HeroVideo·SermonCard·CampaignBanner·WelcomeCTA·MapEmbed)로 분리.
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
      {/* ── 헤로 (다크 풀블리드) — 높이는 섹션이 고정, 미디어는 object-cover로 채움 ── */}
      <section className="relative flex h-[100svh] max-h-[1000px] min-h-[640px] flex-col overflow-hidden bg-brand-ink md:h-screen">
        {/* TODO: content/HeroVideo 컴포넌트로 추출. 영상 src는 임시(프로토타입 URL) — 디자인팀 제작본으로 교체. */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          poster="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
        >
          <source src="https://gts.ac.kr/UserData/gtshp/Layouts/gtshp_Layout/Images/20250605.mp4" type="video/mp4" />
        </video>
        {/* 모바일 — 데이터/배터리 고려해 정지 이미지 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1080&q=80"
          alt="햇살 아래 두 팔을 벌린 실루엣 — 경향교회 헤로 배경 (임시)"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/35 via-brand-ink/55 to-brand-ink/95" />

        <Container className="relative w-full pt-24 md:pt-32">
          <p className="text-[11px] font-medium tracking-[0.4em] text-white/70 md:text-xs">
            — 1973년부터
          </p>
        </Container>

        <Container className="relative flex w-full flex-1 flex-col justify-center text-white">
          <h1 className="display-xl mb-2 text-white md:mb-3">
            자유로이,
            <br />
            예배하라.
          </h1>
          <p className="display-md mb-8 font-light text-white/85 md:mb-10">함께, 자유로이.</p>
          <p className="max-w-md text-[15px] leading-relaxed text-white/70 md:text-lg">
            &ldquo;네 입을 크게 열라 내가 채우리라&rdquo;
            <br className="hidden md:block" />
            <span className="text-white/50">— 시편 81:10</span>
          </p>
        </Container>

        <div className="relative w-full border-t border-white/15 backdrop-blur-sm">
          <Container className="grid grid-cols-3 gap-3 py-4 text-white md:grid-cols-5 md:gap-6 md:py-5">
            <div className="flex items-center gap-3 md:col-span-2">
              <span className="relative mt-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping bg-brand-support opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-brand-support" />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] font-medium tracking-[0.3em] text-white/55">다음 예배</p>
                <p className="text-sm font-bold md:text-base">주일 · 11:00</p>
              </div>
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-medium tracking-[0.3em] text-white/55">1부</p>
              <p className="text-sm font-bold md:text-base">9:00</p>
            </div>
            <div className="hidden leading-tight md:block">
              <p className="text-[10px] font-medium tracking-[0.3em] text-white/55">2부</p>
              <p className="text-sm font-bold md:text-base">11:00</p>
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-medium tracking-[0.3em] text-white/55">수요</p>
              <p className="text-sm font-bold md:text-base">19:30</p>
            </div>
          </Container>
        </div>
      </section>

      {/* ── 이번 주 말씀 ── */}
      <section className="bg-brand-bg py-20 md:py-28">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
            <div>
              <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-accent md:text-xs">
                — 이번 주
              </p>
              <h2 className="display-lg">
                이번 주
                <br />
                말씀.
              </h2>
            </div>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.25em] text-brand-ink transition-colors hover:text-brand-accent"
            >
              전체 설교 <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-8 md:grid-cols-12 md:gap-12">
            <a href={WATCH_URL} target="_blank" rel="noopener" className="group block md:col-span-8">
              <div className="relative mb-6 aspect-video overflow-hidden bg-brand-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80"
                  alt="이번 주 설교 썸네일 (임시)"
                  className="h-full w-full object-cover opacity-95 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="btn-square flex h-[68px] w-[68px] items-center justify-center bg-brand-accent transition-transform group-hover:scale-110">
                    <Play className="h-7 w-7 text-white" style={{ marginLeft: 3 }} />
                  </div>
                </div>
                <span className="btn-square absolute left-4 top-4 bg-brand-surface px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-brand-ink">
                  주일 · 대예배
                </span>
              </div>
              <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-brand-ink-muted">
                2026.05.17 · 누가복음 24:44–49
              </p>
              <h3 className="display-md mb-3 transition-colors group-hover:text-brand-accent">
                선교하시는 하나님
              </h3>
              <p className="text-base text-brand-ink-muted">신승욱 담임목사</p>
            </a>

            <div className="flex flex-col md:col-span-4">
              <p className="mb-5 border-b-2 border-brand-ink pb-3 text-[11px] font-bold tracking-[0.4em] text-brand-ink-muted md:text-xs">
                — 지난 설교
              </p>
              {PAST_SERMONS.map((s) => (
                <a
                  key={s.date}
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener"
                  className="group -mx-2 block border-b border-brand-line px-2 py-5 transition-colors hover:bg-brand-surface"
                >
                  <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-brand-ink-muted">
                    {s.date}
                  </p>
                  <h4 className="mb-1.5 whitespace-pre-line text-lg font-bold leading-snug transition-colors group-hover:text-brand-accent">
                    {s.title}
                  </h4>
                  <p className="text-sm text-brand-ink-muted">{s.preacher}</p>
                </a>
              ))}
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener"
                className="mt-5 inline-flex items-center gap-2 self-start text-[12px] font-bold tracking-[0.25em] text-brand-accent"
              >
                더보기 <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2026 표어 배너 (다크) ── */}
      <section className="relative overflow-hidden bg-brand-ink py-24 text-white md:py-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-brand-ink/70" />
        <Container className="relative text-center">
          <p className="mb-6 text-[11px] font-bold tracking-[0.5em] text-brand-support md:mb-8 md:text-xs">
            — 2026년 표어
          </p>
          <h2 className="display-lg mx-auto mb-6 max-w-5xl md:mb-8">
            &ldquo;네 입을 크게
            <br />
            열라 내가 채우리라&rdquo;
          </h2>
          <p className="text-base text-white/65 md:text-xl">시편 81:10 · Go &amp; Grow</p>
        </Container>
      </section>

      {/* ── 공동체 가치 3 ── */}
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

      {/* ── 새가족 환영 (다크 임팩트) ── */}
      <section className="relative overflow-hidden bg-brand-ink py-24 text-white md:py-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-brand-ink/70" />
        <Container className="relative">
          <div className="max-w-2xl">
            <p className="mb-6 text-[11px] font-bold tracking-[0.5em] text-brand-support md:text-xs">
              — 처음 오셨나요?
            </p>
            <h2 className="display-xl mb-6 md:mb-8">
              처음 오신
              <br />
              당신을
              <br />
              환영합니다.
            </h2>
            <p className="mb-10 max-w-xl text-base leading-relaxed text-white/75 md:text-xl">
              교회가 낯설어도 괜찮습니다. 어떤 모습이든 그대로 오세요. 주일 오전 10:20, 새가족
              환영의 자리에서 만나뵙겠습니다.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/newcomer"
                className="btn-square inline-flex items-center gap-2 bg-brand-accent px-7 py-4 text-sm font-bold tracking-widest text-white transition-colors hover:bg-white hover:text-brand-ink"
              >
                새가족 등록 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/intro"
                className="btn-square inline-flex items-center gap-2 border border-white/40 px-7 py-4 text-sm font-bold tracking-widest text-white transition-colors hover:bg-white/10"
              >
                교회 소개
              </Link>
            </div>
          </div>
        </Container>
      </section>

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
              <a href={WATCH_URL} target="_blank" rel="noopener" className="group block">
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

              {/* TODO: content/MapEmbed */}
              <div className="relative mb-6 aspect-video overflow-hidden border border-brand-line bg-brand-surface">
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="btn-square mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-brand-accent text-white">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-brand-ink-muted">[지도 placeholder]</p>
                  </div>
                </div>
              </div>

              {/* 실내 길찾기 진입 (prototypes/wayfind · context/features/wayfinding.md) */}
              <Link
                href="/intro#directions"
                className="btn-square inline-flex items-center gap-2 border border-brand-line px-5 py-3 text-[13px] font-bold tracking-widest text-brand-ink transition-colors hover:border-brand-accent hover:text-brand-accent"
              >
                <Navigation className="h-4 w-4" /> 건물 내 길찾기
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
