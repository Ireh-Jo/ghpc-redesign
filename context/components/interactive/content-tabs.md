---
name: content-tabs
category: interactive
status: wip
client-component: true
pages: [care]
depends-on:
  design: [color, typography, spacing, motion]
  components: []
  features: []
---

# ContentTabs (`components/interactive/content-tabs.tsx`)

범용 탭 — 버튼 줄 + 선택된 패널 하나. 첫 사용처는 `/care` 전도회(남전도회 · 여전도회 · 청년회).

## Props

```ts
interface ContentTabsProps {
  /** 스크린리더용 그룹 이름 (예: "전도회 구분") */
  label: string;
  tabs: { id: string; label: string; content: React.ReactNode }[];
}
```

- `content`는 **서버 컴포넌트가 렌더해서 넘긴다** — 이 컴포넌트만 클라이언트라 표·문구는 HTML로 이미 들어 있다.
- 숨긴 패널도 DOM에 남긴다(`hidden`) — 검색엔진과 페이지 내 찾기(⌘F)가 표 내용을 볼 수 있게.

## 접근성

- WAI-ARIA Tabs 패턴: `role="tablist" / tab / tabpanel`, `aria-selected`, `aria-controls`
- 키보드 ← → 로 탭 이동, Home/End로 처음·끝
- 탭 스타일은 `VideoArchive` 분류 탭과 같다 (활성 = `bg-brand-ink text-white`) — 같은 의미엔 같은 모양

## 원고와 다른 점

원고는 패널을 다시 누르면 닫히는 토글이었다. 항상 하나는 열려 있게 했다 — 처음 들어온 사람이 빈 자리를 보지 않게.
