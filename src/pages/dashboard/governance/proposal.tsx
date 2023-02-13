import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Layout as AntdLayout } from 'antd';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Proposal from '@/containers/dashboard/governance/proposal';

import styles from '@/styles/content.module.css';

const App: NextPageWithLayout = () => {
  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <div>
        <div className={styles.title1}>Basic Settings</div>
        <div className={styles.title2}>Welcome to SmartDAO</div>
      </div>
      <div className={styles.box}>
        <Proposal />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
