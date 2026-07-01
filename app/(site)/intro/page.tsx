import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';
import { FloorMap } from '@/components/interactive/floor-map';

export const metadata: Metadata = { title: '교회소개' };

export default function IntroPage() {
  return (
    <SubPage
      sectionKey="intro"
      overrides={{
        directions: (
          <div className="space-y-8">
            <p className="text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
              서울 강서구 가양동. 9호선 가양역 도보 N분. [ 상세 주소·오시는 길 안내 입력 예정 ]
              <br />
              아래 지도에서 방·시설을 두 번 선택하면 건물 안에서의 이동 경로를 안내합니다.
            </p>
            <FloorMap />
          </div>
        ),
      }}
    />
  );
}
