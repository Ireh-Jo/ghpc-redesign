/**
 * 사역(`/ministry`) 콘텐츠 — 별들의학교 · 제네바신학대학원대학교 · 경향선교회 · 경향복지재단 · 경향학원 · 놀이학원.
 *
 * 출처: 교역자 원고 (2026-10-09 수령)
 * - `사역2(3대 후원회).html` → 별들의학교 · 제신원 · 경향선교회 (로고 3종은 원고에 내장된 이미지를 꺼냈다: `public/ministry/`)
 * - `사역3(경향학원).html` → 경복여고 · 경복비즈니스고 · 경향키즈놀이학원
 * - `사역4(복지재단).html` → 성민종합사회복지관 · 경향지역아동센터 · 강서8호점 우리동네키움센터
 *   (활동사진은 현행 사이트 서버(http)에서 직접 불러오던 것이라 내려받아 메타데이터를 지우고 `public/ministry/welfare/`에 둠.
 *    키움센터 1장은 원본 서버에서도 404라 뺐다)
 *
 * 사진이 없는 자리(원고의 placeholder)는 `photoSlots`의 라벨로만 남긴다 — 사진이 오면 같은 자리에 넣는다.
 */

export type MinistryLink = { label: string; href?: string; kind?: 'primary' | 'line' | 'support' };

/* ── 별들의학교 ───────────────────────────────────────── */

export const STARS = {
  logo: { src: '/ministry/stars-logo.png', alt: '별들의학교 Stars for the Gospel 로고' },
  en: 'STARS FOR THE GOSPEL',
  verse: { text: '많은 사람을 옳은 데로 돌아오게 한 자는 별과 같이 빛나리라', ref: '다니엘 12:3' },
  body: [
    '별들의학교는 장차 복음 사역에 쓰임 받을 목사·전도사·선교사·신학교수를 발굴하고 양육하는 기관입니다.',
    '영아부터 청년까지를 대상으로, 단계적이고 체계적인 신앙교육을 통해 다음 세대의 사역자를 길러냅니다.',
  ],
  links: [
    { label: '별들의학교 홈페이지', href: 'https://starsforthegospel.or.kr/portal/information/introViewAction.do' },
  ] as MinistryLink[],
  curriculumLead: '연령별 발달 단계에 맞추어 신앙의 기초부터 신학적 사고까지 이어지는 과정입니다.',
  /** 단계별 과정 — `terms`의 각 쌍이 [상반기, 하반기] 한 해 */
  curriculum: [
    { stage: '영아부', sub: '0~2세', terms: [['별님 부모님의 마음가짐(부모교육)', '서원의 의미(부모교육)'], ['성경 낱말 들려주기', '기독교 낱말 들려주기']] },
    { stage: '유아부', sub: '3~5세', terms: [['성경 이야기 읽어주기 Ⅰ', '성경 이야기 읽어주기 Ⅱ'], ['구약 이야기 소재 만들기 놀이', '신약 이야기 소재 만들기 놀이']] },
    { stage: '유치부', sub: '6~7세', terms: [['하나님의 사람들: 구약 인물 Ⅰ', '하나님의 사람들: 신약 인물 Ⅰ'], ['하나님의 사람들: 구약 인물 Ⅱ', '하나님의 사람들: 신약 인물 Ⅱ']] },
    { stage: '초등부', sub: '1~3학년', terms: [['천지창조와 이스라엘 이야기', '선지자들 이야기'], ['하나님: 사랑의 아버지', '성경: 하나님의 말씀'], ['교회: 구원받은 사람들', '성경 인물로 알아보는 별님의 성품 Ⅰ']] },
    { stage: '초등부', sub: '4~6학년', terms: [['예수님의 생애 이야기', '사도들의 이야기'], ['사도신경: 이렇게 믿어요', '십계명: 이렇게 생활해요'], ['주기도문: 이렇게 기도해요', '성경 인물로 알아보는 별님의 성품 Ⅱ']] },
    { stage: '중등부', sub: '중1~3', terms: [['구약성경 알아보기', '신약성경 알아보기'], ['웨스트민스터 소요리문답 Ⅰ', '웨스트민스터 소요리문답 Ⅱ'], ['왕이신 하나님: 하나님의 주권', '복 받은 자녀들: 언약의 자녀']] },
    { stage: '고등부', sub: '고1~3', terms: [['교리 탐구 Ⅰ', '교리 탐구 Ⅱ'], ['간추린 세계교회사', '성경 - 형성의 역사와 신적 권위'], ['기독교와 문화', '기독교와 윤리']] },
    { stage: '대학·청년', sub: '대학~청년부', terms: [['웨스트민스터 신앙고백서 Ⅰ', '웨스트민스터 신앙고백서 Ⅱ'], ['구원의 5대 교리', '종교개혁사'], ['개혁신학 기초', '기독교 세계관'], ['성경연구 Ⅰ', '성경연구 Ⅱ']] },
  ],
  photoSlots: ['단기선교 활동', '말씀 수련회', '졸업 예배', '교사 교육', '하기 수양회'],
};

