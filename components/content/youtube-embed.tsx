'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

/**
 * 유튜브 임베드 (lite 패턴) — 썸네일 → 클릭 후에야 iframe을 붙인다.
 * iframe 1개가 500KB+ · 쿠키를 즉시 심기 때문 (`guardrails/05-performance.md`).
 * 스펙: `context/components/content/youtube-embed.md`
 */
export function YouTubeEmbed({
  videoId,
  channelId,
  title,
  thumbnailSrc,
  autoLoad,
}: {
  videoId?: string;
  channelId?: string;
  title: string;
  thumbnailSrc?: string;
  autoLoad?: boolean;
}) {
  // 라이브 임베드는 썸네일이 없다 → 바로 iframe
  const isLive = !videoId && !!channelId;
  const [loaded, setLoaded] = useState(!!autoLoad || isLive);
  const [thumbFallback, setThumbFallback] = useState(false);

  const src = isLive
    ? `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&rel=0`
    : `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  const watchUrl = isLive
    ? `https://www.youtube.com/channel/${channelId}/live`
    : `https://www.youtube.com/watch?v=${videoId}`;

  const thumb =
    thumbnailSrc ??
    `https://i.ytimg.com/vi/${videoId}/${thumbFallback ? 'hqdefault' : 'maxresdefault'}.jpg`;

  if (loaded) {
    return (
      <div className="aspect-[16/9] w-full border border-brand-line bg-brand-ink">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <a
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        // JS가 살아 있으면 새 탭 대신 자리에서 재생 (JS 없으면 링크 그대로 동작)
        e.preventDefault();
        setLoaded(true);
      }}
      className="group relative block aspect-[16/9] w-full overflow-hidden border border-brand-line bg-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      aria-label={`${title} — 영상 재생`}
    >
      <Image
        src={thumb}
        alt=""
        fill
        sizes="(min-width: 768px) 720px, 100vw"
        onError={() => setThumbFallback(true)}
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-brand-ink/20 transition-colors duration-200 group-hover:bg-brand-ink/10"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-surface/90 shadow-lg transition-transform duration-200 ease-out group-hover:scale-105 motion-reduce:transition-none">
          <Play className="ml-1 h-6 w-6 fill-brand-ink text-brand-ink" />
        </span>
      </span>
    </a>
  );
}
