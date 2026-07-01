import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

/** 공개 페이지 그룹 레이아웃 — 전역 Header + Footer (context/02-architecture.md) */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
