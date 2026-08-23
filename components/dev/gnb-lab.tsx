'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, ExternalLink, Monitor, MousePointerClick, Ban, Smartphone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV as NAV_V2, type NavSection } from '@/lib/nav';

/**
 * GNB 검토 랩 (/dev/gnb) — 개발 내부용. 실서비스 라우트 아님.
 * STEP 1 메가메뉴 3안 · STEP 2 대메뉴 클릭 정책 3안 · STEP 3 L4→탭.
 * 결정 확정 후 이 파일과 app/dev/ 는 삭제한다.
 */

/* ─────────────────────────── STEP 1 ─────────────────────────── */

type Variant = 'all' | 'single' | 'hybrid';

const COLS: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };

const VARIANTS: { id: Variant; name: string; pros: string; cons: string }[] = [
  { id: 'all', name: 'A · 전체 노출', pros: '5개 메뉴가 한눈에', cons: '패널이 큼' },
  { id: 'single', name: 'B · 사랑의교회식', pros: '깔끔·여백 넉넉', cons: '나머지 4개가 안 보임' },
  { id: 'hybrid', name: 'C · 하이브리드', pros: '깔끔 + 5개 계속 보임', cons: '좌측 열이 폭을 먹음' },
];

/* ─────────────────────────── STEP 2 ─────────────────────────── */

type Policy = 'none' | 'hub' | 'full' | 'first';

const POLICIES: { id: Policy; name: string; behavior: string }[] = [
  { id: 'none', name: '① 클릭 불가', behavior: '대메뉴는 hover 전용. 클릭해도 아무 일 없음. (사랑의교회 실제 방식)' },
  { id: 'hub', name: '② 허브 요약', behavior: '/worship 로 이동. 하위를 나열하지 않고 카드·칩으로 요약. 내용은 눌러서 들어감.' },
  {
    id: 'full',
    name: '③ 전체 나열',
    behavior:
      '/worship 한 페이지에 L2·L3 하위 내용을 전부 이어 붙임. 상단 앵커 칩으로 점프. (원래 기획하려던 방식 · 현재 SubPage+AnchorNav 패턴)',
  },
  { id: 'first', name: '④ 첫 항목으로', behavior: '/worship#times 로 바로 이동. 대메뉴 = 가장 많이 찾는 항목의 별칭.' },
];

type Device = 'desktop' | 'mobile';

