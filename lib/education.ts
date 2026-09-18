/**
 * 교육 페이지(`/education`) 부서 데이터 — 단일 출처.
 *
 * 내용 출처: `docs/meetings/screens/교육.html` (TF 작성 화면안, 2026-08). 문구를 거의 그대로 옮겼고
 * 조판은 2026-09-18 디자인팀 교육 화면 시안을 따른다 (`docs/2026-09-18-교육페이지-시안-반영.md`).
 * 카페 URL은 그 화면안의 실제 링크.
 *
 * ⚠️ 여기 있는 것은 **TF가 작성한 초안**이다. 교육 담당(김창진·신동근 목사) 원고가 오면 교체한다
 * (`docs/NEXT.md` 1-1). 사실 확인이 필요한 값에는 `// 확인:` 주석을 달아 뒀다.
 *
 * Supabase 이관 계획은 없다 — 부서 소개는 저빈도 변경이라 이 파일이 계속 출처일 수 있다.
 * 활동사진만 나중에 Storage로 간다 (`photoSlots`가 그 자리).
 */

export type EduFact = { label: string; value: string };
export type EduGroupItem = { name: string; meta?: string; place?: string };

export type EduDept = {
  /** 앵커 id — `lib/nav.ts`의 `/education#<id>`와 반드시 일치 */
  id: string;
  /** 시안의 섹션 번호 (01~07) */
  no: string;
  /** 번호 옆 영문 */
  en: string;
  title: string;
  lead: string;
  /** 제목 오른쪽 바로가기 (네이버 카페 등) */
  links?: { label: string; href: string }[];
  /** 소개 카드 — 시안의 연한 블루 박스 */
  intro: { title: string; body: string; photoSlots?: number };
  /** 부서 카드 그룹 (주일학교 미취학부/초등부 등) */
  groups?: { label: string; items: EduGroupItem[] }[];
  /** 라벨-값 정보 (개강·수업시간·학기 등) */
  facts?: { title?: string; items: EduFact[] };
  /** 목록형 특징·혜택 */
  bullets?: { title: string; items: string[] };
  /** 청년회 지회 구성표 */
  roster?: { title: string; note?: string; items: EduFact[] };
  /** 주요 행사 — 시안의 번호 카드 */
  events?: string[];
  faq?: { question: string; answer: string }[];
  /** 섹션 맨 아래 각주 */
  notes?: string[];
};

/** 모든 부서가 공유하는 교육 방침 (화면안 공통 블록) */
export const EDU_PRINCIPLES = [
  { title: '하나님 중심', body: '모든 예배와 배움의 출발점은 하나님을 아는 것입니다.' },
  { title: '교회 중심', body: '각 부서는 홀로가 아닌 교회 공동체 안에서 함께 자랍니다.' },
  { title: '성경 중심', body: '모든 가르침은 하나님의 말씀인 성경 위에 굳게 섭니다.' },
];

/** 교회 대표전화 — 부서 문의 안내에 공통으로 붙는다 */
export const CHURCH_TEL = '02-3663-0333';

