/**
 * 예배·모임 시간표 데이터 — 단일 출처 (Supabase `services` 테이블 이관 전 임시).
 * 스키마: `context/03-data-model.md` §services. 표 렌더: `components/content/service-time-table.tsx`.
 *
 * 값은 **디자인팀 시안(`예배및모임안내 pc.ai`, 2026-09-15)** 기준으로 옮겼다.
 * 현행 사이트(ghpc.or.kr/Page/Index/34)와 다른 곳이 5군데 있고 전부 교회 확인 대기다 —
 * 상세·근거: `docs/2026-09-15-예배페이지-디자인시안-검토.md` §6.
 */

export type ServiceColumn = { key: string; label: string };
export type ServiceGroup = { label: string; span: number };
/** 표 제목 오른쪽에 붙는 바로가기 (네이버 카페 등 외부 링크) — 2026-09-18 예배 시안 */
export type ServiceLink = { label: string; href: string };
export type ServiceTable = {
  id: string;
  title: string;
  columns: ServiceColumn[];
  groups?: ServiceGroup[];
  rows: Record<string, string>[];
  note?: string;
  links?: ServiceLink[];
};

export const SERVICE_TABLES: ServiceTable[] = [
  {
    id: 'services',
    title: '예배 및 모임안내',
    // 시안(2026-09-18)이 이 표 오른쪽에 주일학교 카페를 뒀다. URL은 사용자 전달분.
    links: [{ label: '주일학교 카페', href: 'https://cafe.naver.com/ghpcedu1' }],
    columns: [
      { key: 'name', label: '구분' },
      { key: 'time', label: '시간' },
      { key: 'place', label: '장소' },
    ],
    rows: [
      { name: '주일낮 1부예배', time: '오전 7시', place: '비전홀 (지하 1층)' },
      { name: '주일낮 2부예배', time: '오전 9시', place: '트리니티홀 (1층)' },
      { name: '주일낮 3부예배', time: '오전 11시', place: '트리니티홀 (1층) / 비전홀 (지하 1층)' },
      // 현행은 트리니티홀 단독 — 시안에서 비전홀이 추가됐다 (확인 대기, 검토서 §6-3)
      { name: '주일 밤예배', time: '오후 7시', place: '트리니티홀 (1층) / 비전홀 (지하 1층)' },
      { name: '수요 밤예배', time: '오후 7시 30분', place: '비전홀 (지하 1층)' },
      // 현행 명칭은 '금요밤예배' (확인 대기, 검토서 §6-4)
      { name: '금요밤기도회', time: '오후 8시', place: '트리니티홀 (1층)' },
      { name: '새벽기도회', time: '월–토 오전 5시', place: '비전홀 (지하 1층)' },
      { name: '청년회 모임', time: '주일 오후 1시 30분', place: '글로브홀 (지하 2층)' },
      // 현행에 있던 `구역장성경공부 — 온라인(홈페이지)` 행은 시안에서 빠졌다 (삭제 확정 여부 확인 대기, 검토서 §6-5)
    ],
  },
  {
    id: 'sunday-school',
    title: '주일학교 예배 및 모임',
    columns: [
      { key: 'dept', label: '부서' },
      { key: 'age', label: '구분' },
      { key: 'time', label: '시간' },
      { key: 'place', label: '장소' },
    ],
    // 연령이 현행 사이트보다 한 살씩 낮다(영아부 0-3세 → 0-2세 등). 만 나이 전환으로 보이나 확인 대기 —
    // 현행에 있던 `(태아-24년생)` 년생 병기도 시안에서 빠졌다. 검토서 §6-1.
    rows: [
      { dept: '영아부', age: '0-2세', time: '오전 9시', place: '제1교육실' },
      { dept: '유아부', age: '3-4세', time: '오전 9시', place: '제7교육실' },
      { dept: '유치 1부', age: '5-6세', time: '오전 9시', place: '제2교육실' },
      { dept: '유치 2부', age: '0-6세', time: '오전 11시', place: '제1교육실' },
      { dept: '초등 1부', age: '1-2학년', time: '오전 9시', place: '제4교육실' },
      { dept: '초등 2부', age: '3-4학년', time: '오전 9시', place: '제3교육실' },
      { dept: '초등 3부', age: '5-6학년', time: '오전 9시', place: '제8교육실' },
      { dept: '초등 4부', age: '1-6학년', time: '오전 11시', place: '제3교육실' },
    ],
  },
  {
    id: 'sfc',
    title: 'S.F.C. 주일예배 및 모임',
    // 시안은 중등부·고등부·대학부 3개 버튼이지만 전달받은 URL은 중고등부 통합 1개 + 대학부 1개다 (2026-09-18).
    // 중등부·고등부가 분리된 카페가 따로 있으면 여기 항목만 늘리면 된다.
    links: [
      { label: '중고등부 카페', href: 'https://cafe.naver.com/ghmhsfc' },
      { label: '대학부 카페', href: 'https://cafe.naver.com/shalomuniv' },
    ],
    // 시안은 헤더가 `부서 | 예배 | 장소 | 예배 | 장소`로 4·5열이 '예배'로 잘못 적혀 있다.
    // 현행 사이트 기준 두 번째 묶음은 중·고등부 = 성경공부, 대학부 = 모임이다 (검토서 §6-2).
    // 같은 이름의 열이 두 번 나오는 모호함도 없애려고 2단 헤더로 묶었다.
    groups: [
      { label: '', span: 1 },
      { label: '예배', span: 2 },
      { label: '성경공부 · 모임', span: 2 },
    ],
    columns: [
      { key: 'dept', label: '부서' },
      { key: 'worshipTime', label: '시간' },
      { key: 'worshipPlace', label: '장소' },
      { key: 'studyTime', label: '시간' },
      { key: 'studyPlace', label: '장소' },
    ],
    rows: [
      {
        dept: '중등부',
        worshipTime: '오전 9시',
        worshipPlace: '트리니티홀',
        studyTime: '오전 10시 10분',
        studyPlace: '교육관 3층',
      },
      {
        dept: '고등부',
        worshipTime: '오전 9시',
        worshipPlace: '트리니티홀',
        studyTime: '오전 10시 10분',
        studyPlace: '교육관 4층',
      },
      {
        dept: '대학부',
        worshipTime: '오전 9시, 11시',
        worshipPlace: '트리니티홀',
        studyTime: '오후 1시 20분',
        studyPlace: '교육관 4층',
      },
    ],
  },
];
