import type { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Layout, Image, Space, Button } from 'antd';

import Sider from '@/components/sider/dashbordSider';
import Footer from '@/components/footer';

const Header = dynamic(() => import('@/components/header'), { ssr: false });

export default function BasicLayout({ children }: { children: ReactElement }) {
  return (
    <>
      <Head>
        <title>Smart DAO</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout hasSider>
        <Sider />
        <Layout>
          <Header />
          {children}
          <Footer />
        </Layout>
      </Layout>
    </>
  );
}
