# References — 참고 교회·서비스

> 기획서가 명시한 참고 사이트 + 추가 분석. 시안 단계 분석 승계.

## 1. Grace Community Church — https://www.gracechurch.org/

**가져올 것:**
- 헤로 영상의 자연 활용 (인위적이지 않은 교회/자연 영상)
- 따뜻한 사진 톤 (실내 자연광)
- 예배 시간 정보를 헤로 바로 아래 큰 카드로
- 설교 다시보기 카드 (가로 와이드 썸네일 + 제목·본문·날짜)
- "Welcome" 페이지의 새신자 친화 톤

**가져오지 않을 것:**
- 영문 큰 sans-serif 그대로 한글 적용 시 인상 약함 → Pretendard로 보정

## 2. Ligonier Ministries — https://www.ligonier.org/

**가져올 것:**
- 콘텐츠 카드의 일관된 그리드 (영상·아티클·도서)
- 정보 위계의 명확함 (큰 헤딩 → 중간 라벨 → 본문 3단계)

**가져오지 않을 것:**
- 짙은 네이비·세리프 헤딩 (우리 팔레트와 톤 다름)
- 콘텐츠 밀도가 매우 높음 — 새신자에겐 과함
- 검색·필터 UX (1차 오버스펙)

## 3. 사랑의교회 — https://www.sarang.org/

**가져올 것:**
- 메인의 큰 영상 + 빠른 진입 카드 패턴
- 메뉴 드롭다운 정리 (한국 교회 도메인에 익숙한 메뉴 위치)
- 모바일 풀스크린 햄버거 메뉴 동작

**가져오지 않을 것:**
- 카테고리 수 과다 (우리는 4+1 단순화 — 기획서 핵심)
- 다중 슬라이드 캐러셀 자동재생 (접근성·로딩)
- 한 화면 정보 밀도 — 새신자가 첫 진입에서 압도되면 실패

## 4. 현재 경향교회 사이트 — https://www.ghpc.or.kr/

**역할:** 브랜드 컬러·로고 확인용 참고. 디자인은 따라가지 않음 (개편 대상).

## 5. 추가 참고 (개발 단계용)

### shadcn/ui — https://ui.shadcn.com/
- 우리 primitives 베이스
- 컴포넌트 추가: `npx shadcn-ui@latest add <name>`

### Vercel templates — https://vercel.com/templates
- Next.js 14 App Router 패턴 참고

### Supabase examples — https://github.com/supabase/supabase/tree/master/examples
- RLS 정책 패턴
- Next.js + Supabase Auth 통합

## 6. 안티 패턴 (피할 것)

- 회전 배너 자동재생 (한국 교회 사이트의 80% — 접근성·CLS 악화)
- 팝업 우상단 N개 (한국 교회 사이트 흔함 — 사용자 피로)
- 풀스크린 인트로 영상 + 스킵 버튼 (모바일에서 끔찍)
- 메뉴 8개 이상 (단순화 핵심)
- 노란/주황 배경 + 검정 텍스트 (80~90년대 인상)
- 풍선·이펙트 GIF·과한 그래픽
