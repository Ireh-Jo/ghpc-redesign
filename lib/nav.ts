/**
 * 전역 네비게이션(GNB) 구조 — 단일 출처.
 * IA: `context/04-information-architecture.md`.
 *
 * 메뉴 항목·라벨·순서·뎁스는 전부 이 배열에서 관리한다 (코드/마크업에 박지 않음).
 * 추가·삭제·이름변경·순서변경 = 이 파일 수정만. 나중에 CMS 테이블로 이관 가능.
 *
 * ── 2차 목차 승계 (2026-08-23) ──
 * `lib/nav-v2.ts` 초안을 여기로 흡수하고 초안 파일은 삭제했다. 구조가 `children[]` 평면에서
 * `groups[].items[]` 2단으로 바뀌었다 — 메가메뉴 열 = 그룹.
 *
 * 확정 사항 (2026-08-10 · 08-12 · 08-23):
 * 1. 대메뉴 5개 고정 — 2차 목차 4개 + `새가족`(highlight). **대메뉴 신설 금지.**
 * 2. 뎁스 상한 L3. PPT의 L4(예배실황 6종·특별순서·복지재단/학원 산하기관)는 페이지 안 탭/앵커로 내린다.
 * 3. 대메뉴는 링크가 아니라 패널 컨트롤(클릭 불가) — 하위가 패널에 다 보이므로 1클릭 도달 유지.
 * 4. 사역 10개 기관은 나열하지 않고 `/ministry` 한 페이지 + 앵커 6개.
 * 5. `새가족 등록`(온라인 폼) 항목 없음 — 온라인 유입 안 함. 접점은 카카오채널·전화.
 * 6. 현행 `연합기관` 해체분 중 **집사회·권사회는 `목양과 사역 > 목양`에 항목으로 흡수.**
 *    (그것만을 위해 그룹/대메뉴를 새로 만들지 않는다 — 2026-08-23 사용자 지시)
 * 7. 현행 대메뉴 `e교회행정` 해체분은 `교회 활동 > 행정·신청` 그룹으로. 전 항목이 로그인 없이
 *    공개돼 있어 회원 전용 영역은 만들지 않는다.
 *    근거: `docs/meetings/2026-08-23-현행사이트-메뉴-전수분석.md`
 *
 * `legacy`는 현행 사이트(ghpc.or.kr)의 대응 URL — 콘텐츠 이관 전까지 스텁 페이지에서
 * "현재 홈페이지에서 보기"로 노출한다. 이관이 끝나면 제거한다.
 */
export type NavItem = {
  label: string;
  href: string;
  /** 외부 사이트 — 새 탭 */
  external?: boolean;
  /** 현행 사이트 대응 URL (이관 전 임시 노출용) */
  legacy?: string;
  /** 스텁/허브 페이지에 뿌리는 한 줄 설명 */
  desc?: string;
};

export type NavGroup = {
  /** L2 그룹 제목 — 메가메뉴 컬럼 머리 */
  label: string;
  items: NavItem[];
};

export type NavSection = {
  /** 컬럼 식별 키 (활성 인디케이터·SubPage 조회용) */
  key: string;
  label: string;
  href: string;
  /** 새가족 등 강조 메뉴 (녹색 처리) */
  highlight?: boolean;
  /**
   * 메가메뉴 좌측·모바일 하위 화면 상단에 붙는 한 줄 설명.
   * 대메뉴가 클릭 불가라 "이 메뉴가 뭔지"를 문장으로 알려주는 자리 (2026-08-12 결정).
   */
  tagline?: string;
  groups: NavGroup[];
};

const LEGACY = 'https://www.ghpc.or.kr';

