import type { ReactNode } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '@/components/layout/fade-in';
import { SideNav, type SideNavItem } from '@/components/layout/side-nav';
import {
  EduBullets,
  EduEvents,
  EduFacts,
  EduFaq,
  EduIntro,
  EduNotes,
  EduRoster,
} from '@/components/content/edu-dept';
import type { EduDept as Dept } from '@/lib/education';

/**
 * 교육 C안(`/education/c`)의 부서 1개 = 배너 + 좌측 부서별 하위 메뉴 + 우측 콘텐츠 (2026-09-27 시범).
 * 상세: context/components/content/edu-chapter.md
 *
 * 좌측 패널의 sticky는 **이 section 안에서만** 유효하다 — 부서 끝에서 멈추고 다음 부서 패널이 올라오는 게
 * "영역에 들어가면 새 서브메뉴가 나온다"의 전부다. 스크롤 JS 없음.
 * 블록 조판은 `EduDept`의 export 블록을 그대로 쓴다 (A·B·C안 콘텐츠 동일). 그룹만 행 단위로 다시 짠다.
 */

type Sub = SideNavItem & { body: ReactNode };
type Group = NonNullable<Dept['groups']>[number];

/** 데이터에 있는 블록만 하위 섹션으로 — 순서·라벨 규칙은 스펙 문서 표 */
function subsectionsOf(dept: Dept): Sub[] {
  const subs: Sub[] = [{ id: `${dept.id}-intro`, label: '소개', body: <EduIntro dept={dept} /> }];

  dept.groups?.forEach((group, gi) => {
    const id = `${dept.id}-g${gi + 1}`;
    subs.push({
      id,
      label: group.label,
      children: group.items.map((item, ii) => ({ id: `${id}-${ii + 1}`, label: item.name })),
      body: <GroupRows id={id} group={group} />,
    });
  });
  if (dept.facts) {
    subs.push({ id: `${dept.id}-facts`, label: dept.facts.title ?? '안내', body: <EduFacts dept={dept} /> });
  }
  if (dept.roster) {
    subs.push({ id: `${dept.id}-roster`, label: dept.roster.title, body: <EduRoster dept={dept} /> });
  }
  if (dept.bullets) {
    subs.push({ id: `${dept.id}-bullets`, label: dept.bullets.title, body: <EduBullets dept={dept} /> });
  }
  if (dept.events?.length) {
    subs.push({ id: `${dept.id}-events`, label: '주요 행사', body: <EduEvents dept={dept} /> });
  }
  if (dept.faq?.length) {
    subs.push({ id: `${dept.id}-faq`, label: '자주 묻는 질문', body: <EduFaq dept={dept} /> });
  }
  return subs;
}

