import { Layout as AntdLayout } from 'antd';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import Income from '@/containers/dashboard/mine/income';

const App: NextPageWithLayout = () => {
  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <Income />
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
