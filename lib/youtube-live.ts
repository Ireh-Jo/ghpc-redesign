/**
 * 지금 방송 중인 라이브 영상 찾기 (API 키 없이).
 *
 * ── 왜 이게 필요한가 (2026-09-16) ──
 * 원래는 `youtube.com/embed/live_stream?channel=<ID>`를 그대로 박아 두고 "라이브 여부는 유튜브가 판단"하게
 * 했다(2026-09-15 결정). 그런데 이 엔드포인트가 **실제로 방송 중일 때도 오류 화면**을 띄운다
 * ("오류가 발생했습니다 · 재생 ID는 …"). 2026-09-16 수요 밤예배 생중계 중에 재현했고,
 * 같은 방송을 **영상 ID로 임베드하면 정상 재생**되는 것도 확인했다. 즉 문제는 채널 임베드 엔드포인트다.
 *
 * 그래서 채널의 `/live` 페이지를 서버에서 한 번 읽어 **실제 라이브 영상 ID**를 뽑아 임베드한다.
 * - 키·쿼터·서버 상태 없음. 실패하면 `null` → 패널이 "유튜브에서 열기" 안내로 내려앉는다 (오류 화면 없음)
 * - `revalidate: 60`으로 캐시 — 방송 시작/종료 반영이 최대 1분 늦다
 * - HTML 구조에 기대는 방식이라 언젠가 깨질 수 있다. 깨지면 조용히 `null`이 되도록 짰다.
 *   정확도가 더 필요해지면 YouTube Data API로 승격한다 (`context/features/live-streaming.md` 하이브리드안).
 */

export type LiveBroadcast = {
  videoId: string;
  /** 유튜브에 올라온 방송 제목 (예: `수요밤예배실황 2026-09-16 | 경향교회`) */
  title: string;
};

/** 캐시 수명(초) — 페이지의 `revalidate`와 맞춘다 */
export const LIVE_REVALIDATE_SEC = 60;

export async function getLiveBroadcast(channelId: string): Promise<LiveBroadcast | null> {
  try {
    const res = await fetch(`https://www.youtube.com/channel/${channelId}/live`, {
      headers: {
        // 봇 UA로 가면 라이브 정보가 빠진 축약 HTML이 온다
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'accept-language': 'ko-KR,ko;q=0.9',
      },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: LIVE_REVALIDATE_SEC },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // `"videoDetails":{"videoId":"…","title":"…","lengthSeconds":"0","isLive":true,…}`
    // 방송이 아니면 이 블록이 지난 영상 정보이고 `isLive`가 없다.
    const start = html.indexOf('"videoDetails":{');
    if (start < 0) return null;
    const block = html.slice(start, start + 1200);
    if (!block.includes('"isLive":true')) return null;

    const videoId = block.match(/"videoId":"([A-Za-z0-9_-]{11})"/)?.[1];
    if (!videoId) return null;
    const title = block.match(/"title":"((?:[^"\\]|\\.)*)"/)?.[1] ?? '';

    return { videoId, title: title.replace(/\\u0026/g, '&').replace(/\\"/g, '"') };
  } catch {
    // 네트워크 오류·타임아웃·구조 변경 — 전부 "지금은 모른다"로 처리한다
    return null;
  }
}
