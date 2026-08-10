/**
 * GNB 구조 v2 (2차 목차 반영) — 검토용 초안. 아직 lib/nav.ts를 대체하지 않는다.
 *
 * 출처: docs/meetings/교회 홈페이지 개편안 2차.pptx 슬라이드 4~7
 * 검토 화면: /dev/gnb
 *
 * ── 확정 반영 (2026-08-10) ──
 * 1. 대메뉴 5개 유지 — 2차 목차 4개 + `새가족`(현행 유지 결정). 새가족은 highlight.
 * 2. `새가족 등록`(온라인 등록 폼) 항목 삭제 — 온라인 유입 안 하기로 결론.
 * 3. 뎁스 상한 = L3. PPT의 L4(예배실황 6종·특별순서·복지재단/학원 산하기관)는
 *    GNB에 올리지 않고 페이지 안 탭/앵커로 내린다.
 * 4. 교회활동에 L2 그룹 2개(`일정` / `소식·자료`) 신설 — 메가메뉴 열 레이아웃 대칭용.
 * 5. 사역 10개 기관은 GNB에 나열하지 않고 `/ministry` 한 페이지 + 앵커 6개로 묶는다.
 *    (새신자·3040 대상에게 외부 사이트 이탈 링크를 GNB에 노출하지 않기 위함)
 *
 * ── 설계 제약 (2026-08-09 롤백 사유) ──
 * A. 메가메뉴에서 다른 대메뉴의 존재가 계속 보여야 한다.
 * B. 모든 L3 항목은 GNB에서 1클릭 도달. 부서·기관은 한 페이지 안 앵커로 묶어
 *    페이지 내 스크롤로도 훑을 수 있게 한다. (부서별 개별 라우트 분리 금지)
 */

export type NavItem = {
  label: string;
  href: string;
  /** 외부 사이트 — 새 탭 + 아이콘 */
  external?: boolean;
  /** 검토용 메모 (/dev/gnb 에만 표시. 실제 GNB 렌더에는 안 나감) */
  note?: string;
};

export type NavGroup = {
  /** L2 그룹 제목 — 메가메뉴 컬럼 머리 */
  label: string;
  /** 그룹 제목 자체가 링크인 경우 (없으면 제목은 비링크) */
  href?: string;
  items: NavItem[];
};

export type NavSection = {
  key: string;
  label: string;
  href: string;
  /** 새가족 등 강조 메뉴 */
  highlight?: boolean;
  /** 메가메뉴 좌측에 붙는 한 줄 설명 */
  tagline?: string;
  groups: NavGroup[];
};

