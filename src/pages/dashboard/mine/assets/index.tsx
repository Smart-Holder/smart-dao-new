import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Button, Col, Empty, Form, Input, Row, Image, Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import Card from '@/components/card';
import Layout from '@/components/layout';

import NFT from '@/containers/dashboard/mine/nft';
import Title from '@/containers/dashboard/header/title';
import Select from '@/components/form/filter/select';

import type { NextPageWithLayout } from '@/pages/_app';

import { useAppSelector } from '@/store/hooks';
import { getCookie } from '@/utils/cookie';
import { request } from '@/api';
import { formatDayjsValues } from '@/utils';

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
  const { loading } = useAppSelector((store) => store.common);
  const address = getCookie('address');

  const [init, setInit] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<ItemType[]>([]);
  const [pageStart, setPageStart] = useState(0);
  const [values, setValues] = useState({ orderBy: 'blockNumber desc' });
  const [initialValues, setInitialValues] = useState({
    orderBy: 'blockNumber desc',
  });

  const getDataParams = useCallback(() => {
    return {
      chain: chainId,
      host: currentDAO.host,
      owner: address,
      state: 0,
      ...values,
    };
  }, [address, chainId, currentDAO.host, values]);

  const onValuesChange = (changedValues: any) => {
    let [[key, value]]: any = Object.entries(changedValues);
    let nextValues: any = { ...values };

    if (key === 'type') {
      delete nextValues.author;
      delete nextValues.author_not;

      if (value === '1') {
        nextValues = { ...nextValues, author: address };
      } else if (value === '2') {
        nextValues = { ...nextValues, author_not: address };
      }

      setValues(nextValues);
      return;
    }

    if (!value) {
      delete nextValues[key];
    } else {
      nextValues[key] = key === 'time' ? formatDayjsValues(value) : value;
    }

    console.log('values', nextValues);
    setValues(nextValues);
  };

  const getData = async () => {
    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        ...getDataParams(),
        limit: [pageStart, 100],
      },
    });

    setData([...data, ...res]);
  };

  // const getData = useCallback(
  //   async (page = 1) => {
  //     const res = await request({
  //       name: 'utils',
  //       method: 'getAssetFrom',
  //       params: {
  //         ...getDataParams(),
  //         limit: [(page - 1) * pageSize, pageSize],
  //       },
  //     });

  //     setData(res);
  //   },
  //   [getDataParams],
  // );

  // const getTotal = useCallback(async () => {
  //   const res = await request({
  //     name: 'utils',
  //     method: 'getAssetTotalFrom',
  //     params: getDataParams(),
  //   });

  //   setTotal(res);
  // }, [getDataParams]);

  const resetData = async () => {
    const t = await request({
      name: 'utils',
      method: 'getAssetTotalFrom',
      params: getDataParams(),
    });

    setTotal(t);

    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        ...getDataParams(),
        limit: [0, 6],
      },
    });

    setPageStart(6);
    setData(res);
    setInit(true);
  };

  // const onPageChange: PaginationProps['onChange'] = (p) => {
  //   setPage(p);
  //   getData(p);
  // };

  // useEffect(() => {
  //   setPage(1);
  //   getData(1);
  //   getTotal();
  // }, [getData, getTotal]);

  useEffect(() => {
    if (currentDAO.host) {
      setData([]);
      setTotal(0);
      resetData();
    }
  }, [address, chainId, currentDAO.host, values]);

  const goShelves = () => {
    router.push('/dashboard/mine/assets/shelves');
  };

  return (
    <div style={{ padding: '30px 80px 50px' }}>
      <Title title={formatMessage({ id: 'sider.my.asset' })} />

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

      <div style={{ marginTop: 59 }}>
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
            <Form.Item name="type">
              <Select
                style={{ width: 200 }}
                placeholder={formatMessage({ id: 'my.asset.allTypes' })}
                options={[
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
                ]}
              />
            </Form.Item>
            <Form.Item name="orderBy">
              <Select
                style={{ width: 200 }}
                placeholder="Sort"
                options={[
                  { value: '', label: 'Default' },
                  {
                    value: 'sellPrice desc',
                    label: formatMessage({ id: 'my.asset.sort.price.desc' }),
                  },
                  {
                    value: 'sellPrice asc',
                    label: formatMessage({ id: 'my.asset.sort.price' }),
                  },
                  // { value: '2', label: 'offer从低到高' },
                  // { value: '3', label: 'offer从高到低' },
                  {
                    value: 'sellingTime desc',
                    label: formatMessage({ id: 'my.asset.sort.release' }),
                  },
                  {
                    value: 'blockNumber desc',
                    label: formatMessage({ id: 'my.asset.sort.created' }),
                  },
                  {
                    value: 'soldTime desc',
                    label: formatMessage({ id: 'my.asset.sort.sold' }),
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

          <Button className="button-filter" type="primary" onClick={goShelves}>
            {formatMessage({ id: 'financial.asset.listing' })}
          </Button>
        </div>

        <Row gutter={[22, 22]}>
          {data.map((item: any, i) => {
            return (
              <Col span={8} key={i}>
                <NFT data={item} />
              </Col>
            );
          })}
        </Row>

        {loading && <Skeleton active />}

        {!loading && data.length === 0 && <Empty />}

        {init && !loading && data.length < total && (
          <div className="footer">
            <Button className="button-all" onClick={getData}>
              {formatMessage({ id: 'viewAllNfts' })}
            </Button>
          </div>
        )}

        {/* {total > 0 && (
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
          )} */}
      </div>

      <style jsx>
        {`
          .footer {
            padding-top: 40px;
            text-align: center;
          }

          .footer :global(.button-all) {
            width: 260px;
            height: 46px;
            font-size: 18px;
            font-weight: bold;
            color: #000000;
            line-height: 27px;
            background: #ffffff;
            border-radius: 5px;
            border: 1px solid #000000;
          }
        `}
      </style>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
