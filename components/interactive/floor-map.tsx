'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpDown, Footprints, RotateCcw, Scan, Search, X, Zap, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildGraph, dijkstra, loadMask, nearestCell, simplify } from '@/lib/wayfind/engine';
import { FLOORS, FLOOR_ORDER } from '@/lib/wayfind/floors';
import type { EdgeType, FloorData, FloorId, Graph, Mode, Point, Room } from '@/lib/wayfind/types';

/**
 * 실내 길찾기 지도 — React 이전본. 로직/데이터는 lib/wayfind/* (잠긴 결정, 그대로 재사용).
 * 이 파일은 렌더·팬줌·애니메이션(프리젠테이션, 비잠금)만 담당.
 * 상세: context/components/interactive/floor-map.md · context/features/wayfinding.md
 */

// README §8 — 실측 축척 보정 전 추정값. > DECISION NEEDED.
const SCALE_M_PER_PX = 0.03;

type Status =
  | { kind: 'idle' }
  | { kind: 'pick-end'; startLabel: string }
  | { kind: 'same-room' }
  | { kind: 'transit'; via: EdgeType; floorLabel: string }
  | { kind: 'no-route' }
  | { kind: 'done'; fromLabel: string; toLabel: string; meters: number; via: EdgeType | null };

type RoomState = 'idle' | 'start' | 'end';

const MODE_OPTIONS: { mode: Mode; label: string; icon: typeof ArrowUpDown }[] = [
  { mode: 'elevator', label: '엘리베이터', icon: ArrowUpDown },
  { mode: 'stairs', label: '계단', icon: Footprints },
  { mode: 'any', label: '최단', icon: Zap },
];

const key = (floorId: FloorId, code: string) => `${floorId}:${code}`;
const floorScale = (floor: FloorData) => floor.viewBox[2] / 2097.64;

