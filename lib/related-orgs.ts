/**
 * 관련 기관 — 메인 하단 "바른 신앙, 따뜻한 사랑이 있는 공동체" 블록.
 * 2026-09-16 디자인팀 메인 시안의 6개를 그대로 옮겼다 (시안 표기 그대로 · 순서 그대로).
 *
 * URL 출처: `docs/meetings/2026-08-09-화면시안-분석-작업플랜.md` §유형 A "확인된 외부 링크".
 * 외부 URL이 없는 두 곳은 `/ministry` 앵커로 보낸다 — 기관 페이지가 채워지면 그대로 쓰면 되고,
 * 공식 URL이 확인되면 여기만 고친다.
 *
 * ⚠️ `성민종합사회복지관`은 **https가 안 열린다**(인증서 없음). http로 둔다 — 링크라 혼합 콘텐츠 문제는 없다.
 */

export type RelatedOrg = {
  /** 시안 표기 그대로 */
  name: string;
  href: string;
  /** 카드 뒷면에 뜨는 한 줄 */
  desc: string;
  /** 외부 사이트면 새 탭 */
  external?: boolean;
};

export const RELATED_ORGS: RelatedOrg[] = [
  {
    name: '경향키즈놀이학원',
    // 고정 URL 없음 (현행은 네이버 카페 개별 글) — 작업플랜 D-5
    href: '/ministry#childcare',
    desc: '어린이집 · 놀이학원',
  },
  {
    name: '제네바신학대학원대학교',
    href: 'https://gts.ac.kr',
    desc: '신학 교육 기관',
    external: true,
  },
  {
    name: '성민종합사회복지기관',
    href: 'http://smw.or.kr',
    desc: '지역 사회복지',
    external: true,
  },
  {
    name: '경향복지재단',
    // 공식 URL 미확인
    href: '/ministry#welfare',
    desc: '복지 사역',
  },
  {
    name: '경복여자고등학교',
    href: 'https://kb.sen.hs.kr',
    desc: '경향학원',
    external: true,
  },
  {
    name: '경복비즈니스고등학교',
    href: 'https://kbb.sen.hs.kr',
    desc: '경향학원',
    external: true,
  },
];
