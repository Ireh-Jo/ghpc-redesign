import { ArrowUpRight, Bus, Car, MapPin, Navigation, TrainFront } from 'lucide-react';
import { KakaoMap } from '@/components/interactive/kakao-map';
import { BUILDINGS, BUS, MAP_CENTER, MAP_LINKS, PARKING, SUBWAY, routeTo } from '@/lib/directions';

/**
 * 오시는 길 본문 — 지도 · 지도 앱 버튼 · 건물 3곳 · 대중교통 · 주차.
 * 출처: 현행 사이트 Page/Index/36 (2026-10-09). 데이터: `lib/directions.ts`. 상세: context/components/content/directions.md
 * 실내 길찾기(`FloorMap`)는 페이지가 이 아래에 붙인다.
 */
export function Directions() {
  return (
    <div>
      <KakaoMap
        center={MAP_CENTER}
        points={BUILDINGS.map((b) => ({ name: b.name, lat: b.lat, lng: b.lng }))}
        fallback={<MapFallback />}
      />

      {/* 지도 앱 바로가기 — 지도가 떠 있어도 항상 둔다 (모바일은 앱이 더 편하다) */}
      <ul className="mt-4 flex flex-wrap gap-2">
        <li>
          <AppLink href={MAP_LINKS.kakaoRoute} label="카카오맵 길찾기" primary icon />
        </li>
        <li>
          <AppLink href={MAP_LINKS.kakaoView} label="카카오맵에서 보기" />
        </li>
        <li>
          <AppLink href={MAP_LINKS.naver} label="네이버지도" />
        </li>
      </ul>

      {/* 건물 3곳 */}
      <ul className="mt-8 grid gap-3 md:grid-cols-3 md:gap-4">
        {BUILDINGS.map((b) => (
          <li
            key={b.name}
            className={`flex flex-col rounded-2xl border p-5 ${
              b.main ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-line bg-brand-surface'
            }`}
          >
            <p className="flex items-center gap-1.5 text-[17px] font-bold text-brand-ink">
              <MapPin className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden />
              {b.name}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-brand-ink-muted md:text-[15px]">
              <span className="tabular-nums">{b.postcode}</span> {b.address}
            </p>
            <a
              href={routeTo(b)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-bold text-brand-accent transition-colors duration-200 hover:text-brand-ink"
            >
              길찾기
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(카카오맵, 새 창으로 열림)</span>
            </a>
          </li>
        ))}
      </ul>

      {/* 대중교통 */}
      <div className="mt-10 grid gap-3 md:mt-12 md:grid-cols-2 md:gap-4">
        <div className="rounded-2xl border border-brand-line bg-brand-surface p-5 md:p-6">
          <h3 className="flex items-center gap-2 text-[17px] font-bold text-brand-ink md:text-[18px]">
            <TrainFront className="h-5 w-5 text-brand-accent" aria-hidden />
            지하철
          </h3>
          <p className="mt-4 flex items-center gap-2.5">
            <span
              aria-label={`${SUBWAY.line}호선`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-accent-2 text-[13px] font-extrabold text-white"
            >
              {SUBWAY.line}
            </span>
            <span className="text-[16px] font-bold text-brand-ink">{SUBWAY.station}</span>
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-brand-ink-muted md:text-[15px]">{SUBWAY.guide}</p>
        </div>

        <div className="rounded-2xl border border-brand-line bg-brand-surface p-5 md:p-6">
          <h3 className="flex items-center gap-2 text-[17px] font-bold text-brand-ink md:text-[18px]">
            <Bus className="h-5 w-5 text-brand-accent" aria-hidden />
            버스
          </h3>
          <p className="mt-4 text-[13px] font-bold text-brand-ink-muted">정류장</p>
          <p className="mt-1 text-[14px] leading-relaxed text-brand-ink md:text-[15px]">{BUS.stops.join(' · ')}</p>
          <dl className="mt-4 space-y-2">
            {BUS.lines.map((line) => (
              <div key={line.type} className="flex gap-3">
                <dt className="w-9 shrink-0 pt-0.5 text-[13px] font-bold text-brand-ink-muted">{line.type}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {line.numbers.map((n) => (
                    <span key={n} className="rounded-md bg-brand-subtle px-2 py-0.5 text-[13px] font-bold tabular-nums text-brand-ink">
                      {n}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 주차 — 현행 사이트에 안내가 없어 원고 대기 */}
      <p className="mt-4 flex items-start gap-2 rounded-2xl bg-brand-subtle px-5 py-4 text-[14px] leading-relaxed text-brand-ink-muted">
        <Car className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {PARKING ?? '주차 안내는 준비 중입니다. 궁금하신 점은 교회 대표전화로 문의해 주세요.'}
      </p>
    </div>
  );
}

/** 키가 없거나 지도를 못 불렀을 때 — 빈 상자 대신 위치 요약 + 지도 앱으로 */
function MapFallback() {
  const main = BUILDINGS[0];
  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border border-brand-line bg-brand-subtle px-6 text-center md:aspect-[16/9]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent text-white">
        <MapPin className="h-6 w-6" aria-hidden />
      </span>
      <p className="mt-4 text-[18px] font-bold text-brand-ink">{main.name}</p>
      <p className="mt-1 text-[14px] text-brand-ink-muted">{main.address}</p>
      <div className="mt-5">
        <AppLink href={MAP_LINKS.kakaoView} label="지도에서 위치 보기" primary icon />
      </div>
    </div>
  );
}

function AppLink({ href, label, primary, icon }: { href: string; label: string; primary?: boolean; icon?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-round inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 ${
        primary
          ? 'bg-brand-accent text-white hover:bg-brand-ink'
          : 'border border-brand-line bg-brand-surface text-brand-ink hover:border-brand-ink'
      }`}
    >
      {icon && <Navigation className="h-3.5 w-3.5" aria-hidden />}
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">(새 창으로 열림)</span>
    </a>
  );
}
