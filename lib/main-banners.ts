/**
 * 메인 중앙 배너 — **관리자(미디어팀)가 넣고 빼는 영역** (2026-09-16 사용자 지시).
 *
 * 지금은 이 파일이 단일 출처인 목업이다. 바꾸려면 코드 수정 + 배포가 필요하다 = 미디어팀은 못 바꾼다.
 * ⚠️ **배너 테이블은 아직 스키마에 없다** (`context/03-data-model.md` 테이블 11종 어디에도 없음 — 2026-09-16 확인).
 * 어드민(`context/features/admin-ui.md`, 옵션 B 자체 제작)을 붙일 때 `banners` 테이블 + `/admin/banners`를
 * 같이 만들어야 한다. 컴포넌트(`components/content/main-banner.tsx`)는 배열만 받으므로
 * 그때 데이터 출처만 바꾸면 된다.
 *
 * ── 이미지 규칙 ──
 * - PC: 2400×750 (3.2:1) JPEG q82, **400KB 이하**. `public/banners/<id>.jpg`
 *   (디자인팀 원본은 11339×3543. 그대로 올리면 10MB라 반드시 축소해서 커밋한다)
 * - 모바일: 시안은 PC와 **다른 크롭**(2줄 조판)이다. 전달받으면 `srcMobile`에 `<id>-m.jpg`를 채운다.
 *   없으면 PC 배너를 16:9로 가운데 크롭해 보여준다 — 양 끝 그래픽이 잘린다.
 * - 이 경로는 next/image 최적화를 타지 않는다(아트디렉션 `<picture>`). 파일 자체를 적정 용량으로 넣을 것.
 */

export type MainBanner = {
  /** 파일명·key 겸용 (public/banners/<id>.jpg) */
  id: string;
  /** PC 배너 */
  src: string;
  /** 모바일 전용 크롭 (없으면 PC를 크롭해 표시) */
  srcMobile?: string;
  /**
   * 대체 텍스트 — 이미지 안 문구를 **그대로** 옮긴다.
   * 배너는 텍스트가 이미지에 박혀 있어 alt가 유일한 접근 경로다 (`guardrails/01-code-quality.md`).
   */
  alt: string;
  /** 누르면 갈 곳. 없으면 링크 없는 배너로 렌더 */
  href?: string;
};

export const MAIN_BANNERS: MainBanner[] = [
  {
    id: '2026-theme',
    src: '/banners/2026-theme.jpg',
    alt: '2026년 표어 — 네 입을 크게 열라 내가 채우리라 (시편 81:10)',
  },
  {
    id: 'wm-contest',
    src: '/banners/wm-contest.jpg',
    alt: '경향교회 여전도회연합회 찬양·율동 경연대회 — 2026년 10월 11일(주일) 오후 2시, 트리니티홀',
  },
];
