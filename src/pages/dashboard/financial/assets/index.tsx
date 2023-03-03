import { Form, Layout as AntdLayout, Select, Skeleton } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import InfiniteScroll from 'react-infinite-scroll-component';

import Layout from '@/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import FinancialHeader from '@/containers/dashboard/financial/financial-header';
import Counts from '@/containers/dashboard/mine/counts';
import FinancialItem from '@/containers/dashboard/financial/financial-item';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { ETH_CHAINS_INFO } from '@/config/chains';
import { formatAddress, formatDayjsValues, fromToken } from '@/utils';
import { request } from '@/api';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

dayjs.extend(customParseFormat);

const PriceIcon = () => (
  <Image
    src="https://storage.nfte.ai/icon/currency/eth.svg"
    alt="eth"
    width={15}
    height={15}
  />
);

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { searchText, loading } = useAppSelector((store) => store.common);

  const [chainData, setChainData] = useState({ name: '' }) as any;
  const [summary, setSummary] = useState({
    assetOrderAmountTotal: 0,
    assetTotal: 0,
  });
  const [values, setValues] = useState({});

  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]) as any;

  useEffect(() => {
    if (ETH_CHAINS_INFO[chainId]) {
      setChainData(ETH_CHAINS_INFO[chainId]);
    }
  }, [chainId]);

  useEffect(() => {
    const getData = async () => {
      const res = await request({
        name: 'dao',
        method: 'getDAOSummarys',
        params: { chain: chainId, host: currentDAO.host },
      });

      if (res) {
        setSummary(res);
      }
    };

    if (currentDAO.host) {
      getData();
    }
  }, []);

  const getData = async () => {
    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        state: 0,
        limit: [(page - 1) * pageSize, pageSize],
        name: searchText,
        ...values,
      },
    });

    setPage(page + 1);
    setData([...data, ...res]);
  };

  const resetData = async () => {
    const t = await request({
      name: 'utils',
      method: 'getAssetTotalFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        state: 0,
        name: searchText,
        ...values,
      },
    });

    setTotal(t);

    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        state: 0,
        limit: [0, pageSize],
        name: searchText,
        ...values,
      },
    });

    setPage(2);
    setData(res);
  };

  const onValuesChange = (changedValues: any) => {
    let [[key, value]]: any = Object.entries(changedValues);
    const nextValues: any = { ...values };

    if (!value) {
      delete nextValues[key];
    } else {
      nextValues[key] = key === 'time' ? formatDayjsValues(value) : value;
    }

    console.log('values', nextValues);
    setValues(nextValues);
  };

  useEffect(() => {
    setData([]);
    setTotal(0);
    resetData();
    // getTotal();
  }, [searchText, values, chainId, address]);

  const onCountClick = () => {
    router.push('/dashboard/financial/order');
  };

  return (
    <AntdLayout.Content
      className={`${styles['dashboard-content']} ${styles['dashboard-content-scroll']}`}
    >
      <div className={styles['dashboard-content-header']}>
        <FinancialHeader
          title={currentDAO.name}
          addr={formatAddress(currentDAO.address)}
          createTime={dayjs(currentDAO.time).format('MM/DD/YYYY')}
          amount={0}
          desc={currentDAO.description}
          logo={currentDAO.image}
          chain={chainData.name}
        />
      </div>
      <div
        className={`${styles['dashboard-content-header']} ${styles['dashboard-content-header-mt']}`}
      >
        <Counts
          items={[
            {
              num: `${fromToken(summary?.assetOrderAmountTotal || 0)} ETH`,
              title: formatMessage({ id: 'financial.asset.total.trading' }),
              onClick: onCountClick,
            },
            // { num: 31232, title: '地板价' },
            {
              num: '3%',
              title: formatMessage({ id: 'financial.asset.royalties' }),
            },
            {
              num: summary?.assetTotal || 0,
              title: formatMessage({ id: 'financial.asset.total' }),
            },
            // { num: 31232, title: '所有者' },
            // { num: 31232, title: '挂单率' },
            // { num: 31232, title: '交易市场' },
          ]}
        />

        <Form
          name="filter"
          layout="inline"
          onValuesChange={onValuesChange}
          autoComplete="off"
          labelAlign="left"
          requiredMark={false}
          validateTrigger="onBlur"
        >
          <Form.Item name="orderBy">
            <Select
              style={{ width: 140 }}
              placeholder="Sort"
              options={[
                { value: '', label: 'Default' },
                {
                  value: 'sellPrice',
                  label: formatMessage({ id: 'financial.asset.sort.price' }),
                },
                {
                  value: 'sellPrice desc',
                  label: formatMessage({
                    id: 'financial.asset.sort.price.desc',
                  }),
                },
                {
                  value: 'sellingTime desc',
                  label: formatMessage({ id: 'financial.asset.sort.released' }),
                },
                {
                  value: 'blockNumber desc',
                  label: formatMessage({ id: 'financial.asset.sort.created' }),
                },
                {
                  value: 'soldTime desc',
                  label: formatMessage({ id: 'financial.asset.sort.sold' }),
                },
              ]}
            />
          </Form.Item>
        </Form>
      </div>
      <div
        style={{ padding: '23px 30px' }}
        className={styles['dashboard-content-body']}
        id="scrollableAssets"
      >
        <InfiniteScroll
          dataLength={data.length}
          next={getData}
          hasMore={data.length < total}
          loader={loading && <Skeleton paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableAssets"
        >
          <div className={styles['financial-list']}>
            {data.map((item: any) => {
              return (
                <div key={item.id} className={styles['financial-item']}>
                  <FinancialItem
                    title={`${item.name} #${item.id}`}
                    logo={item.imageOrigin}
                    price={item.sellPrice || 0}
                    // priceIcon={<PriceIcon />}
                    onClick={() => {
                      localStorage.setItem('asset', JSON.stringify(item));
                      router.push(
                        `/dashboard/mine/assets/detail?id=${item.id}`,
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
