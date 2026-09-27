import { getPlaylistFeed, type FeedEntry } from './youtube-feed';
import {
  SERVICE_ARCHIVE,
  SPECIAL_ARCHIVE,
  type ArchiveCategory,
  type ArchiveVideo,
} from './worship-videos';

/**
 * 예배 실황·특별순서 목록 = **유튜브 재생목록 RSS + 시드(`lib/worship-videos.ts`)** 병합 (2026-09-27).
 *
 * 미디어팀이 유튜브에 올리기만 하면 최대 10분 뒤 홈페이지에 뜬다. 추가 입력 없음.
 * 근거 조사: `docs/2026-09-15-예배페이지-디자인시안-검토.md` §4-4 (재생목록·설명란 양식).
 *
 * 병합 규칙:
 * - 시드에 있는 영상은 **시드가 이긴다** (손으로 다듬은 제목·분류). RSS는 시드에 없는 영상만 더한다
 * - 날짜 내림차순 정렬 — 날짜는 제목의 `YYYY-MM-DD`에서 읽는다 (업로드 시각이 아니라 예배 날짜)
 * - RSS가 실패하면 시드만 나온다 (= 2026-09-27 이전과 같은 화면)
 *
 * 수동으로 남은 분류: `신앙 간증` — 채널에 재생목록이 없다. 새 간증은 시드에 직접 추가한다.
 *
 * TODO(youtube-api): API 전환 시 `lib/youtube-feed.ts`만 바꾸면 된다. 강해 재생목록은 **시리즈마다 새로 생긴다**
 * (갈라디아서 → 하박국) — 시리즈가 바뀌면 아래 `PLAYLISTS.exposition`을 교체해야 한다. API로 가면 채널 재생목록을
 * 이름(`*강해`)으로 찾아 자동화할 수 있다.
 */

const PLAYLISTS = {
  /** `예배실황2(2026-02-15부터)` — 주일낮·주일밤·수요밤이 섞여 올라온다 */
  services: 'PLX5x3I1V2lX-Td0HcMO0QCbRVWiJZ_UCv',
  /** `하박국 강해` — 금요밤기도회 설교. 시리즈가 끝나면 교체 */
  exposition: 'PLX5x3I1V2lX8NUJvsL_dMPVM4_aS7I9oC',
  /** `집회/특강` */
  conference: 'PLX5x3I1V2lX-CxX61PWodQe8knxbQpRau',
  /** `예배특송` — 낮·밤 특송이 섞여 올라온다 */
  songs: 'PLX5x3I1V2lX8IdC-PYp2egqG8B2Ji9ymk',
} as const;

/** 분류별 보관 편수 — 화면은 플레이어 1 + 지난 영상 3만 쓴다. 여유를 조금 둔다 */
const KEEP = 8;

/* ── 파싱 ─────────────────────────────────────────────── */

/** 제목의 `2026-09-27` → `2026.09.27` */
const dateOf = (title: string) => {
  const m = title.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : '';
};

/** 제목을 `|`로 자르고 꼬리의 `경향교회`를 뗀다 */
const partsOf = (title: string) =>
  title
    .split('|')
    .map((p) => p.trim())
    .filter((p) => p && p !== '경향교회');

/**
 * 설교 영상. 설명란의 `설교: {제목}({본문}) {설교자}` 줄이 1순위 (2~3번째 줄에 온다 — 위치가 아니라 머리글로 찾는다).
 * 없으면 제목 `헤드 | 설교제목(본문) | 설교자` 형식(강해)을 본다. 둘 다 없으면 헤드(`주일밤예배실황`)만 제목으로.
 */
export function parseSermon(entry: FeedEntry): ArchiveVideo {
  const date = dateOf(entry.title);
  const line = entry.description
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('설교:'));
  // 제목 안의 괄호(`(I)`)는 탐욕 매칭으로 넘기고 **마지막 괄호**를 본문으로 본다
  const m = line?.match(/^설교:\s*(.+)\(([^()]+)\)\s*(.+)$/);
  if (m) {
    return { videoId: entry.videoId, date, title: m[1].trim(), scripture: m[2].trim(), speaker: m[3].trim() };
  }

  const [head = entry.title, sermon, speaker] = partsOf(entry.title);
  const t = sermon?.match(/^(.+)\(([^()]+)\)$/);
  if (t) return { videoId: entry.videoId, date, title: t[1].trim(), scripture: t[2].trim(), speaker };
  return {
    videoId: entry.videoId,
    date,
    title: sermon ?? head.replace(/\s*\d{4}-\d{2}-\d{2}\s*/, ' ').trim(),
    speaker,
  };
}

