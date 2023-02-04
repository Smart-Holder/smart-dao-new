import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Layout } from 'antd';

import LaunchLayout from '@/components/layout/launch';
// import Setting from '@/components/launch/setting';

import styles from '@/styles/content.module.css';

const Setting = dynamic(() => import('@/components/launch/setting'), {
  ssr: false,
});

const App = () => {
  return (
    <LaunchLayout>
      <Layout.Content className={styles['launch-content']}>
        <div>
          <div className={styles.title1}>Chose your mo ban elements</div>
          <div className={styles.title2}>Welcome to SmartDAO</div>
        </div>
        <div className={styles.box} style={{ padding: '68px 55px' }}>
          <Setting />
        </div>
      </Layout.Content>
    </LaunchLayout>
  );
};

export default App;
