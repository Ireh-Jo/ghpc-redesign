'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * 메인 헤로 — 다크 풀블리드 영상/이미지 + 헤드라인 + 예배시간 바.
 * 상세: context/components/content/hero-video.md
 *
 * 2026-09-16: 메인 시안 반영 때 **영상 헤로 구조는 그대로 두고 문구 슬롯만 늘렸다** (사용자 지시).
 * `lead`(도입 2줄) + `titleEn`(영문 표기)를 추가하고 `subtitle`·`verse`는 선택으로 바꿨다 —
 * 시안 헤드라인이 "도입 2줄 → 큰 교회 이름 + 영문" 구조라 기존 3슬롯(title/subtitle/verse)에 안 맞았다.
 */
export type HeroServiceTime = {
  label: string;
  time: string;
  /** LIVE 펄스 도트 표시 (다음 예배 등 강조 1개만) */
  emphasize?: boolean;
  /** 좁은 화면에서 숨김(공간 우선순위 낮은 항목) */
  hideOnMobile?: boolean;
};

export function HeroVideo({
  eyebrow,
  lead,
  title,
  titleEn,
  subtitle,
  verse,
  verseRef,
  videoSrc,
  videoSrcHevc,
  posterSrc,
  mobileImageSrc,
  mobileImageAlt,
  mobileVideoSrc,
  mobileVideoSrcHevc,
  serviceTimes,
}: {
  eyebrow: string;
  /** 제목 위 도입 문구. 줄바꿈(`\n`) 유지 — 2026-09-16 시안 문구 반영 때 추가 */
  lead?: string;
  title: React.ReactNode;
  /** 제목 옆 영문 표기 (예: GYUNG-HYANG PRESBYTERIAN CHURCH) */
  titleEn?: string;
  subtitle?: string;
  verse?: string;
  verseRef?: string;
  /** H.264 mp4 — 모든 브라우저가 트는 대체본 */
  videoSrc: string;
  /** 같은 영상의 HEVC 판 (같은 용량에 화질이 훨씬 낫다). 못 트는 브라우저는 `videoSrc`로 내려간다 — 2026-10-08 */
  videoSrcHevc?: string;
  posterSrc: string;
  mobileImageSrc: string;
  mobileImageAlt: string;
  /**
   * 모바일 전용 세로 영상 (H.264) — 있으면 md 미만에서도 영상을 튼다. 없으면 정지 이미지만.
   * 2026-10-09 채택 — 결정: context/design/05-imagery.md §모바일 · 절차: context/components/content/hero-video.md
   */
  mobileVideoSrc?: string;
  /** 모바일 세로 영상의 HEVC 판 */
  mobileVideoSrcHevc?: string;
  serviceTimes: HeroServiceTime[];
}) {
  // display:none(hidden)은 리소스 다운로드를 막지 못함 — 영상은 조건이 맞을 때만 마운트한다.
  // 데스크탑: md 이상 + 모션 허용. 모바일: 세로판이 있고 + 모션 허용 + 데이터 절약 모드 아님.
  const [mode, setMode] = useState<'none' | 'desktop' | 'mobile'>('none');
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const update = () =>
      setMode(
        reduce.matches ? 'none' : desktop.matches ? 'desktop' : mobileVideoSrc && !saveData ? 'mobile' : 'none'
      );
    update();
    desktop.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, [mobileVideoSrc]);

  /** 지금 모드의 소스 — HEVC를 먼저 시도하고 안 되면 H.264 */
  const sources =
    mode === 'desktop'
      ? { hevc: videoSrcHevc, h264: videoSrc, poster: posterSrc }
      : mode === 'mobile' && mobileVideoSrc
        ? { hevc: mobileVideoSrcHevc, h264: mobileVideoSrc, poster: mobileImageSrc }
        : null;

  return (
    // 높이 상한 없음 (2026-10-08) — 1000px 상한이 있으면 큰 모니터에서 16:9 영상 위아래가 31%까지 잘렸다.
    // 모바일은 화면의 75% (2026-10-08 "너무 길다") — 예배시간 바는 그대로 첫 화면에 있고 아래 말씀 섹션이 살짝 보인다.
    <section className="relative flex h-[75svh] min-h-[540px] flex-col overflow-hidden bg-brand-ink md:h-screen md:min-h-[640px]">
      {/* 베이스 레이어 — <picture>가 뷰포트에 맞는 한 장만 다운로드 (모바일=정지 이미지, 데스크탑=포스터) */}
      <picture>
        <source media="(min-width: 768px)" srcSet={posterSrc} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mobileImageSrc} alt={mobileImageAlt} className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {sources && (
        <video
          // 모드가 바뀌면(창 크기 변경) 소스가 달라지므로 새로 마운트한다 — <source>만 바꾸면 브라우저가 다시 안 읽는다
          key={mode}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          poster={sources.poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {/* 재생 가능한 첫 소스 하나만 받는다 — HEVC를 먼저 시도하고 안 되면 H.264 */}
          {sources.hevc && <source src={sources.hevc} type='video/mp4; codecs="hvc1"' />}
          <source src={sources.h264} type="video/mp4" />
        </video>
      )}
      {/* 오버레이 — 전체를 덮던 어두운 막(35→55→95%)을 걷고 글씨가 있는 곳만 누른다 (2026-10-08, 영상 선명도).
          전부 없애진 않는다: 영상이 흰 화면으로 시작·끝나서 흰 글씨가 묻힌다. 상세: hero-video.md */}
      <div aria-hidden className="absolute inset-0 bg-brand-ink/30 md:bg-transparent" />
      <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-brand-ink/55 via-brand-ink/20 to-transparent md:block" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-ink/40 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-ink/75 to-transparent" />

      <div className="relative mx-auto w-full max-w-container px-5 pt-24 md:px-8 md:pt-32">
        <p className="text-[11px] font-medium tracking-[0.4em] text-white/70 md:text-xs">{eyebrow}</p>
      </div>

      {/* 글자 그림자 — 오버레이를 옅게 한 대신 글자 뒤만 누른다. 영상이 흰 화면으로 시작·끝나는 구간에서도 읽히게 */}
      <div className="relative mx-auto flex w-full max-w-container flex-1 flex-col justify-center px-5 text-white [text-shadow:0_2px_18px_rgb(var(--brand-ink)/0.55)] md:px-8">
        {lead && (
          <p className="mb-3 whitespace-pre-line text-[24px] font-light leading-[1.35] text-white/90 md:mb-4 md:text-[40px]">
            {lead}
          </p>
        )}
        <h1 className="display-lg mb-2 flex flex-wrap items-baseline gap-x-3 text-white md:mb-3 md:gap-x-4">
          {title}
          {titleEn && (
            <span className="text-[10px] font-medium tracking-[0.18em] text-white/60 md:text-[13px]">
              {titleEn}
            </span>
          )}
        </h1>
        {subtitle && <p className="display-md mb-8 font-light text-white/85 md:mb-10">{subtitle}</p>}
        {verse && (
          <p className="max-w-md text-[15px] leading-relaxed text-white/70 md:text-lg">
            &ldquo;{verse}&rdquo;
            <br className="hidden md:block" />
            {verseRef && <span className="text-white/50">— {verseRef}</span>}
          </p>
        )}
      </div>

      <div className="relative w-full border-t border-white/15 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-container grid-cols-3 gap-3 px-5 py-4 text-white md:grid-cols-5 md:gap-6 md:px-8 md:py-5">
          {serviceTimes.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'leading-tight',
                i === 0 && 'flex items-center gap-3 md:col-span-2',
                s.hideOnMobile && 'hidden md:block'
              )}
            >
              {i === 0 && (
                <span className="relative mt-0.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-brand-support opacity-75" />
                  <span className="relative inline-flex h-2 w-2 bg-brand-support" />
                </span>
              )}
              <div>
                <p className="text-[10px] font-medium tracking-[0.3em] text-white/55">{s.label}</p>
                <p className="text-sm font-bold md:text-base">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
