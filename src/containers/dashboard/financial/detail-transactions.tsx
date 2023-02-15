import { FC } from 'react';
import styles from './detail-transactions.module.css';
import contentStyles from '@/styles/content.module.css';
import { Select, Table } from 'antd';
import { formatAddress } from '@/utils';
import Image from 'next/image';

type DetailTransactionsProps = {
  data: DetailTransactionItem[];
  currentPage?: number;
  pageSize: number;
  total: number;
  onPageChange?: () => void;
};

export type DetailTransactionItem = {
  market: string;
  event: string;
  price: number;
  from: string;
  to: string;
  date: number;
};

const DetailTransactions: FC<DetailTransactionsProps> = (props) => {
  const { data, currentPage = 1, pageSize, total, onPageChange } = props;
  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <div className={styles['title']}>
          <div>交易历史</div>
          <span className={styles['s']}>Transactions</span>
        </div>
        <div className={styles['filter']}>
          <Select
            defaultValue="All Times"
            style={{ width: 120 }}
            options={[
              { value: '', label: 'All Times' },
              { value: '1', label: '1' },
            ]}
          />
        </div>
      </div>
      <div className={styles['items']}>
        <Table
          className={contentStyles['dashboard-content-table']}
          pagination={{
            position: ['bottomRight'],
            current: currentPage,
            pageSize,
            total,
            onChange: onPageChange,
          }}
          rowKey="order"
          columns={[
            { title: '市场', dataIndex: 'market', key: 'market' },
            { title: '事件', dataIndex: 'event', key: 'event' },
            {
              title: '金额',
              dataIndex: 'price',
              key: 'price',
              render: (value) => (
                <div className={styles['price']}>
                  <Image
                    src="https://storage.nfte.ai/icon/currency/eth.svg"
                    alt="eth"
                    width={15}
                    height={15}
                  />
                  {value / 1e18}
                </div>
              ),
            },
            {
              title: '发送方',
              dataIndex: 'from',
              key: 'from',
              render: (str) => formatAddress(str),
            },

            {
              title: '接收方',
              dataIndex: 'to',
              key: 'to',
              render: (str) => formatAddress(str),
            },
            {
              title: 'Date',
              dataIndex: 'date',
              key: 'date',
            },
          ]}
          dataSource={[...data]}
        />
      </div>
    </div>
  );
};

export default DetailTransactions;
