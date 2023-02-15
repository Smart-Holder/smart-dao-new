import { Layout as AntdLayout, Pagination, PaginationProps } from 'antd';
import Layout from '@/components/layout';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import styles from '@/styles/content.module.css';
import Counts from '@/containers/dashboard/mine/counts';
import Filters from '@/containers/dashboard/mine/filters';
import FinancialItem from '@/containers/dashboard/financial/financial-item';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { getCookie } from '@/utils/cookie';
import { request } from '@/api';
import { useRouter } from 'next/router';

const PriceIcon = () => (
  <Image
    src="https://storage.nfte.ai/icon/currency/eth.svg"
    alt="eth"
    width={15}
    height={15}
  />
);

type ItemProperty = {
  trait_type: string;
  value: string | number;
};

type ItemType = {
  name: string;
  author: string;
  id: string;
  mediaOrigin: string;
  properties: ItemProperty[];
};

const App: NextPageWithLayout = () => {
  const router = useRouter();
  const pageSize = 20;
  const { chainId } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const address = getCookie('address');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<ItemType[]>([]);

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
          state: 0,
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
        owner: address,
        state: 0,
      },
    });

    setTotal(res);
  }, [address, chainId, currentDAO.host]);

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
        <Counts items={[{ num: total, title: 'All Counts' }]} />
        <Filters />
      </div>
      <div className={styles['dashboard-content-body']}>
        <div className={styles['financial-list']}>
          {data.map((item, i) => {
            return (
              <div key={i} className={styles['financial-item']}>
                <FinancialItem
                  title={item.name}
                  logo={item.mediaOrigin}
                  price={
                    item.properties.find((item) => item.trait_type === 'price')
                      ?.value || ''
                  }
                  priceIcon={<PriceIcon />}
                  onClick={() => {
                    router.push(`assets/detail?id=${item.id}`);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className={styles['dashboard-content-pagination']}>
          <Pagination
            simple
            defaultCurrent={1}
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
          />
        </div>
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
