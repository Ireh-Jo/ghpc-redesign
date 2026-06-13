/* 경향교회 실내 길찾기 엔진 (프로토타입) — 격자(grid) 라우팅
 * - 배경: 원본 .ai → pdftocairo 벡터 SVG (svg/*.svg) 를 <image>로 정밀 표시
 * - 보행경로: 사용자가 핑크로 칠한 길을 픽셀 추출한 walkMask(격자)를 그래프로 사용
 * - 라우팅: 격자 8-이웃 그래프 + 다익스트라 + LOS(시선) 경로 단순화 → 핑크 길을 그대로 따라감
 * - 이동수단(계단/엘베) 선택: 층간 transfer 간선의 종류를 필터
 *
 * 본 개발 이전 대비: 로직/렌더와 데이터(data/*.js) 분리. React 이전 시 글루만 재작성.
 */
(function (global) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const el = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 핑크 보행경로 PNG → walkable 격자 {C,gw,gh,walk}. 핑크 = (255,64,255) 근사.
  function loadMask(url, C) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const W = img.width, Hh = img.height;
        const cv = document.createElement('canvas'); cv.width = W; cv.height = Hh;
        const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0);
        const D = cx.getImageData(0, 0, W, Hh).data;
        const gw = Math.ceil(W / C), gh = Math.ceil(Hh / C), walk = new Uint8Array(gw * gh);
        for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) {
          let hit = false;
          for (let y = gy * C; y < Math.min(Hh, gy * C + C) && !hit; y += 3)
            for (let x = gx * C; x < Math.min(W, gx * C + C) && !hit; x += 3) {
              const i = (y * W + x) * 4;
              if (D[i] > 200 && D[i + 1] < 150 && D[i + 2] > 150 && (D[i] - D[i + 1]) > 80) hit = true;
            }
          walk[gy * gw + gx] = hit ? 1 : 0;
        }
        res({ C, gw, gh, walk });
      };
      img.onerror = () => rej(new Error('walk mask load fail: ' + url));
      img.src = url + (url.indexOf('?') < 0 ? '?t=' + Date.now() : '');
    });
  }

  /* ---------- 통합 격자 그래프 ----------
   * 각 층 walkMask 의 walkable 셀 = 노드("F:idx"). 8-이웃 연결(corridor).
   * 층간: 같은 transfer.id 가 인접 두 층에 있으면, 각 층에서 transfer.at 의 가장 가까운
   *       walkable 셀끼리 수직 간선(stairs/elevator)으로 연결.
   */
  function buildGraph(floors, order) {
    const adj = {}, pos = {}, info = {};   // info[fid] = {C,gw,gh,walk}
    const add = (a, b, w, type) => { (adj[a] = adj[a] || []).push([b, w, type]); (adj[b] = adj[b] || []).push([a, w, type]); };
    const ctr = (f, idx) => { const g = info[f]; const gx = idx % g.gw, gy = (idx / g.gw) | 0; return [(gx + 0.5) * g.C, (gy + 0.5) * g.C]; };

    for (const f of floors) {
      const g = f._mask;             // load() 에서 미리 채워둠
      info[f.id] = g;
      const { gw, gh, C, walk } = g;
      for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) {
        const idx = gy * gw + gx; if (!walk[idx]) continue;
        const id = `${f.id}:${idx}`; pos[id] = [(gx + 0.5) * C, (gy + 0.5) * C];
        // 8-이웃 (오른쪽/아래/대각만 추가 → 중복 방지)
        for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
          const nx = gx + dx, ny = gy + dy; if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          const nidx = ny * gw + nx; if (!walk[nidx]) continue;
          // 대각은 양옆 셀 하나라도 walkable해야(벽 모서리 관통 방지 완화)
          add(id, `${f.id}:${nidx}`, Math.hypot(dx, dy) * C, 'corridor');
        }
      }
    }
    // 층간 transfer 연결
    const byId = {};
    for (const f of floors) for (const x of (f.transfers || [])) (byId[x.id] = byId[x.id] || []).push({ f, x });
    for (const id in byId) {
      const list = byId[id].sort((p, q) => order.indexOf(p.f.id) - order.indexOf(q.f.id));
      for (let i = 0; i < list.length - 1; i++) {
        const A = list[i], B = list[i + 1];
        if (Math.abs(order.indexOf(A.f.id) - order.indexOf(B.f.id)) !== 1) continue;
        const ca = nearestCell(info[A.f.id], A.x.at), cb = nearestCell(info[B.f.id], B.x.at);
        if (ca != null && cb != null) add(`${A.f.id}:${ca}`, `${B.f.id}:${cb}`, 40, A.x.kind);
      }
    }
    return { adj, pos, info, ctr };
  }

  // 좌표 → 가장 가까운 walkable 셀 인덱스 (셀이 비었으면 링 확장 탐색)
  function nearestCell(g, pt) {
    const { gw, gh, C, walk } = g;
    let gx = Math.floor(pt[0] / C), gy = Math.floor(pt[1] / C);
    gx = Math.max(0, Math.min(gw - 1, gx)); gy = Math.max(0, Math.min(gh - 1, gy));
    if (walk[gy * gw + gx]) return gy * gw + gx;
    for (let r = 1; r < 30; r++) {
      let best = null, bestd = 1e9;
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const nx = gx + dx, ny = gy + dy; if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
        if (!walk[ny * gw + nx]) continue;
        const d = dx * dx + dy * dy; if (d < bestd) { bestd = d; best = ny * gw + nx; }
      }
      if (best != null) return best;
    }
    return null;
  }

  function allowed(type, mode) {
    if (type === 'corridor') return true;
    if (mode === 'any') return true;
    if (mode === 'elevator') return type === 'elevator';
    if (mode === 'stairs') return type === 'stairs';
    return true;
  }

  function dijkstra(G, s, t, mode) {
    const dis = {}, prev = {}, Q = new Set(Object.keys(G.adj));
    if (!Q.has(s) || !Q.has(t)) return null;
    for (const k of Q) dis[k] = Infinity; dis[s] = 0;
    while (Q.size) {
      let u = null, best = Infinity;
      for (const k of Q) if (dis[k] < best) { best = dis[k]; u = k; }
      if (u === null || u === t) break; Q.delete(u);
      for (const [v, w, type] of G.adj[u]) {
        if (!Q.has(v) || !allowed(type, mode)) continue;
        const nd = dis[u] + w + (type !== 'corridor' ? 60 : 0);
        if (nd < dis[v]) { dis[v] = nd; prev[v] = [u, type]; }
      }
    }
    if (dis[t] === Infinity) return null;
    const path = []; let c = t;
    while (c !== undefined) { const p = prev[c]; path.unshift({ id: c, viaType: p ? p[1] : null }); c = p ? p[0] : undefined; }
    return { path, cost: dis[t] };
  }

  // LOS 단순화: 격자 위 직선이 walkable 셀만 지나면 중간점 생략 → 자연스러운 경로
  function losClear(g, a, b) {
    const { C, gw, gh, walk } = g, steps = Math.ceil(dist(a, b) / (C * 0.4));
    for (let i = 0; i <= steps; i++) {
      const x = a[0] + (b[0] - a[0]) * i / steps, y = a[1] + (b[1] - a[1]) * i / steps;
      const gx = Math.floor(x / C), gy = Math.floor(y / C);
      if (gx < 0 || gy < 0 || gx >= gw || gy >= gh || !walk[gy * gw + gx]) return false;
    }
    return true;
  }
  function simplify(g, pts) {
    if (pts.length <= 2) return pts;
    const out = [pts[0]]; let i = 0;
    while (i < pts.length - 1) {
      let j = pts.length - 1;
      for (; j > i + 1; j--) if (losClear(g, pts[i], pts[j])) break;
      out.push(pts[j]); i = j;
    }
    return out;
  }

  class Wayfinder {
    constructor(opts) {
      this.floors = opts.floors;
      this.order = opts.order || this.floors.map(f => f.id);
      this.scaleMPerPx = opts.scaleMPerPx || 0.03;
      this.mode = opts.mode || 'elevator';
      this.cellSize = opts.cellSize || 12;
      this.byFloor = {}; this.floors.forEach(f => this.byFloor[f.id] = f);
      this.roomOf = {};
      this.floors.forEach(f => f.rooms.forEach(r => { if (r.code) this.roomOf[`${f.id}:${r.code}`] = { floor: f, room: r }; }));
      this.svgs = {};
      const present = new Set(this.floors.map(f => f.id));
      this.cur = this.order.find(id => present.has(id)) || this.floors[0].id;
      this.start = null; this.end = null; this.animating = false;
      this._cb = opts.onStatus || (() => { });
    }

    // 핑크 보행경로 PNG들을 로드해 격자 그래프 구성 (mountFloors 전에 await)
    async load() {
      await Promise.all(this.floors.map(async f => { f._mask = await loadMask(f.walk, f.cell || this.cellSize); }));
      this.G = buildGraph(this.floors, this.order);
      return this;
    }

    mountFloors(container) {
      const pz = document.createElement('div');
      pz.className = 'panzoom'; pz.style.transformOrigin = '0 0';
      container.appendChild(pz); this.pz = pz; this._z = 1; this._tx = 0; this._ty = 0;
      this._initPanZoom(container, pz);
      for (const f of this.floors) {
        const [, , w, h] = f.viewBox;
        const wrap = document.createElement('div');
        wrap.className = 'floor'; wrap.dataset.floor = f.id;
        wrap.style.display = f.id === this.cur ? 'block' : 'none';
        const svg = el('svg', { viewBox: f.viewBox.join(' '), width: w, height: h, preserveAspectRatio: 'xMidYMid meet' });
        if (f.display) { svg.style.width = (f.display * 100) + '%'; svg.style.margin = '0 auto'; }  // 층별 표시 축소(F1/F2)
        const img = el('image', { x: 0, y: 0, width: w, height: h }); img.setAttribute('href', f.svg);
        svg.appendChild(img);
        svg.appendChild(el('g', { class: 'rooms' }));
        svg.appendChild(el('g', { class: 'routes' }));
        svg.appendChild(el('g', { class: 'markers' }));
        const rg = svg.querySelector('.rooms');
        for (const r of f.rooms) {
          if (!r.sel) continue;
          const hot = this._areaShape(r);
          hot.setAttribute('class', 'hotspot'); hot.dataset.floor = f.id; hot.dataset.code = r.code;
          rg.appendChild(hot);
          hot.addEventListener('click', () => { if (this._suppressClick) return; this.pick(f.id, r.code); });
        }
        wrap.appendChild(svg); pz.appendChild(wrap); this.svgs[f.id] = svg;
      }
    }

    _areaShape(r) {
      const a = r.area;
      if (a && a.rect) return el('rect', { x: a.rect[0], y: a.rect[1], width: a.rect[2], height: a.rect[3], rx: 4 });
      if (a && a.circle) return el('circle', { cx: a.circle[0], cy: a.circle[1], r: a.circle[2] });
      if (a && a.poly) return el('polygon', { points: a.poly.map(p => p.join(',')).join(' ') });
      const c = r.door || [0, 0];
      return el('circle', { cx: c[0], cy: c[1], r: 40 });
    }

    /* pan/zoom */
    _applyTransform() { this.pz.style.transform = `translate(${this._tx}px,${this._ty}px) scale(${this._z})`; }
    resetView() { this._z = 1; this._tx = 0; this._ty = 0; this._applyTransform(); }
    _zoomCenter(cx, cy, factor) {
      const r = this._viewport.getBoundingClientRect(), z0 = this._z, z1 = Math.max(1, Math.min(5, z0 * factor));
      const lx = (cx - r.left - this._tx) / z0, ly = (cy - r.top - this._ty) / z0;
      this._tx = (cx - r.left) - lx * z1; this._ty = (cy - r.top) - ly * z1; this._z = z1;
      this._clampPan(r); this._applyTransform();
    }
    _clampPan(r) {
      const w = r.width, h = r.height, z = this._z;
      this._tx = Math.min(0, Math.max(w - w * z, this._tx)); this._ty = Math.min(0, Math.max(h - h * z, this._ty));
    }
    _initPanZoom(viewport, pz) {
      this._viewport = viewport; const pts = new Map();
      let last = null, startDist = 0, startZ = 1, moved = 0, downPt = null, panning = false;
      const rect = () => viewport.getBoundingClientRect();
      this._suppressClick = false;
      const zoomAt = (cx, cy, nz) => {
        const r = rect(), z0 = this._z, z1 = Math.max(1, Math.min(5, nz));
        const lx = (cx - r.left - this._tx) / z0, ly = (cy - r.top - this._ty) / z0;
        this._tx = (cx - r.left) - lx * z1; this._ty = (cy - r.top) - ly * z1; this._z = z1;
        this._clampPan(r); this._applyTransform();
      };
      viewport.addEventListener('wheel', (e) => { e.preventDefault(); zoomAt(e.clientX, e.clientY, this._z * (e.deltaY < 0 ? 1.12 : 0.89)); }, { passive: false });
      viewport.addEventListener('pointerdown', (e) => {
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0; downPt = { x: e.clientX, y: e.clientY };
        if (pts.size === 1) { last = { x: e.clientX, y: e.clientY }; panning = false; }
        else if (pts.size === 2) { const [a, b] = [...pts.values()]; startDist = Math.hypot(a.x - b.x, a.y - b.y); startZ = this._z; try { viewport.setPointerCapture(e.pointerId); } catch (_) { } }
      });
      viewport.addEventListener('pointermove', (e) => {
        if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; zoomAt(mid.x, mid.y, startZ * (d / startDist)); moved += 20; }
        else if (pts.size === 1 && last) {
          const dx = e.clientX - last.x, dy = e.clientY - last.y; moved += Math.abs(dx) + Math.abs(dy);
          if (!panning && moved > 8) { panning = true; try { viewport.setPointerCapture(e.pointerId); } catch (_) { } }
          if (panning) { this._tx += dx; this._ty += dy; this._clampPan(rect()); this._applyTransform(); }
          last = { x: e.clientX, y: e.clientY };
        }
      });
      const up = (e) => {
        pts.delete(e.pointerId);
        if (downPt && Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) > 8) { this._suppressClick = true; setTimeout(() => this._suppressClick = false, 60); }
        if (pts.size === 0) { last = null; panning = false; }
      };
      viewport.addEventListener('pointerup', up); viewport.addEventListener('pointercancel', up);
    }

    showFloor(id) { this.cur = id; for (const fid in this.svgs) this.svgs[fid].parentNode.style.display = (fid === id ? 'block' : 'none'); if (this._onFloor) this._onFloor(id); }
    setMode(m) { this.mode = m; if (this.start && this.end) this.run(); }

    pick(floorId, code) {
      if (this.animating) return;
      const key = `${floorId}:${code}`;
      if (!this.start || (this.start && this.end)) {
        this.clear(); this.start = key; this.end = null;
        this._cb(`출발지: <b>${esc(this.byFloor[floorId].short)} ${esc(this.roomOf[key].room.name)}</b> — 도착지를 선택하세요.`);
        this._hl(key, 'start');
      } else { if (key === this.start) { this._cb('⚠️ 출발지와 같은 곳입니다.'); return; } this.end = key; this.run(); }
    }
    clear() { for (const fid in this.svgs) { this.svgs[fid].querySelector('.routes').innerHTML = ''; this.svgs[fid].querySelector('.markers').innerHTML = ''; } document.querySelectorAll('.hl-start,.hl-end').forEach(n => n.classList.remove('hl-start', 'hl-end')); }
    reset() { this.clear(); this.start = this.end = null; this._cb('지도에서 출발지를 선택하세요.'); }
    _hl(key, type) { const [f, code] = key.split(':'); const n = this.svgs[f].querySelector(`.hotspot[data-code="${CSS.escape(code)}"]`); if (n) n.classList.add(type === 'start' ? 'hl-start' : 'hl-end'); }
    _marker(floorId, pt, type) {
      const g = el('g', { class: 'marker ' + type }); g.appendChild(el('circle', { cx: pt[0], cy: pt[1], r: 13 }));
      const t = el('text', { x: pt[0], y: pt[1] - 22 }); t.textContent = type === 'start' ? '출발' : '도착'; g.appendChild(t);
      this.svgs[floorId].querySelector('.markers').appendChild(g);
    }
    _segment(floorId, pts) {
      return new Promise(res => {
        const g = this.svgs[floorId].querySelector('.routes');
        const d = 'M ' + pts.map(p => `${p[0]} ${p[1]}`).join(' L ');
        const casing = el('path', { d, class: 'route-casing' }), line = el('path', { d, class: 'route-line' });
        g.appendChild(casing); g.appendChild(line);
        const len = line.getTotalLength();
        for (const p of [casing, line]) { p.style.strokeDasharray = len; p.style.strokeDashoffset = len; }
        const dot = el('circle', { r: 9, class: 'route-dot', cx: pts[0][0], cy: pts[0][1] }); g.appendChild(dot);
        const dur = Math.min(3000, Math.max(900, len * 1.4)), t0 = performance.now();
        (function step(t) {
          const k = Math.min(1, (t - t0) / dur), off = len * (1 - k);
          casing.style.strokeDashoffset = off; line.style.strokeDashoffset = off;
          const pt = line.getPointAtLength(len * k); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
          if (k < 1) requestAnimationFrame(step); else { dot.remove(); res(len); }
        })(t0);
      });
    }

    async run() {
      if (this.animating || !this.start || !this.end) return;
      const A = this.roomOf[this.start], B = this.roomOf[this.end];
      this.clear(); this._hl(this.start, 'start'); this._hl(this.end, 'end');
      const gA = this.G.info[A.floor.id], gB = this.G.info[B.floor.id];
      // 다중 입구(doors): 모든 (출발도어×도착도어) 조합을 라우팅해 최단 유효경로 선택
      const doorsOf = r => r.doors || [r.door];
      let best = null, aDoor = null, bDoor = null;
      for (const ad of doorsOf(A.room)) for (const bd of doorsOf(B.room)) {
        const sCell = nearestCell(gA, ad), eCell = nearestCell(gB, bd);
        if (sCell == null || eCell == null) continue;
        const res = dijkstra(this.G, `${A.floor.id}:${sCell}`, `${B.floor.id}:${eCell}`, this.mode);
        if (res && (!best || res.cost < best.cost)) { best = res; aDoor = ad; bDoor = bd; }
      }
      if (!best) { this._cb('⚠️ 해당 이동수단으로는 경로를 찾지 못했습니다. 이동수단을 바꿔보세요.'); return; }
      const path = best.path;
      this.animating = true;

      // 층별 구간 분할
      const segs = []; const vmoves = [];
      for (let i = 0; i < path.length; i++) {
        const fid = path[i].id.split(':')[0];
        if (!segs.length || segs[segs.length - 1].floor !== fid) segs.push({ floor: fid, pts: [], viaType: path[i].viaType });
        segs[segs.length - 1].pts.push(this.G.pos[path[i].id].slice());
        if (path[i].viaType && path[i].viaType !== 'corridor') vmoves.push(path[i].viaType);
      }
      // 각 층 구간 LOS 단순화 + 방 도어 부착
      for (const s of segs) s.pts = simplify(this.G.info[s.floor], s.pts);
      segs[0].pts.unshift(aDoor.slice());
      segs[segs.length - 1].pts.push(bDoor.slice());

      this._marker(A.floor.id, aDoor, 'start');
      let total = 0;
      for (let i = 0; i < segs.length; i++) {
        this.showFloor(segs[i].floor); await sleep(350);
        total += await this._segment(segs[i].floor, segs[i].pts);
        if (i < segs.length - 1) {
          const via = segs[i + 1].viaType === 'elevator' ? '🛗 엘리베이터' : '🪜 계단';
          this._cb(`${via} 로 ${esc(this.byFloor[segs[i + 1].floor].label)} 이동 중…`); await sleep(1100);
        }
      }
      this._marker(B.floor.id, bDoor, 'end');
      const meters = Math.max(5, Math.round(total * this.scaleMPerPx / 5) * 5);
      const via = vmoves.length ? ` · ${vmoves[0] === 'elevator' ? '엘리베이터' : '계단'} 이용` : '';
      this._cb(`✅ <b>${esc(A.room.name)}</b> → <b>${esc(B.room.name)}</b> 도착 · 도보 약 ${meters}m${via} <span style="color:#94a3b8">(추정)</span>`);
      this.animating = false;
    }
  }

  global.Wayfinder = Wayfinder;
})(window);
