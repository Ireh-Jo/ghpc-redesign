# 02. 기술 제약

## 결과물 형식

- **단일 HTML 파일 5개** — `designs/01-main.html` ~ `designs/05-activity.html`
- 외부 의존성은 CDN만. 빌드·번들 없음.
- 더블클릭으로 브라우저에서 바로 열려야 함.

## 외부 CDN 화이트리스트

이 외에는 추가 금지.

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Pretendard 폰트 -->
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />

<!-- Lucide 아이콘 (필요 시) -->
<script src="https://unpkg.com/lucide@latest"></script>
```

> Noto Serif KR 로드 금지 — 팔레트 A로 잠겨 세리프 미사용.

## Tailwind 설정 (CDN config)

각 HTML `<head>`에 동일하게 박는다:

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'system-ui', 'sans-serif'],
        },
        colors: {
          // LOCKED 2026-05-18 — Logo Brand v2 화이트톤 (context/01-design-system.md)
          brand: {
            bg: '#F8F9FB',
            surface: '#FFFFFF',
            ink: '#18253F',
            'ink-muted': '#6B7280',
            accent: '#C8252C',
            'accent-2': '#0E1A33',
            line: '#E5E7EB',
          },
        },
        maxWidth: {
          container: '1200px',
        },
      },
    },
  };
</script>
```

## 이미지 소스 화이트리스트

- **Unsplash** — `https://images.unsplash.com/...`
- **Placeholder** — `https://placehold.co/WIDTHxHEIGHT/HEX/HEX?text=...`
- **로컬 placeholder SVG** — 필요 시 시안 안에 인라인 SVG로 (외부 호스팅 X)

## 영상

- 헤로 영상은 `<video>` 태그 + Unsplash/Pexels 영상 URL 또는 정적 이미지로 대체
- 자동재생 시 `muted playsinline loop` 필수
- 모바일에서는 정적 포스터 이미지로 대체 가능

## JS

- 가능하면 무JS. 필요할 때만 인라인 `<script>`.
- 햄버거 토글·앵커 스크롤·페이드인 정도. 그 이상은 시안 범위 아님.

## 파일 헤더 템플릿

각 HTML 상단에 이 주석 박는다 (시안 추적용):

```html
<!--
  경향교회 홈페이지 개편 1차 시안
  Page: 메인 (또는 교회소개 / 예배와 교육 / 목양과 사역 / 교회 활동)
  Design System: context/01-design-system.md (Palette: A/B/C)
  Last updated: YYYY-MM-DD
-->
```

## 검증 명령

시안 작성 후 브라우저 더블클릭으로 확인. 추가로:

```bash
# 모바일 모드 확인 (Chrome DevTools): 360px, 768px, 1024px
# 콘솔 에러 없음을 확인
# Lighthouse는 시안 단계에선 강제 아님
```
