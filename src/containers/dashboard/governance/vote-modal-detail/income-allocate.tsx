import { Table } from 'antd';
import { useEffect, useState } from 'react';

import Ellipsis from '@/components/typography/ellipsis';

import { formatAddress, fromToken } from '@/utils';

import { useIntl, FormattedMessage } from 'react-intl';

import styles from './detail.module.css';
import { useAppSelector } from '@/store/hooks';
import { request } from '@/api';

import type { PaginationProps } from 'antd';

type Props = {
  data: {
    balance: string;
  };
};

const columns = [
  {
    title: 'NFTP',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => text || '-',
  },
  {
    title: <FormattedMessage id="address" />,
    dataIndex: 'owner',
    key: 'owner',
    render: (text: string) => {
      return (
        <Ellipsis copyable={{ text: text }}>
          {formatAddress(text, 6, 6)}
        </Ellipsis>
      );
    },
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
];

const App = ({ data }: Props) => {
  const { formatMessage } = useIntl();

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState([]);

  const getData = async (page = 1) => {
    const res = await request({
      name: 'utils',
      method: 'getMembersFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        limit: [(page - 1) * pageSize, pageSize],
      },
    });

    setTableData(res);
  };

  const getTotal = async () => {
    const res = await request({
      name: 'utils',
      method: 'getMembersTotalFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
      },
    });

    setTotal(res);
  };

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    getData(p);
  };

  // useEffect(() => {
  //   setPage(1);
  //   getData(1);
  //   getTotal();
  // }, [chainId, address]);

  return (
    <>
      <div className={styles.item} style={{ marginTop: 20 }}>
        <span className={styles.label}>
          {formatMessage({ id: 'proposal.detail.label.income.allocate' })}:
        </span>
        <span className={styles.value}>{fromToken(data.balance || 0)} ETH</span>
      </div>

      {/* <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        pagination={{
          position: ['bottomCenter'],
          current: page,
          pageSize,
          total,
          onChange: onPageChange,
        }}
      /> */}
    </>
  );
};

export default App;
