# 작업 컨텍스트 — 경향교회 홈페이지 시안 5종

이 프로젝트는 **시안 5개(HTML)** 만 만드는 작업이다. 실제 운영 코드가 아님.

## 절대 규칙 — 어기지 마라

1. **결과물은 단일 정적 HTML 파일 5개.** Tailwind CDN, 외부 빌드 없음.
2. **5개 시안은 동일한 디자인시스템을 공유한다.** 토큰·컴포넌트·간격이 다르면 실패.
3. **콘텐츠는 `context/03-content-inventory.md`에 적힌 PPT 기획안 그대로 사용.** 임의로 섹션 추가/삭제 금지.
4. **이미지는 Unsplash 또는 placeholder.** 교회 실사진은 사용자만 교체 가능.
5. **사용자가 명시적으로 잠그지 않은 결정사항은 코드에 박지 말고 `> DECISION NEEDED`로 표시.**

## 작업 전 반드시 읽기

| 순서 | 파일 | 용도 |
|---|---|---|
| 1 | `context/00-brief.md` | 프로젝트 1페이지 요약 |
| 2 | `context/01-design-system.md` | 컬러·타이포·간격 토큰 |
| 3 | `context/02-information-architecture.md` | 5개 페이지 구조 |
| 4 | `context/03-content-inventory.md` | 페이지별 들어갈 콘텐츠 |
| 5 | `guardrails/00-rules.md` | DO / DONT |

## 시안 만들 때

- 메인(`designs/01-main.html`) 먼저. 이게 통과하기 전엔 다른 시안 손대지 않는다.
- 새 시안 만들기 전에 `guardrails/01-consistency-checklist.md` 통과 확인.
- 디자인 결정사항 변경 시 → 시안 코드보다 `context/01-design-system.md` 먼저 업데이트.
