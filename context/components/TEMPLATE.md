---
name: example-component
status: draft                      # draft / wip / shipped / deprecated
category: content                   # primitives / layout / content / interactive
shadcn-base: null                   # 또는 shadcn 컴포넌트명 (e.g. "popover")
client-component: false             # 'use client' 필요 여부
depends-on:
  design: [color, typography, spacing, iconography]
  components: []                    # ["primitives/button", "primitives/popover"]
  features: []                      # ["calendar-data"]
used-on-pages: []                   # ["01-main", "05-activity"]
---

# {Component Name}

## 목적
한 줄 — 이 컴포넌트가 무엇을 위해 존재하는가.

## UX 원칙
3~5 줄 — 분위기 키워드(`design/00-mood.md`)와 어떻게 정합하는가, 새신자·3040에게 어떻게 작용하는가.

## 항목 / 타입 / 설명 / 데이터

| 항목 | 타입 | 설명 | 데이터 |
|---|---|---|---|
| 예) 타이틀 | text | 컴포넌트 헤딩 | props.title |
| 예) 썸네일 | image | 16:9 카드 이미지 | props.thumbnailUrl (Supabase Storage) |
| 예) CTA 버튼 | btn | 액션 트리거 | props.cta |

## Props

```ts
interface ExampleComponentProps {
  title: string;
  description?: string;
  // ...
}
```

## Variants

(있으면) `variant: 'default' | 'compact'` 같은 분기와 시각 차이.

## 인터랙션

- 호버 시: ...
- 클릭 시: ...
- 키보드 (Tab/Enter/Esc): ...

## 엣지케이스

- 데이터 0건일 때 (empty state)
- 매우 긴 텍스트 (overflow)
- 모바일 360px
- 이미지 로딩 실패
- (해당 시) 일정·시간 관련: 자정 경계·DST
- (해당 시) 권한: 비로그인 / 일반 / 어드민

## 접근성

- ARIA: role/aria-label/aria-live (해당 시)
- 키보드 네비: Tab 순서·Enter/Space·Esc
- 색 대비 (`design/01-color.md` 기준)
- 스크린리더 텍스트 (시각 숨김 텍스트 필요한 곳)

## 데이터 소스

(데이터를 받는 컴포넌트면) Supabase 테이블·쿼리:

```ts
// 예
const { data } = await supabase
  .from('sermons')
  .select('id, title, scripture, preacher, youtube_id')
  .eq('published', true)
  .order('preached_at', { ascending: false })
  .limit(3);
```

## 사용 예

```tsx
<ExampleComponent
  title="..."
  description="..."
/>
```

## 관련 컨텍스트

이 컴포넌트 작업 시 Claude가 읽어야 할 파일:

- `context/design/00-mood.md`, `context/design/01-color.md`, `context/design/02-typography.md`, `context/design/03-spacing.md`
- (의존 컴포넌트) `context/components/primitives/button.md`
- (해당 시) `context/features/<feature>.md`
- (해당 시) `context/03-data-model.md`

## 미정 사항

- [ ] (있으면) 결정 안 된 props·디자인·데이터 출처
