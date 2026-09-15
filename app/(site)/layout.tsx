import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/primitives/toast';

/** 공개 페이지 그룹 레이아웃 — 전역 Header + Footer (context/02-architecture.md) */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* JS가 꺼져 있으면 FadeIn(`[data-fade]`)이 숨긴 채로 남는다 — 되돌려 놓는다 */}
      <noscript>
        <style>{`[data-fade]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Header />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
