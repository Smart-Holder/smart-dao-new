import { Layout } from 'antd';

import DashboardLayout from '@/components/layout/dashboard';
import styles from '@/styles/content.module.css';
import FinancialHeader from '@/containers/dashboard/financial/financial-header';
import Counts from '@/containers/dashboard/mine/counts';
import Filters from '@/containers/dashboard/mine/filters';
import FinancialItem from '@/containers/dashboard/financial/financial-item';
import Image from 'next/image';

const PriceIcon = () => (
  <Image
    src="https://storage.nfte.ai/icon/currency/eth.svg"
    alt="eth"
    width={15}
    height={15}
  />
);

const Assets = () => {
  return (
    <DashboardLayout>
      <Layout.Content className={styles['dashboard-content']}>
        <div className={styles['dashboard-content-header']}>
          <FinancialHeader
            title="DAO名称"
            addr="0xC……4F5C"
            createTime={123123123}
            amount={199}
            desc="xxxxxxx"
            logo="https://storage.nfte.ai/icon/currency/eth.svg"
          />
        </div>
        <div
          className={`${styles['dashboard-content-header']} ${styles['dashboard-content-header-mt']}`}
        >
          <Counts
            items={[
              { num: 12456, title: 'All Acounts' },
              { num: 31232, title: 'All Acounts' },
              { num: 31232, title: 'All Acounts' },
              { num: 31232, title: 'All Acounts' },
            ]}
          />
          <Filters />
        </div>
        <div className={styles['dashboard-content-body']}>
          <div className={styles['financial-list']}>
            {new Array(20).fill({}).map((item, i) => {
              return (
                <div key={i} className={styles['financial-item']}>
                  <FinancialItem
                    title="Medium Spicy Pizza with Kemangi Leaf"
                    logo="/next.svg"
                    price={100}
                    priceIcon={<PriceIcon />}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Layout.Content>
    </DashboardLayout>
  );
};

export default Assets;
