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
  const [allData, setAllData] = useState([]);

  const getAllData = async (page = 1) => {
    const total = await request({
      name: 'utils',
      method: 'getMembersTotalFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
      },
    });

    setTotal(total);

    const res = await request({
      name: 'utils',
      method: 'getMembersFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        limit: [0, Math.min(total, 10000)],
      },
    });

    setAllData(res);
    setTableData(res.slice(0, pageSize));
  };

  const getData = (p = 1) => {
    // setTableData()
  };

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    getData(p);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <>
      <div className={styles.item} style={{ marginTop: 20 }}>
        <span className={styles.label}>
          {formatMessage({ id: 'proposal.detail.label.income.allocate' })}:
        </span>
        <div className={styles.value} style={{ marginTop: 10, fontSize: 28 }}>
          {fromToken(data.balance || 0)} ETH
        </div>
      </div>

      <Table
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
      />
    </>
  );
};

export default App;
