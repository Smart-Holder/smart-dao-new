import { Layout as AntdLayout } from 'antd';
import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Mine from '@/containers/dashboard/mine';

import styles from '@/styles/content.module.css';

const App: NextPageWithLayout = () => {
  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <div>
        <div className={styles.title1}>Chose your mo ban elements</div>
        <div className={styles.title2}>Welcome to SmartDAO</div>
      </div>
      <div className={styles.box} style={{ padding: '68px 55px' }}>
        <Mine />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
