---
name: live-panel
category: content
status: wip
pages: [worship]
depends-on:
  design: [color, typography, motion]
  components: [content/youtube-embed]
  features: [live-streaming]
---

# LivePanel (`components/content/live-panel.tsx`)

`/worship#live` 맨 위. 방송 중이면 라이브 플레이어, 아니면 다음 방송 안내.

## 결정 — 수동 on/off 폐지 (2026-09-15)

현행 사이트는 생방송 상태를 **사람이 켜고 껐다.** 끄는 걸 잊으면 방송이 끝났는데 "방송 중"으로 남고,
켜는 걸 잊으면 방송 중인데 안내가 안 뜬다. 미디어팀 2명이 운영하는 조건에서 주 3회 수동 토글은 사고가 난다.

그래서 **사람 손이 필요 없는 구조**로 간다:

| 층 | 무엇이 정하나 | 실패하면 |
|---|---|---|
| 실제 영상 | 유튜브 `embed/live_stream?channel=` — 방송 중이면 라이브, 아니면 유튜브 자체 안내 | 유튜브가 알아서 정정 |
| 화면 배치 (플레이어 vs 안내문) | `LIVE_SCHEDULE` 편성표 + 서울 시각 | 배치만 어긋나고 내용은 맞다 |

즉 **편성표는 화면 배치용이고 진실은 유튜브**다. API 키도 서버도 필요 없다.
더 정확한 배지(특별집회 등 편성표 밖 방송)가 필요해지면 YouTube Data API로 승격한다 —
`context/features/live-streaming.md`의 하이브리드안이 그대로 다음 단계다.

## 동작

- 시각 판정은 `Intl.DateTimeFormat(timeZone: 'Asia/Seoul')` — 해외 접속자도 교회 현지 시각 기준으로 본다
- 서버 렌더에서는 판정하지 않고 마운트 후 계산 (하이드레이션 불일치 방지), 이후 60초마다 갱신
- **프리롤 15분** (`LIVE_PRE_ROLL_MIN`): 미디어팀이 예배 시작 15분 전쯤 스트림을 켜므로 그때부터 플레이어를 띄운다.
  먼저 들어온 사람이 빈 화면을 보지 않게 하는 것이 목적이다.
  - 시작 전(프리롤): `brand-support` 점 + `잠시 후 시작 · 주일 낮예배 오전 11시` (펄스 없음)
  - 시작 후: `brand-point` 펄스 도트 + `LIVE · {예배명} 생중계 중`
    (레드는 도트·텍스트 뿐 — `context/design/01-color.md` 레드 사용 가이드)
- "다음 생방송" 안내도 프리롤 시작 시각을 기준으로 계산해, 안내가 사라지는 순간 플레이어가 뜬다
- 방송 전/후: `다음 생방송은 수요일 오후 7시 30분 · 수요 밤예배` + 편성 안내 + 유튜브 바로가기

## 엣지케이스

- `prefers-reduced-motion` → 펄스 정지 (`motion-reduce:animate-none`)
- 편성표가 비면 "생방송 시간이 아닙니다"로 폴백
- 특별예배·집회 등 편성표 밖 생방송은 지금 구조에선 "다음 방송 안내"로 보인다 → 잦아지면 API 승격