export const EDU_DEPTS: EduDept[] = [
  {
    id: 'kids',
    no: '01',
    en: 'SUNDAY SCHOOL',
    title: '주일학교',
    lead: '미취학부와 초등부로 나뉘어 연령에 맞는 예배와 양육이 이루어지는 교육기관입니다.',
    links: [{ label: '주일학교 카페', href: 'https://cafe.naver.com/ghpcedu1' }],
    intro: {
      title: '주일학교 소개',
      body: '경향교회 주일학교는 영아부·유아부·유치부·초등부로 조직되어, 담임목사의 주일 말씀을 각 부서 눈높이에 맞게 전하며 온 교회가 같은 말씀으로 자랍니다. 다양한 프로그램으로 어린이 전도의 기회도 넓혀가고 있습니다.',
      photoSlots: 4,
    },
    groups: [
      {
        label: '미취학부',
        items: [
          { name: '영아부', meta: '0~3세 · 주일 9:00', place: '제1교육실' },
          { name: '유아부', meta: '4~5세 · 주일 9:00', place: '제7교육실' },
          { name: '유치1부', meta: '6~7세 · 주일 9:00', place: '제2교육실' },
          { name: '유치2부', meta: '0~7세 · 주일 11:00', place: '제1교육실' },
        ],
      },
      {
        label: '초등부',
        items: [
          { name: '초등1부', meta: '초1~2학년 · 주일 9:00', place: '제4교육실' },
          { name: '초등2부', meta: '초3~4학년 · 주일 9:00', place: '제3교육실' },
          { name: '초등3부', meta: '초5~6학년 · 주일 9:00', place: '제8교육실' },
          { name: '초등4부', meta: '초1~6학년 · 주일 11:00', place: '제3교육실' },
        ],
      },
    ],
    facts: {
      title: '주요 시설',
      items: [
        { label: '놀이 공간', value: '키즈그라운드 · 운동장' },
        { label: '수유실', value: '본당 층 안내데스크 문의' },
        { label: '교육실', value: '제1~8교육실' },
      ],
    },
    events: [
      '겨울성경학교',
      '어린이주일',
      '문화교실',
      '여름성경학교',
      '성탄찬양예배',
      '그림글짓기대회',
    ],
    notes: [
      '각 부서 담당교역자 및 교육실로 문의해 주세요.',
      '새신자·교사를 위한 연간 행사계획표는 추후 별도로 안내됩니다.',
    ],
  },
  {
    id: 'youth',
    no: '02',
    en: 'MIDDLE & HIGH SCHOOL',
    title: '중 · 고등부 S.F.C.',
    lead: '학업과 신앙을 함께 세워가는 청소년 신앙공동체, S.F.C.입니다.',
    links: [{ label: '중 · 고등부 카페', href: 'https://cafe.naver.com/ghmhsfc' }],
    intro: {
      title: 'S.F.C. 소개',
      body: '그리스도 때문에 존재하고, 그리스도께 소속되어, 그리스도를 위해 살아가는 학생들의 모임입니다. 주일은 예배·성경공부·교제로, 학교에서는 빛과 소금으로 살아가도록 함께 세워갑니다.',
      photoSlots: 4,
    },
    groups: [
      {
        label: '부서 구성',
        items: [
          { name: '중등부', meta: '중학교 1~3학년', place: '교육관 3층' },
          { name: '고등부', meta: '고등학교 1~3학년', place: '교육관 4층' },
        ],
      },
    ],
    events: [
      '위원 MT',
      '부활주일행사',
      '고기파티',
      'Come and See day',
      '체육대회',
      '교역자특강',
      '운동리그',
      '수양회',
      '수험생을 위한 기도',
    ],
    notes: [
      '예배·성경공부 시간은 `예배와 교육 > 예배`의 S.F.C. 표에서 확인하실 수 있습니다.',
      '진학 후에는 대학부 S.F.C.로 자연스럽게 이어집니다.',
    ],
  },
  {
    id: 'college',
    no: '03',
    en: 'COLLEGE',
    title: '대학부 S.F.C.',
    lead: '예배와 성경공부로 기독교적 세계관을 세워가는 대학생 공동체입니다.',
    links: [{ label: '대학부 카페', href: 'https://cafe.naver.com/shalomuniv' }],
    intro: {
      title: 'S.F.C. 소개',
      body: '주일 오후 예배와 함께 새빛부·선교부 등 부서모임, 조장성경공부가 진행되며, 새내기학교·동기수양회·대학부 M.T.·단기선교·Shalom’s Day 등을 통해 신앙과 공동체가 함께 성장합니다.',
      photoSlots: 4,
    },
    events: [
      '샬롬 M.T.',
      '조별모임',
      '대학생대회',
      '단기선교',
      'S.F.C. 주일',
      '샬롬투어',
      '샬롬의 날',
    ],
    notes: ['졸업 후에는 청년회로 자연스럽게 이어집니다.'],
  },
  {
    id: 'young-adult',
    no: '04',
    en: 'YOUNG ADULTS',
    title: '청년회',
    lead: '삶의 모든 영역에서 그리스도인의 사명을 감당하는 청년 공동체입니다.',
    links: [{ label: '청년회 카페', href: 'https://cafe.naver.com/ghimmanuel' }],
    intro: {
      title: '청년회 소개',
      body: '연령별 10개 지회로 조직되어 주일 모임·팀 모임·구역 모임·새가족 양육 등을 통해 바른 신앙과 성숙한 그리스도인의 삶을 함께 훈련합니다. 교회학교 교사, 찬양대 등 교회 곳곳에서도 함께 섬깁니다.',
      photoSlots: 4,
    },
    roster: {
      title: '지회 구성',
      note: '출생연도 기준으로 지회가 정해집니다. 잘 모르시면 주일 모임에 오셔서 안내받으실 수 있어요.',
      items: [
        { label: '청년전도회', value: '1984년생 이상' },
        { label: '1청년회', value: '1986년생 이상' },
        { label: '2청년회', value: '1987~1988년생' },
        { label: '3청년회', value: '1989~1991년생' },
        { label: '4청년회', value: '1992~1993년생' },
        { label: '5청년회', value: '1994~1995년생' },
        { label: '6청년회', value: '1996년생' },
        { label: '7청년회', value: '1997년생' },
        { label: '8청년회', value: '1998년생' },
        { label: '9청년회', value: '1999년생' },
        { label: '10청년회', value: '2000년생 이하' },
      ],
    },
    events: ['사랑의 모임', '단기선교', '수련회', '엠티', '임마누엘의 날', '하계봉사'],
    notes: ['모임 시간·장소는 `예배와 교육 > 예배`의 청년회 모임 행을 참고해 주세요.'],
  },
  {
    id: 'senior',
    no: '05',
    en: 'SENIOR SCHOOL',
    title: '경향시니어스쿨',
    lead: '어르신들이 주님 안에서 건강하고 기쁘게 지내시도록 마련된 모임입니다.',
    intro: {
      title: '경향시니어스쿨 소개',
      body: '봄학기와 가을학기로 운영되며, 주일 모임에서는 제네바신학대학원 교수님을 모시고 깊이 있는 성경공부를, 수요 모임에서는 예배와 특강·특별활동·소풍을, 식사 모임에서는 권사회가 정성껏 준비한 따뜻한 식사를 함께 나눕니다.',
      photoSlots: 4,
    },
    facts: {
      title: '모임 구성',
      items: [
        { label: '주일 모임', value: '성경공부 (제네바신학대학원 교수 강의)' },
        { label: '수요 모임', value: '예배 · 특강 · 특별활동 · 소풍' },
        { label: '식사 모임', value: '권사회가 준비한 식사 교제' },
      ],
    },
    notes: [
      '봄학기·가을학기 세부 계획표와 강사 프로필은 준비되는 대로 이곳에 게시합니다.',
      '활동 사진·영상은 어드민에서 등록하면 이 자리에 붙습니다.',
    ],
  },
  {
    id: 'academy',
    no: '06',
    en: 'LIFELONG EDUCATION',
    title: '제네바신학대학원 평생교육원',
    lead: '평신도에게 깊이 있는 신학과 성경 지식을 배울 기회를 제공하는 과정입니다.',
    links: [{ label: '제네바신학대학원', href: 'https://gts.ac.kr' }],
    intro: {
      title: '평생교육원 소개',
      body: '개혁주의 신학에 입각해 제네바신학대학원 교수진이 직접 강의하며, 여자교역자를 배출해 온 전통을 이어 평신도들에게도 신학교육의 기회를 열어드립니다.',
    },
    facts: {
      title: '과정 안내',
      items: [
        { label: '개강', value: '매년 상반기 3월 · 하반기 8월' },
        { label: '수업 시간', value: '월 · 화 온라인 수업' },
        { label: '수료 기간', value: '전 과목 이수 시 2년 4학기' },
        { label: '문의', value: '제네바신학대학원 교학처 031-958-6001' },
      ],
    },
    bullets: {
      title: '특징 및 혜택',
      items: [
        '전 과목 이수 시 평생교육원장·총장 명의 수료증 수여',
        '제네바신학대학원 교수진의 직접 강의',
        '제신원 각종 부대시설 이용 가능',
        '전 과목 이수 여학생은 소정 시험·선발 후 여전도사 자격증 수여',
        '피택권사고시 면제',
      ],
    },
    notes: ['수강 신청은 `교회 활동 > 행정·신청`의 평생교육원 신청 폼으로 접수합니다.'],
  },
  {
    id: 'newsclass',
    no: '07',
    en: 'GOSPEL CLASS',
    title: '경향어린이 새소식반',
    lead: '성도가 사는 지역에서 동네 어린이들에게 복음을 전하는 어린이 전도 모임입니다.',
    links: [{ label: '새소식반 카페', href: 'https://cafe.naver.com/ghpcedu1' }],
    intro: {
      title: '새소식반 소개',
      body: '“마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라.”(잠언 22:6) 성도가 사는 지역의 어린이들에게 복음을 전하고, 부모와 자녀가 자연스럽게 주일에 교회로 나오도록 돕습니다. 현재 서울 전 지역 약 18개 처소에서 열리고 있습니다.',
      photoSlots: 4,
    },
    facts: {
      title: '운영 안내',
      items: [
        { label: '봄학기', value: '4월 초 ~ 6월 중순' },
        { label: '가을학기', value: '9월 초 ~ 11월 초' },
        { label: '모이는 곳', value: '동네 놀이터 · 공원 · 아파트 · 주택 등' },
        { label: '진행 요일', value: '처소별로 화~토 중 진행' },
      ],
    },
    faq: [
      {
        question: '새소식반은 무엇인가요?',
        answer:
          '성도가 사는 지역의 어린이들에게 복음을 전하고 부모와 자녀가 자연스럽게 주일에 교회로 나오도록 돕는 프로그램입니다.',
      },
      {
        question: '누가 어떻게 섬기나요?',
        answer:
          '말씀교사 · 2부 교사 · 협력교사 · 방 제공자 · 전도교사가 함께 준비합니다. 매 주일 강습회에서 찬양·율동·말씀을 미리 훈련받습니다.',
      },
      {
        question: '새소식반의 자랑은 무엇인가요?',
        answer:
          '신나는 찬양과 율동, 쉽고 재미있는 말씀과 만들기로 “예수님을 닮아가는 어린이”로 자라도록 돕습니다.',
      },
    ],
    notes: [
      '처소별 교사·위치 안내는 담당교역자 확인 후 게시합니다.',
      '어린이 사진·영상은 얼굴이 드러나지 않게 하거나 보호자 동의를 받은 것만 올립니다.',
    ],
  },
];
