/**
 * 예배 실황(생방송 탭)·특별순서 영상 목록 — 임시 목업.
 *
 * 값은 현행 사이트 게시판에서 그대로 옮겼다 (2026-09-15 기준 최신순):
 * - 예배 실황: `/Board/Index/137000`(주일낮) · `137001`(주일밤) · `137002`(수요밤) · `142105`(특별예배) ·
 *   `115950`(강해) · `48`(집회·특강)
 * - 특별순서: `/Board/Index/4434`(낮예배특송) · `4435`(밤예배특송) · `4433`(신앙간증)
 *
 * Supabase `sermons` 테이블 또는 유튜브 재생목록 동기화(검토서 §4-4)로 이관하면 이 파일은 사라진다.
 * 각 분류의 "전체 보기"는 **현행 게시판으로 나간다** — 새 화면과 현행을 비교하기 위한 임시 장치이고
 * **오픈 전에 제거**한다 (2026-09-15 사용자 지시). 새 영상은 이 파일을 고치기 전엔 반영되지 않는다 — 자동화 결정 필요.
 */

export type ArchiveVideo = {
  videoId: string;
  title: string;
  /** 표시용 날짜 (YYYY.MM.DD) */
  date: string;
  /** 설교 본문 — 예배 실황만 */
  scripture?: string;
  /** 설교자 또는 특송자 */
  speaker?: string;
};

/** 각 분류는 **최소 4편** 유지 — 상단 플레이어 1편 + 아래 "지난 영상" 3편이 한 줄로 딱 맞는다 */
export type ArchiveCategory = {
  key: string;
  label: string;
  videos: ArchiveVideo[];
  /**
   * 이관 전까지 "전체 보기"가 향할 현행 사이트 목록.
   * 새 화면과 현행을 나란히 비교하려고 일부러 남겨 둔다 (2026-09-15 사용자 지시) — **오픈 전 제거.**
   */
  legacyUrl: string;
};

const LEGACY = 'https://www.ghpc.or.kr';

