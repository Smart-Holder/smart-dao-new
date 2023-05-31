import { useEffect, useState } from 'react';
import { Table, Form, Row, Col, Button } from 'antd';
import dayjs from 'dayjs';
import web3 from 'web3';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Select from '@/components/form/filter/select';
import RangePicker from '@/components/form/filter/rangePicker';
import Title from '@/containers/dashboard/header/title';
import Price from '@/components/price';

import { request } from '@/api';

import { useAppSelector } from '@/store/hooks';

import {
  formatAddress,
  formatDayjsValues,
  fromToken,
  getUnit,
  tokenIdFormat,
} from '@/utils';

import type { PaginationProps } from 'antd';

import { useIntl, FormattedMessage } from 'react-intl';
import Card from '@/components/card';
import { useLayoutNftList } from '@/api/graph/nfts';
import { GET_DAOS_NFT_LIST } from '@/api/gqls/nfts';
import {
  Daos_Nft_List_Props,
  LayoutNftListProps,
  listDataType,
} from '@/api/typings/nfts';
import Ellipsis from '@/components/typography/ellipsis';

dayjs.extend(customParseFormat);

const columns = [
  {
    title: <FormattedMessage id="my.order.id" />,
    dataIndex: 'id',
    key: 'id',
  },
  // {
  //   title: '标签',
  //   dataIndex: 'tags',
  //   key: 'tags',
  //   render: (text: string, { asset: { properties } }: any) => {
  //     const arr = properties.find((item: any) => item.trait_type === 'tags');
  //     return arr?.value || '';
  //   },
  // },
  {
    title: <FormattedMessage id="my.order.asset" />,
    // dataIndex: ['asset', 'name'],
    dataIndex: 'asset_id',
    key: 'asset_id',
    render: (text: string) => '#' + text,
  },
  // { title: '市场', dataIndex: 'votes', key: 'votes' },
  {
    title: <FormattedMessage id="my.order.type" />,
    dataIndex: 'votes',
    key: 'votes',
  },
  {
    title: <FormattedMessage id="my.order.amount" />,
    dataIndex: 'value',
    key: 'value',
    render: (text: string) => <Price value={fromToken(text)} />,
  },
  {
    title: <FormattedMessage id="my.order.date" />,
    dataIndex: 'time',
    key: 'time',
    render: (text: string) => dayjs(text).format('MM/DD/YYYY'),
  },
];

const getColumns = (type = 'Seller') => {
  return [
    {
      title: 'BlockNumber',
      dataIndex: 'blockNumber',
      key: 'blockNumber',
    },
    // {
    //   title: <FormattedMessage id="my.order.id" />,
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    // {
    //   title: '标签',
    //   dataIndex: 'tags',
    //   key: 'tags',
    //   render: (text: string, { asset: { properties } }: any) => {
    //     const arr = properties.find((item: any) => item.trait_type === 'tags');
    //     return arr?.value || '';
    //   },
    // },
    // {
    //   title: <FormattedMessage id="my.order.asset" />,
    //   // dataIndex: ['asset', 'name'],
    //   dataIndex: 'asset_id',
    //   key: 'asset_id',
    //   render: (text: string) => '#' + text,
    // },

    {
      title: <FormattedMessage id="my.order.asset" />,
      // dataIndex: ['asset', 'name'],
      dataIndex: 'tokenId',
      key: 'tokenId',
      // render: (text: string) => '#' + text,
      render: (text: string) => {
        let text2 = tokenIdFormat(text);
        return (
          <Ellipsis copyable={{ text: text2 }}>
            {formatAddress(text2, 6, 6)}
          </Ellipsis>
        );
      },
    },
    // { title: '市场', dataIndex: 'votes', key: 'votes' },
    {
      title: <FormattedMessage id="my.order.type" />,
      dataIndex: 'votes',
      key: 'votes',
      render: (text: string) => type,
    },
    {
      title: <FormattedMessage id="my.order.amount" />,
      dataIndex: 'value',
      key: 'value',
      render: (text: string) => <Price value={fromToken(text)} />,
    },
    {
      title: <FormattedMessage id="my.order.date" />,
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => dayjs(text).format('MM/DD/YYYY'),
    },
  ];
};