export const NAV_V2: NavSection[] = [
  {
    key: 'intro',
    label: '교회소개',
    href: '/intro',
    tagline: '1973년부터, 세계를 품은 교회',
    groups: [
      {
        label: '교회안내',
        items: [
          { label: '교회 소개', href: '/intro#about' },
          { label: '교회 역사', href: '/intro#history', note: '10년 단위 타임라인 — 최유빈 목사님 담당' },
          { label: '신학 노선', href: '/intro#theology' },
        ],
      },
      {
        label: '섬기는 사람들',
        items: [
          { label: '담임목사', href: '/intro#pastor' },
          { label: '원로 · 은퇴목사', href: '/intro#emeritus', note: '약력 삭제 확정' },
          { label: '장로', href: '/intro#elders' },
          { label: '교역자', href: '/intro#staff' },
        ],
      },
      {
        label: '교회정보',
        items: [
          { label: '오시는 길 · 주차', href: '/intro#directions' },
          { label: '실내 길찾기', href: '/intro#wayfind', note: 'wayfind 위젯 — /newcomer 와 공유' },
          { label: '교회 시설', href: '/intro#facility' },
          { label: '연락처', href: '/intro#contact' },
          { label: '온라인 헌금', href: '/giving' },
          { label: 'e교회행정', href: '#', external: true, note: '외부 시스템 URL 미확보 · 하위 항목 카톡 문의 중' },
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
        href: '/worship',
        items: [
          { label: '예배 시간 안내', href: '/worship#times' },
          { label: '생방송', href: '/worship#live' },
          { label: '예배 실황', href: '/worship/live', note: 'L4 6종(주일낮·주일밤·수요·특별·금요밤·강해)을 페이지 내 탭으로' },
          { label: '특별순서', href: '/worship#special', note: 'L4 2종(특송·간증)을 섹션 내 탭으로' },
        ],
      },
      {
        label: '교육',
        href: '/education',
        items: [
          { label: '주일학교', href: '/education#kids' },
          { label: '중 · 고등부', href: '/education#youth' },
          { label: '대학부', href: '/education#college' },
          { label: '청년회', href: '/education#young-adult', note: '소속 미정 (PPT 슬라이드 5)' },
          { label: '경향시니어스쿨', href: '/education#senior' },
          { label: '평생교육원', href: '/education#academy' },
          { label: '새소식반', href: '/education#newsclass' },
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
        href: '/care',
        items: [
          { label: '새가족 안내', href: '/newcomer', note: '정본은 새가족 대메뉴 — 여기선 교차링크' },
          { label: '새가족 모임', href: '/newcomer#meeting' },
          { label: '구역모임', href: '/care#district' },
          { label: '전도회', href: '/care#evangelism' },
          { label: '동호회', href: '/care#clubs' },
        ],
      },
      {
        label: '사역',
        href: '/ministry',
        items: [
          { label: '별들의학교', href: '/ministry#stars' },
          { label: '제네바신학대학원대학교', href: '/ministry#gts' },
          { label: '경향선교회', href: '/ministry#mission', note: 'B-2 보안지역 선교사 노출 이슈 선결' },
          { label: '경향복지재단', href: '/ministry#welfare', note: '산하 3곳은 페이지 내 앵커' },
          { label: '경향학원', href: '/ministry#school', note: '산하 2곳은 페이지 내 앵커' },
          { label: '어린이집 · 놀이학원', href: '/ministry#childcare', note: '키즈놀이학원 · 해바라기 · 배다리 묶음' },
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
          { label: '교회 일정', href: '/activity#calendar', note: '월/주 토글 · 교회소개>교회정보와 중복 → 여기가 정본' },
          { label: '경향의 일주일', href: '/activity/weekly' },
        ],
      },
      {
        label: '소식 · 자료',
        items: [
          { label: '주보', href: '/activity/bulletin', note: '누적형 → 독립 라우트' },
          { label: '영상뉴스', href: '/activity/video-news', note: '누적형 → 독립 라우트' },
          { label: '교회소식', href: '/activity/news', note: '누적형 → 독립 라우트' },
          { label: '교우소식', href: '/activity/members', note: '누적형 → 독립 라우트 · 개인정보 검토 대상' },
          { label: '교단소식', href: '/activity/denomination', note: '누적형 → 독립 라우트' },
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
          { label: '처음 오신 날 안내', href: '/newcomer#firstday', note: '5단계' },
          { label: '오시는 길 · 주차', href: '/newcomer#directions' },
          { label: '예배당 가는 길', href: '/newcomer#wayfind', note: 'wayfind 위젯 주 배치 (D-1)' },
          { label: '픽업 차량', href: '/newcomer#pickup', note: '5개 노선' },
        ],
      },
      {
        label: '등록하신 후',
        items: [
          { label: '새가족 모임 (4주)', href: '/newcomer#meeting' },
          { label: '나의 공동체 찾기', href: '/newcomer#community', note: '교구·부서 5탭 정본 (D-2)' },
          { label: '소통 채널', href: '/newcomer#channels', note: '카카오채널·전화 — 온라인 등록 폼 대체' },
        ],
      },
    ],
  },
];

/** 미배치 — 목차에 있으나 아직 자리 못 정한 항목 (/dev/gnb 에 경고로 표시) */
export const UNPLACED = [
  { label: '교구친선리그', reason: 'PPT 슬라이드 7 — 위치 논의 필요' },
  { label: '집사회 · 권사회', reason: '카톡 질의 회신 대기' },
  { label: 'e교회행정 하위 항목', reason: '카톡 질의 회신 대기' },
  { label: '새가족 수료자 명단', reason: 'B-1 실명 공개 이슈 — 결론 전 미배치' },
];

export const LIVE_URL = 'https://www.youtube.com/channel/UCpPEfMA_nBf1koFnjyKu1pg/live';