export function EduChapter({ dept }: { dept: Dept }) {
  const subs = subsectionsOf(dept);
  const cafe = dept.links?.[0];

  return (
    <section
      id={dept.id}
      aria-labelledby={`${dept.id}-title`}
      className="scroll-mt-32 pt-12 md:scroll-mt-36 md:pt-16"
    >
      <FadeIn>
        <DeptBanner dept={dept} />
      </FadeIn>

      {/* 모바일·태블릿 하위 메뉴 — 좌측 패널 대신. 상단은 부서 탭이 차지하므로 sticky 아님 */}
      <nav aria-label={`${dept.title} 하위 메뉴`} className="mt-5 lg:hidden">
        <ul className="flex flex-wrap gap-2">
          {subs.map((sub) => (
            <li key={sub.id}>
              <a
                href={`#${sub.id}`}
                className="btn-round inline-block border border-brand-line bg-brand-surface px-3 py-2 text-[13px] font-bold text-brand-ink-muted transition-colors duration-200 hover:text-brand-ink"
              >
                {sub.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden pt-8 lg:block">
          <SideNav
            eyebrow={`${dept.no} ${dept.en}`}
            title={dept.title}
            items={subs.map(({ id, label, children }) => ({ id, label, children }))}
            // 부서마다 패널이 있으므로 첫 항목(소개)은 페이지 맨 위가 아니라 이 부서 소개로 간다
            topOnFirst={false}
            // 헤더(80) + 상단 부서 탭(약 57) 아래
            className="top-40 max-h-[calc(100vh-11rem)]"
            cta={cafe && { label: cafe.label, href: cafe.href, external: true }}
          />
        </aside>

        <div className="pb-16 md:pb-20">
          {subs.map((sub, i) => (
            <div key={sub.id} id={sub.id} className="scroll-mt-40">
              <FadeIn>
                {sub.body}
                {i === subs.length - 1 && <EduNotes dept={dept} />}
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 부서 배너 — 사진이 없으면 다크 면 + "배너 이미지 자리" (디자인팀 사진 대기) */
function DeptBanner({ dept }: { dept: Dept }) {
  return (
    <div className="relative flex min-h-[240px] items-end overflow-hidden rounded-2xl bg-brand-accent-2 p-6 md:min-h-[320px] md:p-10">
      {dept.banner ? (
        <>
          <Image
            src={dept.banner.src}
            alt={dept.banner.alt}
            fill
            sizes="(min-width: 1200px) 1136px, 100vw"
            className="object-cover"
          />
          {/* 글자 쪽(아래)만 누르는 스크림 — 서브 히어로와 같은 규칙 */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-accent-2/85 to-transparent" />
        </>
      ) : (
        <span className="absolute right-5 top-5 rounded-lg border border-dashed border-white/30 px-3 py-1.5 text-[12px] font-bold text-white/50">
          배너 이미지 자리
        </span>
      )}

      <div className="relative max-w-2xl text-white">
        <p className="text-[12px] font-bold tracking-[0.2em] text-white/70">
          {dept.no} {dept.en}
        </p>
        <h2
          id={`${dept.id}-title`}
          className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight md:text-[40px]"
        >
          {dept.title}
        </h2>
        <p className="mt-2.5 text-[15px] leading-relaxed text-white/80 md:text-base">{dept.lead}</p>
        {dept.links && dept.links.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {dept.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-round inline-flex items-center gap-1.5 bg-white px-3.5 py-2 text-[13px] font-bold text-brand-accent-2 transition-colors duration-200 hover:bg-brand-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-accent-2"
                >
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="sr-only">(새 창으로 열림)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** 그룹 = 부서별 **행** (A·B안은 4열 카드). 좌측 메뉴의 영아부·유아부…가 각자 스크롤 목적지를 갖도록 */
function GroupRows({ id, group }: { id: string; group: Group }) {
  return (
    <div className="mt-10 md:mt-12">
      <h3 className="text-[19px] font-bold text-brand-ink md:text-[22px]">{group.label}</h3>
      <ul className="mt-4 space-y-3 md:mt-5">
        {group.items.map((item, ii) => (
          <li
            key={item.name}
            id={`${id}-${ii + 1}`}
            className="grid scroll-mt-40 gap-4 rounded-2xl border border-brand-line bg-brand-surface p-5 sm:grid-cols-[minmax(0,1fr)_180px] sm:items-center md:p-6"
          >
            <div>
              <p className="text-[18px] font-bold text-brand-ink md:text-[20px]">{item.name}</p>
              {item.meta && (
                <p className="mt-1.5 text-[14px] leading-relaxed text-brand-ink-muted md:text-[15px]">
                  {item.meta}
                </p>
              )}
              {item.place && (
                <p className="mt-3 inline-block rounded-lg bg-brand-accent/5 px-3 py-1 text-[13px] font-bold text-brand-accent">
                  {item.place}
                </p>
              )}
            </div>
            <div
              aria-hidden
              className="flex aspect-[4/3] items-center justify-center rounded-xl bg-brand-line/70 text-[13px] text-brand-ink-muted"
            >
              활동사진
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