export function GnbLab() {
  const [device, setDevice] = useState<Device>('desktop');
  const [variant, setVariant] = useState<Variant>('hybrid');
  const [activeKey, setActiveKey] = useState<string>('worship');
  const [policy, setPolicy] = useState<Policy>('hub');
  const [showNotes, setShowNotes] = useState(false);

  const active = NAV_V2.find((s) => s.key === activeKey) ?? NAV_V2[0];
  const mobile = device === 'mobile';

  return (
    <div className="min-h-screen bg-brand-bg pb-24">
      {/* ── 기기 전환 ── */}
      <div className="sticky top-0 z-[80] border-b border-brand-line bg-brand-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center gap-2 px-5 py-3">
          <span className="mr-2 text-[11px] font-bold tracking-[0.2em] text-brand-ink-muted">보는 기기</span>
          {(
            [
              { id: 'desktop' as Device, label: '데스크탑 1440', Icon: Monitor },
              { id: 'mobile' as Device, label: '모바일 390', Icon: Smartphone },
            ] satisfies { id: Device; label: string; Icon: typeof Monitor }[]
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setDevice(id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors',
                device === id
                  ? 'border-brand-accent bg-brand-accent text-white'
                  : 'border-brand-line bg-brand-surface text-brand-ink hover:border-brand-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-[12px] text-brand-ink-muted">
            <input
              type="checkbox"
              checked={showNotes}
              onChange={(e) => setShowNotes(e.target.checked)}
              className="h-3.5 w-3.5 accent-[#002D60]"
            />
            URL · 메모 표시
          </label>
        </div>
      </div>

      {/* ── STEP 1 ── */}
      <Step
        n="1"
        title={mobile ? '모바일 메뉴 — 메가메뉴가 없습니다' : '메가메뉴 — 어느 모양으로 갈까'}
        lead={
          mobile
            ? 'A/B/C는 전부 데스크탑 hover 패턴이라 모바일에는 존재하지 않습니다. 모바일은 햄버거 → 풀스크린 아코디언 별도 설계입니다.'
            : undefined
        }
      >
        {!mobile && (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariant(v.id)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-[13px] font-medium transition-colors',
                    variant === v.id
                      ? 'border-brand-accent bg-brand-accent text-white'
                      : 'border-brand-line bg-brand-surface text-brand-ink hover:border-brand-accent'
                  )}
                >
                  {v.name}
                </button>
              ))}
            </div>
            <div className="mb-5 flex gap-3">
              {VARIANTS.filter((v) => v.id === variant).map((v) => (
                <div key={v.id} className="flex flex-wrap gap-2 text-[12px]">
                  <span className="border border-brand-support/40 bg-brand-support/5 px-2.5 py-1 text-brand-support">
                    좋음 · {v.pros}
                  </span>
                  <span className="border border-brand-point/30 bg-brand-point/5 px-2.5 py-1 text-brand-point">
                    아쉬움 · {v.cons}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </Step>

      {mobile ? (
        <div className="mx-auto max-w-container px-5 pb-14">
          <MobileNavMock policy={policy} showNotes={showNotes} />
        </div>
      ) : (
        <div className="border-y border-brand-line">
          <MockHeader
            variant={variant}
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            active={active}
            showNotes={showNotes}
          />
          <div className="relative h-[420px] bg-brand-ink">
            <p className="absolute inset-x-0 bottom-14 text-center text-2xl font-bold text-white">
              페이지 콘텐츠 — 메가메뉴가 위에서 이만큼 덮습니다
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      <Step
        n="2"
        title={`대메뉴(예: 『예배와 교육』)를 ${mobile ? '탭' : '클릭'}하면 뭐가 나오나`}
        lead="네 가지 처리 방식 — ②와 ③을 번갈아 눌러 페이지 길이를 비교해 보세요. 기기를 바꾸면 길이가 다시 측정됩니다."
      >
        <div className="mb-6 flex flex-wrap gap-2">
          {POLICIES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPolicy(p.id)}
              className={cn(
                'rounded-full border px-4 py-2 text-[13px] font-medium transition-colors',
                policy === p.id
                  ? 'border-brand-accent bg-brand-accent text-white'
                  : 'border-brand-line bg-brand-surface text-brand-ink hover:border-brand-accent'
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="mb-6 border-l-2 border-brand-accent pl-4 text-[13px] leading-relaxed text-brand-ink">
          {POLICIES.find((p) => p.id === policy)?.behavior}
        </p>
        <PolicyResult policy={policy} device={device} />
      </Step>

      {/* ── STEP 3 ── */}
      <Step
        n="3"
        title="L4는 페이지 안 탭으로"
        lead="PPT의 『예배 실황 ▸ 주일낮/주일밤/수요/특별/금요밤/강해』 6종. GNB에는 한 줄만 두고, 구분은 여기 탭에서."
      >
        <TabDemo />
      </Step>
    </div>
  );
}

function Step({ n, title, lead, children }: { n: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-container px-5 py-14">
      <p className="text-[11px] font-bold tracking-[0.3em] text-brand-support">STEP {n}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink">{title}</h2>
      {lead && <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-brand-ink-muted">{lead}</p>}
      <div className="mt-7">{children}</div>
    </section>
  );
}

/* ─────────────────────────── 헤더 목업 ─────────────────────────── */

function MockHeader({
  variant,
  activeKey,
  setActiveKey,
  active,
  showNotes,
}: {
  variant: Variant;
  activeKey: string;
  setActiveKey: (k: string) => void;
  active: NavSection;
  showNotes: boolean;
}) {
  return (
    <div className="relative z-10 bg-brand-surface">
      <div className="mx-auto flex h-20 max-w-container items-center justify-between px-5">
        <span className="text-lg font-bold tracking-tight text-brand-ink">경향교회</span>
        <nav className="flex items-center gap-8">
          {NAV_V2.map((s) => (
            <button
              key={s.key}
              type="button"
              onMouseEnter={() => setActiveKey(s.key)}
              className={cn(
                'relative py-1 text-[13px] tracking-widest transition-colors',
                s.highlight ? 'font-bold text-brand-support' : 'font-medium text-brand-ink',
                'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-brand-support after:transition-transform',
                activeKey === s.key && variant !== 'all' ? 'after:scale-x-100' : 'after:scale-x-0'
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <span className="flex items-center gap-2 text-[12px] font-medium tracking-widest text-brand-ink">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping bg-brand-support opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-brand-support" />
          </span>
          생방송
        </span>
      </div>

      <div className="absolute inset-x-0 top-full border-t border-brand-line bg-brand-surface shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]">
        {variant === 'all' && <PanelAll showNotes={showNotes} />}
        {variant === 'single' && <PanelSingle active={active} showNotes={showNotes} />}
        {variant === 'hybrid' && (
          <PanelHybrid active={active} activeKey={activeKey} setActiveKey={setActiveKey} showNotes={showNotes} />
        )}
      </div>
    </div>
  );
}

function ItemLink({
  item,
  showNotes,
}: {
  // `note`는 2026-08-23 nav 승계 때 `desc`(사용자에게 보이는 한 줄 설명)로 통합됨
  item: { label: string; href: string; external?: boolean; desc?: string };
  showNotes: boolean;
}) {
  return (
    <li>
      <span className="inline-flex cursor-pointer items-baseline gap-1 text-brand-ink hover:text-brand-accent">
        {item.label}
        {item.external && <ExternalLink className="h-3 w-3 self-center text-brand-ink-muted" />}
      </span>
      {showNotes && (
        <span className="mt-0.5 block font-mono text-[10px] leading-snug text-brand-ink-muted">{item.href}</span>
      )}
      {showNotes && item.desc && (
        <span className="mt-0.5 block text-[11px] leading-snug text-brand-point">↳ {item.desc}</span>
      )}
    </li>
  );
}

function PanelAll({ showNotes }: { showNotes: boolean }) {
  return (
    <div className="mx-auto grid max-w-container grid-cols-5 gap-x-8 px-5 py-9">
      {NAV_V2.map((s) => (
        <div key={s.key}>
          <p
            className={cn(
              'mb-4 border-b pb-3 text-sm font-bold tracking-widest',
              s.highlight ? 'border-brand-support/30 text-brand-support' : 'border-brand-line text-brand-ink'
            )}
          >
            {s.label}
          </p>
          <div className="space-y-5">
            {s.groups.map((g) => (
              <div key={g.label}>
                <p className="mb-2 text-[11px] font-bold tracking-[0.15em] text-brand-ink-muted">{g.label}</p>
                <ul className="space-y-2 text-[13px]">
                  {g.items.map((it) => (
                    <ItemLink key={it.href + it.label} item={it} showNotes={showNotes} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelSingle({ active, showNotes }: { active: NavSection; showNotes: boolean }) {
  return (
    <div className="mx-auto flex max-w-container gap-12 px-5 py-10">
      <div className="w-56 shrink-0 border-r border-brand-line pr-8">
        <p className={cn('text-lg font-bold tracking-tight', active.highlight ? 'text-brand-support' : 'text-brand-ink')}>
          {active.label}
        </p>
        {active.tagline && <p className="mt-2 text-[12px] leading-relaxed text-brand-ink-muted">{active.tagline}</p>}
      </div>
      <div className={cn('grid flex-1 gap-x-8', COLS[active.groups.length] ?? 'grid-cols-3')}>
        {active.groups.map((g) => (
          <div key={g.label}>
            <p className="mb-3 text-[13px] font-bold tracking-wide text-brand-ink">{g.label}</p>
            <ul className="space-y-2 text-[13px]">
              {g.items.map((it) => (
                <ItemLink key={it.href + it.label} item={it} showNotes={showNotes} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelHybrid({
  active,
  activeKey,
  setActiveKey,
  showNotes,
}: {
  active: NavSection;
  activeKey: string;
  setActiveKey: (k: string) => void;
  showNotes: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-container gap-10 px-5 py-8">
      <div className="w-52 shrink-0 border-r border-brand-line pr-6">
        <ul className="space-y-0.5">
          {NAV_V2.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                onMouseEnter={() => setActiveKey(s.key)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] transition-colors',
                  activeKey === s.key
                    ? 'bg-brand-bg font-bold text-brand-accent'
                    : s.highlight
                      ? 'font-bold text-brand-support hover:bg-brand-bg'
                      : 'text-brand-ink hover:bg-brand-bg'
                )}
              >
                {s.label}
                <ArrowRight className={cn('h-3.5 w-3.5', activeKey === s.key ? 'opacity-100' : 'opacity-0')} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={cn('grid flex-1 gap-x-8', COLS[active.groups.length] ?? 'grid-cols-3')}>
        {active.groups.map((g) => (
          <div key={g.label}>
            <p className="mb-3 border-b border-brand-line pb-2 text-[13px] font-bold tracking-wide text-brand-ink">
              {g.label}
            </p>
            <ul className="space-y-2 text-[13px]">
              {g.items.map((it) => (
                <ItemLink key={it.href + it.label} item={it} showNotes={showNotes} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── STEP 2 · 클릭 정책 결과 화면 ─────────────────── */

/** 결과 화면의 실제 높이를 재서 "화면 몇 개 분량"인지 보여준다. */
function useMeasuredHeight(dep: unknown) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setH(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dep]);
  return { ref, h };
}

/** 1화면 기준 높이(px) — 데스크탑 브라우저 / 아이폰 사파리 실사용 영역 */
const SCREEN: Record<Device, number> = { desktop: 900, mobile: 700 };

function PolicyResult({ policy, device }: { policy: Policy; device: Device }) {
  const { ref, h } = useMeasuredHeight(`${policy}-${device}`);
  const mobile = device === 'mobile';
  const screens = h / SCREEN[device];

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      {/* 클릭 시점 */}
      <div className="self-start border border-brand-line bg-brand-surface p-5 lg:sticky lg:top-5">
        <p className="text-[11px] font-bold tracking-[0.2em] text-brand-ink-muted">클릭한 것</p>
        <div className="mt-4 inline-flex items-center gap-2 border border-brand-accent px-4 py-2.5 text-[14px] font-bold text-brand-accent">
          예배와 교육
          <MousePointerClick className="h-4 w-4" />
        </div>
        <p className="mt-5 text-[11px] font-bold tracking-[0.2em] text-brand-ink-muted">주소</p>
        <p className="mt-2 font-mono text-[12px] text-brand-ink">
          {policy === 'none'
            ? '— 이동 없음 —'
            : policy === 'first'
              ? '/worship#times'
              : '/worship'}
        </p>

        {policy !== 'none' && (
          <>
            <p className="mt-6 text-[11px] font-bold tracking-[0.2em] text-brand-ink-muted">페이지 길이 (실측)</p>
            <p
              className={cn(
                'mt-2 text-2xl font-bold tracking-tight',
                screens > 3 ? 'text-brand-point' : 'text-brand-support'
              )}
            >
              {screens.toFixed(1)}화면
            </p>
            <p className="mt-1 text-[11px] text-brand-ink-muted">
              {h.toLocaleString()}px · {mobile ? '모바일' : '데스크탑'} 1화면 {SCREEN[device]}px 기준
            </p>
            {/* 세로 스케일 바 */}
            <div className="mt-3 flex items-end gap-1.5">
              {Array.from({ length: Math.min(Math.ceil(screens), 12) }).map((_, i) => (
                <span
                  key={i}
                  className={cn('h-8 w-2.5', screens > 3 ? 'bg-brand-point/70' : 'bg-brand-support/70')}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 결과 화면 */}
      <div className={cn(mobile && 'flex justify-center')}>
        <div
          ref={ref}
          className={cn(
            'border border-brand-line bg-brand-surface',
            mobile && 'w-[390px] shrink-0 text-[13px]'
          )}
        >
          {policy === 'none' && <ResultNone mobile={mobile} />}
          {policy === 'hub' && <ResultHub mobile={mobile} />}
          {policy === 'full' && <ResultFull mobile={mobile} />}
          {policy === 'first' && <ResultFirst />}
        </div>
      </div>
    </div>
  );
}

/* ── 모바일 풀스크린 메뉴 (햄버거 → 아코디언) ── */

function MobileNavMock({ policy, showNotes }: { policy: Policy; showNotes: boolean }) {
  const [open, setOpen] = useState<string | null>('worship');
  // ① 클릭 불가 = 대메뉴 행 전체가 펼치기. 그 외 = 펼치기(▾) / 바로가기(→) 분리
  const splitRow = policy !== 'none';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-[390px] overflow-hidden rounded-[2rem] border-[10px] border-brand-ink bg-brand-ink">
        <div className="flex h-14 items-center justify-between px-5 text-white">
          <span className="text-[15px] font-bold">경향교회</span>
          <X className="h-5 w-5" />
        </div>
        <div className="max-h-[620px] overflow-y-auto bg-brand-ink pb-8">
          {NAV_V2.map((s) => (
            <div key={s.key} className="border-t border-white/10">
              <div className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => setOpen(open === s.key ? null : s.key)}
                  className={cn(
                    'flex flex-1 items-center justify-between px-5 py-4 text-left text-[15px]',
                    s.highlight ? 'font-bold text-brand-support' : 'font-medium text-white'
                  )}
                >
                  {s.label}
                  {!splitRow && (
                    <ChevronDown
                      className={cn('h-4 w-4 transition-transform', open === s.key && 'rotate-180')}
                    />
                  )}
                </button>
                {splitRow && (
                  <>
                    <span className="flex items-center px-3 text-white/50">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpen(open === s.key ? null : s.key)}
                      className="flex items-center border-l border-white/10 px-4 text-white/70"
                      aria-label={`${s.label} 하위 펼치기`}
                    >
                      <ChevronDown className={cn('h-4 w-4 transition-transform', open === s.key && 'rotate-180')} />
                    </button>
                  </>
                )}
              </div>

              {open === s.key && (
                <div className="space-y-5 bg-white/5 px-5 pb-5 pt-1">
                  {s.groups.map((g) => (
                    <div key={g.label}>
                      <p className="mb-2 text-[11px] font-bold tracking-[0.15em] text-white/45">{g.label}</p>
                      <ul className="space-y-2.5 text-[14px] text-white/85">
                        {g.items.map((it) => (
                          <li key={it.href + it.label}>
                            {it.label}
                            {showNotes && (
                              <span className="mt-0.5 block font-mono text-[10px] text-white/35">{it.href}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-[390px] space-y-2 text-[12px]">
        <p className="border border-brand-line bg-brand-surface p-3 leading-relaxed text-brand-ink">
          {splitRow ? (
            <>
              대메뉴 행이 <b>[이동 →] / [펼치기 ▾]</b> 둘로 나뉩니다. 탭 실수는 늘지만, 눌렀는데 아무 반응 없는
              상황은 안 생깁니다.
            </>
          ) : (
            <>
              대메뉴 행 전체가 <b>펼치기</b>입니다. 데스크탑에서 클릭 불가인 걸 모바일에선 아코디언으로 대체 —
              두 기기 동작이 달라집니다.
            </>
          )}
        </p>
        <p className="border border-brand-point/30 bg-brand-point/5 p-3 leading-relaxed text-brand-point">
          『목양과 사역』을 펼쳐 보세요. L2 2개 + L3 11개라 한 번 펼치면 화면을 꽉 채웁니다. 3뎁스 아코디언의
          한계 지점입니다.
        </p>
      </div>
    </div>
  );
}

function ResultNone({ mobile }: { mobile: boolean }) {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center gap-4 text-center',
        mobile ? 'min-h-[420px] p-6' : 'min-h-[380px] p-10'
      )}
    >
      <Ban className="h-10 w-10 text-brand-ink-muted" />
      <p className="text-[15px] font-bold text-brand-ink">화면이 바뀌지 않습니다</p>
      <p className="max-w-md text-[13px] leading-relaxed text-brand-ink-muted">
        {mobile ? (
          <>
            모바일엔 hover가 없어서 이 방식이 그대로 성립하지 않습니다. 대메뉴 탭 = <b>아코디언 펼치기</b>로
            대체해야 합니다 (STEP 1 참고).
          </>
        ) : (
          <>
            메뉴 패널만 열려 있고, 실제 이동은 아래 L3 항목(『예배 시간 안내』 등)을 눌러야 일어납니다.
            사랑의교회가 이 방식입니다 — 대메뉴 링크가 <code className="font-mono">href=&quot;#&quot;</code>.
          </>
        )}
      </p>
      <div className="mt-2 grid gap-2 text-left text-[12px]">
        <span className="border border-brand-support/40 bg-brand-support/5 px-3 py-1.5 text-brand-support">
          좋음 · 만들 페이지가 줄어듦
        </span>
        <span className="border border-brand-point/30 bg-brand-point/5 px-3 py-1.5 text-brand-point">
          아쉬움 · 눌렀는데 반응 없으면 당황함. 특히 모바일·새신자
        </span>
      </div>
    </div>
  );
}

const HUB_GROUPS = [
  {
    label: '예배',
    items: [
      { t: '예배 시간 안내', d: '주일 · 수요 · 새벽 전체 시간표' },
      { t: '생방송', d: '지금 진행 중인 예배 보기' },
      { t: '예배 실황', d: '지난 예배 다시보기 6종' },
      { t: '특별순서', d: '특송 · 간증' },
    ],
  },
  {
    label: '교육',
    items: [
      { t: '주일학교', d: '영아 ~ 초등' },
      { t: '중 · 고등부', d: '' },
      { t: '대학부', d: '' },
      { t: '청년회', d: '' },
      { t: '경향시니어스쿨', d: '' },
      { t: '평생교육원', d: '' },
      { t: '새소식반', d: '' },
    ],
  },
];

function ResultHub({ mobile }: { mobile: boolean }) {
  return (
    <div>
      <div className={cn('border-b border-brand-line bg-brand-bg', mobile ? 'px-5 py-7' : 'px-8 py-10')}>
        <p className="text-[11px] tracking-[0.2em] text-brand-ink-muted">예배와 교육</p>
        <p className={cn('mt-2 font-bold tracking-tight text-brand-ink', mobile ? 'text-xl' : 'text-2xl')}>
          자유로이, 함께 예배하라
        </p>
      </div>
      <div className={cn('space-y-8', mobile ? 'px-5 py-6' : 'px-8 py-8')}>
        {HUB_GROUPS.map((g) => (
          <div key={g.label}>
            <p className="mb-4 text-[13px] font-bold tracking-[0.15em] text-brand-support">{g.label}</p>
            {g.items[0].d ? (
              <div className={cn('grid gap-3', !mobile && 'sm:grid-cols-2')}>
                {g.items.map((it) => (
                  <div
                    key={it.t}
                    className="flex items-start justify-between gap-3 border border-brand-line p-4 hover:border-brand-accent"
                  >
                    <div>
                      <p className="text-[14px] font-bold text-brand-ink">{it.t}</p>
                      {it.d && <p className="mt-1 text-[12px] text-brand-ink-muted">{it.d}</p>}
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-accent" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span
                    key={it.t}
                    className="border border-brand-line px-4 py-2 text-[13px] text-brand-ink hover:border-brand-accent hover:text-brand-accent"
                  >
                    {it.t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        <p className="border-t border-brand-line pt-5 text-[12px] leading-relaxed text-brand-ink-muted">
          하위를 <b className="text-brand-ink">전부 펼치지 않습니다.</b> L2 그룹 2개 → 카드/칩 요약이라 한 화면에 들어갑니다.
          실제 내용은 각 항목을 눌러 들어갑니다.
        </p>
      </div>
    </div>
  );
}

/* ── ③ 전체 나열 (원래 기획안 · SubPage + AnchorNav) ── */

const FULL_SECTIONS: { group: string; title: string; lead: string; kind: 'table' | 'video' | 'dept' }[] = [
  { group: '예배', title: '예배 시간 안내', lead: '주일 · 수요 · 새벽 전체 시간표', kind: 'table' },
  { group: '예배', title: '생방송', lead: '지금 진행 중인 예배 보기', kind: 'video' },
  { group: '예배', title: '예배 실황', lead: '지난 예배 다시보기 6종', kind: 'video' },
  { group: '예배', title: '특별순서', lead: '특송 · 간증', kind: 'video' },
  { group: '교육', title: '주일학교', lead: '영아부 ~ 초등부', kind: 'dept' },
  { group: '교육', title: '중 · 고등부', lead: '', kind: 'dept' },
  { group: '교육', title: '대학부', lead: '', kind: 'dept' },
  { group: '교육', title: '청년회', lead: '', kind: 'dept' },
  { group: '교육', title: '경향시니어스쿨', lead: '', kind: 'dept' },
  { group: '교육', title: '평생교육원', lead: '', kind: 'dept' },
  { group: '교육', title: '새소식반', lead: '', kind: 'dept' },
];

function ResultFull({ mobile }: { mobile: boolean }) {
  const pad = mobile ? 'px-5' : 'px-8';
  return (
    <div>
      <div className={cn('border-b border-brand-line bg-brand-bg', pad, mobile ? 'py-7' : 'py-10')}>
        <p className="text-[11px] tracking-[0.2em] text-brand-ink-muted">예배와 교육</p>
        <p className={cn('mt-2 font-bold tracking-tight text-brand-ink', mobile ? 'text-xl' : 'text-2xl')}>
          자유로이, 함께 예배하라
        </p>
      </div>

      {/* 앵커 내비 (AnchorNav) — 모바일은 가로 스크롤 */}
      <div
        className={cn(
          'sticky top-0 z-10 gap-1.5 border-b border-brand-line bg-brand-surface/95 py-3 backdrop-blur',
          pad,
          mobile ? 'flex overflow-x-auto whitespace-nowrap' : 'flex flex-wrap'
        )}
      >
        {FULL_SECTIONS.map((s, i) => (
          <span
            key={s.title}
            className={cn(
              'shrink-0 border px-3 py-1.5 text-[12px]',
              i === 0
                ? 'border-brand-accent bg-brand-accent text-white'
                : 'border-brand-line text-brand-ink-muted'
            )}
          >
            {s.title}
          </span>
        ))}
      </div>

      {FULL_SECTIONS.map((s, i) => (
        <section key={s.title} className={cn(pad, mobile ? 'py-8' : 'py-10', i > 0 && 'border-t border-brand-line')}>
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand-support">{s.group}</p>
          <h4 className="mt-2 text-xl font-bold tracking-tight text-brand-ink">{s.title}</h4>
          {s.lead && <p className="mt-1.5 text-[13px] text-brand-ink-muted">{s.lead}</p>}

          {s.kind === 'table' && (
            <div className="mt-5 divide-y divide-brand-line border border-brand-line">
              {[
                ['주일 1부', '오전 7:00', '본당'],
                ['주일 2부', '오전 9:00', '본당'],
                ['주일 3부', '오전 11:00', '본당'],
                ['수요예배', '오후 7:30', '본당'],
              ].map(([a, b, c]) => (
                <div key={a} className="grid grid-cols-3 px-5 py-3 text-[13px]">
                  <span className="font-bold text-brand-ink">{a}</span>
                  <span className="text-brand-ink">{b}</span>
                  <span className="text-brand-ink-muted">{c}</span>
                </div>
              ))}
            </div>
          )}

          {s.kind === 'video' && (
            <div className={cn('mt-5 grid gap-4', mobile ? 'grid-cols-1' : 'sm:grid-cols-3')}>
              {[0, 1, 2].map((n) => (
                <div key={n} className="border border-brand-line">
                  <div className="flex aspect-video items-center justify-center bg-brand-bg text-[11px] text-brand-ink-muted">
                    썸네일
                  </div>
                  <p className="p-3 text-[12px] text-brand-ink">
                    {s.title} {n + 1}
                  </p>
                </div>
              ))}
            </div>
          )}

          {s.kind === 'dept' && (
            <>
              <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-brand-ink">
                부서 소개 문단이 여기 들어갑니다. 시안(교육.html) 기준으로 각 부서마다 소개 · 3중심 · 시설 · 카페
                링크 · 문의처가 모두 들어갑니다.
              </p>
              <div className={cn('mt-5 grid gap-3', mobile ? 'grid-cols-1' : 'sm:grid-cols-3')}>
                {['말씀 중심', '예배 중심', '공동체 중심'].map((t) => (
                  <div key={t} className="border border-brand-line p-4">
                    <p className="text-[13px] font-bold text-brand-ink">{t}</p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-brand-ink-muted">
                      한두 줄 설명이 들어갑니다.
                    </p>
                  </div>
                ))}
              </div>
              <div className={cn('mt-4 grid gap-3', mobile ? 'grid-cols-1' : 'sm:grid-cols-2')}>
                {[0, 1].map((n) => (
                  <div
                    key={n}
                    className="flex aspect-[16/7] items-center justify-center bg-brand-bg text-[11px] text-brand-ink-muted"
                  >
                    활동 사진
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[12px] text-brand-ink-muted">
                네이버 카페 바로가기 · 문의 02-000-0000 (내선 000)
              </p>
            </>
          )}
        </section>
      ))}

      <p className={cn('border-t border-brand-line py-6 text-[12px] leading-relaxed text-brand-ink-muted', pad)}>
        섹션 <b className="text-brand-ink">11개</b>가 한 페이지에 이어집니다. 여기 미리보기는 사진·본문이 자리만
        잡은 상태이고, 실제 콘텐츠가 들어가면 더 길어집니다.
      </p>
    </div>
  );
}

function ResultFirst() {
  return (
    <div>
      <div className="border-b border-brand-line bg-brand-bg px-8 py-10">
        <p className="text-[11px] tracking-[0.2em] text-brand-ink-muted">예배와 교육 › 예배 › 예배 시간 안내</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-brand-ink">예배 시간 안내</p>
      </div>
      <div className="px-8 py-8">
        <div className="divide-y divide-brand-line border border-brand-line">
          {[
            ['주일 1부', '오전 7:00', '본당'],
            ['주일 2부', '오전 9:00', '본당'],
            ['주일 3부', '오전 11:00', '본당'],
            ['수요예배', '오후 7:30', '본당'],
          ].map(([a, b, c]) => (
            <div key={a} className="grid grid-cols-3 px-5 py-3.5 text-[13px]">
              <span className="font-bold text-brand-ink">{a}</span>
              <span className="text-brand-ink">{b}</span>
              <span className="text-brand-ink-muted">{c}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-2 text-[12px]">
          <span className="border border-brand-support/40 bg-brand-support/5 px-3 py-1.5 text-brand-support">
            좋음 · 새신자가 가장 많이 찾는 정보로 바로 떨어짐
          </span>
          <span className="border border-brand-point/30 bg-brand-point/5 px-3 py-1.5 text-brand-point">
            아쉬움 · 『교육』 쪽을 찾던 사람은 헛걸음. 대메뉴 이름과 도착지가 안 맞음
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── STEP 3 · 탭 ─────────────────────────── */

const LIVE_TABS = [
  { id: 'sun-am', label: '주일 낮예배', count: 412 },
  { id: 'sun-pm', label: '주일 밤예배', count: 380 },
  { id: 'wed', label: '수요예배', count: 351 },
  { id: 'special', label: '특별예배', count: 47 },
  { id: 'fri', label: '금요밤기도회', count: 244 },
  { id: 'expo', label: '강해 · 특강', count: 62 },
];

function TabDemo() {
  const [tab, setTab] = useState('sun-am');
  const current = LIVE_TABS.find((t) => t.id === tab)!;
  return (
    <div className="border border-brand-line bg-brand-surface">
      <div className="border-b border-brand-line px-6 pt-6">
        <p className="text-[11px] tracking-[0.2em] text-brand-ink-muted">
          예배와 교육 › 예배 › 예배 실황 <span className="font-mono">/worship/live?type={tab}</span>
        </p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink">예배 실황</h3>
        <div className="mt-5 flex flex-wrap gap-1">
          {LIVE_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'border-b-2 px-4 py-2.5 text-[13px] transition-colors',
                tab === t.id
                  ? 'border-brand-accent font-bold text-brand-accent'
                  : 'border-transparent text-brand-ink-muted hover:text-brand-ink'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 py-8">
        <p className="mb-4 text-[12px] text-brand-ink-muted">
          {current.label} — 영상 {current.count}개
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-brand-line">
              <div className="flex aspect-video items-center justify-center bg-brand-bg text-[11px] text-brand-ink-muted">
                썸네일
              </div>
              <div className="p-3">
                <p className="text-[13px] font-bold text-brand-ink">
                  {current.label} 설교 {i + 1}
                </p>
                <p className="mt-1 text-[11px] text-brand-ink-muted">2026. 08. 0{i + 2}.</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 border-t border-brand-line pt-4 text-[12px] leading-relaxed text-brand-ink-muted">
          같은 방식이 <b className="text-brand-ink">특별순서(특송·간증)</b>, <b className="text-brand-ink">나의 공동체 찾기(5탭)</b>,{' '}
          <b className="text-brand-ink">전도회(남/여/청년)</b>에도 적용됩니다. 사랑의교회도 설교 25종을 한 페이지 +
          쿼리(<code className="font-mono">?sflag=sun</code>)로 처리합니다.
        </p>
      </div>
    </div>
  );
}
