/**
 * 실내 길찾기 라우팅 엔진 — prototypes/wayfind/lib/wayfind.js 의 순수 함수 포팅.
 * 알고리즘·좌표 처리는 잠긴 결정(context/features/wayfinding.md)이라 그대로 유지.
 * DOM 렌더·팬줌·애니메이션은 components/interactive/floor-map.tsx 에서 재작성.
 */
import type { EdgeType, FloorData, FloorId, Graph, Mask, Mode, PathResult, Point } from './types';

const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** 핑크(255,64,255) 보행경로 PNG → walkable 격자 마스크. */
export function loadMask(url: string, cell: number): Promise<Mask> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const W = img.width;
      const H = img.height;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      const D = ctx.getImageData(0, 0, W, H).data;
      const gw = Math.ceil(W / cell);
      const gh = Math.ceil(H / cell);
      const walk = new Uint8Array(gw * gh);
      for (let gy = 0; gy < gh; gy++) {
        for (let gx = 0; gx < gw; gx++) {
          let hit = false;
          for (let y = gy * cell; y < Math.min(H, gy * cell + cell) && !hit; y += 3) {
            for (let x = gx * cell; x < Math.min(W, gx * cell + cell) && !hit; x += 3) {
              const i = (y * W + x) * 4;
              if (D[i] > 200 && D[i + 1] < 150 && D[i + 2] > 150 && D[i] - D[i + 1] > 80) hit = true;
            }
          }
          walk[gy * gw + gx] = hit ? 1 : 0;
        }
      }
      resolve({ C: cell, gw, gh, walk });
    };
    img.onerror = () => reject(new Error('walk mask load fail: ' + url));
    img.src = url;
  });
}

/** 좌표 → 가장 가까운 walkable 셀 인덱스 (비어 있으면 링 확장 탐색). */
export function nearestCell(g: Mask, pt: Point): number | null {
  const { gw, gh, C, walk } = g;
  let gx = Math.floor(pt[0] / C);
  let gy = Math.floor(pt[1] / C);
  gx = Math.max(0, Math.min(gw - 1, gx));
  gy = Math.max(0, Math.min(gh - 1, gy));
  if (walk[gy * gw + gx]) return gy * gw + gx;
  for (let r = 1; r < 30; r++) {
    let best: number | null = null;
    let bestD = 1e9;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
        if (!walk[ny * gw + nx]) continue;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = ny * gw + nx;
        }
      }
    }
    if (best != null) return best;
  }
  return null;
}

/** 층별 격자 + 층간 transfer 를 하나의 그래프로 합친다. order 상 인접 층끼리만 연결. */
export function buildGraph(floors: (FloorData & { _mask: Mask })[], order: FloorId[]): Graph {
  const adj: Graph['adj'] = {};
  const pos: Graph['pos'] = {};
  const info = {} as Graph['info'];
  const add = (a: string, b: string, w: number, type: EdgeType) => {
    (adj[a] = adj[a] || []).push([b, w, type]);
    (adj[b] = adj[b] || []).push([a, w, type]);
  };

  for (const f of floors) {
    const g = f._mask;
    info[f.id] = g;
    const { gw, gh, C, walk } = g;
    for (let gy = 0; gy < gh; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        const idx = gy * gw + gx;
        if (!walk[idx]) continue;
        const id = `${f.id}:${idx}`;
        pos[id] = [(gx + 0.5) * C, (gy + 0.5) * C];
        for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]] as const) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          const nidx = ny * gw + nx;
          if (!walk[nidx]) continue;
          add(id, `${f.id}:${nidx}`, Math.hypot(dx, dy) * C, 'corridor');
        }
      }
    }
  }

  const byId: Record<string, { f: FloorData; at: Point; kind: EdgeType }[]> = {};
  for (const f of floors) {
    for (const t of f.transfers) {
      (byId[t.id] = byId[t.id] || []).push({ f, at: t.at, kind: t.kind });
    }
  }
  for (const id in byId) {
    const list = byId[id].sort((p, q) => order.indexOf(p.f.id) - order.indexOf(q.f.id));
    for (let i = 0; i < list.length - 1; i++) {
      const A = list[i];
      const B = list[i + 1];
      if (Math.abs(order.indexOf(A.f.id) - order.indexOf(B.f.id)) !== 1) continue;
      const ca = nearestCell(info[A.f.id], A.at);
      const cb = nearestCell(info[B.f.id], B.at);
      if (ca != null && cb != null) add(`${A.f.id}:${ca}`, `${B.f.id}:${cb}`, 40, A.kind);
    }
  }
  return { adj, pos, info };
}

function allowed(type: EdgeType, mode: Mode) {
  if (type === 'corridor') return true;
  if (mode === 'any') return true;
  return type === mode;
}

/** 다익스트라 (이동수단 필터). transfer 간선엔 환승 패널티(60)를 더한다. */
export function dijkstra(G: Graph, s: string, t: string, mode: Mode): PathResult | null {
  const dis: Record<string, number> = {};
  const prev: Record<string, [string, EdgeType]> = {};
  const Q = new Set(Object.keys(G.adj));
  if (!Q.has(s) || !Q.has(t)) return null;
  for (const k of Q) dis[k] = Infinity;
  dis[s] = 0;
  while (Q.size) {
    let u: string | null = null;
    let best = Infinity;
    for (const k of Q) {
      if (dis[k] < best) {
        best = dis[k];
        u = k;
      }
    }
    if (u === null || u === t) break;
    Q.delete(u);
    for (const [v, w, type] of G.adj[u]) {
      if (!Q.has(v) || !allowed(type, mode)) continue;
      const nd = dis[u] + w + (type !== 'corridor' ? 60 : 0);
      if (nd < dis[v]) {
        dis[v] = nd;
        prev[v] = [u, type];
      }
    }
  }
  if (dis[t] === Infinity) return null;
  const path: PathResult['path'] = [];
  let c: string | undefined = t;
  while (c !== undefined) {
    const p: [string, EdgeType] | undefined = prev[c];
    path.unshift({ id: c, viaType: p ? p[1] : null });
    c = p ? p[0] : undefined;
  }
  return { path, cost: dis[t] };
}

function losClear(g: Mask, a: Point, b: Point) {
  const { C, gw, gh, walk } = g;
  const steps = Math.ceil(dist(a, b) / (C * 0.4));
  for (let i = 0; i <= steps; i++) {
    const x = a[0] + ((b[0] - a[0]) * i) / steps;
    const y = a[1] + ((b[1] - a[1]) * i) / steps;
    const gx = Math.floor(x / C);
    const gy = Math.floor(y / C);
    if (gx < 0 || gy < 0 || gx >= gw || gy >= gh || !walk[gy * gw + gx]) return false;
  }
  return true;
}

/** LOS(시선) 단순화 — 핑크 길을 그대로 따라가는 자연스러운 폴리라인으로 축약. */
export function simplify(g: Mask, pts: Point[]): Point[] {
  if (pts.length <= 2) return pts;
  const out: Point[] = [pts[0]];
  let i = 0;
  while (i < pts.length - 1) {
    let j = pts.length - 1;
    for (; j > i + 1; j--) if (losClear(g, pts[i], pts[j])) break;
    out.push(pts[j]);
    i = j;
  }
  return out;
}
