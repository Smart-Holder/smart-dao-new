import { Layout as AntdLayout } from 'antd';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Index from '@/containers/launch';

import styles from '@/styles/content.module.css';

const App: NextPageWithLayout = () => {
  return (
    <AntdLayout.Content className={styles['launch-content']}>
      <div>
        <div className={styles.title1}>
          Welcome! Discovery the hole magic worlds !
        </div>
        <div className={styles.title2}>Welcome to SmartDAO</div>
      </div>
      <div className={styles.box}>
        <Index />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="launch">{page}</Layout>;

export default App;
