import { Layout } from 'antd';

import DashboardLayout from '@/components/layout/dashboard';
import Filters from '@/containers/dashboard/mine/filters';

import styles from '@/styles/content.module.css';
import VoteItem, {
  VoteItemType,
} from '@/containers/dashboard/governance/vote-item';
import VoteModal from '@/containers/dashboard/governance/vote-modal';
import { useState } from 'react';

const App = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<VoteItemType>();
  const onClickItem = (item: VoteItemType) => {
    setCurrentItem(item);
    setOpenModal(true);
  };
  const onCloseModal = () => {
    setCurrentItem(undefined);
    setOpenModal(false);
  };
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
                onClick={onClickItem}
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
                onClick={onClickItem}
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
                onClick={onClickItem}
                endTime={1875885670252}
              />
            </div>
            <div className={styles['vote-item']}>
              <VoteItem
                status="executed"
                execTime={1475885670252}
                execUser={{
                  name: 'Willy Wonca',
                  address: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
                }}
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
                onClick={onClickItem}
                endTime={1475885670252}
              />
            </div>
          </div>
        </div>
        <VoteModal open={openModal} onClose={onCloseModal} data={currentItem} />
      </Layout.Content>
    </DashboardLayout>
  );
};

export default App;
