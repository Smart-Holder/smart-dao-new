import { FC } from 'react';
import styles from './detail-transactions.module.css';
import { Table } from 'antd';
import { formatAddress } from '@/utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useIntl } from 'react-intl';
import EllipsisMiddle from '@/components/typography/ellipsisMiddle';

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
    <>
      <div className="table-title">
        {formatMessage({ id: 'financial.asset.transaction.history' })}
      </div>
      <div className="table-card" style={{ margin: '39px 33px 50px 24px' }}>
        <div className={styles['header']}>
          {/* <div className={styles['title']}>
            {formatMessage({ id: 'financial.asset.transaction.history' })}
          </div> */}
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
              render: (str) => {
                // return formatAddress(str);
                return (
                  <EllipsisMiddle
                    style={{ width: 100 }}
                    suffixCount={4}
                    copyable
                  >
                    {str}
                  </EllipsisMiddle>
                );
              },
            },

            {
              title: formatMessage({ id: 'financial.asset.recipient' }),
              dataIndex: 'toAddress',
              key: 'toAddress',
              render: (str) => {
                // return formatAddress(str);
                return (
                  <EllipsisMiddle
                    style={{ width: 100 }}
                    suffixCount={4}
                    copyable
                  >
                    {str}
                  </EllipsisMiddle>
                );
              },
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
      <style jsx>
        {`
          .table-title {
            height: 45px;
            margin: 0 80px;
            font-size: 32px;
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 45px;
          }
        `}
      </style>
    </>
  );
};

export default DetailTransactions;
