import Link from 'next/link';
import { MapPin, Navigation } from 'lucide-react';

/**
 * 지도 placeholder + 실내 길찾기 진입 버튼.
 * 실제 지도는 `> DECISION NEEDED:`(context/pages/01-main.md) — 임베드 방식 확정 전 placeholder.
 * 상세: context/components/content/map-embed.md
 */
export function MapEmbed({ wayfindingHref }: { wayfindingHref: string }) {
  return (
    <>
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

      <Link
        href={wayfindingHref}
        className="btn-square inline-flex items-center gap-2 border border-brand-line px-5 py-3 text-[13px] font-bold tracking-widest text-brand-ink transition-colors hover:border-brand-accent hover:text-brand-accent"
      >
        <Navigation className="h-4 w-4" /> 건물 내 길찾기
      </Link>
    </>
  );
}
