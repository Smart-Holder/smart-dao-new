import { ReactElement, useEffect, useState } from 'react';
import { Button, Col, Empty, Form, Input, Row, Image, Skeleton } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import InfiniteScroll from 'react-infinite-scroll-component';

import Layout from '@/components/layout';
import Select from '@/components/form/filter/select';
import Footer from '@/components/footer';
import NFT from '@/containers/dashboard/mine/nft';
import DashboardHeader from '@/containers/dashboard/header';

import type { NextPageWithLayout } from '@/pages/_app';

import { useAppSelector } from '@/store/hooks';
import { ETH_CHAINS_INFO } from '@/config/chains';
import { formatAddress, formatDayjsValues, fromToken, getUnit } from '@/utils';
import { request } from '@/api';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Card from '@/components/card';
import Ellipsis from '@/components/typography/ellipsis';
import { DAOType } from '@/config/enum';

dayjs.extend(customParseFormat);

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { currentDAO, currentMember, daoType } = useAppSelector(
    (store) => store.dao,
  );
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { loading } = useAppSelector((store) => store.common);

  const [chainData, setChainData] = useState({ name: '' }) as any;
  const [summary, setSummary] = useState({
    assetOrderAmountTotal: 0,
    assetTotal: 0,
  });
  const [initialValues, setInitialValues] = useState({
    orderBy: 'blockNumber desc',
  });
  const [values, setValues] = useState(initialValues);

  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]) as any;

  const isMember = daoType === DAOType.Join && currentMember.tokenId;

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
    if (currentDAO.host) {
      setData([]);
      setTotal(0);
      resetData();
      // getTotal();
    }
  }, [values, chainId, address, currentDAO.host]);

  const onCountClick = () => {
    router.push('/dashboard/financial/order');
  };

  const onCreate = () => {
    router.push('/dashboard/financial/assets/issue');
  };

  const onShelves = () => {
    router.push('/dashboard/mine/assets/shelves');
  };

  return (
    <div className="dashboard-content-scroll" id="scrollTarget">
      <div
        style={{ padding: '30px 91px 50px 82px' }}
        className="content-min-height"
      >
        <DashboardHeader
          title={formatMessage({ id: 'sider.financial.asset' })}
          buttons={
            isMember && (
              <>
                <Button
                  type="primary"
                  ghost
                  className="smart-button"
                  onClick={onCreate}
                >
                  {formatMessage({ id: 'financial.asset.publish' })}
                </Button>
                <Button
                  type="primary"
                  className="smart-button"
                  onClick={onShelves}
                >
                  {formatMessage({ id: 'financial.asset.listing' })}
                </Button>
              </>
            )
          }
        >
          <div style={{ marginTop: 15 }} className="dao-info-item">
            <span className="dao-info-item-label">
              {formatMessage({ id: 'address' })}:
            </span>
            {/* {formatAddress(currentDAO.address)} */}
            <Ellipsis copyable>{currentDAO.address}</Ellipsis>
          </div>
          <div className="dao-info-item">
            <span className="dao-info-item-label">
              {formatMessage({ id: 'financial.asset.time.create' })}:
            </span>
            {dayjs(currentDAO.time).format('YYYY-MM-DD')}
          </div>
          <div className="dao-info-item">{chainData.name}</div>
        </DashboardHeader>
        {/* <div className={styles['dashboard-content-header']}>
          <FinancialHeader
            title={currentDAO.name}
            addr={formatAddress(currentDAO.address)}
            createTime={dayjs(currentDAO.time).format('MM/DD/YYYY')}
            amount={0}
            desc={currentDAO.description}
            logo={currentDAO.image}
            chain={chainData.name}
          />
        </div> */}

        <Card
          data={[
            {
              label: formatMessage({ id: 'financial.asset.total.trading' }),
              value: `${fromToken(
                summary?.assetOrderAmountTotal || 0,
              )} ${getUnit()}`,
              onClick: onCountClick,
            },
            {
              label: formatMessage({ id: 'financial.asset.royalties' }),
              value: '3%',
            },
            {
              label: formatMessage({ id: 'financial.asset.total' }),
              value: summary?.assetTotal || 0,
            },
            // { num: 31232, title: '所有者' },
            // { num: 31232, title: '挂单率' },
            // { num: 31232, title: '交易市场' },
          ]}
        />

        <div style={{ marginTop: 69 }}>
          <div className="table-filter">
            <Form
              name="filter"
              layout="inline"
              initialValues={initialValues}
              onValuesChange={onValuesChange}
              autoComplete="off"
              labelAlign="left"
              requiredMark={false}
              validateTrigger="onBlur"
            >
              <Form.Item name="orderBy">
                <Select
                  style={{ width: 200 }}
                  placeholder="Sort"
                  options={[
                    { value: '', label: 'Default' },
                    {
                      value: 'sellPrice',
                      label: formatMessage({
                        id: 'financial.asset.sort.price',
                      }),
                    },
                    {
                      value: 'sellPrice desc',
                      label: formatMessage({
                        id: 'financial.asset.sort.price.desc',
                      }),
                    },
                    {
                      value: 'sellingTime desc',
                      label: formatMessage({
                        id: 'financial.asset.sort.released',
                      }),
                    },
                    {
                      value: 'blockNumber desc',
                      label: formatMessage({
                        id: 'financial.asset.sort.created',
                      }),
                    },
                    {
                      value: 'soldTime desc',
                      label: formatMessage({ id: 'financial.asset.sort.sold' }),
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name="name">
                <Input
                  className="filter"
                  placeholder="Search name"
                  prefix={
                    <Image
                      src="/images/filter/icon_table_search_default@2x.png"
                      width={20}
                      height={20}
                      alt=""
                      preview={false}
                    />
                  }
                />
              </Form.Item>
            </Form>
          </div>
          <InfiniteScroll
            dataLength={data.length}
            next={getData}
            hasMore={data.length < total}
            loader={loading && <Skeleton active />}
            scrollableTarget="scrollTarget"
            style={{ overflow: 'inherit' }}
          >
            <Row gutter={[19, 20]}>
              {data.map((item: any) => {
                // return (
                //   <div key={item.id} className={styles['financial-item']}>
                //     <FinancialItem
                //       title={`${item.name} #${item.id}`}
                //       logo={item.imageOrigin}
                //       price={item.sellPrice || 0}
                //       // priceIcon={<PriceIcon />}
                //       onClick={() => {
                //         localStorage.setItem('asset', JSON.stringify(item));
                //         router.push(
                //           `/dashboard/mine/assets/detail?id=${item.id}`,
                //         );
                //       }}
                //     />
                //   </div>
                // );
                return (
                  <Col span={8} key={item.id}>
                    <NFT data={item} />
                  </Col>
                );
              })}
            </Row>
            {!loading && data.length === 0 && <Empty />}
          </InfiniteScroll>
        </div>
      </div>
      <Footer />

      <style jsx>
        {`
          .dao-info-item {
            display: flex;
            align-items: center;
            height: 25px;
            margin-top: 20px;
            font-size: 18px;
            font-weight: 500;
            color: #000000;
            line-height: 25px;
          }

          .dao-info-item-label {
            margin-right: 10px;
          }

          .dao-info-item :global(.ant-typography) {
            font-size: 18px;
            font-weight: 500;
            color: #000000;
            line-height: 25px;
          }
        `}
      </style>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout footer={false}>{page}</Layout>;

export default App;