export const NAV: NavSection[] = [
  {
    key: 'intro',
    label: '교회소개',
    href: '/intro',
    tagline: '1973년부터, 세계를 품은 교회',
    groups: [
      {
        label: '교회안내',
        items: [
          { label: '교회 소개', href: '/intro#about', legacy: `${LEGACY}/Page/Index/28` },
          { label: '교회 역사', href: '/intro#history', legacy: `${LEGACY}/Page/Index/31` },
          { label: '신학 노선', href: '/intro#theology' },
        ],
      },
      {
        label: '섬기는 사람들',
        items: [
          { label: '담임목사', href: '/intro#pastor', legacy: `${LEGACY}/Page/Index/29` },
          { label: '원로 · 은퇴목사', href: '/intro#emeritus', legacy: `${LEGACY}/Page/Index/198` },
          { label: '장로', href: '/intro#elders', legacy: `${LEGACY}/Page/Index/140` },
          { label: '교역자', href: '/intro#staff', legacy: `${LEGACY}/Page/Index/139` },
        ],
      },
      {
        label: '교회정보',
        items: [
          { label: '오시는 길 · 주차', href: '/intro#directions', legacy: `${LEGACY}/Page/Index/36` },
          { label: '실내 길찾기', href: '/intro#wayfind' },
          { label: '교회 시설', href: '/intro#facility', legacy: `${LEGACY}/Page/Index/238` },
          { label: '연락처', href: '/intro#contact', legacy: `${LEGACY}/Page/Index/37` },
          { label: '온라인 헌금', href: '/giving' },
        ],
      },
    ],
  },
  {
    key: 'worship',
    label: '예배와 교육',
    href: '/worship',
    tagline: '자유로이, 함께 예배하라',
    groups: [
      {
        label: '예배',
        items: [
          { label: '예배 시간 안내', href: '/worship#times', legacy: `${LEGACY}/Page/Index/34` },
          { label: '생방송', href: '/worship#live', legacy: `${LEGACY}/Page/Index/41` },
          {
            label: '예배 실황',
            href: '/worship/live',
            desc: '주일낮 · 주일밤 · 수요밤 · 특별 · 금요밤 · 강해',
            legacy: `${LEGACY}/Board/Index/137000`,
          },
          { label: '특별순서', href: '/worship#special', desc: '특송 · 간증', legacy: `${LEGACY}/Link/Index/4432` },
        ],
      },
      {
        label: '교육',
        items: [
          { label: '주일학교', href: '/education#kids', legacy: `${LEGACY}/Page/Index/57` },
          { label: '중 · 고등부', href: '/education#youth', legacy: `${LEGACY}/Page/Index/144` },
          { label: '대학부', href: '/education#college', legacy: `${LEGACY}/Page/Index/145` },
          { label: '청년회', href: '/education#young-adult', legacy: `${LEGACY}/Page/Index/64` },
          { label: '경향시니어스쿨', href: '/education#senior', legacy: `${LEGACY}/Page/Index/148` },
          { label: '평생교육원', href: '/education#academy', legacy: `${LEGACY}/Page/Index/150` },
          { label: '새소식반', href: '/education#newsclass', legacy: `${LEGACY}/Page/Index/147` },
        ],
      },
    ],
  },
  {
    key: 'care',
    label: '목양과 사역',
    href: '/care',
    tagline: '함께 자라고 함께 섬깁니다',
    groups: [
      {
        label: '목양',
        items: [
          // 정본은 `새가족` 대메뉴. 여기선 교차링크만 둔다
          { label: '새가족 안내', href: '/newcomer', desc: '처음 오신 분을 위한 안내로 이동합니다' },
          { label: '구역모임', href: '/care#district' },
          {
            label: '전도회',
            href: '/care#evangelism',
            desc: '남전도회 · 여전도회',
            legacy: `${LEGACY}/Page/Index/60`,
          },
          { label: '집사회', href: '/care#deacons', legacy: `${LEGACY}/Page/Index/62` },
          { label: '권사회', href: '/care#kwonsa', legacy: `${LEGACY}/Page/Index/63` },
          { label: '동호회', href: '/care#clubs' },
        ],
      },
      {
        label: '사역',
        items: [
          { label: '별들의학교', href: '/ministry#stars', legacy: `${LEGACY}/Page/Index/146119` },
          { label: '제네바신학대학원대학교', href: '/ministry#gts' },
          { label: '경향선교회', href: '/ministry#mission' },
          { label: '경향복지재단', href: '/ministry#welfare' },
          { label: '경향학원', href: '/ministry#school' },
          { label: '어린이집 · 놀이학원', href: '/ministry#childcare' },
        ],
      },
    ],
  },
  {
    key: 'activity',
    label: '교회 활동',
    href: '/activity',
    tagline: '이번 주 경향교회',
    groups: [
      {
        label: '일정',
        items: [
          { label: '교회 일정', href: '/activity#calendar', legacy: `${LEGACY}/Page/Index/111013` },
          { label: '경향의 일주일', href: '/activity/weekly', legacy: `${LEGACY}/Board/Index/11297` },
        ],
      },
      {
        label: '소식 · 자료',
        items: [
          { label: '주보', href: '/activity/bulletin', legacy: `${LEGACY}/Board/Index/53` },
          {
            label: '영상뉴스',
            href: '/activity/video-news',
            desc: '경향뉴스 · 홍보영상 · 교구친선리그',
            legacy: `${LEGACY}/Board/Index/5985`,
          },
          { label: '교회소식', href: '/activity/news', legacy: `${LEGACY}/Board/Index/54` },
          { label: '교우소식', href: '/activity/members', legacy: `${LEGACY}/Board/Index/113347` },
          { label: '교단소식', href: '/activity/denomination', legacy: `${LEGACY}/Board/Index/21646` },
        ],
      },
      {
        // 현행 대메뉴 `e교회행정` 해체분 (2026-08-23)
        label: '행정 · 신청',
        items: [
          { label: '공지사항', href: '/activity/notice', legacy: `${LEGACY}/Board/Index/12` },
          {
            label: '자료실',
            href: '/activity/resources',
            desc: '자료실 · 로고 · 별들의 노래 · 기관회계보고',
            legacy: `${LEGACY}/Board/Index/44544`,
          },
          {
            label: '신청 · 서식',
            href: '/activity/apply',
            desc: '영상제작 · 3대 후원회원 작정 · 평생교육원 수강',
            legacy: `${LEGACY}/Link/Index/76`,
          },
          { label: '시설 예약', href: '/reserve', legacy: `${LEGACY}/Board/Index/25484` },
        ],
      },
    ],
  },
  {
    key: 'newfamily',
    label: '새가족',
    href: '/newcomer',
    highlight: true,
    tagline: '처음 오셨나요? 반갑습니다',
    groups: [
      {
        label: '처음 오신 분께',
        items: [
          { label: '처음 오셨나요?', href: '/newcomer#welcome' },
          { label: '처음 오신 날 안내', href: '/newcomer#firstday' },
          { label: '오시는 길 · 주차', href: '/newcomer#directions' },
          { label: '예배당 가는 길', href: '/newcomer#wayfind' },
          { label: '픽업 차량', href: '/newcomer#pickup' },
        ],
      },
      {
        label: '등록하신 후',
        items: [
          { label: '새가족 모임 (4주)', href: '/newcomer#meeting' },
          { label: '나의 공동체 찾기', href: '/newcomer#community' },
          { label: '소통 채널', href: '/newcomer#channels' },
        ],
      },
    ],
  },
];

