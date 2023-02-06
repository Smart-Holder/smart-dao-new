import { Layout } from 'antd';

import LaunchLayout from '@/components/layout/launch';
import Index from '@/containers/launch';

import styles from '@/styles/content.module.css';

const Home = () => {
  return (
    <LaunchLayout>
      <Layout.Content className={styles['launch-content']}>
        <div>
          <div className={styles.title1}>
            Welcome! Discovery the hole magic worlds !
          </div>
          <div className={styles.title2}>Welcome to SmartDAO</div>
        </div>
        <div className={styles.box}>
          <Index />
        </div>
      </Layout.Content>
    </LaunchLayout>
  );
};

export default Home;
