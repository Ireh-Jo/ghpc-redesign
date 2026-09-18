# 웹폰트

## 현재 사용 중

**Pretendard Variable** — CDN `@import` (`app/globals.css`).
`next/font` 로컬 호스팅 전환은 아직 TODO (`context/design/02-typography.md`).

## 대기: AG 최정호 스크린 (교육 메뉴)

2026-09-19 디자인팀 요청 — **교육 메뉴에 `AG 최정호 스크린` 추가.**
안그라픽스(AG 타이포그라피연구소)의 **유료 폰트**라 파일과 웹 라이선스가 없으면 적용할 수 없다.
CDN·구글폰트에 없고, 무단 자가 호스팅은 라이선스 위반이다.

### 디자인팀에 요청할 것

1. **웹폰트 파일** — `woff2` (필수) + `woff` (구형 브라우저 대비, 선택)
   - OTF/TTF만 있으면 웹 변환이 **라이선스 허용 범위인지 확인**이 필요하다. 임의 변환 금지
2. **웹 라이선스 증빙** — 허용 도메인(`ghpc.or.kr`), 월 PV 상한, 기간
3. **자수 범위** — 한글 2350자(KS X 1001) 서브셋인지, 전체 11172자인지
   - 전체는 woff2로도 1MB를 넘기기 쉽다. **서브셋을 받는 게 낫다** (`guardrails/05-performance.md` LCP)
4. **사용 범위** — 교육 메뉴 **제목만**인지 본문까지인지
   - 권장: 제목(h1~h3)만. 본문은 Pretendard 유지 — 긴 본문에 디스플레이 서체를 쓰면 가독성이 떨어지고
     폰트 용량이 LCP를 직접 깎는다

### 파일이 오면 (드롭인 절차)

```
public/fonts/ag-choejeongho-screen/
  AGChoejeonghoScreen-Regular.woff2
  AGChoejeonghoScreen-Bold.woff2   (있으면)
```

1. `app/layout.tsx`에 `next/font/local`로 등록하고 CSS 변수(`--font-ag`)를 `<html>`에 붙인다
   (`display: 'swap'` — 폰트가 늦어도 글자가 먼저 보이게)
2. `tailwind.config.ts`의 `fontFamily`에 `ag: ['var(--font-ag)', ...Pretendard 폴백]` 추가
3. 교육 페이지 제목에 `font-ag` 적용 — `components/content/edu-dept.tsx`의 h2/h3, `app/(site)/education/page.tsx`
4. 폴백 확인: 변수가 비어도 Pretendard로 정상 표시되는지 (파일 누락 시 화면이 깨지지 않게)
5. `context/design/02-typography.md`에 서체 추가를 기록 — **문서가 먼저 바뀐다**(CLAUDE.md 절대규칙 1)

라이선스 파일·증빙은 **리포에 커밋하지 않는다**. 계약 문서는 교회 내부 보관.
