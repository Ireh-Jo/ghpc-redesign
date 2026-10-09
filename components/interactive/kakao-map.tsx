'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * 카카오맵 지도 + 다중 마커·이름표. 상세: context/components/interactive/kakao-map.md
 *
 * - 키(`NEXT_PUBLIC_KAKAO_MAP_KEY`)가 없으면 스크립트를 부르지 않고 처음부터 `fallback`.
 * - 섹션이 화면 근처에 올 때만 SDK를 로드한다 — 첫 화면 무게에 안 들어간다.
 * - 스크롤을 가두지 않는다: 휠·핀치 확대 끔(대신 줌 버튼), 터치 기기는 드래그도 끔.
 * - 로드 실패(키·도메인 미등록·네트워크)면 `fallback`으로 바꾼다 — 빈 회색 상자를 남기지 않는다.
 * 외부 스크립트 기록: guardrails/03-tech-constraints.md
 */

type Point = { name: string; lat: number; lng: number };

/* 카카오 SDK에서 쓰는 만큼만 타입을 적는다 */
type KakaoLatLng = object;
type KakaoMapInstance = {
  setZoomable(v: boolean): void;
  setDraggable(v: boolean): void;
  addControl(control: object, position: number): void;
};
type KakaoMaps = {
  load(cb: () => void): void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (el: HTMLElement, opts: { center: KakaoLatLng; level: number }) => KakaoMapInstance;
  Marker: new (opts: { position: KakaoLatLng; map: KakaoMapInstance }) => object;
  CustomOverlay: new (opts: { position: KakaoLatLng; content: string; yAnchor: number; map: KakaoMapInstance }) => object;
  ZoomControl: new () => object;
  ControlPosition: { RIGHT: number };
};
declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

const KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
const SDK_ID = 'kakao-map-sdk';

/** SDK 스크립트를 한 번만 붙이고, `kakao.maps.load` 완료까지 기다린다 */
function loadSdk(key: string): Promise<KakaoMaps> {
  return new Promise((resolve, reject) => {
    const ready = () => (window.kakao?.maps ? window.kakao.maps.load(() => resolve(window.kakao!.maps)) : reject());
    const existing = document.getElementById(SDK_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.kakao?.maps) ready();
      else existing.addEventListener('load', ready, { once: true });
      existing.addEventListener('error', () => reject(), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = SDK_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`;
    script.onload = ready;
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

/** 이름표 HTML — CustomOverlay는 문자열을 받는다. 클래스는 Tailwind가 이 파일을 스캔해 생성한다 */
const label = (name: string) =>
  `<div class="mb-12 whitespace-nowrap rounded-lg bg-brand-ink px-2.5 py-1 text-[12px] font-bold text-white shadow">${name}</div>`;

export function KakaoMap({
  center,
  points,
  fallback,
  level = { desktop: 2, mobile: 4 },
}: {
  center: { lat: number; lng: number };
  points: Point[];
  fallback: ReactNode;
  level?: { desktop: number; mobile: number };
}) {
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!KEY);

  useEffect(() => {
    if (!KEY || !box.current) return;
    const el = box.current;
    let cancelled = false;

    const init = async () => {
      try {
        const maps = await loadSdk(KEY);
        if (cancelled) return;
        const small = window.matchMedia('(max-width: 767px)').matches;
        const map = new maps.Map(el, {
          center: new maps.LatLng(center.lat, center.lng),
          level: small ? level.mobile : level.desktop,
        });
        // 페이지 스크롤을 지도가 가로채지 않게 — 휠·핀치 확대 끔, 터치 기기는 끌기도 끔
        map.setZoomable(false);
        if (window.matchMedia('(pointer: coarse)').matches) map.setDraggable(false);
        map.addControl(new maps.ZoomControl(), maps.ControlPosition.RIGHT);
        for (const p of points) {
          const position = new maps.LatLng(p.lat, p.lng);
          new maps.Marker({ position, map });
          new maps.CustomOverlay({ position, content: label(p.name), yAnchor: 1, map });
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    // 화면 근처(+300px)에 오면 그때 로드
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          void init();
        }
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [center.lat, center.lng, points, level.desktop, level.mobile]);

  if (failed) return <>{fallback}</>;

  return (
    <div
      ref={box}
      role="img"
      aria-label={`지도: ${points.map((p) => p.name).join(', ')}`}
      className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-line bg-brand-subtle md:aspect-[16/9]"
    />
  );
}
