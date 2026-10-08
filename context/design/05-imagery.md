# Design — 05. 이미지·영상

> 헤로 영상 + 사진 가이드. 인물 실사진 / AI 생성 인물 사용 절대 금지.

## 헤로 영상

### 데스크탑 (md 이상)
- `<video autoplay muted loop playsinline poster="...">` 루프 재생
- 소스: Unsplash/Pexels의 햇빛·교회·자연 영상 또는 운영 단계 자체 촬영본
- 오버레이: `bg-black/30` 또는 `bg-gradient-to-b from-transparent to-black/40` (텍스트 가독성)
- 컨테이너: `h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]` (헤더 빼고 풀 뷰포트)

### 모바일 (md 미만)
- **2026-10-09 변경: 모바일 전용 세로 영상을 자동재생한다** (사용자 결정, 레퍼런스 `gts.ac.kr`).
  PC 영상을 그대로 주지 않고 **세로(640×1080)로 따로 잘라 만든 작은 파일**을 준다 — 메인은 HEVC·H.264 각 약 4.4MB, 60fps
- 자동재생 조건: `muted` + `playsinline` (iOS·안드로이드 모두 허용)
- **정지 이미지로 내려앉는 경우**: `prefers-reduced-motion` · 데이터 절약 모드(`navigator.connection.saveData`) ·
  iOS 저전력 모드(브라우저가 자동재생 차단 → poster만)
- 세로 크롭은 장면마다 피사체 위치가 달라 **시간에 따라 크롭 위치를 옮긴다**. 옮길 땐 천천히·가감속·60fps로
  (빠른 패닝은 30fps에서 끊겨 보인다). 절차: `context/components/content/hero-video.md`
- 근본책: 디자인팀에 **9:16 세로 편집본**을 같이 요청 — 받으면 크롭 작업 없이 그대로 인코딩

### 50주년 영상 (`/intro` 헤로)
- YouTube embed 또는 자체 호스팅 (영상 소스 미정)
- 자동재생 안 함 (사용자가 클릭해서 보는 큰 영상)
- 16:9 비율, 컨테이너 가운데 정렬

## 사진 가이드

### 인물 (목사·교인)
- **실사진 / AI 생성 인물 사용 금지**
- 1차 오픈: **실루엣 SVG placeholder** 또는 추상 Unsplash 이미지
- 운영 단계: 본인 동의 받은 사진만 미디어팀이 어드민으로 업로드

```tsx
// 실루엣 placeholder 예
<div className="aspect-square w-full rounded-2xl bg-brand-line flex items-center justify-center">
  <UserSilhouetteSvg className="w-1/2 h-1/2 text-brand-ink-muted/40" />
</div>
```

### 풍경·인테리어
- Unsplash 키워드: `church interior warm light`, `sunlight cathedral`, `community worship`, `wooden cross sunlight`
- 톤: 따뜻한 색온도(주황·황금빛 자연광)
- **차가운 푸른 톤 이미지 회피** — Warm Earth/분위기 키워드 "따뜻한"과 충돌

### 사역·교육 아이콘 이미지
- 일러스트보다 사진 선호 (모던 키워드)
- 사람 얼굴 정면 클로즈업 회피 — 손·도구·공간 위주

## 라운드·비율

- 라운드: `rounded-xl` (12px) 일반, `rounded-2xl` (16px) 카드
- 비율:
  - 정사각 카드: `aspect-square`
  - 와이드 카드: `aspect-[16/9]`
  - 인물 카드: `aspect-[3/4]` 또는 `aspect-square`
  - 배너 헤로: `aspect-[16/9]` 데스크탑, `aspect-[4/3]` 모바일

## Next.js Image 사용

```tsx
import Image from 'next/image';

<Image
  src={url}
  alt="..."
  width={800}
  height={450}
  className="rounded-2xl aspect-[16/9] object-cover"
  sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
/>
```

### remotePatterns (`next.config.js`)

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '*.supabase.co' },
    { protocol: 'https', hostname: 'i.ytimg.com' },         // 유튜브 썸네일
    { protocol: 'https', hostname: 'images.unsplash.com' }, // 임시
  ],
}
```

> DECISION NEEDED: Unsplash 직접 사용 vs Storage로 이전. 운영 안정성 위해 Supabase Storage 권장.

## alt 텍스트

- 모든 이미지 alt 필수
- 장식 이미지는 `alt=""` (스크린리더 스킵)
- placeholder도 의미 있는 alt: `alt="담임목사 사진 (운영 단계에서 교체)"`

## 영상 임베드 (유튜브)

`context/features/video-embed.md` 참조.

- 직접 `<iframe>` 대신 lite-youtube-embed 패턴 (사용자 클릭 후 iframe 로드)
- 썸네일은 `https://i.ytimg.com/vi/{ID}/maxresdefault.jpg`
- 자동재생 금지 (헤로 영상 제외)

## 금지

- 인물 실사진 (본인 동의 없는)
- AI 생성 인물 (Midjourney·DALL-E 등)
- 워터마크 있는 이미지
- 차가운 푸른 톤 풍경
- GIF 풀스크린 (성능)
- 패럴랙스 스크롤
