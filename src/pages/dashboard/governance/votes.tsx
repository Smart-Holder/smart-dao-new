import { Layout } from 'antd';

import DashboardLayout from '@/components/layout/dashboard';
import Filters from '@/containers/dashboard/mine/filters';

import styles from '@/styles/content.module.css';
import VoteItem from '@/containers/dashboard/governance/vote-item';

const App = () => {
  return (
    <DashboardLayout>
      <Layout.Content className={styles['dashboard-content']}>
        <div className={styles['dashboard-content-header']}>
          <div>
            <div className={styles.title1}>Governance</div>
            <div className={styles.title2}>Welcome to SmartDAO</div>
          </div>
          <Filters />
        </div>
        <div className={`${styles['dashboard-content-body']}`}>
          <div className={styles['vote-list']}>
            <div className={styles['vote-item']}>
              <VoteItem
                status="processing"
                title="Meidum Spicy Spagethi Italiano"
                owner={{
                  name: 'Willy Wonca',
                  address: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
                }}
                number="#123123"
                description="The service was excellent; our waiter was  knowledgeable and attentive 
                without being intrusive. "
                type="normal"
                support={1}
                opposed={0}
                endTime={1675845670252}
              />
            </div>
            <div className={styles['vote-item']}>
              <VoteItem
                status="rejected"
                title="Meidum Spicy Spagethi Italiano"
                owner={{
                  name: 'Willy Wonca',
                  address: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
                }}
                number="#123123"
                type="member"
                description="The service was excellent; our waiter was  knowledgeable and attentive 
                without being intrusive. "
                support={1}
                opposed={0}
                endTime={1675845670252}
              />
            </div>
            <div className={styles['vote-item']}>
              <VoteItem
                status="passed"
                title="Meidum Spicy Spagethi Italiano"
                owner={{
                  name: 'Willy Wonca',
                  address: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
                }}
                number="#123123"
                type="basic"
                description="The service was excellent; our waiter was  knowledgeable and attentive 
                without being intrusive. "
                support={1}
                opposed={0}
                endTime={1675845670252}
              />
            </div>
          </div>
        </div>
      </Layout.Content>
    </DashboardLayout>
  );
};

export default App;
