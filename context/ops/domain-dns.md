# Ops — 도메인·DNS

## 도메인

- **현 도메인:** https://www.ghpc.or.kr/
- 유지 (안건 3-1)
- 등록 종류: `.or.kr` (비영리)
- 자동 갱신 필수 (만료 시 도메인 회수 위험)

## DNS

- **Cloudflare DNS** (안건 3-1) — 무료
- Vercel 연결: Cloudflare에서 A/CNAME 레코드 설정
- 메일은 별도 (Google Workspace 또는 기존 호스팅) — DNS MX 레코드 유지

## SSL

- Vercel이 Let's Encrypt 자동 발급·갱신
- Cloudflare는 DNS만 사용 (Proxy off — 또는 Full(strict) 모드)
- 사람 손 안 댐

## 리다이렉트

- `ghpc.or.kr` → `www.ghpc.or.kr` (정규 도메인 통일)
- Vercel Project Settings에서 설정

## sitemap·robots

- `app/sitemap.ts` → 모든 페이지 자동 생성
- `app/robots.ts` → `/admin/*` Disallow

```ts
// app/robots.ts
import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin/' }],
    sitemap: 'https://www.ghpc.or.kr/sitemap.xml',
  };
}
```

## 검색엔진 등록

- Google Search Console — 사이트맵 등록
- Naver Search Advisor — 한국 검색 노출용 (강력 권장)
- Bing Webmaster (선택)

## 결정 안 된 것

- [ ] 등록 대행 사이트 자동 갱신 설정 확인
- [ ] 메일 호스팅 (Google Workspace? 기존?)
- [ ] 도메인·DNS 백업 관리자
