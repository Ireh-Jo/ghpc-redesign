'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { YouTubeEmbed } from './youtube-embed';
import type { ArchiveCategory } from '@/lib/worship-videos';

/**
 * 영상 아카이브 — 하위 카테고리 탭 + 큰 플레이어 1개 + 최근 목록.
 * `/worship#live`(예배 실황)와 `/worship#special`(특별순서)이 같은 컴포넌트를 쓴다.
 * 레퍼런스: 사랑의교회 설교 페이지 · 선한목자교회 말씀 (2026-09-15 사용자 제시).
 * 스펙: `context/components/content/video-archive.md`
 */
export function VideoArchive({
  categories,
  label,
}: {
  categories: ArchiveCategory[];
  /** 스크린리더용 — "예배 실황 분류" 처럼 읽힌다 */
  label: string;
}) {
  const [categoryKey, setCategoryKey] = useState(categories[0]?.key ?? '');
  const category = categories.find((c) => c.key === categoryKey) ?? categories[0];
  const [videoId, setVideoId] = useState(category?.videos[0]?.videoId ?? '');

  if (!category) return null;
  const current = category.videos.find((v) => v.videoId === videoId) ?? category.videos[0];
  /** 지난 영상 — 지금 재생 중인 것을 빼고 3편. 한 줄(lg 3열)에 딱 맞게 고정한다 */
  const recent = category.videos.filter((v) => v.videoId !== current?.videoId).slice(0, 3);

  const selectCategory = (next: ArchiveCategory) => {
    setCategoryKey(next.key);
    setVideoId(next.videos[0]?.videoId ?? '');
  };

  return (
    <div>
      {/* 카테고리 탭 — 모바일에선 가로 스크롤 */}
      <div
        role="group"
        aria-label={label}
        className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0"
      >
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            aria-pressed={c.key === category.key}
            onClick={() => selectCategory(c)}
            className={cn(
              'btn-round shrink-0 whitespace-nowrap px-4 py-2 text-[13px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2',
              c.key === category.key
                ? 'bg-brand-ink text-white'
                : 'bg-brand-subtle text-brand-ink-muted hover:text-brand-ink',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 선택된 영상 */}
      {current && (
        <div className="max-w-3xl">
          <YouTubeEmbed key={current.videoId} videoId={current.videoId} title={current.title} />
          <p className="mt-4 text-[13px] text-brand-ink-muted">
            {current.date}
            {current.scripture && ` · ${current.scripture}`}
          </p>
          <p className="mt-1 text-[18px] font-bold leading-snug text-brand-ink md:text-[20px]">
            {current.title}
          </p>
          {current.speaker && (
            <p className="mt-1 text-[14px] text-brand-ink-muted">{current.speaker}</p>
          )}
        </div>
      )}

      {/* 지난 영상 — 누르면 위 플레이어가 바뀐다 */}
      {recent.length > 0 && (
        <>
          <p className="mb-4 mt-10 text-[13px] font-bold tracking-[0.2em] text-brand-ink-muted">
            지난 영상
          </p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((video) => (
            <li key={video.videoId}>
              <button
                type="button"
                onClick={() => setVideoId(video.videoId)}
                className="group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              >
                <span className="relative block aspect-[16/9] overflow-hidden rounded-2xl border border-brand-line bg-brand-ink shadow-sm transition-[border-color,box-shadow] duration-200 group-hover:border-brand-ink group-hover:shadow-md">
                  <Image
                    src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center bg-brand-ink/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-surface/90">
                      <Play className="ml-0.5 h-4 w-4 fill-brand-ink text-brand-ink" />
                    </span>
                  </span>
                </span>
                <span className="mt-3 block text-[12px] text-brand-ink-muted">{video.date}</span>
                <span className="mt-1 block text-[15px] font-bold leading-snug text-brand-ink transition-colors duration-200 group-hover:text-brand-accent">
                  {video.title}
                </span>
                {video.speaker && (
                  <span className="mt-0.5 block text-[13px] text-brand-ink-muted">
                    {video.speaker}
                  </span>
                )}
              </button>
            </li>
            ))}
          </ul>
        </>
      )}

      {/* 현행 사이트 비교용 임시 링크 — **오픈 전 제거** (2026-09-15 사용자 지시) */}
      <a
        href={category.legacyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-brand-accent transition-colors duration-200 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      >
        {category.label} 전체 보기 (현재 홈페이지)
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}