/* ── 제네바신학대학원대학교 ──────────────────────────── */

export const GTS = {
  logo: { src: '/ministry/gts-emblem.png', alt: '제네바신학대학원대학교 엠블럼' },
  en: 'GENEVA THEOLOGICAL SEMINARY',
  tagline: ['진리와 함께 50년', '진리를 향해 50년'],
  lead: '신앙의 선배들이 지켜온 개혁신학의 터 위에, 다음 세대의 사역자를 세우는 제네바신학대학원대학교입니다.',
  body: [
    '신사참배에 항거하다 투옥되었던 신앙의 선배들의 기도로 1946년 세워진 고려신학교의 정신을 잇습니다. 부산에서 폐교되었던 학교는 1976년 서울에서 다시 문을 열었고, 2017년 교육부 인가를 받아 ‘제네바신학대학원대학교’로 새롭게 도약했습니다.',
    '칼뱅과 개혁주의 전통 위에 서서, 개혁신학에 입각한 학문과 경건을 겸비한 하나님 나라의 일군을 양성합니다. 그렇게 하나님의 은혜로 한국교회와 세계교회를 세우는 사명을 감당해 왔습니다.',
    '우리 교회는 이 신학교를 물심양면으로 후원하며, 복음의 사역자가 세워지는 일에 함께하고 있습니다.',
  ],
  links: [{ label: '제네바신학대학원대학교 홈페이지', href: 'https://www.gts.ac.kr/' }] as MinistryLink[],
  photoSlots: ['사랑의 모임', '봉사의 모임', '신학교 후원 행사'],
};

/* ── 경향선교회 ──────────────────────────────────────── */

/**
 * ⚠️ 특수지역(보안지역) 선교사 실명 공개 스위치.
 *
 * 원고에는 특수지역(동아시아·M국·I국) 선교사·현지 사역자 실명이 들어 있다. 이 항목은 원래
 * `docs/NEXT.md` §3 "🔴 착수 금지 — 선교회 담당자 확인 전"이었고, 2026-10-09 사용자가 "원고대로 이름 공개"로 결정했다.
 * 한 번 공개되면 검색엔진·아카이브에 남아 되돌리기 어렵다 — **선교회 확인이 아직이면 `false`로 바꾸면** 특수지역은
 * 나라·인원 없이 "보안상 명단을 공개하지 않습니다"만 보인다.
 */
export const SHOW_SPECIAL_REGION_NAMES = true;

