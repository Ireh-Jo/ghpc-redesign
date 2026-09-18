import Image from 'next/image';

/**
 * 서브페이지 히어로 — 풀블리드 사진 + **흰 텍스트** (스펙: context/components/content/hero-image.md).
 * 2026-07-06 분할형 → 풀블리드 전환.
 *
 * ── 2026-09-18: 웜 화이트 스크림 폐기 (사용자 지시) ──
 * 사진 전체를 덮던 `brand-bg` 그라데이션이 "안개처럼 뿌옇다"는 판단으로 제거했다.
 * 따라서 2026-07-05의 "다크 오버레이 금지 · 텍스트는 항상 ink"는 **이 컴포넌트에서만 해제**된다
 * (메인 헤로와 같은 톤 — 사진 위 흰 글씨). 서브페이지 본문은 그대로 라이트다.
 * 오버레이는 **다크 그라데이션**(모바일 상→하 · PC 좌→우) + PC 상단 띠 두 개뿐이다. 웜 화이트 안개와 달리
 * 사진 색을 죽이지 않고, 사진이 밝은 라우트(임시 placeholder)에서도 흰 글씨가 읽힌다.
 * 사진 촬영·선정 가이드(디자인팀용): context/components/content/hero-image.md
 *
 * ── 2026-09-15: 모바일 전용 배너 지원 ──
 * 디자인팀이 PC/모바일 배너를 **다른 크롭**으로 만들어 준다. `imageSrcMobile`을 주면
 * `<picture>`로 뷰포트에 따라 **한 장만** 내려받는다 (next/image 두 장을 CSS로 숨기면 둘 다 받는다).
 * 이 경로는 Next 이미지 최적화를 타지 않으므로 파일 자체를 webp/적정 용량으로 받아야 한다.
 *
 * ── 2026-09-18: 모바일 재조정 (높이 440px · 하단 기준 크롭 · 텍스트 위로) ──
 * 재전달분(`/worship`·`/intro`)이 **세로 사진(750×899)**으로 왔고 피사체(건물)가 아래쪽 30%에 있다.
 * 기존 360px + 가운데 크롭으로는 건물 바닥이 잘려 하늘만 보였다. 그래서 세 가지를 같이 바꿨다:
 *   1. 모바일 박스 360 → **440px** (원본이 거의 전부 들어온다)
 *   2. 크롭 기준 가운데 → **아래쪽**(`object-bottom`, PC는 가운데 유지)
 *   3. 모바일 텍스트를 **가운데**로 + 스크림 방향을 상→하로 반전
 * 3번이 핵심이다 — 높이만 키워도 제목이 아래에 있으면 그 자리 스크림이 가장 진해서 건물이 묻힌다.
 * 하늘(사진 위쪽)이 텍스트 바탕이 되고 아래쪽 건물·사인이 드러난다. **PC 조판은 그대로**(좌측 하단).
 * 상단 정렬은 헤더에 붙어 보여서(2026-09-18 사용자 피드백) 가운데로 내렸다.
 * 공용 값이라 앞으로 들어올 배너(`care`·`activity`·`newcomer`)에도 그대로 적용된다.
 */
export function HeroImage({
  eyebrow = '— 경향교회',
  title,
  titleEn,
  lead,
  imageSrc,
  imageSrcMobile,
  imageAlt,
}: {
  eyebrow?: string;
  title: string;
  /** 제목 아래 영문 표기 (예: GYUNG - HYANG PRESBYTERIAN CHURCH). 2026-09-18 예배 시안 */
  titleEn?: string;
  lead?: string;
  imageSrc: string;
  /** 선택 — 모바일(768px 미만) 전용 크롭. `public/hero/*-m.*` */
  imageSrcMobile?: string;
  imageAlt: string;
}) {
  return (
    <section className="relative border-b border-brand-line">
      {imageSrcMobile ? (
        <picture>
          <source media="(min-width: 768px)" srcSet={imageSrc} />
          {/* eslint-disable-next-line @next/next/no-img-element -- 아트디렉션(PC/모바일 다른 크롭)은 next/image가 지원하지 않는다 */}
          <img
            src={imageSrcMobile}
            alt={imageAlt}
            fetchPriority="high"
            decoding="async"
            // 모바일 크롭은 **아래쪽 기준**(object-bottom) — 전달분이 세로 사진이고 피사체(건물)가 아래에 있어
            // 가운데 크롭을 하면 바닥이 잘려 나간다 (2026-09-18 사용자 지시). PC는 그대로 가운데.
            className="absolute inset-0 h-full w-full object-cover object-bottom md:object-center"
          />
        </picture>
      ) : (
        <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      )}
      {/* 웜 화이트 스크림 폐기 (2026-09-18 사용자 지시) — 사진을 뿌옇게 덮지 않는다.
         대신 **다크 그라데이션**으로 텍스트가 놓이는 쪽만 누른다. 흰 안개와 달리 사진의 색·대비는 살아 있어
         오히려 선명해 보이고, 사진이 밝든 어둡든 흰 글씨가 읽힌다 (배너가 아직 임시인 라우트 대비).
         모바일=위→아래(텍스트가 상단~가운데) · PC=좌→우(텍스트가 좌측). */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-brand-ink/55 via-brand-ink/20 to-transparent md:bg-gradient-to-r md:from-brand-ink/60 md:via-brand-ink/20 md:to-transparent"
      />
      {/* 상단 띠 — PC에서 우측 GNB가 밝은 하늘 위에 놓일 때를 위한 보강 (좌→우 그라데이션이 안 닿는 영역) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 hidden h-32 bg-gradient-to-b from-brand-ink/40 to-transparent md:block md:h-36"
      />
      {/* 정렬 — 모바일은 가운데(위는 헤더, 아래는 피사체를 비워 준다), 데스크탑은 기존처럼 좌측 하단 */}
      <div className="relative mx-auto flex min-h-[440px] w-full max-w-container flex-col justify-center px-5 pb-16 pt-20 md:min-h-[460px] md:justify-end md:px-8 md:pb-20 md:pt-40">
        {/* 스크림이 없어졌으므로 텍스트는 흰색 + 부드러운 그림자로 대비를 만든다.
           사진이 밝은 하늘이라 흰 글씨만으로는 대비가 모자란다 — 그림자가 스크림 역할을 대신한다. */}
        <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-white/85 drop-shadow-[0_2px_8px_rgba(20,18,16,0.55)] md:text-xs">
          {eyebrow}
        </p>
        <h1 className="display-lg text-white drop-shadow-[0_3px_16px_rgba(20,18,16,0.6)]">{title}</h1>
        {lead && (
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(20,18,16,0.6)] md:text-base">
            {lead}
          </p>
        )}
        {titleEn && (
          <p className="mt-8 text-[10px] font-medium tracking-[0.25em] text-white/55 drop-shadow-[0_2px_8px_rgba(20,18,16,0.6)] md:mt-10 md:text-[12px]">
            {titleEn}
          </p>
        )}
      </div>
    </section>
  );
}
