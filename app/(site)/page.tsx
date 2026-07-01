import { Container } from '@/components/layout/container';

/**
 * 메인 페이지 (/) — 조립도: context/pages/01-main.md
 * ⚠️ F안 임시 룩(다크 미니멀). 콘텐츠는 placeholder — 7월 이후 실데이터/CMS 연결.
 * 현재 구현: 헤로. 나머지 섹션(이번주 말씀·표어 배너·가치 3·새가족·LIVE+오시는길)은
 * content 컴포넌트 분리 후 단계적으로 추가.
 */
export default function HomePage() {
  return (
    <>
      {/* ── 헤로 (다크 풀블리드) ── */}
      <section className="relative flex min-h-[640px] flex-col overflow-hidden bg-brand-ink md:h-screen">
        {/* TODO: content/HeroVideo 컴포넌트로 교체 (데스크탑 영상 / 모바일 이미지) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1920&q=80"
          alt="햇살 아래 두 팔을 벌린 실루엣 — 경향교회 헤로 배경 (임시)"
          className="absolute inset-0 h-full w-full object-cover"
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

        {/* 헤로 하단 예배 시간 바 */}
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

      {/* ── 다음 섹션 placeholder (content 컴포넌트 분리 예정) ── */}
      <section className="py-20 md:py-28">
        <Container>
          <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-accent md:text-xs">
            — 이번 주
          </p>
          <h2 className="display-lg mb-6">
            이번 주
            <br />
            말씀.
          </h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
            설교 다시보기 · 표어 배너 · 공동체 가치 · 새가족 환영 · 생방송 + 오시는 길 섹션은
            content 컴포넌트(SermonCard·ServiceTimeTable 등) 분리 후 단계적으로 채웁니다.
            (조립도: context/pages/01-main.md)
          </p>
        </Container>
      </section>
    </>
  );
}
