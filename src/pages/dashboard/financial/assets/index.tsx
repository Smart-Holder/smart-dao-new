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
import { useDaosAsset } from '@/api/graph/asset';
import { assetPoolProps } from '@/api/typings/dao';
import { useDaosNfts } from '@/api/graph/nfts';
import { GET_DAOS_NFTS_ACTION } from '@/api/gqls/nfts';

dayjs.extend(customParseFormat);

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { currentDAO, currentMember, daoType } = useAppSelector(
    (store) => store.dao,
  );
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { loading } = useAppSelector((store) => store.common);

  const [pageStart, setPageStart] = useState(0);
  const [chainData, setChainData] = useState({ name: '' }) as any;
  const [summary, setSummary] = useState({
    assetOrderAmountTotal: 0,
    assetTotal: 0,
  });
  const [initialValues, setInitialValues] = useState({
    orderBy: 'blockNumber desc',
  });
  const [values, setValues] = useState(initialValues);
  const [ledgerSummarys, setLedgerSummarys] = useState([]);
  const [assetTax, setAssetTax] = useState<any[]>([]);

  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]) as any;
  const [variables, setVariables] = useState<{
    orderBy: string;
    orderDirection: string;
    name_contains_nocase?: string;
  }>({
    orderBy: 'blockNumber',
    orderDirection: 'desc',
  });
  const isMember = daoType === DAOType.Join && currentMember.tokenId;

  const { data: assetData } = useDaosAsset({
    host: currentDAO.host,
    vote_id: currentDAO.root,
    first: currentDAO.first,
    second: currentDAO.second,
  });

  const {
    items: AssetNftDatas,
    fetchMore,
    loading: nftLoading,
  } = useDaosNfts({
    host: currentDAO.host,
    first: pageSize,
    skip: pageStart,
    chainId,
    destroyed: false,
  });

  useEffect(() => {
    if (ETH_CHAINS_INFO[chainId]) {
      setChainData(ETH_CHAINS_INFO[chainId]);
    }
  }, [chainId]);

  // useEffect(() => {
  //   const getData = async () => {
  //     const res = await request({
  //       name: 'dao',
  //       method: 'getDAOSummarys',
  //       params: { chain: chainId, host: currentDAO.host },
  //     });

  // if (res) {
  //   let ledgerSummarysData = res.ledgerSummarys.map((item: any) => {
  //     return {
  //       value:
  //         fromToken(item.assetSaleAmount || 0) + ' ' + item.balance.symbol,
  //       symbol: item.balance.symbol,
  //     };
  //   });
  //   setLedgerSummarys(ledgerSummarysData);
  //   setSummary(res);
  // }
  // if (currentDAO) {
  //   let taxList = [
  //     {
  //       value:
  //         formatMessage({ id: 'financial.asset.issuance.tax' }) +
  //         ' : ' +
  //         currentDAO.assetIssuanceTax / 100 +
  //         '%',
  //       symbol: '%',
  //     },
  //     {
  //       value:
  //         formatMessage({ id: 'financial.asset.circulation.tax' }) +
  //         ' : ' +
  //         currentDAO.assetCirculationTax / 100 +
  //         '%',
  //       symbol: '%',
  //     },
  //   ];

  //   setAssetTax(taxList);
  // }
  // };

  //   if (currentDAO.host) {
  //     getData();
  //   }
  // }, []);

  const getData = async () => {
    const { name_contains_nocase, orderBy, orderDirection } = variables;
    // const res = await request({
    //   name: 'utils',
    //   method: 'getAssetFrom',
    //   params: {
    //     chain: chainId,
    //     host: currentDAO.host,
    //     state: 0,
    //     limit: [(page - 1) * pageSize, pageSize],
    //     ...values,
    //   },
    // });
    // setPage(page + 1);
    // setData([...data, ...res]);

    await fetchMore({
      query: GET_DAOS_NFTS_ACTION({
        destroyed: false,
        name_contains_nocase,
      }),
      variables: {
        host: currentDAO.host.toLocaleLowerCase(),
        first: pageSize,
        skip: data.length || 0,
        chainId,
        orderBy,
        orderDirection,
      },
    });
  };

  const resetData = async () => {
    const { name_contains_nocase, orderBy, orderDirection } = variables;
    // const t = await request({
    //   name: 'utils',
    //   method: 'getAssetTotalFrom',
    //   params: {
    //     chain: chainId,
    //     host: currentDAO.host,
    //     state: 0,
    //     ...values,
    //   },
    // });

    // setTotal(t);

    // const res = await request({
    //   name: 'utils',
    //   method: 'getAssetFrom',
    //   params: {
    //     chain: chainId,
    //     host: currentDAO.host,
    //     state: 0,
    //     limit: [0, pageSize],
    //     ...values,
    //   },
    // });

    await fetchMore({
      query: GET_DAOS_NFTS_ACTION({
        destroyed: false,
        name_contains_nocase,
      }),
      variables: {
        host: currentDAO.host.toLocaleLowerCase(),
        first: pageSize,
        skip: 0,
        chainId,
        orderBy,
        orderDirection,
      },
    });

    // setPage(1);
    // setData(res);
  };

  const onValuesChange = (changedValues: any) => {
    let varobj = { ...variables };
    let [[key, value]]: any = Object.entries(changedValues);
    const nextValues: any = { ...values };

    if (!value) {
      delete nextValues[key];
    } else {
      nextValues[key] = key === 'time' ? formatDayjsValues(value) : value;
    }

    console.log('nextValues', nextValues);
    switch (key) {
      case 'orderBy':
        switch (value) {
          case 'sellPrice':
            varobj.orderBy = 'sellPrice';
            varobj.orderDirection = 'asc';
            break;
          case 'sellPrice desc':
            varobj.orderBy = 'sellPrice';
            varobj.orderDirection = 'desc';
            break;
          case 'sellingTime desc':
            varobj.orderBy = 'sellingTime';
            varobj.orderDirection = 'desc';
            break;
          case 'blockNumber desc':
            varobj.orderBy = 'blockNumber';
            varobj.orderDirection = 'desc';
            break;
          case 'soldTime desc':
            varobj.orderBy = 'soldTime';
            varobj.orderDirection = 'desc';
            break;
          default:
            break;
        }
        break;
      case 'name':
        varobj.name_contains_nocase = value ? value : undefined;
        break;
      default:
        break;
    }

    setVariables(varobj);
    setValues(nextValues);
  };

  useEffect(() => {
    if (currentDAO.host) {
      setData([]);
      setTotal(0);
      setPage(1);
      setPageStart(0);
      resetData();
      // getTotal();
    }
  }, [variables, chainId, address, currentDAO.host]);

  useEffect(() => {
    if (AssetNftDatas) {
      if (page === 1) {
        setData([...AssetNftDatas]);
      } else {
        if (AssetNftDatas.length < pageSize) {
          setTotal([...data, ...AssetNftDatas].length);
        }
        setData([...data, ...AssetNftDatas]);
      }
    }
  }, [AssetNftDatas]);

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
            {dayjs(Number(currentDAO.time)).format('YYYY-MM-DD')}
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
              // value: `${fromToken(
              //   summary?.assetOrderAmountTotal || 0,
              // )} ${getUnit()}`,
              // value: ledgerSummarys.length ? ledgerSummarys : 0,
              value: `${
                fromToken(assetData?.first?.orderAmountTotal) +
                fromToken(assetData?.second?.orderAmountTotal)
              } ${getUnit()}`,
              onClick: onCountClick,
            },
            {
              // label: formatMessage({ id: 'financial.asset.royalties' }),
              // value: '3%',
              value: assetTax.length ? assetTax : 0,
              childStyle: { marginTop: '0', fontSize: '18px' },
            },
            {
              label: formatMessage({ id: 'financial.asset.total' }),
              // value: summary?.assetTotal || 0,
              value:
                Number(assetData?.second?.total) +
                  Number(assetData?.first?.total) || 0,
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
            loader={nftLoading && <Skeleton active />}
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
            {!nftLoading && data.length === 0 && <Empty />}
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
