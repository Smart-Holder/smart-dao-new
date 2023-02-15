import { Layout as AntdLayout, PaginationProps } from 'antd';
import Layout from '@/components/layout';
import { ReactElement, useState } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import styles from '@/styles/content.module.css';
import DetailHeader from '@/containers/dashboard/financial/detail-header';
import DetailAttributes from '@/containers/dashboard/financial/detail-attributes';
import DetailTransactions, {
  DetailTransactionItem,
} from '@/containers/dashboard/financial/detail-transactions';

const App: NextPageWithLayout = () => {
  const pageSize = 20;

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<DetailTransactionItem[]>([]);

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    // getData(p);
  };

  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <div className={styles['dashboard-content-body']}>
        <div className={styles['detail-content']}>
          <DetailHeader
            title="DAO名称"
            logo="https://storage.nfte.ai/icon/currency/eth.svg"
          />
          <DetailAttributes
            items={[
              { key: 'key1', value: 'v1', ratio: 10 },
              { key: 'key2', value: 'v2', ratio: 10 },
              { key: 'key3', value: 'v3', ratio: 10 },
              { key: 'key4', value: 'v4', ratio: 10 },
              { key: 'key5', value: 'v5', ratio: 10 },
              { key: 'key6', value: 'v6', ratio: 10 },
            ]}
          />
          <DetailTransactions
            currentPage={page}
            total={total}
            pageSize={pageSize}
            data={[
              {
                market: 'market1',
                event: 'event',
                price: 100000000000000,
                from: '0x0EB18a48f4d4Fd42985AC63bD48E102277C20D6C',
                to: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
                date: Date.now(),
              },
              {
                market: 'market2',
                event: 'event',
                price: 100000000000000,
                from: '0x0EB18a48f4d4Fd42985AC63bD48E102277C20D6C',
                to: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
                date: Date.now(),
              },
              {
                market: 'market3',
                event: 'event',
                price: 100000000000000,
                from: '0x0EB18a48f4d4Fd42985AC63bD48E102277C20D6C',
                to: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
                date: Date.now(),
              },
            ]}
          />
        </div>
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