/** 생방송 탭 = 예배 실황 (2026-09-15 디자인팀 시안 확인) */
export const SERVICE_ARCHIVE: ArchiveCategory[] = [
  {
    key: 'sunday-day',
    label: '주일 낮예배',
    legacyUrl: `${LEGACY}/Board/Index/137000`,
    videos: [
      { videoId: 'ypcPPGQFeN8', title: '다시 일어설 힘이 없을 때', date: '2026.09.13', scripture: '열왕기상 19장 1-18절', speaker: '신승욱 목사' },
      { videoId: 'rkxtonYFMPI', title: '삶의 모든 자리에서 주를 섬기라', date: '2026.09.06', scripture: '골로새서 3장 22절-4장 1절', speaker: '신승욱 목사' },
      { videoId: 'fEAbkKT8puc', title: '헛되고 공허한 삶에서 건짐받은 사람들', date: '2026.08.30', scripture: '베드로전서 1장 13-21절', speaker: '신승욱 목사' },
      { videoId: 'MA538G4XjCY', title: '은혜가 몸을 움직일 때', date: '2026.08.23', scripture: '로마서 12장 3-8절', speaker: '신승욱 목사' },
    ],
  },
  {
    key: 'sunday-night',
    label: '주일 밤예배',
    legacyUrl: `${LEGACY}/Board/Index/137001`,
    videos: [
      { videoId: 'ZYzM8w9g9X4', title: '광야 길을 걷게 하신 것을 기억하라', date: '2026.09.13', scripture: '신명기 8장 1-10절', speaker: '김윤식 목사' },
      { videoId: '7PUltPiIfKQ', title: '창조 신화 vs 창조 계시', date: '2026.09.06', scripture: '창세기 1장 1절', speaker: '김주원 목사' },
      { videoId: '67mpjXAugTw', title: '행함과 진실함으로 사랑하자', date: '2026.08.30', scripture: '요한일서 3장 11-24절', speaker: '이상민 목사' },
      { videoId: 'g4qL0vY_IMQ', title: '여기는 빈들이니이다', date: '2026.08.23', scripture: '유다서 1장 14-15절', speaker: '손광식 목사' },
    ],
  },
  {
    key: 'wednesday',
    label: '수요 밤예배',
    legacyUrl: `${LEGACY}/Board/Index/137002`,
    videos: [
      { videoId: 'IDuk1XHCfH0', title: '하나님을 찬송하는 일이 아름답고 마땅하도다', date: '2026.09.09', scripture: '시편 147편 1-20절', speaker: '오태희 강도사' },
      { videoId: 'g8nWnP-Cxy4', title: '사유하심이 주께 있음은', date: '2026.09.02', scripture: '시편 130편 1-8절', speaker: '박현준 강도사' },
      { videoId: 'uaRs2SBuB8U', title: '내가 자식을 잃게되면 잃으리로다', date: '2026.08.26', scripture: '창세기 43장 1-15절', speaker: '김수만 목사' },
      { videoId: 's4m9UXOk0pA', title: '와서 조반을 먹으라', date: '2026.08.19', scripture: '요한복음 21장 1-18절', speaker: '김윤식 목사' },
    ],
  },
  {
    key: 'special-service',
    label: '특별예배',
    legacyUrl: `${LEGACY}/Board/Index/142105`,
    videos: [
      { videoId: 'D0ppYnRhTsE', title: '예수정사기념예배', date: '2026.04.03', scripture: '갈라디아서 6장 11-16절', speaker: '신승욱 목사' },
      { videoId: 'lssOgF7NYAA', title: '송구영신예배', date: '2026.01.01', scripture: '시편 81편 1-16절', speaker: '신승욱 목사' },
      { videoId: 'UkExHNotEms', title: '성탄축하예배', date: '2025.12.25', scripture: '요한복음 1장 1-18절', speaker: '신승욱 목사' },
      { videoId: 'h3XZBeM94H8', title: '예수정사기념예배', date: '2025.04.18', scripture: '로마서 5장 6-11절', speaker: '신승욱 목사' },
    ],
  },
  {
    // 유튜브 설명란을 보면 이 분류의 영상 머리글이 `금요밤기도회 2026-09-11`이다 —
    // 현행 게시판 이름은 `강해`지만 실제로는 **금요밤기도회 설교**다. 라벨 확정 필요 (검토서 §7).
    key: 'exposition',
    label: '강해',
    legacyUrl: `${LEGACY}/Board/Index/115950`,
    videos: [
      { videoId: '7ckXxiH5Dmg', title: '하나님의 영광을 인정하는 것(I)', date: '2026.09.11', scripture: '하박국 2장 12-14절', speaker: '신승욱 목사' },
      { videoId: 'yP-L8Y6cdC4', title: '믿음 없는 삶의 다섯 모습(Ⅴ)', date: '2026.09.04', scripture: '하박국 2장 9-14절', speaker: '신승욱 목사' },
      { videoId: 'es3pthIwXYQ', title: '믿음 없는 삶의 다섯 모습(Ⅳ)', date: '2026.08.28', scripture: '하박국 2장 5-8절', speaker: '신승욱 목사' },
      { videoId: 'Ymh2sqJm09E', title: '믿음 없는 삶의 다섯 모습(Ⅲ)', date: '2026.08.21', scripture: '하박국 2장 5-8절', speaker: '신승욱 목사' },
    ],
  },
  {
    key: 'conference',
    label: '집회 · 특강',
    legacyUrl: `${LEGACY}/Board/Index/48`,
    videos: [
      { videoId: 'yrTlaIanAyU', title: '“죽으면 죽으리이다” 입을 열면 길이 열린다', date: '2026.01.21', scripture: '에스더 4장 13-17절', speaker: '신승욱 목사' },
      { videoId: 'e47Hqlrb_tc', title: '책임', date: '2026.01.21', scripture: '요한복음 9장 18-25절', speaker: '박윤석 목사' },
      { videoId: '4EoVpEhm444', title: '내가 여호와 앞에 내 마음을 쏟았나이다', date: '2026.01.20', scripture: '사무엘상 1장 9-20절', speaker: '신승욱 목사' },
      { videoId: 'W1WQBx3zzpE', title: '실로암, 보냄을 받은 사람', date: '2026.01.20', scripture: '요한복음 9장 1-12절', speaker: '박윤석 목사' },
    ],
  },
];

