import { Layout as AntdLayout, Table, PaginationProps, Image } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import Layout from '@/components/layout';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import Counts from '@/containers/dashboard/mine/counts';
import Filters from '@/containers/dashboard/mine/filters';
import { request } from '@/api';
import { useAppSelector } from '@/store/hooks';
import { getCookie } from '@/utils/cookie';
import { formatAddress } from '@/utils';

const App: NextPageWithLayout = () => {
  const pageSize = 20;
  const { chainId } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const address = getCookie('address');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const getData = useCallback(
    async (page = 1) => {
      const res = await request({
        name: 'utils',
        method: 'getAssetFrom',
        params: {
          chain: chainId,
          host: currentDAO.host,
          limit: [(page - 1) * pageSize, pageSize],
          owner: address,
        },
      });

      setData(res);
    },
    [address, chainId, currentDAO.host],
  );

  const getTotal = useCallback(async () => {
    const res = await request({
      name: 'utils',
      method: 'getAssetTotalFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
      },
    });

    setTotal(res);
  }, [chainId, currentDAO.host]);

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    getData(p);
  };

  useEffect(() => {
    setPage(1);
    getData(1);
    getTotal();
  }, [getData, getTotal]);

  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <div className={styles['dashboard-content-header']}>
        <Counts items={[{ num: total, title: 'All Acounts' }]} />
        <Filters />
      </div>
      <div className={styles['dashboard-content-body']}>
        <Table
          className={styles['dashboard-content-table']}
          pagination={{
            position: ['bottomRight'],
            current: page,
            pageSize,
            total,
            onChange: onPageChange,
          }}
          rowKey="order"
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
              title: 'Creator',
              dataIndex: 'author',
              key: 'author',
              render: (str) => formatAddress(str),
            },
            { title: 'Tag', dataIndex: 'tag', key: 'tag' },
            {
              title: 'Media',
              dataIndex: 'mediaOrigin',
              key: 'mediaOrigin',
              render: (url, item: { name: string; properties: any[] }) => (
                <Image
                  src={url}
                  alt={item.name}
                  preview={false}
                  width={30}
                  height={30}
                />
              ),
            },
            {
              title: 'Selling Price',
              dataIndex: 'sellPrice',
              key: 'sellPrice',
            },
            {
              title: 'Blockchain',
              key: 'blockchain',
              render: (_, item: { name: string; properties: any[] }) =>
                item.properties[1].value,
            },
            { key: 'action', render: () => <EllipsisOutlined /> },
          ]}
          dataSource={[...data]}
        />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
