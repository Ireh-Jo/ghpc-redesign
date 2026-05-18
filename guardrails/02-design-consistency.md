# 02. 디자인 일관성

> 토큰만 사용 + 일관성 깨면 안 되는 항목. 새 컴포넌트/페이지 추가 시 교차검증.

## 컬러

- [ ] `context/design/01-color.md`의 7개 토큰 외 컬러 사용 없음
- [ ] 본문 텍스트 모두 `text-brand-ink`
- [ ] 보조 텍스트 모두 `text-brand-ink-muted`
- [ ] 1차 CTA는 항상 `bg-brand-accent text-white`
- [ ] LIVE 인디케이터·강조 배지만 `brand-accent` 사용 (큰 면적 금지)
- [ ] 한 화면에 레드 면적 합계 5% 이하
- [ ] 다크 섹션 배경은 `bg-brand-accent-2`
- [ ] 보더는 `border-brand-line`
- [ ] grayscale Tailwind 직접 사용 없음 (`bg-gray-*`, `text-slate-*` 등)
- [ ] 그라데이션 사용은 헤로 영상 오버레이만 (예외 명시)

## 타이포그래피

- [ ] Pretendard 단독 — 세리프 로드 없음
- [ ] 스케일 표 (`context/design/02-typography.md`) 값만 사용
- [ ] h1/h2/h3 weight 표와 일치
- [ ] 본문 line-height 모바일 1.65 / 데스크탑 1.7
- [ ] `word-break: keep-all` 적용 (한국어)
- [ ] 임의 `text-[Npx]` 금지 (스케일 외)

## 간격·그리드

- [ ] 컨테이너 `max-w-[1200px]` 통일
- [ ] 좌우 패딩 `px-5 md:px-8`
- [ ] 섹션 사이 `py-20 md:py-28`
- [ ] 카드 패딩 `p-6 md:p-8`
- [ ] 그리드 갭 `gap-6 md:gap-8`
- [ ] 라운드 `rounded-xl` (이미지·인풋) / `rounded-2xl` (카드)

## 컴포넌트

- [ ] `Button` primitive는 `components/primitives/button.tsx` 단일 출처
- [ ] `Card` primitive 동일
- [ ] shadcn 컴포넌트를 페이지에서 직접 import 안 함 (primitive 거침)
- [ ] 같은 의미에 같은 아이콘 (`context/design/04-iconography.md` 매핑 표)
- [ ] 같은 의미에 같은 카피 (예: 새가족 CTA는 "처음 오셨나요?" 통일)

## 헤더·푸터·레이아웃

- [ ] 모든 페이지가 동일한 `Header` `Footer` 컴포넌트
- [ ] 현재 페이지 active 표시만 다름 (구조는 동일)
- [ ] GNB 항목 순서: 교회소개 → 예배와 교육 → 목양과 사역 → 교회 활동 → 새가족 → [생방송 보기]
- [ ] 모바일 햄버거 메뉴 최상단에 "새가족"

## 영상·이미지

- [ ] 인물 실사진·AI 생성 인물 사용 없음
- [ ] 헤로 영상 오버레이 가독성 OK (`bg-black/30~40`)
- [ ] 모바일 헤로는 정적 이미지로 대체
- [ ] Next/Image 사용 (raw `<img>` 회피, 예외는 lite-youtube 썸네일)
- [ ] `next.config.js` `images.remotePatterns`에 호스트 등록

## 모션

- [ ] 자동재생 캐러셀 없음
- [ ] 패럴랙스·풀스크린 Lottie 없음
- [ ] `prefers-reduced-motion` 대응 CSS 있음
- [ ] 호버 transition 200ms 통일

## 반응형

- [ ] 360px 가로 스크롤 없음
- [ ] 768px (태블릿) 깨짐 없음
- [ ] 1024px (데스크탑 기준) 정상
- [ ] 헤더 햄버거 메뉴 동작 (모바일)
- [ ] 폼 입력 모바일에서 충분히 큼 (input 높이 ≥ 44px)

## 콘텐츠

- [ ] placeholder 텍스트에 `[ ]` 또는 `(운영 단계 입력)` 명시
- [ ] 목사님·교인 얼굴 실사진 없음 (실루엣/추상만)
- [ ] 신학적 단언 문구 없음 (인사말·신학노선은 placeholder 또는 검토본)
- [ ] 카테고리 5개+새가족 외 메뉴 추가 없음
- [ ] 50주년 표기 한 페이지 안에선 하나만

## 새신자 진입 동선

- [ ] 메인에서 "주일예배 시간" 첫 화면(스크롤 없이)에 보임
- [ ] 메인 → "오시는 길" 1뎁스 진입
- [ ] 모든 페이지 GNB에 "새가족" 시각 강조
- [ ] 모바일 햄버거 메뉴 최상단 "새가족"
- [ ] 첫 진입 시 정보 밀도가 압도적이지 않음

## 50주년 어필

- [ ] 교회소개 헤로에 50주년 영상 또는 강한 시각 자산
- [ ] 다른 페이지에 50주년 배지가 과하지 않음 (한 곳 강조 원칙)

## 한 줄 검증 명령

```bash
# 디자인 토큰 외 HEX 컬러 사용 grep
git grep -nE '#[0-9a-fA-F]{6}\b' -- '*.tsx' '*.ts' '*.css' | grep -v 'globals.css'

# 이모지 사용 grep
git grep -nP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' -- '*.tsx' '*.ts'

# raw img 사용
git grep -n '<img' -- '*.tsx'
```
