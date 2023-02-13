import dynamic from 'next/dynamic';
import { Layout as AntdLayout } from 'antd';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';

const Start = dynamic(() => import('@/containers/launch/start'), {
  ssr: false,
});

const App: NextPageWithLayout = () => {
  return (
    <AntdLayout.Content className={styles.content}>
      <div>
        <div className={styles.title1}>
          Welcome! Discovery the hole magic worlds !
        </div>
        <div className={styles.title2}>Welcome to SmartDAO</div>
      </div>
      <div className={styles.box}>
        <Start />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
