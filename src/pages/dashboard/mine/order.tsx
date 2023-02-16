import { Layout as AntdLayout } from 'antd';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import Order from '@/containers/dashboard/mine/order';

const App: NextPageWithLayout = () => {
  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <Order />
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
