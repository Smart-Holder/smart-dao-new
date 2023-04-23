import { FC } from 'react';
import styles from './detail-transactions.module.css';
import { Table, Typography } from 'antd';
import { formatAddress } from '@/utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useIntl } from 'react-intl';
import Ellipsis from '@/components/typography/ellipsis';
import Price from '@/components/price';
import { AssetOrderExt } from '@/config/define_ext';

dayjs.extend(customParseFormat);

type DetailTransactionsProps = {
  data: AssetOrderExt[];
  currentPage?: number;
  pageSize: number;
  total: number;
  onPageChange?: () => void;
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
            // {
            //   title: formatMessage({ id: 'financial.asset.event' }),
            //   dataIndex: 'event',
            //   key: 'event',
            //   render: (str) => str || '--',
            // },
            {
              title: formatMessage({ id: 'financial.asset.price' }),
              dataIndex: 'value',
              key: 'value',
              render: (value, item: AssetOrderExt) => {
                return <Price data={item?.asset} />;
              },
            },
            {
              title: formatMessage({ id: 'financial.asset.sender' }),
              dataIndex: 'fromAddres',
              key: 'fromAddres',
              render: (str) => {
                // return formatAddress(str);
                return (
                  // <EllipsisMiddle prefixCount={6} suffixCount={6} copyable>
                  //   {str}
                  // </EllipsisMiddle>
                  <Ellipsis copyable={{ text: str }}>
                    {formatAddress(str, 6, 6)}
                  </Ellipsis>
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
                  // <EllipsisMiddle prefixCount={6} suffixCount={6} copyable>
                  //   {str}
                  // </EllipsisMiddle>
                  <Ellipsis copyable={{ text: str }}>
                    {formatAddress(str, 6, 6)}
                  </Ellipsis>
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
            font-family: var(--font-family-secondary);
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
