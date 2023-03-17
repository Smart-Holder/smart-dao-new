import { Button, Pagination, PaginationProps } from 'antd';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import Card from '@/components/card';
import Layout from '@/components/layout';

import Filters from '@/containers/dashboard/mine/filters';
import FinancialItem from '@/containers/dashboard/financial/financial-item';

import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';

import { useAppSelector } from '@/store/hooks';
import { getCookie } from '@/utils/cookie';
import { request } from '@/api';

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
  const { formatMessage } = useIntl();
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
      owner: address,
      state: 0,
    } as {
      author?: string;
      author_not?: string;
      owner?: string;
      orderBy?: string;
    };
    if (type === '1') {
      params.author = address;
    } else if (type === '2') {
      params.owner = address;
      params.author_not = address;
    }
    if (orderBy === '0') {
      params.orderBy = 'sellPrice desc';
    } else if (orderBy === '1') {
      params.orderBy = 'sellPrice asc';
    } else if (orderBy === '2') {
      params.orderBy = 'sellingTime desc';
    } else if (orderBy === '3') {
      params.orderBy = 'blockNumber desc';
    } else if (orderBy === '4') {
      params.orderBy = 'soldTime desc';
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

  const goShelves = () => {
    router.push('/dashboard/mine/assets/shelves');
  };

  return (
    <div className="dashboard-content">
      <Card
        data={[
          {
            label: formatMessage({
              id: 'my.asset.total',
            }),
            value: total,
          },
        ]}
      />

      <div className="table-card">
        <div className="table-filter">
          <Filters
            items={[
              {
                defaultValue: '',
                options: [
                  {
                    value: '',
                    label: formatMessage({ id: 'my.asset.allTypes' }),
                  },
                  {
                    value: '1',
                    label: formatMessage({ id: 'my.asset.published' }),
                  },
                  {
                    value: '2',
                    label: formatMessage({ id: 'my.asset.purchased' }),
                  },
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
                  {
                    value: '0',
                    label: formatMessage({ id: 'my.asset.sort.price.desc' }),
                  },
                  {
                    value: '1',
                    label: formatMessage({ id: 'my.asset.sort.price' }),
                  },
                  // { value: '2', label: 'offer从低到高' },
                  // { value: '3', label: 'offer从高到低' },
                  {
                    value: '2',
                    label: formatMessage({ id: 'my.asset.sort.release' }),
                  },
                  {
                    value: '3',
                    label: formatMessage({ id: 'my.asset.sort.created' }),
                  },
                  {
                    value: '4',
                    label: formatMessage({ id: 'my.asset.sort.sold' }),
                  },
                ],
                onSelect: onSelectOrderby,
              },
            ]}
          />

          <Button className="button-filter" type="primary" onClick={goShelves}>
            {formatMessage({ id: 'financial.asset.listing' })}
          </Button>
        </div>

        <div className={styles['dashboard-content-body']}>
          <div className={styles['financial-list']}>
            {data.map((item: any, i) => {
              return (
                <div key={i} className={styles['financial-item']}>
                  <FinancialItem
                    title={`${item.name} #${item.id}`}
                    logo={item.mediaOrigin}
                    price={
                      item.properties.find((i: any) => i.trait_type === 'price')
                        ?.value || ''
                    }
                    priceIcon={<PriceIcon />}
                    onClick={() => {
                      localStorage.setItem('asset', JSON.stringify(item));
                      router.push(`assets/detail?id=${item.id}`);
                    }}
                  />
                </div>
              );
            })}
          </div>
          {total > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
