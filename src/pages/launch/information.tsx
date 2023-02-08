import dynamic from 'next/dynamic';
import { Layout } from 'antd';

import LaunchLayout from '@/components/layout/launch';
// import Form from '@/components/launch/form';

import styles from '@/styles/content.module.css';

const Start = dynamic(() => import('@/containers/launch/start'), {
  ssr: false,
});

const App = () => {
  return (
    <LaunchLayout>
      <Layout.Content className={styles['launch-content']}>
        <div className={styles.title1}>Welcome! Tianxie nide gerenxinxi!</div>
        <div className={styles.title2}>Welcome to SmartDAO</div>
        <div className={styles.box}>
          <Start />
        </div>
      </Layout.Content>
    </LaunchLayout>
  );
};

export default App;
