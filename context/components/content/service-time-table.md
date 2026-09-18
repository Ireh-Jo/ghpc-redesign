---
name: service-time-table
category: content
status: wip
pages: [worship]
depends-on:
  design: [color, typography, spacing, motion]
  components: []
  features: [live-streaming]
---

# ServiceTimeTable (`components/content/service-time-table.tsx`)

예배·모임 시간표를 표 하나로 렌더한다. `/worship#times`의 표 3종(예배 및 모임 / 주일학교 / S.F.C.)이
같은 컴포넌트를 데이터만 바꿔 쓴다.

근거 시안: 디자인팀 `예배및모임안내 pc.ai`·`홈페이지 예배 m.ai` (2026-09-15 수령).
검토·미결 사항: `docs/2026-09-15-예배페이지-디자인시안-검토.md`.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `title` | `string` | 표 위 h3 (예: `예배 및 모임안내`) |
| `columns` | `{ key: string; label: string }[]` | 열 정의. **첫 열은 행 머리(`<th scope="row">`)** 로 렌더 |
| `groups` | `{ label: string; span: number }[]` | (선택) 2단 헤더. 있으면 헤더가 두 줄이 된다 — S.F.C. 표의 `예배` / `성경공부 · 모임` 묶음 |
| `rows` | `Record<string, string>[]` | `columns[].key`를 키로 갖는 행 |
| `note` | `string` | (선택) 표 아래 각주 |
| `links` | `{ label, href }[]` | (선택) 제목 오른쪽 바로가기 버튼 — 네이버 카페 등 **외부 링크** (2026-09-18) |

컴포넌트 prop은 `table` 외에 `headingLevel`(`'h2' | 'h3'`, 기본 `h3`)이 있다.
섹션 h2를 숨긴 화면(`SubPage`의 `bareSections`)에서는 **`h2`로 올려서** 제목 계층이 끊기지 않게 한다.

데이터 단일 출처는 `lib/worship-services.ts` (Supabase `services` 테이블 이관 전 임시).

## 반응형 — 시안과 의도적으로 다른 지점

시안은 375px에서 4~5열 표를 그대로 압축해 본문이 10~11px까지 떨어진다(권장 하한 14px, `guardrails/01-code-quality.md` 접근성).
그래서 **`md` 미만에서는 표를 카드 목록으로 전환**한다 — 첫 열 값이 카드 제목, 나머지 열은 `라벨 — 값` 정의 목록.
마크업은 하나(`<table>`)를 CSS로 바꾸지 않고, 의미가 다른 두 트리를 각각 렌더하고 한쪽만 표시한다
(표는 `hidden md:block`, 카드는 `md:hidden`) — 스크린리더가 두 번 읽지 않도록 숨긴 쪽은 `aria-hidden` 없이 `hidden` 사용.

> DECISION NEEDED: 디자인팀이 "모바일도 표 그대로"를 고수하면 가로 스크롤 + 첫 열 고정으로 바꾼다. 검토서 §3-2.

## 제목 · 바로가기 (2026-09-18 예배 시안)

시안은 표마다 **큰 제목 + 오른쪽 파란 알약 버튼**을 둔다. 그래서:

- `/worship#times`는 섹션 h2("예배 및 모임 안내")와 첫 표 제목이 같은 문구로 두 번 나왔다 →
  `bareSections={['times']}`로 섹션 h2를 숨기고 표 제목을 `h2`로 올렸다
- 버튼 링크 (사용자 전달, 2026-09-18):
  | 표 | 링크 |
  |---|---|
  | 예배 및 모임안내 | 주일학교 카페 `cafe.naver.com/ghpcedu1` |
  | S.F.C. 주일예배 및 모임 | 중고등부 카페 `cafe.naver.com/ghmhsfc` · 대학부 카페 `cafe.naver.com/shalomuniv` |

  시안은 S.F.C.에 중등부·고등부·대학부 **3개** 버튼이지만 받은 URL은 중고등부 통합 1개 + 대학부 1개다.
  분리된 카페가 따로 있으면 `lib/worship-services.ts`의 `links` 배열만 늘린다.

## 디자인

- **표는 시안 그대로 심플하게** — 상단 굵은 선(`border-t-2 border-brand-ink`) + 각진 셀.
  전역 라운드 언어(`context/design/03-spacing.md`)의 **예외**다. 2026-09-18에 라운드 카드로 바꿨다가
  "시안대로 심플하게"로 되돌렸다 (사용자 지시) — 다시 건드리지 말 것
- 헤더 행 `bg-brand-bg`, 본문 `bg-brand-surface`, 보더 `border-brand-line` — 임의 HEX 없음
- 셀 패딩 `py-3` / 본문 `py-3.5`, 행 hover `bg-brand-bg/60`
- 라운드가 붙는 건 **제목 옆 바로가기 버튼**(`btn-round`)뿐이다
- 시안의 `구 분`·`시 간` 같은 **글자 사이 공백은 쓰지 않는다**(스크린리더가 끊어 읽음). 같은 인상은 `tracking-[0.3em]`로 낸다
- 행 hover `bg-brand-bg/60` 200ms (`context/design/06-motion.md` 허용 범위)

## 엣지케이스

- 셀 값이 비면 `—` 로 렌더 (빈 칸 방치 금지)
- 열이 5개를 넘으면 데스크탑에서도 가로 스크롤 컨테이너로 감싼다
- 표 제목(`title`)은 h3 — 섹션 제목(h2)과 중복 레벨이 되지 않게 SubPage 섹션 안에서만 쓴다
