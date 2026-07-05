import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * 새가족 환영 — 라이트 2컬럼 섹션(텍스트 + 사진) + 1차/2차 CTA.
 * 2026-07-05 다크 임팩트 → 라이트 전환 (환영 동선 라이트화, 무드 "따뜻한·환영하는" 정합).
 * 상세: context/components/content/welcome-cta.md
 */
export function WelcomeCTA({
  eyebrow,
  title,
  body,
  imageSrc,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  imageSrc: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className="border-y border-brand-line bg-brand-surface">
      <div className="mx-auto grid w-full max-w-container md:grid-cols-2">
        <div className="px-5 py-20 md:px-8 md:py-28">
          <p className="mb-6 text-[11px] font-bold tracking-[0.5em] text-brand-support md:text-xs">
            {eyebrow}
          </p>
          <h2 className="display-xl mb-6 text-brand-ink md:mb-8">{title}</h2>
          <p className="mb-10 max-w-xl text-base leading-relaxed text-brand-ink-muted md:text-xl">
            {body}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={primaryHref}
              className="btn-square inline-flex items-center gap-2 bg-brand-accent px-7 py-4 text-sm font-bold tracking-widest text-white transition-colors hover:bg-brand-ink"
            >
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="btn-square inline-flex items-center gap-2 border border-brand-line px-7 py-4 text-sm font-bold tracking-widest text-brand-ink transition-colors hover:border-brand-ink"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
        <div className="relative min-h-[260px] md:min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
