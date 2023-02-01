import type { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import Footer from '@/components/footer';

const Header = dynamic(() => import('@/components/header'), { ssr: false });

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
