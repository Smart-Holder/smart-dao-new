import { Layout } from 'antd';

import DashboardLayout from '@/components/layout/dashboard';

import styles from '@/styles/content.module.css';

const App = () => {
  return (
    <DashboardLayout>
      <Layout.Content className={styles['dashboard-content']}>
        <div>
          <div className={styles.title1}>Chose your mo ban elements</div>
          <div className={styles.title2}>Welcome to SmartDAO</div>
        </div>
        <div className={styles.box} style={{ padding: '68px 55px' }}>
          Content
        </div>
      </Layout.Content>
    </DashboardLayout>
  );
};

export default App;
