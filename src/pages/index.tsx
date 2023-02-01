import Head from 'next/head';
import { Layout } from 'antd';

import BasicLayout from '@/components/layout/basic';
import styles from '@/styles/home.module.css';

const { Content } = Layout;

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart DAO</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className={styles.layout}>
        <BasicLayout>
          <Content className={styles.content}>
            <div>
              <p className={styles.title1}>
                Welcome! Discovery the hole magic worlds !
              </p>
              <p className={styles.title2}>Welcome to SmartDAO</p>
            </div>
            <div className={styles['site-layout-content']}>Home Content</div>
          </Content>
        </BasicLayout>
      </Layout>
    </>
  );
}