/** 특별순서 — 특송 · 간증 */
export const SPECIAL_ARCHIVE: ArchiveCategory[] = [
  {
    key: 'day-song',
    label: '낮예배 특송',
    legacyUrl: `${LEGACY}/Board/Index/4434`,
    videos: [
      { videoId: 'IyJdaHfgtlE', title: '나를 지으신 주님', date: '2026.09.13', speaker: '김지수 집사' },
      { videoId: 'S6IJPdeSKgo', title: '일상', date: '2026.09.06', speaker: '김성아 학생' },
      { videoId: 'jODvZKUaiiU', title: '믿음이 없이는', date: '2026.08.30', speaker: '김지수 집사' },
      { videoId: 'K_NBxoB2RRs', title: '하나님의 은혜', date: '2026.08.23', speaker: '구한나 집사' },
    ],
  },
  {
    key: 'night-song',
    label: '밤예배 특송',
    legacyUrl: `${LEGACY}/Board/Index/4435`,
    videos: [
      { videoId: '64dbunW5HqU', title: '행군 나팔 소리에', date: '2026.09.13', speaker: '풋살 선수단' },
      { videoId: 'VSM-dE9LGEo', title: '나의 믿음을 드러냅니다', date: '2026.09.06', speaker: '임마누엘중창단' },
      { videoId: '4dggCTIrQgc', title: '날 세우시네', date: '2026.08.30', speaker: '임직원' },
      { videoId: 'Eps1nmWg2d8', title: '빛의 사자들이여', date: '2026.08.23', speaker: '개교 50주년 기념 수상자' },
    ],
  },
  {
    key: 'testimony',
    label: '신앙 간증',
    legacyUrl: `${LEGACY}/Board/Index/4433`,
    videos: [
      { videoId: '-QT2D9JY25s', title: '신앙 간증', date: '2026.09.13', speaker: '안민기 집사' },
      { videoId: 'Uh4dm1BcmSw', title: '신앙 간증', date: '2026.06.21', speaker: '하미경 집사' },
      { videoId: 'UcNh1pKDWAk', title: '신앙 간증', date: '2026.04.26', speaker: '권미선 집사' },
      { videoId: 'GaZqZ8mwJfw', title: '신앙 간증', date: '2026.03.22', speaker: '황미화 권사' },
    ],
  },
];

/**
 * 생방송 편성 — 현행 `/Page/Index/41`의 "생방송 시간" 그대로.
 * `day`는 `Date.getDay()` 기준 (0=일). 방송 상태 표시에만 쓰고, 실제 라이브 여부는
 * 유튜브 채널 임베드가 스스로 판단한다 (수동 on/off 없음 — `components/content/live-panel.tsx`).
 */
export const LIVE_SCHEDULE = [
  { label: '주일 낮예배', day: 0, startMin: 11 * 60, durationMin: 100 },
  { label: '수요 밤예배', day: 3, startMin: 19 * 60 + 30, durationMin: 90 },
  { label: '금요밤기도회', day: 5, startMin: 20 * 60, durationMin: 90 },
] as const;

/**
 * 방송을 예배 시작 **몇 분 전**부터 켜는가. 미디어팀이 보통 15분 전쯤 스트림을 연다(2026-09-15 확인) —
 * 그 시간부터 플레이어를 띄워 둬야 먼저 들어온 사람이 빈 화면을 보지 않는다.
 */
export const LIVE_PRE_ROLL_MIN = 15;

export const YOUTUBE_CHANNEL_ID = 'UCpPEfMA_nBf1koFnjyKu1pg';
