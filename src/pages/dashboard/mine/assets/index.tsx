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

  const [type, setType] = useState('');
  const [orderBy, setOrderBy] = useState('');

  const getDataParams = useCallback(() => {
    let params = {
      chain: chainId,
      host: currentDAO.host,
      state: 0,
    } as {
      author?: string;
      owner?: string;
      orderBy?: string;
    };
    if (type === '1') {
      params.author = address;
    } else if (type === '2') {
      params.owner = address;
    }
    if (orderBy === '1') {
      params.orderBy = 'sellPrice';
    }
    return params;
  }, [address, chainId, currentDAO.host, type, orderBy]);

  const getData = useCallback(
    async (page = 1) => {
      const res = await request({
        name: 'utils',
        method: 'getAssetFrom',
        params: {
          ...getDataParams(),
          limit: [(page - 1) * pageSize, pageSize],
        },
      });

      setData(res);
    },
    [getDataParams],
  );

  const getTotal = useCallback(async () => {
    const res = await request({
      name: 'utils',
      method: 'getAssetTotalFrom',
      params: getDataParams(),
    });

    setTotal(res);
  }, [getDataParams]);

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    getData(p);
  };

  useEffect(() => {
    setPage(1);
    getData(1);
    getTotal();
  }, [getData, getTotal]);

  const onSelectType = (value: string) => {
    setType(value);
    setPage(1);
    getData(1);
    getTotal();
  };
  // const onSelectTag = (value: string) => {};
  const onSelectOrderby = (value: string) => {
    setOrderBy(value);
    setPage(1);
    getData(1);
    getTotal();
  };

  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <div className={styles['dashboard-content-header']}>
        <Counts items={[{ num: total, title: 'All Counts' }]} />
        <Filters
          items={[
            {
              defaultValue: '',
              options: [
                { value: '', label: '全部类型' },
                { value: '1', label: '我创建的' },
                { value: '2', label: '我的' },
              ],
              onSelect: onSelectType,
            },
            // {
            //   defaultValue: '',
            //   options: [
            //     { value: '', label: '全部标签' },
            //     { value: '1', label: '标签1' },
            //     { value: '2', label: '标签2' },
            //   ],
            //   onSelect: onSelectTag,
            // },
            {
              defaultValue: '0',
              options: [
                { value: '0', label: '价格从高到低' },
                { value: '1', label: '价格从低到高' },
                { value: '2', label: 'offer从低到高' },
                { value: '3', label: 'offer从高到低' },
                { value: '4', label: '最近上架' },
                { value: '5', label: '最近创建' },
                { value: '6', label: '最近卖出' },
              ],
              onSelect: onSelectOrderby,
            },
          ]}
        />
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
