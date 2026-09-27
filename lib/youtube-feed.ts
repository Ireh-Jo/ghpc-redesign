/**
 * 유튜브 재생목록 RSS 읽기 (API 키 없이).
 *
 * ── 왜 RSS인가 (2026-09-27) ──
 * 예배 영상 목록이 `lib/worship-videos.ts` 하드코딩이라 매주 손으로 고쳐야 했다(9/13에서 멈춰 있었다).
 * 유튜브는 재생목록마다 `feeds/videos.xml?playlist_id=`를 공개로 내준다 — 키·쿼터 없음, 제목·설명란·게시시각 포함.
 * 한계: **재생목록당 최신 15편만** 온다. 그 이전 영상은 `lib/worship-videos.ts`(시드)가 채운다.
 *
 * TODO(youtube-api): YouTube Data API 키를 발급받으면 `playlistItems.list`로 교체한다 — 15편 제한이 풀려
 * 영상 목록 검색·페이지네이션이 가능해진다. 교체 지점은 이 파일의 `getPlaylistFeed` 하나다
 * (반환 타입 `FeedEntry`를 유지하면 나머지는 그대로). `docs/NEXT.md` §2 참조.
 *
 * 실패(네트워크·타임아웃·XML 구조 변경)는 전부 빈 배열 — 화면은 시드로 내려앉는다. 오류 화면을 띄우지 않는다.
 */

export type FeedEntry = {
  videoId: string;
  title: string;
  description: string;
  /** ISO 8601 (UTC) — 업로드 시각 */
  published: string;
};

/** 캐시 수명(초). 새 영상 반영이 최대 10분 늦다 */
export const FEED_REVALIDATE_SEC = 600;

const decode = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const pick = (xml: string, tag: string) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1]) : '';
};

export async function getPlaylistFeed(playlistId: string): Promise<FeedEntry[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: FEED_REVALIDATE_SEC },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .map(([, entry]) => ({
        videoId: pick(entry, 'yt:videoId'),
        title: pick(entry, 'title'),
        description: pick(entry, 'media:description'),
        published: pick(entry, 'published'),
      }))
      .filter((e) => /^[A-Za-z0-9_-]{11}$/.test(e.videoId));
  } catch {
    return [];
  }
}
