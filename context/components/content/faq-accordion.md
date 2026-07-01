---
name: faq-accordion
category: content
status: shipped
pages: [intro#qna]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: []
  features: []
---

# FaqAccordion (`components/content/faq-accordion.tsx`)

새신자 Q&A처럼 짧은 질문-답이 여러 개 나열되는 섹션 전용 아코디언. 서브페이지의 다른 섹션은
접지 않고 스크롤 유지(`layout/anchor-nav.md` 참조) — 이 컴포넌트는 그 예외.

## 구현 방식 — 의존성 추가 없이 네이티브 `<details>`

shadcn accordion(Radix 기반)을 새로 도입하지 않고 **네이티브 `<details>/<summary>`** 로 구현했다.
- 브라우저 기본 키보드·스크린리더 지원(별도 ARIA 롤 관리 불필요)
- 새 의존성 없음(`guardrails/03-tech-constraints.md` "필요 함수만 직접 구현" 원칙)
- Tailwind `group-open:` variant로 화살표 회전만 추가

따라서 `context/components/00-inventory.md` Primitives 표의 `Accordion`이 아니라 **Content** 컴포넌트로 등록.
여러 아코디언을 페이지에 더 쓰게 되면(예: 다른 FAQ) 이 컴포넌트를 재사용.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `items` | `{ question: string; answer: string }[]` | Q&A 목록 |

## 인터랙션·접근성

- `<details>` 기본 동작: 클릭/Enter/Space로 토글, 동시에 여러 개 펼침 가능(하나만 펼치기 강제 안 함 — Q&A는 여러 개 동시 참고가 자연스러움)
- `summary`의 화살표(`ChevronDown`, `context/design/04-iconography.md` 매핑) `group-open:rotate-180`
- `prefers-reduced-motion` 은 `app/globals.css` 전역 규칙(2026-07-01 추가)으로 회전 애니메이션도 자동 즉시 전환

## 데이터 소스 (예정)

정적 배열 또는 `faqs` 테이블. 현재 `app/(site)/intro/page.tsx`에 placeholder 질문 4개(`[ ]` 표기 없음 — 실제 자주 나오는 새신자 질문 예시이나 문구는 담임목사/미디어팀 검토 후 교체 필요 → `> DECISION NEEDED`).

## DECISION NEEDED

> DECISION NEEDED: 실제 새신자 Q&A 문구 확정(현재는 예시 placeholder). 검토 없이 그대로 운영 반영 금지(`guardrails/00-rules.md` DO#10).
