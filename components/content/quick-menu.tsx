import Link from 'next/link';
import {
  AlarmClockCheck,
  ArrowUpRight,
  BookOpen,
  FileText,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { FadeIn } from '@/components/layout/fade-in';
import { QUICK_MENU } from '@/lib/nav';

/**
 * 메인 퀵메뉴 — 자주 찾는 4곳 (예배시간 · 약도 주차 · 구역공과 · 주보).
 * 근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai` (2026-09-16). 항목·링크는 `lib/nav.ts`의 `QUICK_MENU`.
 * 상세: context/components/content/quick-menu.md
 *
 * 시안은 네 칸 중 둘이 의미 없는 아이콘(ⓘ · 말풍선)이라 **뜻이 맞는 lucide 아이콘으로 바꿨다**
 * (약도=MapPin · 구역공과=BookOpen). 시안 그대로 가야 하면 여기 매핑만 되돌리면 된다.
 *
 * ── 모션: 색 채우기 (2026-09-16 사용자 요청) ──
 * hover 시 타일 아래에서 위로 진한 면(ink)이 차오르고, 아이콘이 살짝 커지며 우상단 화살표가 나타난다.
 * 타일이 비어 보인다는 피드백에 따라 라벨 아래 **설명 한 줄**(`QUICK_MENU[].desc`)을 추가했다.
 */
const ICONS: Record<string, LucideIcon> = {
  'worship-time': AlarmClockCheck,
  directions: MapPin,
  'district-study': BookOpen,
  bulletin: FileText,
};

export function QuickMenu() {
  return (
    <section className="bg-brand-surface py-14 md:py-20">
      <Container>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4 md:gap-x-7">
          {QUICK_MENU.map((item, i) => {
            const Icon = ICONS[item.key] ?? FileText;
            return (
              <li key={item.key}>
                <FadeIn delay={i * 60}>
                  <Link
                    href={item.href}
                    className="group block text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-4"
                  >
                    <span className="relative flex h-[104px] items-center justify-center overflow-hidden rounded-xl bg-brand-accent text-white shadow-sm transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-md motion-reduce:transform-none md:h-[150px]">
                      {/* 색 채우기 — 아래에서 위로 (유틸: app/globals.css · 06-motion.md) */}
                      <span aria-hidden className="fill-wipe fill-wipe-up bg-brand-ink" />
                      <Icon
                        className="relative h-9 w-9 transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transform-none md:h-11 md:w-11"
                        strokeWidth={1.5}
                      />
                      <ArrowUpRight
                        aria-hidden
                        className="absolute right-3 top-3 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-70 md:right-4 md:top-4"
                      />
                    </span>
                    <span className="mt-3 block text-[15px] font-bold text-brand-ink transition-colors duration-200 group-hover:text-brand-accent md:mt-4 md:text-base">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-[12px] text-brand-ink-muted md:text-[13px]">
                      {item.desc}
                    </span>
                  </Link>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