export function FloorMap() {
  const [floorId, setFloorId] = useState<FloorId>('B1');
  const [mode, setMode] = useState<Mode>('elevator');
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [animating, setAnimating] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [query, setQuery] = useState('');

  const graphRef = useRef<Graph | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const panzoomRef = useRef<HTMLDivElement | null>(null);
  const routesRef = useRef<Partial<Record<FloorId, SVGGElement | null>>>({});
  const markersRef = useRef<Partial<Record<FloorId, SVGGElement | null>>>({});
  const zoomState = useRef({ z: 1, tx: 0, ty: 0 });
  const runToken = useRef(0);

  const byFloor = useMemo(
    () => Object.fromEntries(FLOORS.map((f) => [f.id, f])) as Record<FloorId, FloorData>,
    []
  );
  const roomOf = useMemo(() => {
    const map = new Map<string, { floor: FloorData; room: Room }>();
    for (const f of FLOORS) for (const r of f.rooms) if (r.code) map.set(key(f.id, r.code), { floor: f, room: r });
    return map;
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return FLOORS.flatMap((f) =>
      f.rooms
        .filter((r) => r.sel && r.name.includes(q))
        .map((r) => ({ floorId: f.id, floorLabel: f.label, code: r.code, name: r.name }))
    ).slice(0, 8);
  }, [query]);

  // 접근성 — 경로 애니메이션은 motion-reduce 대응 필수 (context/design/06-motion.md)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // 보행경로(핑크) 마스크 로드 → 통합 격자 그래프 구성 (README §5)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const withMasks = await Promise.all(
          FLOORS.map(async (f) => ({ ...f, _mask: await loadMask(f.walk, f.cell ?? 12) }))
        );
        if (cancelled) return;
        graphRef.current = buildGraph(withMasks, FLOOR_ORDER);
        setReady(true);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyTransform = () => {
    const { z, tx, ty } = zoomState.current;
    if (panzoomRef.current) panzoomRef.current.style.transform = `translate(${tx}px,${ty}px) scale(${z})`;
  };
  const clampPan = (rect: { width: number; height: number }) => {
    const { z } = zoomState.current;
    zoomState.current.tx = Math.min(0, Math.max(rect.width - rect.width * z, zoomState.current.tx));
    zoomState.current.ty = Math.min(0, Math.max(rect.height - rect.height * z, zoomState.current.ty));
  };
  const zoomAt = (cx: number, cy: number, nz: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const z0 = zoomState.current.z;
    const z1 = Math.max(1, Math.min(5, nz));
    const lx = (cx - rect.left - zoomState.current.tx) / z0;
    const ly = (cy - rect.top - zoomState.current.ty) / z0;
    zoomState.current.tx = cx - rect.left - lx * z1;
    zoomState.current.ty = cy - rect.top - ly * z1;
    zoomState.current.z = z1;
    clampPan(rect);
    applyTransform();
  };
  const resetView = () => {
    zoomState.current = { z: 1, tx: 0, ty: 0 };
    applyTransform();
  };
  const zoomButton = (factor: number) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, zoomState.current.z * factor);
  };

  // 팬/줌 — 휠·드래그·핀치 (프로토타입 pointer-event 로직 포팅, 프리젠테이션 비잠금)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const pts = new Map<number, { x: number; y: number }>();
    let last: { x: number; y: number } | null = null;
    let startDist = 0;
    let startZ = 1;
    let moved = 0;
    let downPt: { x: number; y: number } | null = null;
    let panning = false;
    let suppressClick = false;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, zoomState.current.z * (e.deltaY < 0 ? 1.12 : 0.89));
    };
    const onDown = (e: PointerEvent) => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved = 0;
      downPt = { x: e.clientX, y: e.clientY };
      if (pts.size === 1) {
        last = { x: e.clientX, y: e.clientY };
        panning = false;
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        startDist = Math.hypot(a.x - b.x, a.y - b.y);
        startZ = zoomState.current.z;
        try {
          viewport.setPointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        zoomAt(mid.x, mid.y, startZ * (d / startDist));
        moved += 20;
      } else if (pts.size === 1 && last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        moved += Math.abs(dx) + Math.abs(dy);
        if (!panning && moved > 8) {
          panning = true;
          try {
            viewport.setPointerCapture(e.pointerId);
          } catch {
            /* noop */
          }
        }
        if (panning) {
          zoomState.current.tx += dx;
          zoomState.current.ty += dy;
          clampPan(viewport.getBoundingClientRect());
          applyTransform();
        }
        last = { x: e.clientX, y: e.clientY };
      }
    };
    const onUp = (e: PointerEvent) => {
      pts.delete(e.pointerId);
      if (downPt && Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) > 8) {
        suppressClick = true;
        setTimeout(() => {
          suppressClick = false;
        }, 60);
      }
      if (pts.size === 0) {
        last = null;
        panning = false;
      }
    };
    const onClickCapture = (e: MouseEvent) => {
      if (suppressClick) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerup', onUp);
    viewport.addEventListener('pointercancel', onUp);
    viewport.addEventListener('click', onClickCapture, { capture: true });
    return () => {
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('pointerdown', onDown);
      viewport.removeEventListener('pointermove', onMove);
      viewport.removeEventListener('pointerup', onUp);
      viewport.removeEventListener('pointercancel', onUp);
      viewport.removeEventListener('click', onClickCapture, { capture: true });
    };
    // 마운트 시 1회만 리스너 등록 — zoomAt은 ref만 참조해 재생성해도 동작 동일
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearRoute = () => {
    for (const fid of FLOOR_ORDER) {
      if (routesRef.current[fid]) routesRef.current[fid]!.innerHTML = '';
      if (markersRef.current[fid]) markersRef.current[fid]!.innerHTML = '';
    }
  };

  const drawMarker = (fid: FloorId, pt: Point, type: 'start' | 'end', scale: number) => {
    const g = markersRef.current[fid];
    if (!g) return;
    const NS = 'http://www.w3.org/2000/svg';
    const wrap = document.createElementNS(NS, 'g');
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', String(pt[0]));
    circle.setAttribute('cy', String(pt[1]));
    circle.setAttribute('r', String(13 * scale));
    circle.style.fill = type === 'start' ? 'rgb(var(--brand-support))' : 'rgb(var(--brand-accent))';
    circle.style.stroke = 'rgb(var(--brand-surface))';
    circle.style.strokeWidth = String(4 * scale);
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', String(pt[0]));
    text.setAttribute('y', String(pt[1] - 22 * scale));
    text.textContent = type === 'start' ? '출발' : '도착';
    text.style.textAnchor = 'middle';
    text.style.fontSize = `${21 * scale}px`;
    text.style.fontWeight = '800';
    text.style.fill = type === 'start' ? 'rgb(var(--brand-support))' : 'rgb(var(--brand-accent))';
    text.style.paintOrder = 'stroke';
    text.style.stroke = 'rgb(var(--brand-surface))';
    text.style.strokeWidth = String(5 * scale);
    wrap.appendChild(circle);
    wrap.appendChild(text);
    g.appendChild(wrap);
  };

  const drawSegment = (fid: FloorId, pts: Point[], scale: number, skipAnim: boolean): Promise<number> => {
    return new Promise((resolve) => {
      const g = routesRef.current[fid];
      if (!g) {
        resolve(0);
        return;
      }
      const NS = 'http://www.w3.org/2000/svg';
      const d = 'M ' + pts.map((p) => `${p[0]} ${p[1]}`).join(' L ');
      const casing = document.createElementNS(NS, 'path');
      const line = document.createElementNS(NS, 'path');
      for (const [p, w, color] of [
        [casing, 15 * scale, 'rgb(var(--brand-surface))'],
        [line, 8 * scale, 'rgb(var(--brand-accent))'],
      ] as const) {
        p.setAttribute('d', d);
        p.style.fill = 'none';
        p.style.stroke = color;
        p.style.strokeWidth = String(w);
        p.style.strokeLinecap = 'round';
        p.style.strokeLinejoin = 'round';
        g.appendChild(p);
      }
      const len = line.getTotalLength();
      if (skipAnim || len === 0) {
        resolve(len);
        return;
      }
      for (const p of [casing, line]) {
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
      }
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', String(9 * scale));
      dot.setAttribute('cx', String(pts[0][0]));
      dot.setAttribute('cy', String(pts[0][1]));
      dot.style.fill = 'rgb(var(--brand-accent))';
      dot.style.stroke = 'rgb(var(--brand-surface))';
      dot.style.strokeWidth = String(3 * scale);
      g.appendChild(dot);
      const dur = Math.min(3000, Math.max(900, len * 1.4));
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        const off = len * (1 - k);
        casing.style.strokeDashoffset = String(off);
        line.style.strokeDashoffset = String(off);
        const pt = line.getPointAtLength(len * k);
        dot.setAttribute('cx', String(pt.x));
        dot.setAttribute('cy', String(pt.y));
        if (k < 1) requestAnimationFrame(step);
        else {
          dot.remove();
          resolve(len);
        }
      };
      requestAnimationFrame(step);
    });
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const run = async (from: string, to: string, currentMode: Mode) => {
    const G = graphRef.current;
    if (!G) return;
    const token = ++runToken.current;
    try {
      const A = roomOf.get(from);
      const B = roomOf.get(to);
      if (!A || !B) return;
      clearRoute();

      const gA = G.info[A.floor.id];
      const gB = G.info[B.floor.id];
      const doorsOf = (r: Room) => r.doors ?? (r.door ? [r.door] : []);
      let best: ReturnType<typeof dijkstra> = null;
      let aDoor: Point | null = null;
      let bDoor: Point | null = null;
      for (const ad of doorsOf(A.room)) {
        for (const bd of doorsOf(B.room)) {
          const sCell = nearestCell(gA, ad);
          const eCell = nearestCell(gB, bd);
          if (sCell == null || eCell == null) continue;
          const res = dijkstra(G, `${A.floor.id}:${sCell}`, `${B.floor.id}:${eCell}`, currentMode);
          if (res && (!best || res.cost < best.cost)) {
            best = res;
            aDoor = ad;
            bDoor = bd;
          }
        }
      }
      if (!best || !aDoor || !bDoor) {
        setStatus({ kind: 'no-route' });
        return;
      }

      setAnimating(true);
      const path = best.path;
      const segs: { floor: FloorId; pts: Point[]; viaType: EdgeType | null }[] = [];
      for (const node of path) {
        const fid = node.id.split(':')[0] as FloorId;
        if (!segs.length || segs[segs.length - 1].floor !== fid) segs.push({ floor: fid, pts: [], viaType: node.viaType });
        segs[segs.length - 1].pts.push(G.pos[node.id].slice() as Point);
      }
      for (const s of segs) s.pts = simplify(G.info[s.floor], s.pts);
      segs[0].pts.unshift(aDoor.slice() as Point);
      segs[segs.length - 1].pts.push(bDoor.slice() as Point);
      const vmoves = segs.slice(1).map((s) => s.viaType).filter((t): t is EdgeType => !!t && t !== 'corridor');

      drawMarker(A.floor.id, aDoor, 'start', floorScale(A.floor));
      let total = 0;
      for (let i = 0; i < segs.length; i++) {
        if (runToken.current !== token) return;
        setFloorId(segs[i].floor);
        if (!reducedMotion) await sleep(300);
        if (runToken.current !== token) return;
        total += await drawSegment(segs[i].floor, segs[i].pts, floorScale(byFloor[segs[i].floor]), reducedMotion);
        if (i < segs.length - 1) {
          setStatus({ kind: 'transit', via: segs[i + 1].viaType ?? 'corridor', floorLabel: byFloor[segs[i + 1].floor].label });
          if (!reducedMotion) await sleep(900);
        }
      }
      if (runToken.current !== token) return;
      drawMarker(B.floor.id, bDoor, 'end', floorScale(B.floor));
      const meters = Math.max(5, Math.round((total * SCALE_M_PER_PX) / 5) * 5);
      setStatus({ kind: 'done', fromLabel: A.room.name, toLabel: B.room.name, meters, via: vmoves[0] ?? null });
    } finally {
      // 완료·무경로·취소 어느 경로로 끝나든 최신 실행이 animating을 정리 (영구 잠금 방지)
      if (runToken.current === token) setAnimating(false);
    }
  };

  useEffect(() => {
    if (ready && start && end) void run(start, end, mode);
    // mode 변경 시 기존 여정 재계산 (원본 setMode 동작과 동일)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, mode, ready]);

  const pick = (fid: FloorId, code: string) => {
    if (animating) return;
    const k = key(fid, code);
    if (!start || (start && end)) {
      clearRoute();
      setStart(k);
      setEnd(null);
      setStatus({ kind: 'pick-end', startLabel: roomOf.get(k)?.room.name ?? '' });
    } else if (k === start) {
      setStatus({ kind: 'same-room' });
    } else {
      setEnd(k);
    }
  };

  const reset = () => {
    runToken.current += 1; // 진행 중인 경로 애니메이션 취소
    clearRoute();
    setStart(null);
    setEnd(null);
    setAnimating(false);
    setStatus({ kind: 'idle' });
  };

  const selectViaSearch = (result: { floorId: FloorId; code: string }) => {
    setFloorId(result.floorId);
    pick(result.floorId, result.code);
    setQuery('');
  };

  const roomState = (fid: FloorId, code: string): RoomState => {
    const k = key(fid, code);
    if (k === start) return 'start';
    if (k === end) return 'end';
    return 'idle';
  };

  return (
    <div className="border border-brand-line bg-brand-surface">
      {/* 검색 */}
      <div className="border-b border-brand-line p-4 md:p-5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted"
            strokeWidth={1.5}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setQuery('');
              if (e.key === 'Enter' && searchResults[0]) {
                e.preventDefault();
                selectViaSearch(searchResults[0]);
              }
            }}
            placeholder="방·시설 이름으로 검색 (예: 비전홀, 식당)"
            aria-label="방·시설 검색"
            className="h-11 w-full border border-brand-line bg-brand-surface pl-9 pr-9 text-[13px] text-brand-ink placeholder:text-brand-ink-muted focus:border-brand-ink focus:outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-brand-ink-muted transition-colors duration-200 hover:text-brand-ink"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
          {query && (
            <ul className="absolute inset-x-0 top-full z-10 mt-1 border border-brand-line bg-brand-surface shadow-sm">
              {searchResults.length === 0 ? (
                <li className="px-4 py-2.5 text-[13px] text-brand-ink-muted">검색 결과가 없습니다.</li>
              ) : (
                searchResults.map((r) => (
                  <li key={`${r.floorId}:${r.code}`}>
                    <button
                      type="button"
                      onClick={() => selectViaSearch(r)}
                      aria-label={`검색결과: ${r.name} (${r.floorLabel})`}
                      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[13px] text-brand-ink transition-colors duration-200 hover:bg-brand-bg"
                    >
                      <span>{r.name}</span>
                      <span className="text-[11px] text-brand-ink-muted">{r.floorLabel}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* 컨트롤 바 */}
      <div className="flex flex-wrap items-center gap-3 border-b border-brand-line p-4 md:p-5">
        <span className="text-[11px] font-bold tracking-[0.3em] text-brand-ink-muted">이동수단</span>
        <div className="btn-square inline-flex overflow-hidden border border-brand-line">
          {MODE_OPTIONS.map(({ mode: m, label, icon: Icon }) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'flex h-11 items-center gap-1.5 border-l border-brand-line px-3 text-[12px] font-bold tracking-wide first:border-l-0 transition-colors duration-200',
                mode === m ? 'bg-brand-ink text-white' : 'bg-brand-surface text-brand-ink-muted hover:text-brand-ink'
              )}
              aria-pressed={mode === m}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={reset}
          className="btn-square ml-auto inline-flex h-11 items-center gap-1.5 border border-brand-line px-3 text-[12px] font-bold tracking-wide text-brand-ink-muted transition-colors duration-200 hover:text-brand-ink"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
          다시 선택
        </button>
      </div>

      {/* 층 탭 */}
      <div className="flex flex-wrap gap-2 border-b border-brand-line p-4 md:p-5">
        {FLOOR_ORDER.map((fid) => (
          <button
            key={fid}
            type="button"
            onClick={() => !animating && setFloorId(fid)}
            className={cn(
              'btn-square h-9 px-3 text-[12px] font-bold tracking-wide transition-colors duration-200',
              floorId === fid ? 'bg-brand-ink text-white' : 'border border-brand-line text-brand-ink-muted hover:text-brand-ink'
            )}
            aria-pressed={floorId === fid}
          >
            {byFloor[fid].label}
          </button>
        ))}
      </div>

      {/* 상태 안내 */}
      <div className="border-b border-brand-line px-4 py-3 text-[13px] leading-relaxed text-brand-ink md:px-5">
        <StatusText status={status} />
      </div>

      {/* 지도 */}
      <div
        ref={viewportRef}
        className="relative h-[380px] cursor-grab touch-none select-none overflow-hidden bg-brand-bg active:cursor-grabbing md:h-[520px]"
      >
        {!ready && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center text-[13px] text-brand-ink-muted">
            도면을 불러오는 중…
          </div>
        )}
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[13px] text-brand-ink-muted">
            지도를 불러오지 못했습니다. 새로고침해 주세요.
          </div>
        )}
        <div
          ref={panzoomRef}
          style={{ transformOrigin: '0 0' }}
          className={cn('h-full w-full', !ready && 'invisible')}
        >
          {FLOORS.map((floor) => {
            const [, , w, h] = floor.viewBox;
            return (
              <div
                key={floor.id}
                style={{ display: floor.id === floorId ? 'block' : 'none' }}
                className="h-full w-full"
              >
                <svg
                  viewBox={`0 0 ${w} ${h}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="block h-full w-full"
                  role="img"
                  aria-label={`${floor.label} 도면`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- SVG 배경은 <image>로 지도 씬그래프에 삽입(README §7) */}
                  <image href={floor.svg} x={0} y={0} width={w} height={h} />
                  <g>
                    {floor.rooms
                      .filter((r) => r.sel)
                      .map((r) => (
                        <RoomHotspot key={r.code} floorId={floor.id} room={r} state={roomState(floor.id, r.code)} onPick={pick} />
                      ))}
                  </g>
                  <g
                    ref={(el) => {
                      routesRef.current[floor.id] = el;
                    }}
                  />
                  <g
                    ref={(el) => {
                      markersRef.current[floor.id] = el;
                    }}
                  />
                </svg>
              </div>
            );
          })}
        </div>

        {/* 줌 컨트롤 */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
          {[
            { icon: ZoomIn, label: '확대', onClick: () => zoomButton(1.4) },
            { icon: ZoomOut, label: '축소', onClick: () => zoomButton(1 / 1.4) },
            { icon: Scan, label: '지도 원래대로', onClick: resetView },
          ].map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={onClick}
              className="btn-square flex h-11 w-11 items-center justify-center border border-brand-line bg-brand-surface text-brand-ink shadow-sm transition-colors duration-200 hover:border-brand-ink"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap items-center gap-4 p-4 text-[12px] text-brand-ink-muted md:p-5">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-support" /> 출발
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-accent" /> 도착
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-6 rounded-full bg-brand-accent" /> 안내 경로
        </span>
        <span>방을 두 번 선택하면 경로가 표시됩니다.</span>
      </div>
    </div>
  );
}

function StatusText({ status }: { status: Status }) {
  switch (status.kind) {
    case 'idle':
      return <span>지도에서 출발지를 선택하세요.</span>;
    case 'pick-end':
      return (
        <span>
          출발지: <strong className="text-brand-ink">{status.startLabel}</strong> — 도착지를 선택하세요.
        </span>
      );
    case 'same-room':
      return <span className="text-brand-accent">출발지와 같은 곳입니다. 다른 곳을 선택하세요.</span>;
    case 'transit':
      return (
        <span>
          {status.via === 'elevator' ? '엘리베이터' : '계단'}로 {status.floorLabel} 이동 중…
        </span>
      );
    case 'no-route':
      return <span className="text-brand-accent">해당 이동수단으로는 경로를 찾지 못했습니다. 이동수단을 바꿔보세요.</span>;
    case 'done':
      return (
        <span>
          <strong className="text-brand-ink">{status.fromLabel}</strong> →{' '}
          <strong className="text-brand-ink">{status.toLabel}</strong> 도착 · 도보 약 {status.meters}m
          {status.via ? ` · ${status.via === 'elevator' ? '엘리베이터' : '계단'} 이용` : ''}{' '}
          <span className="text-brand-ink-muted">(추정)</span>
        </span>
      );
  }
}

function RoomHotspot({
  floorId,
  room,
  state,
  onPick,
}: {
  floorId: FloorId;
  room: Room;
  state: RoomState;
  onPick: (floorId: FloorId, code: string) => void;
}) {
  const common = {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `${room.name}${room.hall ? ' 홀' : ''} ${state === 'idle' ? '선택' : state === 'start' ? '(출발지)' : '(도착지)'}`,
    className: cn(
      'cursor-pointer fill-transparent stroke-2 stroke-transparent outline-none transition-colors duration-200',
      'hover:fill-brand-ink/[0.06] focus-visible:stroke-brand-ink',
      state === 'start' && 'fill-brand-support/10 stroke-brand-support',
      state === 'end' && 'fill-brand-accent/10 stroke-brand-accent'
    ),
    onClick: () => onPick(floorId, room.code),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPick(floorId, room.code);
      }
    },
  };
  const area = room.area;
  if (area && 'rect' in area && area.rect) {
    const [x, y, w, h] = area.rect;
    return <rect x={x} y={y} width={w} height={h} rx={4} {...common} />;
  }
  if (area && 'circle' in area && area.circle) {
    const [cx, cy, r] = area.circle;
    return <circle cx={cx} cy={cy} r={r} {...common} />;
  }
  if (area && 'poly' in area && area.poly) {
    return <polygon points={area.poly.map((p) => p.join(',')).join(' ')} {...common} />;
  }
  const c = room.door ?? room.doors?.[0] ?? [0, 0];
  return <circle cx={c[0]} cy={c[1]} r={40} {...common} />;
}
