---
name: video-embed
status: draft
owner: 이레
external-systems: [youtube, ghpc-media-server]
depends-on:
  components: [content/youtube-embed]
  data: [sermons, posts]
---

# 영상 임베드

## 목적

설교·교회 소식·영상 시리즈 등 모든 외부 영상을 일관된 임베드 패턴으로.

## 영상 소스

1. **유튜브** — 기본. `youtube_id` 컬럼만 저장. (`sermons.youtube_id`, `posts.youtube_id`)
2. **기존 미디어 서버** — 정보 수령 후 결정 (`content/content-migration.md` 참조)
3. **자체 직접 업로드** — 1차 오픈 범위 외

> DECISION NEEDED: 미디어 서버 영상의 운명 — 유튜브 일원화 vs 병행. 본 문서는 **유튜브 일원화 가정으로 우선 작성**.

## 임베드 패턴 — lite-youtube

직접 `<iframe>` 사용 시 매 페이지 무거운 JS 로드. 대안:

### 패턴 A. 클릭 후 iframe 로드 (자체 구현)
```tsx
// components/content/youtube-embed.tsx (RSC + 클라이언트 분기)
'use client';
import { useState } from 'react';

export function YoutubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [active, setActive] = useState(false);
  if (active) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full rounded-2xl"
      />
    );
  }
  return (
    <button
      onClick={() => setActive(true)}
      className="relative aspect-video w-full rounded-2xl overflow-hidden group"
      aria-label={`재생: ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt=""
        className="w-full h-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <PlayIcon className="h-16 w-16 text-white" />
      </span>
    </button>
  );
}
```

### 패턴 B. lite-youtube-embed 라이브러리
- `npm i lite-youtube-embed` (있긴 한데 직접 구현이 더 가벼움)

**우선:** 패턴 A로 자체 구현. 디자인 토큰 일관성 ↑.

## privacy-enhanced 모드

`youtube-nocookie.com` 사용 — 사용자가 영상 재생할 때까지 쿠키·트래킹 없음. 개인정보처리방침 단순화.

## 썸네일

- 기본: `https://i.ytimg.com/vi/{ID}/maxresdefault.jpg`
- 폴백: `hqdefault.jpg` (maxres 미존재 시)
- 어드민에서 커스텀 썸네일 업로드 가능 → `sermons.thumbnail_url` 우선

## 50주년 영상 (`/intro`)

- 크게 임베드 (`aspect-video w-full max-w-[900px]`)
- 자동재생 안 함 — 사용자가 클릭하여 시작
- 캡션·자막 포함 권장 (접근성)

## 헤로 영상 (`/` 메인)

- **유튜브 임베드 아님.** `<video>` 태그로 자체 짧은 루프 영상 (`design/05-imagery.md`)
- 음소거 자동재생
- 모바일은 정적 이미지로 대체

## 미디어 서버 (기존) 연동 가설

수령 후 작성:
- 영상 URL 패턴
- 메타 API 존재 여부
- 임베드 가능 여부 (CORS·iframe 정책)

## 엣지케이스

- 영상 비공개·삭제: thumbnail이 default(검은 화면)로 옴 → 어드민 알림 + 자동 hide
- 라이브 영상은 일반 임베드와 다름 (`live-streaming.md` 참조)

## 결정 안 된 것

- [ ] 미디어 서버 영상의 운명
- [ ] 자막·캡션 표준화 (유튜브 자동 자막 vs 수동 업로드)
- [ ] 영상 카드 호버 시 미리보기 (gif 또는 짧은 preview) — 1차 오픈 범위 외 검토
