---
name: live-streaming
status: draft
owner: 이레
external-systems: [youtube]
depends-on:
  components: [interactive/live-badge, content/youtube-embed, content/service-time-table]
  data: [services, sermons]
---

# 생방송

## 목적

주일·수요·금요기도회 시간에 라이브 영상으로 진입할 수 있게 하고, GNB·메인 헤더에서 LIVE 상태 시각화.

## 현 상태

- 공식 유튜브 채널: https://www.youtube.com/channel/UCpPEfMA_nBf1koFnjyKu1pg
- 기존: 주일·수요예배 시간에 채널에서 라이브 송출 (사용자 확인 필요)

## 사용자 시나리오

1. 주일 9:00 — 사용자가 메인 진입 → 헤더 우측 "생방송 보기" CTA 옆 빨간 점 활성
2. 클릭 → `/worship` 또는 라이브 페이지 → YouTube embed 자동 재생 (사용자 클릭 후 unmute)
3. 비라이브 시간 — 생방송 버튼 회색·"다음: 주일 9:00 (D-2)" 텍스트

## LIVE 상태 판정 로직

### 옵션 A. YouTube Data API
- `search.list?eventType=live&channelId=...` 로 현재 라이브 video ID 조회
- 장점: 정확 (실제 송출 여부 반영)
- 단점: API 키 + quota 관리, 5분 캐싱 권장

### 옵션 B. 시간표 기반
- `services` 테이블의 `day_of_week + start_time + duration_min` 으로 현재 시각 매칭
- 장점: 외부 의존 없음, 즉답
- 단점: 송출 안 됐는데 "라이브"로 표시될 가능성

> DECISION NEEDED: A vs B. **하이브리드 추천 — 시간표로 1차 표시, YouTube API로 라이브 비디오 ID 검증.**

## 컴포넌트 영향

### `interactive/live-badge.md` (생성 예정)
- props: `isLive: boolean`, `nextServiceAt?: Date`, `liveVideoId?: string`
- 시각: `isLive=true` → 빨간 펄스 도트 + "LIVE" 텍스트 / false → 회색 점 + 다음 예배 시간

### `content/youtube-embed.md`
- live video ID로 embed
- privacy-enhanced mode (`youtube-nocookie.com`) 권장
- lite-youtube 패턴 (썸네일 + 클릭 후 iframe 로드)

### `layout/header.md`
- 우측 CTA에 LiveBadge 통합

## 데이터 흐름

```
서버 컴포넌트 (page.tsx)
  ├── services 테이블 조회 (현재 진행 중 또는 다음 예배)
  └── lib/youtube.ts → YouTube API (또는 캐시 5min)
       └── liveVideoId 또는 null
  ↓
<Header liveStatus={...} />
```

`lib/youtube.ts` 캐싱:
```ts
import { unstable_cache } from 'next/cache';
export const getLiveVideo = unstable_cache(
  async () => { /* YouTube API call */ },
  ['youtube-live'],
  { revalidate: 300, tags: ['live'] },
);
```

## 엣지케이스

- API 실패: 시간표 기반으로 폴백 (옵션 B)
- 특별 집회·임시 라이브 (시간표 외): API 결과 우선
- 라이브 종료 직후 (~30분): "방금 종료" 메시지 또는 다시보기 안내
- 채널이 라이브 송출 중 영상 비공개 처리: API가 ID 반환해도 embed 차단 → 사용자에게 안내

## 운영 절차

- 매주 라이브 시작 전 미디어팀이 유튜브 스트림 키 설정 (외부 절차, 사이트 측 작업 없음)
- 사이트 측: 자동. 별도 입력 없음.

## 환경 변수

```
YOUTUBE_API_KEY=...           # 옵션 A 또는 하이브리드 시
YOUTUBE_CHANNEL_ID=UCpPEfMA_nBf1koFnjyKu1pg
```

## 결정 안 된 것

- [ ] 판정 로직 A/B/하이브리드
- [ ] YouTube API 키 발급·quota 관리 주체
- [ ] 라이브 페이지 전용 라우트 생성 여부 (`/live`) vs `/worship` 안에 임베드