export const MISSION = {
  logo: { src: '/ministry/mission-mark.png', alt: '경향선교회 GHPC 마크' },
  en: 'THE CHURCH WITH A GLOBAL VISION',
  verse: {
    text: '오직 성령이 너희에게 임하시면 너희가 권능을 받고 내 증인이 되리라 하시니라',
    ref: '사도행전 1:8',
  },
  body: [
    '1980년 4월 13일, ‘세계를 받은 교회’로서 첫 걸음을 뗀 경향선교회는 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르는 복음의 사명을 감당하고 있습니다.',
    '선교사를 발굴·양육하여 파송하고, 선교지에 교회를 세운 뒤 현지인을 제자로 양육해 목사로 세우고 있습니다.',
    '세계선교 42년을 맞은 지금, 선교지의 교회와 신학교를 통해 다음 세대의 사역자를 길러내며 독립된 노회 설립의 단계까지 이르고 있습니다.',
  ],
  // 확인: 원고 수치 그대로 — '42년'은 1980년 기준으로 2022년 값이다 (2026년이면 46년). 갱신 여부 확인 필요
  stats: [
    { value: '42년', label: '선교 역사' },
    { value: '73여 명', label: '선교사' },
    { value: '72개', label: '현지 교회' },
    { value: '3,200여 명', label: '성도' },
  ],
  roles: [
    { title: '가는 선교사', body: '소명을 받아 장립되고 선교지로 파송된 선교사들이 현지에서 교회를 개척하고, 현지인을 제자로 양육합니다.' },
    { title: '보내는 선교사', body: '경향교회 성도는 기도와 재정 후원으로 선교사를 세상에 보내는 역할을 함께 감당합니다.' },
  ],
  steps: [
    { title: '발굴 · 양육', body: '별들의학교를 통해 선교에 소명받은 사역자를 발굴하고 신학교에서 양육합니다' },
    { title: '장립 · 파송', body: '사명자를 목사로 장립하고 선교지로 파송합니다' },
    { title: '교회 개척', body: '선교지에 현지 교회를 세웁니다' },
    { title: '제자 양육 · 자립', body: '현지인을 목사로 세우고 교회를 승계합니다 — 독립 노회 설립까지' },
  ],
  /** 지역별 파송·협력 선교사 — `special: true`는 `SHOW_SPECIAL_REGION_NAMES`를 따른다 */
  regions: [
    {
      title: '러시아지역',
      countries: [
        { name: '사할린', names: '양영현 · 나타샤 · 잔나 · 갈리나 · 베라' },
        { name: '나홋카', names: '최아르투르' },
        { name: '빠고로프까', names: '이민찬 · 알렉A · 알렉B' },
        { name: '모스크바', names: '김진호 · 최레바 · 드미뜨리 · 꾸르바노프 · 김라디온' },
        { name: '로스톱나도누', names: '니꼴라이 · 예브다끼야 · 유리 유가이' },
      ],
    },
    {
      title: '아시아지역',
      countries: [
        { name: '필리핀', names: '이창재 · 김진우 · 나길라 · 로시' },
        { name: '캄보디아', names: '백의성' },
        { name: '베트남', names: '임민철' },
        { name: '미얀마', names: '이종민 · 쏘쪼모' },
      ],
    },
    {
      title: '남미지역',
      countries: [
        {
          name: '브라질',
          names: '안승복 · 김상식 · 프란시스꼬 · 마르낑요 · 마르꼬스 · 안또니오 · 까뻬 · 자르데우 · 이따 · 주니어 · 아동 · 맥스웰 · 웨슬리',
        },
      ],
    },
    {
      title: '특수지역',
      special: true,
      countries: [
        {
          name: '동아시아',
          // 확인: 명단 중간의 '사천성'은 사람 이름이 아니라 지명(쓰촨성)으로 보인다 — 원고 그대로 둔다
          names:
            '정호철 · 이은주 · 정바울 · 김마가 · 박요셉 · 황다니엘 · 김수아 · 최지만 · 김모세 · 조강 · 사천성 · 주사룡 · 리청장 · 판중리 · 순시엔잉 · 왕푸민 · 예한라오 · 루오춘푸 · 천인보 · 류하오 · 류쩐유 · 따이궈쩐 · 위꽝훈 · 짱군잔 · 서싸이롱 · 양린 · 거시홍',
        },
        { name: 'M국', names: '최대니' },
        { name: 'I국', names: '이종현 · 백수연' },
      ],
    },
    {
      title: '공로 · 원로 · 은퇴 선교사',
      countries: [
        { name: '공로선교사', names: '최기만 (외항선교 명예)' },
        { name: '원로선교사', names: '김종도 (동아시아)' },
        { name: '은퇴선교사', names: '김영호 (필리핀)' },
      ],
    },
  ] as { title: string; special?: boolean; countries: { name: string; names: string }[] }[],
  photoSlots: ['단기선교', '담임목사님 사역지 방문', '선교사님 사역', '현지 교회 예배', '선교지 신학교'],
};

/* ── 경향복지재단 ────────────────────────────────────── */

export type WelfareOrg = {
  name: string;
  desc: string;
  photos: { src: string; alt: string }[];
  links: MinistryLink[];
};

