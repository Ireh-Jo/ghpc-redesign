'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MainBanner as Banner } from '@/lib/main-banners';

/**
 * 메인 중앙 배너 — 풀블리드 이미지 슬라이드 (관리자 영역).
 * 근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai` (2026-09-16) — 2026 표어 배너 자리.
 * 데이터: `lib/main-banners.ts` (Supabase 이관 예정) · 상세: context/components/content/main-banner.md
 *
 * - **자동 슬라이드 없음.** `context/design/06-motion.md`의 "자동재생 캐러셀 금지"를 따른다.
 *   좌우 버튼 + 하단 점으로만 넘긴다. 배너가 1장이면 컨트롤을 아예 렌더하지 않는다.
 * - 배너 문구는 이미지 안에 박혀 있어 `alt`가 유일한 접근 경로다 — 데이터에서 문구를 그대로 넘긴다.
 * - 모바일 전용 크롭(`srcMobile`)이 없으면 PC 배너를 16:9로 가운데 크롭한다 (양 끝 그래픽 잘림).
 */
export function MainBanner({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  if (banners.length === 0) return null;

  const move = (dir: 1 | -1) => setIndex((i) => (i + dir + banners.length) % banners.length);

  return (
    <section aria-label="교회 배너" className="relative w-full overflow-hidden bg-brand-bg">
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner, i) => {
          const image = (
            <picture>
              {banner.srcMobile && <source media="(min-width: 768px)" srcSet={banner.src} />}
              {/* eslint-disable-next-line @next/next/no-img-element -- 아트디렉션(PC/모바일 다른 크롭)은 next/image가 지원하지 않는다 */}
              <img
                src={banner.srcMobile ?? banner.src}
                alt={banner.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </picture>
          );

          return (
            <div
              key={banner.id}
              aria-hidden={i !== index}
              className="aspect-[16/9] w-full shrink-0 md:aspect-[32/10]"
            >
              {banner.href ? (
                <Link
                  href={banner.href}
                  tabIndex={i === index ? undefined : -1}
                  className="block h-full w-full"
                >
                  {image}
                </Link>
              ) : (
                image
              )}
            </div>
          );
        })}
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="이전 배너"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-surface/70 text-brand-ink backdrop-blur-sm transition-colors duration-200 hover:bg-brand-surface md:left-8 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="다음 배너"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-surface/70 text-brand-ink backdrop-blur-sm transition-colors duration-200 hover:bg-brand-surface md:right-8 md:h-12 md:w-12"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* 점은 보기엔 작지만 클릭 영역은 44px를 지킨다 (context/design/03-spacing.md 접근성).
             배너 이미지가 밝을 수도 어두울 수도 있어 점만 얹으면 사라진다 — 반투명 알약 위에 흰 점으로 고정. */}
          <div className="absolute inset-x-0 bottom-2 flex justify-center md:bottom-4">
            <div className="flex items-center rounded-full bg-brand-ink/35 px-1 backdrop-blur-sm">
              {banners.map((banner, i) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1}번 배너 보기`}
                  aria-current={i === index}
                  className="group flex h-11 w-7 items-center justify-center"
                >
                  <span
                    className={cn(
                      'h-2 rounded-full transition-all duration-200',
                      i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 group-hover:bg-white/80',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
