# 경향교회 홈페이지 개편안 — 시안 5종 작업 폴더

메인 1개 + 서브 허브 4개, 총 5개 시안을 만들기 위한 컨텍스트/가드레일 저장소.

## 폴더 구조

```
ghpc/
├── context/        무엇을 만드는가 (브리프, 디자인시스템, IA, 콘텐츠, 레퍼런스)
├── guardrails/     어떻게 만드는가 (DO/DONT, 일관성 체크리스트, 기술 제약)
├── designs/        결과물 (HTML 시안 5개가 여기 들어감)
└── CLAUDE.md       Claude 세션이 자동 로드하는 진입점
```

## 시안 5개

| # | 페이지 | 파일명 |
|---|---|---|
| 1 | 메인 | `designs/01-main.html` |
| 2 | 교회 소개 | `designs/02-intro.html` |
| 3 | 예배와 교육 | `designs/03-worship.html` |
| 4 | 목양과 사역 | `designs/04-care.html` |
| 5 | 교회 활동 | `designs/05-activity.html` |

## 작업 흐름

1. `context/` 5개 문서를 읽고 머릿속에 디자인시스템·IA를 적재
2. `guardrails/00-rules.md`의 DO/DONT를 강제 규칙으로 인식
3. 메인(`01-main.html`) 먼저 완성 → 기준선 확정
4. 나머지 4개는 같은 토큰·간격·컴포넌트로 확장
5. `guardrails/01-consistency-checklist.md`로 5개 시안 교차검증

## 잠긴 결정 (2026-05-18)

- **컬러 팔레트:** 후보 A — Warm Earth (크림 + 짙은 갈색 + 따뜻한 골드)
- **분위기 키워드:** 따뜻한 / 환영하는 / 모던한 / 영상 중심
- **헤로 영상:** Unsplash/Pexels 대체 영상 + 모바일 정적 포스터
- **참고 사이트:** Grace Community / Ligonier / 사랑의교회 — 모두 긍정 참고

상세는 [context/01-design-system.md](context/01-design-system.md) 와 [context/04-references.md](context/04-references.md).