/** 특송 영상 — 제목 `특송 2026-09-20 | 곡명 | 특송자 | 경향교회` */
export function parseSong(entry: FeedEntry): ArchiveVideo {
  const [, title = entry.title, speaker] = partsOf(entry.title);
  return { videoId: entry.videoId, date: dateOf(entry.title), title, speaker };
}

/**
 * 특송 낮/밤 구분. 설명란의 `◎주일낮예배`는 **모든 영상에 붙는 고정 안내문**이라 단서가 못 된다.
 * 대신 업로드 순서를 쓴다 — 같은 날짜에서 **먼저 올라온 1편 = 낮, 나머지 = 밤** (2026-08-23~09-13 시드 4주와 전부 일치).
 * 그날 1편만 올라와 있으면 업로드 시각으로 본다: 한국시간 19시 전이면 낮 (밤 특송은 20시 이후에 올라온다).
 */
export function splitSongs(entries: FeedEntry[]) {
  const byDate = new Map<string, FeedEntry[]>();
  for (const e of entries) {
    const d = dateOf(e.title);
    if (!d) continue;
    byDate.set(d, [...(byDate.get(d) ?? []), e]);
  }
  const day: FeedEntry[] = [];
  const night: FeedEntry[] = [];
  for (const group of byDate.values()) {
    const sorted = [...group].sort((a, b) => a.published.localeCompare(b.published));
    if (sorted.length === 1) {
      const kstHour = (new Date(sorted[0].published).getUTCHours() + 9) % 24;
      (kstHour < 19 ? day : night).push(sorted[0]);
    } else {
      day.push(sorted[0]);
      night.push(...sorted.slice(1));
    }
  }
  return { day, night };
}

/* ── 병합 ─────────────────────────────────────────────── */

/** 시드 전체의 videoId — 시드에 있는 영상은 RSS가 다른 분류로 옮기지 못한다 */
const seedIds = (archive: ArchiveCategory[]) =>
  new Set(archive.flatMap((c) => c.videos.map((v) => v.videoId)));

function merge(category: ArchiveCategory, fromFeed: ArchiveVideo[], taken: Set<string>): ArchiveCategory {
  const added = fromFeed.filter((v) => v.date && !taken.has(v.videoId));
  // 같은 날짜면 RSS(최신 업로드)가 앞 — 안정 정렬이라 먼저 넣은 쪽이 유지된다
  const videos = [...added, ...category.videos]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, KEEP);
  return { ...category, videos };
}

export async function getServiceArchive(): Promise<ArchiveCategory[]> {
  const [services, exposition, conference] = await Promise.all([
    getPlaylistFeed(PLAYLISTS.services),
    getPlaylistFeed(PLAYLISTS.exposition),
    getPlaylistFeed(PLAYLISTS.conference),
  ]);
  const taken = seedIds(SERVICE_ARCHIVE);

  const byPrefix = (re: RegExp) => services.filter((e) => re.test(e.title)).map(parseSermon);
  const REGULAR = /^(주일낮|주일밤|수요밤)예배실황/;
  const feed: Record<string, ArchiveVideo[]> = {
    'sunday-day': byPrefix(/^주일낮예배실황/),
    'sunday-night': byPrefix(/^주일밤예배실황/),
    wednesday: byPrefix(/^수요밤예배실황/),
    // 정기 예배가 아닌 `…예배실황`(송구영신·성탄 등)
    'special-service': services
      .filter((e) => /예배실황/.test(e.title) && !REGULAR.test(e.title))
      .map(parseSermon),
    exposition: [...exposition, ...services.filter((e) => /^금요밤기도회/.test(e.title))].map(parseSermon),
    conference: conference.map(parseSermon),
  };

  return SERVICE_ARCHIVE.map((c) => merge(c, feed[c.key] ?? [], taken));
}

export async function getSpecialArchive(): Promise<ArchiveCategory[]> {
  const songs = await getPlaylistFeed(PLAYLISTS.songs);
  const taken = seedIds(SPECIAL_ARCHIVE);
  // 시드 영상도 넣은 채로 가른다 — 빼고 가르면 "같은 날 2편" 짝이 깨진다. 시드 영상은 merge가 걸러낸다
  const { day, night } = splitSongs(songs);

  const feed: Record<string, ArchiveVideo[]> = {
    'day-song': day.map(parseSong),
    'night-song': night.map(parseSong),
    // testimony — 재생목록 없음, 시드만
  };
  return SPECIAL_ARCHIVE.map((c) => merge(c, feed[c.key] ?? [], taken));
}
