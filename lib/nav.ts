/**
 * 전역 네비게이션(GNB) 구조 — 단일 출처.
 * IA: context/04-information-architecture.md (시안 IA: prototypes/_archive/context/02-*).
 *
 * 메뉴 항목·라벨·순서·뎁스는 전부 이 배열에서 관리한다 (코드/마크업에 박지 않음).
 * 추가·삭제·이름변경·순서변경 = 이 파일 수정만. 나중에 CMS 테이블로 이관 가능.
 *
 * 트리 구조(children)라 한 가지가 3뎁스로 들어가도 데이터 마이그레이션 없이 렌더만 확장.
 * 단, 현재 비주얼은 2뎁스(컬럼 제목 + 항목 리스트)로 고정.
 *
 * 서브 링크는 아직 서브페이지가 없어 타깃 페이지 + 해시 앵커로 둠.
 * 실제 라우트/섹션 id 확정 시 href 교체.
 */
export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type NavSection = NavItem & {
  /** 컬럼 식별 키 (활성 인디케이터용) */
  key: string;
  /** 새가족 등 강조 메뉴 (녹색 처리) */
  highlight?: boolean;
};

export const NAV: NavSection[] = [
  {
    key: 'intro',
    label: '교회소개',
    href: '/intro',
    children: [
      { label: '인사말', href: '/intro#greeting' },
      { label: '비전 · 신학 노선', href: '/intro#vision' },
      { label: '교회 역사', href: '/intro#history' },
      { label: '섬기는 사람들', href: '/intro#people' },
      { label: '교회 정보 · 시설', href: '/intro#info' },
      { label: '새신자 Q&A', href: '/intro#qna' },
    ],
  },
  {
    key: 'worship',
    label: '예배와 교육',
    href: '/worship',
    children: [
      { label: '예배 시간표', href: '/worship#times' },
      { label: '생방송 · 예배 실황', href: '/worship#live' },
      { label: '특별순서 · 특송', href: '/worship#special' },
      { label: '주일학교', href: '/worship#kids' },
      { label: '중 · 고 · 대학부', href: '/worship#youth' },
      { label: '청년회', href: '/worship#young-adult' },
    ],
  },
  {
    key: 'care',
    label: '목양과 사역',
    href: '/care',
    children: [
      { label: '새가족 안내', href: '/care#newfamily' },
      { label: '구역모임', href: '/care#district' },
      { label: '경향시니어스쿨', href: '/care#senior' },
      { label: '평생교육원', href: '/care#academy' },
      { label: '선교 · 사역', href: '/care#ministry' },
    ],
  },
  {
    key: 'activity',
    label: '교회 활동',
    href: '/activity',
    children: [
      { label: '교회 일정', href: '/activity#calendar' },
      { label: '주보', href: '/activity#bulletin' },
      { label: '교회 소식', href: '/activity#news' },
      { label: '경향의 일주일', href: '/activity#weekly' },
    ],
  },
  {
    key: 'newfamily',
    label: '새가족',
    href: '/newcomer',
    highlight: true,
    children: [
      { label: '처음 오셨나요?', href: '/newcomer#welcome' },
      { label: '새가족 등록', href: '/newcomer#register' },
      { label: '새가족 교육 · 학습', href: '/newcomer#education' },
      { label: '예배 안내', href: '/newcomer#guide' },
    ],
  },
];

/** 헤더 우측 고정 — 생방송 채널 */
export const LIVE_URL = 'https://www.youtube.com/channel/UCpPEfMA_nBf1koFnjyKu1pg/live';
export const YOUTUBE_URL = 'https://www.youtube.com/channel/UCpPEfMA_nBf1koFnjyKu1pg';
