import { Layout as AntdLayout } from 'antd';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Filters from '@/containers/dashboard/mine/filters';

import styles from '@/styles/content.module.css';
import VoteItem, {
  VoteItemType,
} from '@/containers/dashboard/governance/vote-item';
import VoteModal from '@/containers/dashboard/governance/vote-modal';
import { useEffect, useState } from 'react';
import { request } from '@/api';

import { useAppSelector } from '@/store/hooks';

const App: NextPageWithLayout = () => {
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);

  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<VoteItemType>();

  useEffect(() => {
    const getData = async () => {
      const res = await request({
        method: 'getVoteProposalFrom',
        name: 'utils',
        params: { chain: chainId, address: currentDAO.root },
      });

      console.log('res', res);
      setData(res);
    };

    if (currentDAO.root) {
      getData();
    }
  }, [currentDAO]);

  const onClickItem = (item: VoteItemType) => {
    setCurrentItem(item);
    setOpenModal(true);
  };

  const onCloseModal = () => {
    setCurrentItem(undefined);
    setOpenModal(false);
  };

  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <div className={styles['dashboard-content-header']}>
        <div>
          <div className={styles.title1}>Governance</div>
          <div className={styles.title2}>Welcome to SmartDAO</div>
        </div>
        <Filters />
      </div>
      <div className={`${styles['dashboard-content-body']}`}>
        <div className={styles['vote-list']}>
          {data.map((item: any) => (
            <div className={styles['vote-item']} key={item.id}>
              <VoteItem
                status={item.isClose ? 'passed' : 'processing'}
                title={item.name}
                owner={{
                  name: 'Willy Wonca',
                  address: item.origin,
                }}
                number={`#${item.id}`}
                description=""
                desc={item.description}
                type="normal"
                support={item.agreeTotal}
                opposed={item.voteTotal - item.agreeTotal}
                endTime={1675845670252}
                onClick={onClickItem}
              />
            </div>
          ))}
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
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
