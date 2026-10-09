---
name: care-sections
category: content
status: wip
client-component: false
pages: [care]
depends-on:
  design: [color, typography, spacing, iconography]
  components: [interactive/content-tabs]
  features: [video-embed]
---

# CareSections (`components/content/care-sections.tsx`)

`/care`(목양) 섹션 본문 3종. `SubPage`의 `overrides`로 꽂는다. 데이터: `lib/care.ts` (원고 `사역1(소모임).html`, 2026-10-09).

| export | 앵커 | 내용 |
|---|---|---|
| `CareDistrict` | `#district` | 소개 + 구역 4종 카드 + **구역공과** 상자 (이번 주 영상·PDF) |
| `CareEvangelism` | `#evangelism` | `ContentTabs`로 남전도회·여전도회·**청년회** — 설명 + 출생연도별 소속 기관 표 |
| `CareClubs` | `#clubs` | 동호회 7개 카드 — 아이콘·소개·요일/시간 칩·장소·대상·신청 버튼 |

## 구역공과

- 영상: 유튜브 `구역공과` 재생목록 RSS의 **최신 1편** (페이지가 서버에서 읽어 `latest` prop으로 넘긴다, 10분 캐시)
- PDF: 현행 사이트 구역공과 게시판(`Board/52`, 매주 갱신)으로 보낸다 — 어드민 생기면 교체
- 지난 자료: 재생목록 링크. 원고의 "이전 자료" 아코디언은 RSS가 주는 범위를 넘어가 빼고 링크로 대신했다
- RSS 실패 시 영상 버튼은 재생목록으로 간다 (빈 버튼 없음)

## 청년회

2026-10-09 사용자 지시로 **청년회는 전도회 하위**다 — 교육 페이지·교육 메뉴에서 뺐다.

## 동호회 신청

원고 링크가 빈 자리(`forms.gle/`)이고 현행 사이트에도 없다 → **"준비 중"** 비활성 버튼 (사용자 지시: 없으면 준비 중으로 노출).

## 원고와 다른 점

- 원고는 동호회도 탭(버튼 눌러야 보임)이었다 → 정보가 짧아 **카드로 전부 펼쳤다** (한눈에 비교, 클릭 비용 0)
- 사진 캐러셀 placeholder는 사진이 없어 뺐다. 자동재생 캐러셀은 어차피 금지 (`06-motion.md`)
- 이모지 아이콘 → lucide 아이콘 (`iconography`)
