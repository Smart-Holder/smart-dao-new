import { Layout } from 'antd';

import DashboardLayout from '@/components/layout/dashboard';
import NFTP from '@/containers/dashboard/member/nftp';

import styles from '@/styles/content.module.css';

const App = () => {
  return (
    <DashboardLayout>
      <Layout.Content className={styles['dashboard-content']}>
        <NFTP />
      </Layout.Content>
    </DashboardLayout>
  );
};

export default App;
