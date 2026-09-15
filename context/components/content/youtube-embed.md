---
name: youtube-embed
category: content
status: wip
pages: [worship, intro]
depends-on:
  design: [color, spacing, motion]
  components: []
  features: [live-streaming, video-embed]
---

# YouTubeEmbed (`components/content/youtube-embed.tsx`)

유튜브 영상 임베드. **lite 패턴** — 처음에는 썸네일 + 재생 버튼만 그리고, 클릭한 뒤에 iframe을 붙인다.
유튜브 iframe은 1개당 500KB+ · 쿠키를 즉시 심기 때문에 성능(`guardrails/05-performance.md`)·프라이버시 양쪽 이유다.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `videoId` | `string` | 영상 ID. `channelId`와 택일 |
| `channelId` | `string` | 채널의 **현재 라이브**를 임베드 (`embed/live_stream?channel=...`). 방송 중이 아니면 유튜브가 자체 안내를 띄운다 |
| `title` | `string` | iframe `title` · 썸네일 `alt`. 필수 (접근성) |
| `thumbnailSrc` | `string` | (선택) 직접 지정. 없으면 `i.ytimg.com`의 `maxresdefault` |
| `autoLoad` | `boolean` | (선택) 썸네일 단계를 건너뛰고 바로 iframe. 라이브 섹션처럼 "켜져 있는지"가 정보인 경우 |

- 도메인은 `youtube-nocookie.com` (privacy-enhanced)
- 비율 `aspect-[16/9]`, `border border-brand-line`

## 엣지케이스

- `maxresdefault`가 없는 영상 → `onError`로 `hqdefault` 폴백
- 라이브 임베드는 썸네일이 없다 → `channelId`면 `autoLoad` 기본 true
- JS 없는 환경: 썸네일이 `<a>`로 유튜브 원본을 열도록 감싼다 (점진적 향상)