/** 헤더 우측 고정 — 생방송 채널 */
export const LIVE_URL = 'https://www.youtube.com/channel/UCpPEfMA_nBf1koFnjyKu1pg/live';
export const YOUTUBE_URL = 'https://www.youtube.com/channel/UCpPEfMA_nBf1koFnjyKu1pg';

/** 그룹을 걷어낸 평면 목록 — 앵커 추출·검색용 */
export function flatItems(section: NavSection): NavItem[] {
  return section.groups.flatMap((g) => g.items);
}

/** href로 대메뉴·그룹·항목을 역추적 (스텁 페이지 breadcrumb) */
export function findByHref(href: string):
  | { section: NavSection; group: NavGroup; item: NavItem }
  | undefined {
  for (const section of NAV) {
    for (const group of section.groups) {
      const item = group.items.find((i) => i.href === href);
      if (item) return { section, group, item };
    }
  }
  return undefined;
}

/**
 * 아직 자리를 못 정한 항목 — `/dev/gnb`에 경고로 표시.
 * (2026-08-23: 집사회·권사회 / e교회행정 하위 / 교구친선리그 해소)
 */
export const UNPLACED = [
  { label: '새가족 수료자 명단', reason: '실명 공개 개인정보 이슈 — 결론 전 미배치 (작업플랜 §2 B-1)' },
];

/** 현행 사이트 조사로 뽑힌 사실 확인 질문 (디자인 판단 아님) */
export const OPEN_QUESTIONS = [
  { label: '청년회 소속', ask: '연합기관인가 교육기관인가? (현행=연합기관 / 2차 목차=교육 · 잠정 교육 유지)' },
  { label: '구역공과', ask: '계속 웹 게시하는가? 대상이 구역장인가 전교인인가? (현행 Board/52, 2차 목차에 없음)' },
  { label: '키즈그라운드 이용신청', ask: '시설이용신청과 통합 가능한가? (현행은 GNB 밖 별도 폼)' },
];
