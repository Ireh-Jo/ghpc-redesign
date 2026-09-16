---
name: section-header
category: layout
status: wip
pages: [main]
depends-on:
  design: [color, typography, spacing]
  components: []
  features: []
---

# SectionHeader (`components/layout/section-header.tsx`)

섹션 머리 — 아이브로우 + 큰 제목 (+ 제목 옆 리드 / 오른쪽 액션 / 아래 굵은 선).
2026-09-16 메인 시안의 말씀·공지사항·새가족이 전부 같은 형태라 공용으로 뽑았다.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `eyebrow` | `string` | 예: `— 이번주` (대시 포함해서 넘긴다) |
| `title` | `string` | h2. 38px(모바일) / 56px(PC) extrabold |
| `lead` | `string` | 제목 옆 baseline에 붙는 한 줄. 모바일에서는 제목 아래로 내려온다 |
| `action` | `ReactNode` | 오른쪽 끝 액션 (더보기 버튼 등) |
| `rule` | `boolean` | 제목 아래 2px ink 선 (공지사항 섹션) |

## 주의

- `h2` 고정이다. 페이지 안에서 제목 레벨이 꼬이지 않게 **섹션당 하나**만 쓴다
- 아이브로우는 장식이 아니라 문맥(언제/무엇)이라 시각적으로만 작게 두고 숨기지 않는다
- 서브페이지(`SubPage`)는 자체 섹션 제목 체계를 갖고 있어 아직 쓰지 않는다 — 통합은 별도 판단
