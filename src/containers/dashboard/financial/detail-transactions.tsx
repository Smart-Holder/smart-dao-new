import { FC } from 'react';
import styles from './detail-transactions.module.css';
import contentStyles from '@/styles/content.module.css';
import { Table } from 'antd';
import { formatAddress } from '@/utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useIntl } from 'react-intl';

dayjs.extend(customParseFormat);

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
  const { formatMessage } = useIntl();
  const { data, currentPage = 1, pageSize, total, onPageChange } = props;
  return (
    <div className="table-card" style={{ margin: '39px 33px 50px 24px' }}>
      <div className={styles['header']}>
        <div className={styles['title']}>
          <div>
            {formatMessage({ id: 'financial.asset.transaction.history' })}
          </div>
          {/* <span className={styles['s']}>Transactions</span> */}
        </div>
        {/* <div className={styles['filter']}>
          <Select
            defaultValue="All Times"
            style={{ width: 120 }}
            options={[
              { value: '', label: 'All Times' },
              { value: '1', label: '1' },
            ]}
          />
        </div> */}
      </div>
      <Table
        style={{ marginTop: 20 }}
        // pagination={{
        //   position: ['bottomRight'],
        //   current: currentPage,
        //   pageSize,
        //   total,
        //   onChange: onPageChange,
        // }}
        pagination={false}
        rowKey="id"
        columns={[
          // { title: '市场', dataIndex: 'market', key: 'market' },
          {
            title: formatMessage({ id: 'financial.asset.event' }),
            dataIndex: 'event',
            key: 'event',
            render: (str) => str || '--',
          },
          {
            title: formatMessage({ id: 'financial.asset.price' }),
            dataIndex: 'value',
            key: 'value',
            render: (value) => (
              <div className={styles['price']}>
                {/* <Image
                    src="https://storage.nfte.ai/icon/currency/eth.svg"
                    alt="eth"
                    width={15}
                    height={15}
                  /> */}
                {value / 1e18}
              </div>
            ),
          },
          {
            title: formatMessage({ id: 'financial.asset.sender' }),
            dataIndex: 'fromAddres',
            key: 'fromAddres',
            render: (str) => formatAddress(str),
          },

          {
            title: formatMessage({ id: 'financial.asset.recipient' }),
            dataIndex: 'toAddress',
            key: 'toAddress',
            render: (str) => formatAddress(str),
          },
          {
            title: formatMessage({ id: 'financial.asset.date' }),
            dataIndex: 'time',
            key: 'time',
            render: (text: string) => dayjs(text).format('MM/DD/YYYY'),
          },
        ]}
        dataSource={[...data]}
      />
    </div>
  );
};

export default DetailTransactions;
