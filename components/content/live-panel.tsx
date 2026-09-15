'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { YouTubeEmbed } from './youtube-embed';
import { LIVE_PRE_ROLL_MIN, LIVE_SCHEDULE, YOUTUBE_CHANNEL_ID } from '@/lib/worship-videos';

/**
 * 생방송 패널.
 *
 * ── 수동 on/off를 없앤 이유 (2026-09-15 결정) ──
 * 현행 사이트는 방송 상태를 사람이 켜고 껐다. 끄는 걸 잊으면 "방송 중"인데 화면이 비고, 켜는 걸 잊으면
 * 방송 중인데 안내가 안 뜬다. 그래서 **아무도 손대지 않아도 맞는 구조**로 바꿨다.
 * - 실제 라이브 여부는 유튜브 채널 임베드(`embed/live_stream?channel=`)가 스스로 판단한다. 키·서버 불필요.
 * - 편성표(`LIVE_SCHEDULE`)는 "지금 방송 시간대인가"만 판정해서 **플레이어를 크게 띄울지 / 다음 방송을 안내할지**를 고른다.
 *   편성표가 틀려도 플레이어 안의 내용은 유튜브가 정정해 준다 (편성표는 화면 배치용, 진실은 유튜브).
 * - 더 정확한 배지가 필요해지면 YouTube Data API로 승격 (`context/features/live-streaming.md` 하이브리드안).
 *
 * 스펙: `context/components/content/live-panel.md`
 */

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** 교회 현지 시각(서울) 기준 요일·분 — 해외·다른 타임존 접속자도 같은 판정을 보게 한다 */
function seoulNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const hour = Number(get('hour')) % 24;
  return { day: WEEKDAY_INDEX[get('weekday')] ?? 0, minutes: hour * 60 + Number(get('minute')) };
}

function formatTime(startMin: number) {
  const hour = Math.floor(startMin / 60);
  const minute = startMin % 60;
  const meridiem = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${meridiem} ${displayHour}시${minute ? ` ${minute}분` : ''}`;
}

export function LivePanel() {
  // 서버 렌더 시점엔 알 수 없다 (하이드레이션 불일치 방지) → 마운트 후 판정
  const [now, setNow] = useState<{ day: number; minutes: number } | null>(null);

  useEffect(() => {
    setNow(seoulNow());
    const timer = setInterval(() => setNow(seoulNow()), 60_000);
    return () => clearInterval(timer);
  }, []);

  // 방송 시작 15분 전부터 플레이어를 띄운다 (`LIVE_PRE_ROLL_MIN`)
  const onAir = now
    ? LIVE_SCHEDULE.find(
        (s) =>
          s.day === now.day &&
          now.minutes >= s.startMin - LIVE_PRE_ROLL_MIN &&
          now.minutes < s.startMin + s.durationMin,
      )
    : undefined;
  /** 아직 시작 전(프리롤 구간) — 방송은 켜져 있지만 예배는 시작 전 */
  const beforeStart = !!onAir && !!now && now.minutes < onAir.startMin;

  /** 다음 방송 — 이번 주 남은 편성 → 없으면 다음 주 첫 편성 */
  const next = now
    ? [...LIVE_SCHEDULE]
        .map((s) => {
          // 프리롤 시작 시각 기준 — 안내와 플레이어 전환 시점을 같게 맞춘다
          const raw = ((s.day - now.day + 7) % 7) * 1440 + (s.startMin - LIVE_PRE_ROLL_MIN) - now.minutes;
          return { ...s, wait: raw < 0 ? raw + 7 * 1440 : raw };
        })
        .sort((a, b) => a.wait - b.wait)[0]
    : undefined;

  if (onAir) {
    return (
      <div className="max-w-3xl">
        {beforeStart ? (
          <p className="mb-4 flex items-center gap-2 text-[13px] font-bold text-brand-support">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-support" />
            잠시 후 시작 · {onAir.label} {formatTime(onAir.startMin)}
          </p>
        ) : (
          <p className="mb-4 flex items-center gap-2 text-[13px] font-bold text-brand-point">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-point opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-point" />
            </span>
            LIVE · {onAir.label} 생중계 중
          </p>
        )}
        <YouTubeEmbed channelId={YOUTUBE_CHANNEL_ID} title={`${onAir.label} 생방송`} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl border border-brand-line bg-brand-bg px-6 py-8 md:px-8 md:py-10">
      <p className="text-[11px] font-bold tracking-[0.3em] text-brand-support">— 생방송</p>
      <p className="mt-3 text-[18px] font-bold text-brand-ink md:text-[22px]">
        {next ? (
          <>
            다음 생방송은 {DAYS[next.day]}요일 {formatTime(next.startMin)}
            <span className="text-brand-ink-muted"> · {next.label}</span>
          </>
        ) : (
          '생방송 시간이 아닙니다'
        )}
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-brand-ink-muted">
        주일 낮예배 오전 11시 · 수요 밤예배 오후 7시 30분 · 금요밤기도회 오후 8시에 유튜브로 생중계합니다.
        지난 예배는 아래에서 다시 보실 수 있습니다.
      </p>
      <a
        href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-square mt-6 inline-flex items-center gap-2 bg-brand-accent px-6 py-3 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      >
        유튜브에서 생방송 열기
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}