const App = () => {
  const { formatMessage } = useIntl();
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const { loading, searchText } = useAppSelector((store) => store.common);

  const pageSize = 10;
  const [values, setValues] = useState({ toAddress: '', fromAddres: address });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<listDataType[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [amount, setAmount] = useState({ total: 0, amount: 0 });

  const [queryParams, setQueryParams] = useState<Daos_Nft_List_Props>({
    host: currentDAO.host.toLocaleLowerCase(),
    from: address,
  });

  const [variablesParams, setVariablesParams] = useState<LayoutNftListProps>({
    first: pageSize,
    skip: data.length,
  });

  const { data: listData, fetchMore } = useLayoutNftList({
    first: pageSize,
    skip: 0,
    host: currentDAO.host.toLocaleLowerCase(),
  });

  const showModal = () => {
    setIsModalOpen(true);
    // nftpModal.current.show();
  };

  const getData = async (page = 1) => {
    // const res = await request({
    //   name: 'utils',
    //   method: 'getAssetOrderFrom',
    //   params: {
    //     chain: chainId,
    //     host: currentDAO.host,
    //     limit: [(page - 1) * pageSize, pageSize],
    //     name: searchText,
    //     fromAddres_not: '0x0000000000000000000000000000000000000000',
    //     toAddress_not: '0x0000000000000000000000000000000000000000',
    //     // toAddress: address,
    //     ...values,
    //   },
    // });

    await fetchMore({
      query: GET_DAOS_NFT_LIST({
        ...queryParams,
      }),
      variables: {
        ...variablesParams,
        skip: page === 1 ? 0 : data.length,
      },
    });

    // setData(res);
  };

  const getTotal = async () => {
    const filterValues: any = { ...values };
    delete filterValues.time;

    const res = await request({
      name: 'utils',
      method: 'getAssetOrderTotalFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        name: searchText,
        fromAddres_not: '0x0000000000000000000000000000000000000000',
        toAddress_not: '0x0000000000000000000000000000000000000000',
        ...filterValues,
      },
    });

    setTotal(res);
  };

  const onValuesChange = (changedValues: any) => {
    let [[key, value]]: any = Object.entries(changedValues);
    const nextValues: any = { ...values };
    let queryParamsCopy = { ...queryParams };
    let variablesParamsCopy = { ...variablesParams };

    switch (key) {
      case 'type':
        delete queryParamsCopy.from;
        delete queryParamsCopy.to;
        if (value === 'buyer') {
          queryParamsCopy.to = address;
        } else if (value === 'seller') {
          queryParamsCopy.from = address;
        } else {
          queryParamsCopy.to = address;
        }
        break;
      case 'orderBy':
        switch (value) {
          case 'value':
            variablesParamsCopy.orderBy = 'value';
            variablesParamsCopy.orderDirection = 'asc';
            break;
          case 'value desc':
            variablesParamsCopy.orderBy = 'value';
            variablesParamsCopy.orderDirection = 'desc';
            break;
          default:
            variablesParamsCopy.orderBy = 'blockNumber';
            variablesParamsCopy.orderDirection = 'desc';
            break;
        }
        break;
      case 'time':
        if (value) {
          queryParamsCopy.blockTimestamp_gte = dayjs(value[0])
            .unix()
            .toString();
          queryParamsCopy.blockTimestamp_lte = dayjs(value[1])
            .unix()
            .toString();
        } else {
          delete queryParamsCopy.blockTimestamp_gte;
          delete queryParamsCopy.blockTimestamp_lte;
        }
        break;
      default:
        break;
    }

    console.log(queryParamsCopy, 'queryParamsCopy');
    setValues(nextValues);
    setQueryParams(queryParamsCopy);

    if (key === 'type') {
      delete nextValues.toAddress;
      delete nextValues.fromAddres;

      if (value === 'buyer') {
        nextValues.toAddress = address;
      } else if (value === 'seller') {
        nextValues.fromAddres = address;
      }

      setValues(nextValues);
      console.log('values', nextValues);
      return;
    }

    if (!value) {
      delete nextValues[key];
    } else {
      nextValues[key] = key === 'time' ? formatDayjsValues(value) : value;
    }

    console.log('values', nextValues);
    setVariablesParams(variablesParamsCopy);
  };

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    getData(p);
  };

  const onDone = () => {};

  useEffect(() => {
    const getAmount = async () => {
      const [res1, res2] = await Promise.all([
        request({
          name: 'utils',
          method: 'getOrderTotalAmount',
          params: {
            chain: chainId,
            fromAddres: address,
            host: currentDAO.host,
          },
        }),
        request({
          name: 'utils',
          method: 'getOrderTotalAmount',
          params: {
            chain: chainId,
            toAddress: address,
            host: currentDAO.host,
          },
        }),
      ]);

      // console.log('amount', res1, res2);

      if (res1 || res2) {
        setAmount({
          total: Number(res1?.total || 0) + Number(res2?.total || 0),
          amount: fromToken(res1?.amount || 0) + fromToken(res2?.amount || 0),
        });
      }
    };

    getAmount();
  }, [address, chainId, currentDAO.host]);

  useEffect(() => {
    if (currentDAO.host) {
      setPage(1);
      getData(1);
      getTotal();
    }
  }, [
    searchText,
    values,
    chainId,
    address,
    currentDAO.host,
    currentMember.tokenId,
  ]);

  useEffect(() => {
    if (listData) {
      setData(listData);
    }
  }, [listData]);

  return (
    <div style={{ padding: '30px 24px 50px' }}>
      <div style={{ padding: '0 59px' }}>
        <Title title={formatMessage({ id: 'sider.my.order' })} />

        <Card
          data={[
            {
              label: formatMessage({
                id: 'my.order.total',
              }),
              value: amount.total,
            },
            {
              label: formatMessage({
                id: 'my.order.amount',
              }),
              value: amount.amount + ' ' + getUnit(),
            },
          ]}
        />
      </div>

      <div className="table-card">
        <div className="table-filter">
          <Form
            name="filter"
            layout="inline"
            onValuesChange={onValuesChange}
            initialValues={{ type: 'seller' }}
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
                    value: 'value desc',
                    label: formatMessage({
                      id: 'my.order.sort.amount.desc',
                    }),
                  },
                  {
                    value: 'value',
                    label: formatMessage({
                      id: 'my.order.sort.amount',
                    }),
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="type">
              <Select
                style={{ width: 200 }}
                placeholder="Buyer"
                options={[
                  {
                    value: 'buyer',
                    label: 'Buyer',
                  },
                  {
                    value: 'seller',
                    label: 'Seller',
                  },
                ]}
              />
            </Form.Item>
            {/* <Form.Item name="sortVotes">
              <Select
                style={{ width: 140 }}
                placeholder="收入类型"
                options={[
                  { value: '', label: '全部收入类型' },
                  { value: '1', label: '发行税收入' },
                  { value: '0', label: '交易税收入' },
                ]}
              />
            </Form.Item> */}
            <Form.Item name="time">
              <RangePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Form>

          {/* <Button type="primary" onClick={showModal}>
          分配
        </Button> */}
        </div>
        <>
          <Table
            columns={getColumns(values.fromAddres ? 'Seller' : 'Buyer')}
            dataSource={data}
            rowKey="id"
            pagination={false}
            // pagination={{
            //   position: ['bottomCenter'],
            //   current: page,
            //   pageSize,
            //   total,
            //   onChange: onPageChange,
            // }}
            loading={loading}
          />

          <Row justify="center" style={{ marginTop: 20 }}>
            <Col span={3}>
              <Button
                disabled={page === 1}
                onClick={() =>
                  onPageChange(page - 1 <= 1 ? 1 : page - 1, pageSize)
                }
              >
                &lt; Previous
              </Button>
            </Col>
            <Col span={2}>
              <Button
                disabled={!data.length}
                onClick={() => onPageChange(page + 1, pageSize)}
              >
                Next &gt;
              </Button>
            </Col>
          </Row>
        </>
      </div>

      {/* <NftpModal ref={nftpModal} /> */}

      {/* <Modal
        width={512}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className={styles['dashboard-modal-content']}>
          <div className={styles['dashboard-modal-title']}>
            分配收益并自动提交提案
          </div>
          <div className={styles['dashboard-modal-subtitle']}>
            Create your own DAO in a few minutes!
          </div>
          <Button
            type="primary"
            className={styles['dashboard-modal-button']}
            onClick={onDone}
          >
            Done
          </Button>
        </div>
      </Modal> */}
    </div>
  );
};

export default App;