export const WELFARE: { en: string; orgs: WelfareOrg[] } = {
  en: 'GYUNG-HYANG WELFARE FOUNDATION',
  orgs: [
    {
      name: '성민종합사회복지관',
      desc: '서울 관악구 삼성동에서 지역 주민과 함께 살아가는 사회복지 전문기관입니다. 어르신 급식·돌봄, 아동·청소년 교육문화, 지역 사례관리 등 다양한 복지사업을 운영합니다.',
      photos: [
        { src: '/ministry/welfare/sungmin-1.jpg', alt: '성민종합사회복지관 활동 사진' },
        { src: '/ministry/welfare/sungmin-2.jpg', alt: '성민종합사회복지관 활동 사진' },
      ],
      links: [
        // https 인증서가 없어 http로 둔다 (lib/related-orgs.ts와 같은 이유)
        { label: '홈페이지 바로가기', href: 'http://www.smw.or.kr/', kind: 'primary' },
        { label: '인스타그램', href: 'https://www.instagram.com/sungmin_welfare', kind: 'line' },
        {
          label: '후원하기',
          href: 'http://www.smw.or.kr/bbs/board.php?bo_table=m03_01&sca=%EB%82%98%EB%88%94%EC%95%88%EB%82%B4',
          kind: 'support',
        },
        {
          label: '자원봉사 신청',
          href: 'http://www.smw.or.kr/bbs/board.php?bo_table=m03_02&sca=%EC%9E%90%EC%9B%90%ED%99%9C%EB%8F%99%EC%95%88%EB%82%B4',
          kind: 'support',
        },
      ],
    },
    {
      name: '경향지역아동센터',
      desc: '경향교회 교육관 3층에 자리한 아동복지시설로, 초등학생부터 고등학생까지 방과후 돌봄과 학습·정서·문화 프로그램을 제공합니다.',
      photos: [
        { src: '/ministry/welfare/child-1.jpg', alt: '경향지역아동센터 활동 사진 — 웅진플레이' },
        { src: '/ministry/welfare/child-2.jpg', alt: '경향지역아동센터 활동 사진 — 우장산 숲체험' },
        { src: '/ministry/welfare/child-3.jpg', alt: '경향지역아동센터 활동 사진 — 딸기농장 체험' },
        { src: '/ministry/welfare/child-4.jpg', alt: '경향지역아동센터 활동 사진 — 뮤지컬 관람' },
      ],
      links: [
        { label: '홈페이지 바로가기', href: 'https://www.hjy.kr/center/index.php?cId=ghpc1516', kind: 'primary' },
        { label: '인스타그램', href: 'https://www.instagram.com/ghlcc_love/', kind: 'line' },
        { label: '후원 및 자원봉사 문의 02-876-0900', href: 'tel:028760900', kind: 'support' },
      ],
    },
    {
      name: '강서8호점 우리동네키움센터',
      desc: '강서구청으로부터 운영을 위탁받아 2025년부터 운영 중인 초등 돌봄센터로, 정서·체육·독서·공예·요리 등 다채로운 성장 프로그램을 진행합니다.',
      photos: [
        { src: '/ministry/welfare/kium-1.jpg', alt: '강서8호점 우리동네키움센터 활동 사진 — 키움UP' },
        { src: '/ministry/welfare/kium-2.jpg', alt: '강서8호점 우리동네키움센터 활동 사진 — 창의신체' },
        { src: '/ministry/welfare/kium-4.jpg', alt: '강서8호점 우리동네키움센터 활동 사진 — 도자기 공예' },
      ],
      links: [
        // 원고의 '홈페이지 바로가기'는 현행 경향교회 사이트의 키움센터 페이지다
        { label: '키움센터 소개 (현재 홈페이지)', href: 'https://ghpc.or.kr/Page/Index/131954', kind: 'primary' },
        { label: '후원 및 자원봉사 문의 02-876-0900', href: 'tel:028760900', kind: 'support' },
      ],
    },
  ],
};

/* ── 경향학원 · 놀이학원 ─────────────────────────────── */

export const SCHOOL = {
  en: '학교법인 경향학원',
  headline: '믿음과 실력을 함께 키우는 다음세대 배움터',
  lead: [
    '경향교회는 학원복음화를 교회의 중요한 사명으로 삼아왔습니다.',
    '기독교 정신에 입각한 경영으로 신앙과 실력을 겸비한 인재를 키워내고자, 경복여자고등학교와 경복비즈니스고등학교, 경향키즈놀이학원을 세워 운영하고 있습니다.',
  ],
  schools: [
    {
      badge: '慶福',
      name: '경복여자고등학교',
      desc: '하나님의 형상을 닮은 인재를 길러내는 기독교 명문 여자고등학교입니다. 신앙 위에 세운 배움으로 다음세대 딸들을 세워갑니다.',
      link: { label: '경복여자고등학교 홈페이지', href: 'https://kb.sen.hs.kr/52356/subMenu.do' },
      domain: 'kb.sen.hs.kr',
    },
    {
      badge: 'Biz',
      tag: '특성화고등학교 · 서울형 마이스터고 선도학교',
      name: '경복비즈니스고등학교',
      desc: '신앙 인격과 실무 역량을 함께 갖춘 인재를 키우는 특성화고등학교입니다. 세상 속에서 빛과 소금으로 살아갈 전문인을 길러냅니다.',
      link: { label: '경복비즈니스고등학교 홈페이지', href: 'https://kbb.sen.hs.kr/74588/subMenu.do' },
      domain: 'kbb.sen.hs.kr',
    },
  ] as { badge: string; tag?: string; name: string; desc: string; link: MinistryLink; domain: string }[],
};

/**
 * 어린이집 · 놀이학원 (`#childcare`) — 원고에는 경향키즈놀이학원만 있다.
 * 확인: GNB 라벨은 '어린이집 · 놀이학원'인데 어린이집 원고는 없다 (docs/NEXT.md §2)
 */
export const KIDS_ACADEMY = {
  badge: 'Kids',
  name: '경향키즈놀이학원',
  desc: '어린 자녀들이 마음껏 뛰놀며 하나님의 사랑을 자연스럽게 만나는 공간입니다. 놀이를 통해 몸과 마음, 믿음이 함께 자라갑니다.',
  link: {
    label: '경향키즈놀이학원 소식 보러가기',
    href: 'https://cafe.naver.com/f-e/cafes/30939262/articles/58?boardtype=L&menuid=8&referrerAllArticles=false',
  } as MinistryLink,
  domain: '네이버 카페',
};
