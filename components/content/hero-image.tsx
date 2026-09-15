import Image from 'next/image';

/**
 * 서브페이지 히어로 — 풀블리드 웜톤 사진 배경 + 웜 화이트(brand-bg) 스크림.
 * 2026-07-06 분할형 → 풀블리드 전환 (스펙: context/components/content/hero-image.md).
 * 다크 오버레이 금지 — 스크림은 brand-bg 알파 그라데이션만, 텍스트는 항상 ink 계열.
 * 사진은 fixed 헤더 뒤까지 깔리므로 상단에 별도 스크림을 얹어 GNB(ink) 가독성 확보.
 * 사진 촬영·선정 가이드(디자인팀용): context/components/content/hero-image.md
 *
 * ── 2026-09-15: 모바일 전용 배너 지원 ──
 * 디자인팀이 PC/모바일 배너를 **다른 크롭**으로 만들어 준다. `imageSrcMobile`을 주면
 * `<picture>`로 뷰포트에 따라 **한 장만** 내려받는다 (next/image 두 장을 CSS로 숨기면 둘 다 받는다).
 * 이 경로는 Next 이미지 최적화를 타지 않으므로 파일 자체를 webp/적정 용량으로 받아야 한다.
 */
export function HeroImage({
  eyebrow = '— 경향교회',
  title,
  lead,
  imageSrc,
  imageSrcMobile,
  imageAlt,
}: {
  eyebrow?: string;
  title: string;
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
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      ) : (
        <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      )}
      {/* 가독성 스크림 — 모바일 하→상, 데스크탑 좌→우 (guardrails/02 히어로 예외 항목) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/70 to-brand-bg/15 md:bg-gradient-to-r md:via-brand-bg/60 md:to-brand-bg/5"
      />
      {/* 상단 스크림 — 투명 fixed 헤더의 GNB·로고 가독성 */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-brand-bg/90 to-transparent md:h-36"
      />
      <div className="relative mx-auto flex min-h-[360px] w-full max-w-container flex-col justify-end px-5 pb-14 pt-28 md:min-h-[460px] md:px-8 md:pb-20 md:pt-40">
        <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-support md:text-xs">
          {eyebrow}
        </p>
        <h1 className="display-lg text-brand-ink">{title}</h1>
        {lead && (
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-brand-ink/75 md:text-base">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
