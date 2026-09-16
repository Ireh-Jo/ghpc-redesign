import Link from 'next/link';
import { ArrowRight, UserRoundPlus } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { FadeIn } from '@/components/layout/fade-in';

/**
 * 메인 새가족 섹션 — 왼쪽 환영 문구 + 오른쪽 "새가족 등록" 큰 카드.
 * 근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai`·`… 모바일.ai` (2026-09-16).
 * 상세: context/components/content/newcomer-card.md
 *
 * 시안의 네이비 카드는 라벨 한 줄 + 아이콘뿐이라 실제로 보면 비어 보인다 (2026-09-16 사용자 피드백).
 * 조판(좌 문구 / 우 네이비 카드)은 그대로 두고 **카드 안을 채웠다** — 안내 문구 + 바로가기 칩 3개 + 주 버튼.
 * 칩·버튼이 각각 링크라 **카드 전체를 링크로 감싸지 않는다** (a 안의 a는 잘못된 마크업).
 *
 * ⚠️ 온라인 새가족 등록 폼은 1차 오픈 범위 밖이다 (2026-08-09 결정, `app/(site)/newcomer/page.tsx`).
 * 그래서 주 버튼 문구는 "등록하기"가 아니라 **"새가족 안내 보기"** 다 — 카드 라벨(시안 문구)만 "새가족 등록".
 *
 * 기존 `content/WelcomeCTA`(다크 사진 배경 임팩트형)와 목적은 같지만 조판이 달라 별도 컴포넌트로 뒀다.
 * WelcomeCTA는 `/care` 등 서브페이지용으로 남는다.
 */

/** 카드 안 바로가기 칩 — hover 시 흰색이 차오르며 글자가 네이비로 뒤집힌다 */
const CHIPS = [
  { label: '처음 오신 날 안내', href: '/newcomer#firstday' },
  { label: '새가족 모임 (4주)', href: '/newcomer#meeting' },
  { label: '오시는 길', href: '/newcomer#directions' },
];

export function NewcomerCard({
  eyebrow = '— 바른 신앙, 따뜻한 사랑이 있는',
  lines = ['경향교회에', '오신 것을', '환영합니다'],
  lead = '교회가 낯설어도 괜찮습니다. 처음 오신 날 안내부터 새가족 모임까지 차근차근 도와드립니다.',
  cardLabel = '새가족 등록',
  href = '/newcomer',
}: {
  eyebrow?: string;
  /** 제목 줄바꿈 — 시안대로 3줄 */
  lines?: string[];
  lead?: string;
  cardLabel?: string;
  href?: string;
}) {
  return (
    <section className="bg-brand-surface py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
          <FadeIn className="md:col-span-5">
            <p className="mb-3 text-[13px] text-brand-ink-muted md:mb-4 md:text-sm">{eyebrow}</p>
            <h2 className="text-[38px] font-extrabold leading-[1.15] tracking-tight text-brand-ink md:text-[56px]">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-brand-ink-muted md:mt-6 md:text-base">
              {lead}
            </p>
          </FadeIn>

          <FadeIn delay={80} className="md:col-span-7">
            <div className="relative overflow-hidden rounded-2xl bg-brand-accent p-6 text-white shadow-sm md:p-9">
              {/* 배경 장식 — 큰 아이콘을 흐리게 깔아 빈 면을 채운다 (장식이라 aria-hidden) */}
              <UserRoundPlus
                aria-hidden
                strokeWidth={1}
                className="pointer-events-none absolute -bottom-6 -right-4 h-40 w-40 text-white/10 md:h-52 md:w-52"
              />

              <div className="relative">
                <p className="text-[13px] font-bold tracking-[0.2em] text-white/60">{cardLabel}</p>
                <p className="mt-3 text-[20px] font-bold leading-snug md:text-[26px]">
                  처음 오신 분을 위한
                  <br />
                  안내를 준비했습니다
                </p>

                <ul className="mt-6 flex flex-wrap gap-2 md:mt-7">
                  {CHIPS.map((chip) => (
                    <li key={chip.href}>
                      <Link
                        href={chip.href}
                        className="group relative inline-flex overflow-hidden rounded-full border border-white/30 px-4 py-2 text-[13px] font-medium transition-colors duration-200 hover:border-white md:text-[14px]"
                      >
                        {/* 색 채우기 — 왼쪽에서 오른쪽으로 (유틸: app/globals.css · 06-motion.md) */}
                        <span aria-hidden className="fill-wipe fill-wipe-right bg-white" />
                        <span className="relative transition-colors duration-200 group-hover:text-brand-accent">
                          {chip.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className="btn-round group mt-7 inline-flex items-center gap-2 bg-white px-6 py-3.5 text-[14px] font-bold text-brand-accent transition-colors duration-200 hover:bg-brand-support hover:text-white md:mt-9 md:text-[15px]"
                >
                  새가족 안내 보기
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
