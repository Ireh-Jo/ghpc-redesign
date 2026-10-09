import Image from 'next/image';
import { ArrowRight, ArrowUpRight, HandHeart, Phone, Plane, ShieldAlert } from 'lucide-react';
import {
  GTS,
  KIDS_ACADEMY,
  MISSION,
  SCHOOL,
  SHOW_SPECIAL_REGION_NAMES,
  STARS,
  WELFARE,
  type MinistryLink,
} from '@/lib/ministry';

/**
 * 사역(`/ministry`) 섹션 본문 6종 — 각 export가 앵커 섹션 하나를 채운다.
 * 데이터: `lib/ministry.ts` (교역자 원고 사역2·3·4, 2026-10-09). 상세: context/components/content/ministry-sections.md
 *
 * 제목은 페이지가 섹션 h2로 단다 — 여기서는 h3부터 쓴다.
 */

/* ── 공용 조각 ────────────────────────────────────────── */

const H3 = 'text-[19px] font-bold text-brand-ink md:text-[22px]';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-bold tracking-[0.2em] text-brand-accent">{children}</p>;
}

function Verse({ text, cite }: { text: string; cite: string }) {
  return (
    <blockquote className="mt-6 border-l-2 border-brand-accent pl-5 text-[16px] leading-[1.75] text-brand-ink md:text-[17px]">
      “{text}”
      <cite className="mt-1 block text-[13px] not-italic text-brand-ink-muted">{cite}</cite>
    </blockquote>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="mt-6 space-y-3 text-[15px] leading-[1.8] text-brand-ink/85 md:text-base">
      {items.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/** 기관 머리 — 로고 + 영문 + 소개 */
function OrgHead({ logo, en }: { logo: { src: string; alt: string }; en: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-line bg-brand-surface p-2">
        <Image src={logo.src} alt={logo.alt} width={56} height={56} className="h-full w-full object-contain" />
      </span>
      <Eyebrow>{en}</Eyebrow>
    </div>
  );
}

const BTN_BASE =
  'btn-round inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2';
const BTN_KIND: Record<NonNullable<MinistryLink['kind']>, string> = {
  primary: 'bg-brand-accent text-white hover:bg-brand-ink',
  line: 'border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white',
  support: 'border border-dashed border-brand-ink/40 text-brand-ink hover:border-solid hover:border-brand-ink',
};

function LinkButtons({ links }: { links: MinistryLink[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {links.map((link) => {
        const kind = BTN_KIND[link.kind ?? 'primary'];
        if (!link.href) {
          return (
            <li key={link.label}>
              <span aria-disabled="true" className={`${BTN_BASE} cursor-not-allowed border border-brand-line bg-brand-subtle text-brand-ink-muted`}>
                {link.label}
                <span className="text-[11px] font-medium">준비 중</span>
              </span>
            </li>
          );
        }
        const tel = link.href.startsWith('tel:');
        return (
          <li key={link.label}>
            <a
              href={link.href}
              {...(tel ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className={`${BTN_BASE} ${kind}`}
            >
              {tel && <Phone className="h-3.5 w-3.5" aria-hidden />}
              {link.label}
              {!tel && (
                <>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  <span className="sr-only">(새 창으로 열림)</span>
                </>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** 사진이 아직 없는 자리 — 라벨만 있는 회색 칸 (EduDept 활동사진 칸과 같은 모양) */
function PhotoSlots({ title, labels }: { title: string; labels: string[] }) {
  return (
    <div className="mt-10 md:mt-12">
      <h3 className={H3}>{title}</h3>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-5">
        {labels.map((label) => (
          <li
            key={label}
            className="flex aspect-[4/3] items-center justify-center rounded-xl bg-brand-line/70 px-2 text-center text-[13px] text-brand-ink-muted"
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 별들의학교 ───────────────────────────────────────── */

export function MinistryStars() {
  return (
    <div>
      <OrgHead logo={STARS.logo} en={STARS.en} />
      <Verse text={STARS.verse.text} cite={STARS.verse.ref} />
      <Paragraphs items={STARS.body} />
      <LinkButtons links={STARS.links} />

      <div className="mt-10 md:mt-12">
        <h3 className={H3}>교육과정</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-brand-ink-muted md:text-[15px]">{STARS.curriculumLead}</p>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 md:gap-4">
          {STARS.curriculum.map((group, gi) => (
            <li key={`${group.stage}-${group.sub}`} className="rounded-2xl border border-brand-line bg-brand-surface p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[17px] font-bold text-brand-ink md:text-[18px]">
                  <span aria-hidden className="mr-2 text-[13px] font-extrabold text-brand-accent/50">
                    {String(gi + 1).padStart(2, '0')}
                  </span>
                  {group.stage}
                </p>
                <span className="shrink-0 text-[13px] font-bold text-brand-ink-muted">{group.sub}</span>
              </div>
              <ul className="mt-3 space-y-2 border-t border-brand-line pt-3">
                {group.terms.flatMap((pair) =>
                  pair.map((course, si) => (
                    <li key={course} className="flex gap-2.5 text-[14px] leading-snug text-brand-ink/85">
                      <span
                        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold ${
                          si === 0 ? 'bg-brand-accent/10 text-brand-accent' : 'bg-brand-subtle text-brand-ink-muted'
                        }`}
                      >
                        {si === 0 ? '상반기' : '하반기'}
                      </span>
                      {course}
                    </li>
                  ))
                )}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <PhotoSlots title="별들의학교 활동" labels={STARS.photoSlots} />
    </div>
  );
}

/* ── 제네바신학대학원대학교 ──────────────────────────── */

export function MinistryGts() {
  return (
    <div>
      <OrgHead logo={GTS.logo} en={GTS.en} />
      <p className="mt-6 flex flex-wrap gap-x-4 text-[24px] font-extrabold leading-tight tracking-tight text-brand-ink md:text-[30px]">
        {GTS.tagline.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-brand-ink-muted md:text-base">{GTS.lead}</p>
      <Paragraphs items={GTS.body} />
      <LinkButtons links={GTS.links} />
      <PhotoSlots title="신학교 후원 활동" labels={GTS.photoSlots} />
    </div>
  );
}

/* ── 경향선교회 ──────────────────────────────────────── */

export function MinistryMission() {
  return (
    <div>
      <OrgHead logo={MISSION.logo} en={MISSION.en} />
      <Verse text={MISSION.verse.text} cite={MISSION.verse.ref} />
      <Paragraphs items={MISSION.body} />

      {/* 숫자 4칸 */}
      <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {MISSION.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-brand-accent px-5 py-5 text-white">
            <dt className="text-[13px] font-bold text-white/70">{stat.label}</dt>
            <dd className="mt-1 text-[24px] font-extrabold tracking-tight md:text-[28px]">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {/* 가는 선교사 · 보내는 선교사 */}
      <div className="mt-10 md:mt-12">
        <h3 className={H3}>가는 선교사, 보내는 선교사</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:mt-5 md:gap-4">
          {MISSION.roles.map((role, i) => {
            const Icon = i === 0 ? Plane : HandHeart;
            return (
              <li key={role.title} className="rounded-2xl border border-brand-line bg-brand-surface p-5 md:p-6">
                <Icon className="h-6 w-6 text-brand-accent" aria-hidden />
                <p className="mt-3 text-[17px] font-bold text-brand-ink md:text-[18px]">{role.title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-brand-ink-muted md:text-[15px]">{role.body}</p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 사역 4단계 */}
      <div className="mt-10 md:mt-12">
        <h3 className={H3}>경향선교회 선교 사역</h3>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 md:mt-5 lg:grid-cols-4">
          {MISSION.steps.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-brand-line bg-brand-surface p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-ink text-[14px] font-extrabold text-white">
                {i + 1}
              </span>
              <p className="mt-3 text-[16px] font-bold text-brand-ink">{step.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-brand-ink-muted md:text-[14px]">{step.body}</p>
              {i < MISSION.steps.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-brand-ink-muted lg:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* 지역별 선교사 — 원고의 인터랙티브 지도 대신 지역 카드 (명단 내용은 원고 그대로) */}
      <div className="mt-10 md:mt-12">
        <h3 className={H3}>경향교회 파송 및 협력선교사</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:mt-5 md:gap-4">
          {MISSION.regions.map((region) => {
            const hidden = region.special && !SHOW_SPECIAL_REGION_NAMES;
            return (
              <li key={region.title} className="rounded-2xl border border-brand-line bg-brand-surface p-5 md:p-6">
                <p className="text-[17px] font-bold text-brand-ink md:text-[18px]">{region.title}</p>
                {hidden ? (
                  <p className="mt-3 flex gap-2 text-[14px] leading-relaxed text-brand-ink-muted">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    선교사님들의 안전을 위해 명단을 공개하지 않습니다.
                  </p>
                ) : (
                  <dl className="mt-3 space-y-3 border-t border-brand-line pt-3">
                    {region.countries.map((country) => (
                      <div key={country.name}>
                        <dt className="text-[13px] font-bold text-brand-accent">{country.name}</dt>
                        <dd className="mt-0.5 text-[14px] leading-relaxed text-brand-ink/85">{country.names}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <PhotoSlots title="선교 현장" labels={MISSION.photoSlots} />
    </div>
  );
}

/* ── 경향복지재단 ────────────────────────────────────── */

export function MinistryWelfare() {
  return (
    <div>
      <Eyebrow>{WELFARE.en}</Eyebrow>
      <ul className="mt-6 space-y-5">
        {WELFARE.orgs.map((org) => (
          <li key={org.name} className="overflow-hidden rounded-2xl border border-brand-line bg-brand-surface">
            <div className="px-5 pt-6 md:px-7 md:pt-7">
              <h3 className={H3}>{org.name}</h3>
              <p className="mt-2 max-w-2xl text-[15px] leading-[1.75] text-brand-ink-muted">{org.desc}</p>
            </div>
            {/* 활동사진 — 가로 스크롤 줄 (자동 넘김 없음) */}
            <ul className="mt-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:px-7">
              {org.photos.map((photo) => (
                <li key={photo.src} className="shrink-0">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={400}
                    height={260}
                    sizes="200px"
                    className="h-[130px] w-[200px] rounded-xl object-cover"
                  />
                </li>
              ))}
            </ul>
            <div className="px-5 pb-6 md:px-7 md:pb-7">
              <LinkButtons links={org.links} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 경향학원 · 놀이학원 ─────────────────────────────── */

function SchoolCard({
  badge,
  tag,
  name,
  desc,
  link,
  domain,
}: {
  badge: string;
  tag?: string;
  name: string;
  desc: string;
  link: MinistryLink;
  domain: string;
}) {
  return (
    <li className="rounded-2xl border border-brand-line bg-brand-surface p-5 md:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-accent text-[16px] font-bold text-brand-accent">
          {badge}
        </span>
        <div>
          {tag && <p className="text-[12px] font-bold tracking-[0.08em] text-brand-accent">{tag}</p>}
          <h3 className={`${H3} ${tag ? 'mt-1' : ''}`}>{name}</h3>
          <p className="mt-2 text-[15px] leading-[1.75] text-brand-ink-muted">{desc}</p>
        </div>
      </div>
      <div className="mt-5 flex aspect-[16/7] items-center justify-center rounded-xl bg-brand-line/70 text-[13px] text-brand-ink-muted">
        {name} 활동 사진 · 영상
      </div>
      <div className="flex flex-wrap items-center gap-x-3">
        <LinkButtons links={[link]} />
        <span className="mt-6 text-[13px] text-brand-ink-muted">{domain}</span>
      </div>
    </li>
  );
}

export function MinistrySchool() {
  return (
    <div>
      <Eyebrow>{SCHOOL.en}</Eyebrow>
      <p className="mt-3 text-[22px] font-extrabold leading-snug tracking-tight text-brand-ink md:text-[26px]">
        {SCHOOL.headline}
      </p>
      <Paragraphs items={SCHOOL.lead} />
      <ul className="mt-8 space-y-5">
        {SCHOOL.schools.map((school) => (
          <SchoolCard key={school.name} {...school} />
        ))}
      </ul>
    </div>
  );
}

export function MinistryKids() {
  return (
    <ul>
      <SchoolCard
        badge={KIDS_ACADEMY.badge}
        name={KIDS_ACADEMY.name}
        desc={KIDS_ACADEMY.desc}
        link={KIDS_ACADEMY.link}
        domain={KIDS_ACADEMY.domain}
      />
    </ul>
  );
}
