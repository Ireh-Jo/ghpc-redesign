/**
 * 메인 공지사항 — **관리자(미디어팀)가 넣고 빼는 영역** (2026-09-16 사용자 지시).
 *
 * 목록 문구는 디자인팀 메인 시안(2026-09-16)에 실린 4건을 그대로 옮겼다.
 * 지금은 이 파일이 단일 출처다 — 바꾸려면 코드 수정 + 배포가 필요하다 = 미디어팀은 못 바꾼다.
 * Supabase 연결 뒤에는 `context/03-data-model.md` §5 `posts`에서 최신 N건을 읽어 오고 이 파일은 사라진다.
 * ⚠️ 지금 `posts.category`는 `news / video_news / members / denomination` 넷뿐이라 **`notice`가 없다**
 * (2026-09-16 확인). 스키마 확정 때 카테고리를 추가할 것.
 *
 * 링크는 아직 상세 페이지가 없어 전부 `/church-admin/notice`(공지 목록 스텁)로 보낸다.
 * 게시판형 목록 UI가 생기면(`docs/NEXT.md` 1-4) 글 상세 URL로 바꾼다.
 */

export type Notice = {
  id: string;
  title: string;
  href: string;
  /** 표시용 날짜 (YYYY.MM.DD). 시안에는 날짜가 없어 지금은 쓰지 않는다 */
  date?: string;
};

/** 메인에 노출할 건수 — 시안 기준 4건 (PC·모바일 동일) */
export const MAIN_NOTICE_COUNT = 4;

export const NOTICES: Notice[] = [
  { id: 'seat-guide', title: '예배별 장소 및 교구별 좌석안내', href: '/church-admin/notice' },
  { id: 'book-oct', title: '10월 담임목사님 추천도서', href: '/church-admin/notice' },
  { id: 'online-offering', title: '온라인 헌금안내', href: '/giving' },
  {
    id: 'kidscafe-hire',
    title: '서울형 키즈카페 강서구 등촌3동점 직원 채용 공고',
    href: '/church-admin/notice',
  },
];
