import { useEffect, useState } from 'react';
import {
  Table,
  Form,
  message,
  Image,
  Input,
  Typography,
  Row,
  Col,
  Button,
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Card from '@/components/card';
import Select from '@/components/form/filter/select';
import RangePicker from '@/components/form/filter/rangePicker';
import DashboardHeader from '@/containers/dashboard/header';

import { request } from '@/api';

import { useAppSelector } from '@/store/hooks';

import { formatAddress, formatDayjsValues, fromToken, getUnit } from '@/utils';

import type { PaginationProps } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useIntl, FormattedMessage } from 'react-intl';
import Ellipsis from '@/components/typography/ellipsis';
import { useDaosAsset } from '@/api/graph/asset';
import { assetPoolProps } from '@/api/typings/dao';
import { useLayoutNftList } from '@/api/graph/nfts';
import { GET_DAOS_NFT_LIST } from '@/api/gqls/nfts';
import { listDataType } from '@/api/typings/nfts';

dayjs.extend(customParseFormat);

const copy = (str: string) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', str);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  document.body.removeChild(input);
  message.success('copy');
};

const columns = [
  // graph 暂时没有orderID 暂时去除 增加blockNumber
  // {
  //   title: <FormattedMessage id="financial.order.id" />,
  //   dataIndex: 'id',
  //   key: 'id',
  // },
  // { title: '市场', dataIndex: 'votes', key: 'votes' },
  {
    title: <FormattedMessage id="financial.order.id" />,
    dataIndex: 'blockNumber',
    key: 'blockNumber',
  },
  {
    title: <FormattedMessage id="financial.order.amount" />,
    dataIndex: 'value',
    key: 'value',
    render: (text: string) => fromToken(text),
  },
  // { title: '标签', dataIndex: 'votes', key: 'votes' },
  {
    title: <FormattedMessage id="financial.order.sender" />,
    dataIndex: 'fromAddres',
    key: 'fromAddres',
    render: (text: string) => {
      // return (
      //   <>
      //     <span style={{ marginRight: 4 }}>{formatAddress(text)}</span>
      //     <CopyOutlined
      //       onClick={() => {
      //         copy(text);
      //       }}
      //     />
      //   </>
      // );
      return (
        // <EllipsisMiddle prefixCount={6} suffixCount={6} copyable>
        //   {text}
        // </EllipsisMiddle>

        <Ellipsis copyable={{ text: text }}>
          {formatAddress(text, 6, 6)}
        </Ellipsis>
      );
    },
  },
  {
    title: <FormattedMessage id="financial.order.recipient" />,
    dataIndex: 'toAddress',
    key: 'toAddress',
    render: (text: string) => {
      // return (
      //   <>
      //     <span style={{ marginRight: 4 }}>{formatAddress(text)}</span>
      //     <CopyOutlined
      //       onClick={() => {
      //         copy(text);
      //       }}
      //     />
      //   </>
      // );
      return (
        // <EllipsisMiddle prefixCount={6} suffixCount={6} copyable>
        //   {text}
        // </EllipsisMiddle>
        <Ellipsis copyable={{ text: text }}>
          {formatAddress(text, 6, 6)}
        </Ellipsis>
      );
    },
  },
  {
    title: <FormattedMessage id="financial.order.date" />,
    dataIndex: 'time',
    key: 'time',
    render: (text: string) => dayjs(text).format('MM/DD/YYYY'),
  },
];

const App = () => {
  const { formatMessage } = useIntl();
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { loading, searchText } = useAppSelector((store) => store.common);

  const pageSize = 10;
  const [values, setValues] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<listDataType[]>([]);
  const [timeStr, setTimeStr] = useState<[]>();

  const [queryParams, setQueryParams] = useState<{
    blockTimestamp_gte?: string;
    blockTimestamp_lte?: string;
    asset_contains_nocase?: string;
  }>({});
  const [queryVariables, setQueryVariables] = useState<{
    orderBy: string;
    orderDirection: 'asc' | 'desc';
  }>({
    orderBy: 'blockNumber',
    orderDirection: 'desc',
  });

  const [amount, setAmount] = useState({ total: 0, amount: '0' });

  const [timer, setTimer] = useState() as any;

  const { data: assetData, refetch } = useDaosAsset({
    host: currentDAO.host.toLocaleLowerCase(),
    vote_id: currentDAO.root.toLocaleLowerCase(),
    first: currentDAO.first.toLocaleLowerCase(),
    second: currentDAO.second.toLocaleLowerCase(),
  });

  const {
    data: listData,
    loading: listLoading,
    fetchMore,
  } = useLayoutNftList({
    first: pageSize,
    skip: 0,
    host: currentDAO.host.toLocaleLowerCase(),
  });

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
    //     ...values,
    //   },
    // });

    // setData(res);
    await fetchMore({
      query: GET_DAOS_NFT_LIST({
        host: currentDAO.host,
        ...queryParams,
      }),
      variables: {
        skip: page !== 1 ? (page - 1) * data.length : 0,
        first: pageSize,
        ...queryVariables,
      },
    });
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
    const queryParamsCopy = { ...queryParams };
    const queryVariablesCopy = { ...queryVariables };

    switch (key) {
      case 'orderBy':
        switch (value) {
          case 'time desc':
            queryVariablesCopy.orderBy = 'blockTimestamp';
            queryVariablesCopy.orderDirection = 'desc';
            break;

          case 'time':
            queryVariablesCopy.orderBy = 'blockTimestamp';
            queryVariablesCopy.orderDirection = 'asc';
            break;

          case 'value desc':
            queryVariablesCopy.orderBy = 'value';
            queryVariablesCopy.orderDirection = 'desc';
            break;

          case 'value':
            queryVariablesCopy.orderBy = 'value';
            queryVariablesCopy.orderDirection = 'asc';
            break;
          default:
            break;
        }
        break;
      case 'time':
        if (value) {
          queryParamsCopy.blockTimestamp_gte = dayjs(dayjs(value[0]))
            .unix()
            .toString();
          queryParamsCopy.blockTimestamp_lte = dayjs(dayjs(value[1]))
            .unix()
            .toString();
        } else {
          delete queryParamsCopy.blockTimestamp_gte;
          delete queryParamsCopy.blockTimestamp_lte;
        }
        break;
      case 'name':
        if (value) {
          queryParamsCopy.asset_contains_nocase = value;
        } else {
          delete queryParamsCopy.asset_contains_nocase;
        }
        break;
      default:
        break;
    }

    setQueryParams(queryParamsCopy);
    setQueryVariables(queryVariablesCopy);

    if (key === 'name') {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          if (!value) {
            delete nextValues[key];
          } else {
            nextValues[key] = value;
          }

          console.log('values', nextValues);
          setValues(nextValues);
        }, 1000),
      );
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

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    getData(p);
  };

  useEffect(() => {
    const getAmount = async () => {
      await refetch();
      // const res = await request({
      //   name: 'utils',
      //   method: 'getOrderTotalAmount',
      //   params: { chain: chainId, host: currentDAO.host },
      // });

      // console.log('amount', res);
      // if (res) {
      //   setAmount(res);
      // }
    };

    getAmount();
  }, [chainId, currentDAO.host]);

  useEffect(() => {
    if (currentDAO.host) {
      setPage(1);
      getData(1);
      getTotal();
    }
  }, [searchText, values, chainId, address, currentDAO.host]);

  useEffect(() => {
    setData(listData);
  }, [listData]);

  return (
    <div>
      <div style={{ padding: '30px 91px 0 83px' }}>
        <DashboardHeader
          title={formatMessage({ id: 'sider.financial.order' })}
        />

        <Card
          data={[
            {
              label: formatMessage({ id: 'financial.order.total' }),
              // value: amount.total,
              value:
                Number(assetData?.first?.orderTotal || 0) +
                Number(assetData?.second?.orderTotal || 0),
            },
            {
              label: formatMessage({ id: 'financial.order.total.amount' }),
              // value: fromToken(amount.amount || 0) + ' ETH',
              // value: fromToken(amount.amount || 0) + ' ' + getUnit(),
              value:
                fromToken(assetData?.first?.orderAmountTotal || 0) +
                fromToken(assetData?.second?.orderAmountTotal || 0) +
                ' ETH',
            },
          ]}
        />
      </div>

      <div className="table-card" style={{ margin: '39px 33px 50px 24px' }}>
        <div className="table-filter">
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
                style={{ width: 220 }}
                placeholder="Sort"
                options={[
                  { value: '', label: 'Default' },
                  {
                    value: 'time desc',
                    label: formatMessage({
                      id: 'financial.order.sort.time.desc',
                    }),
                  },
                  {
                    value: 'time',
                    label: formatMessage({
                      id: 'financial.order.sort.time',
                    }),
                  },
                  {
                    value: 'value desc',
                    label: formatMessage({
                      id: 'financial.order.sort.amount.desc',
                    }),
                  },
                  {
                    value: 'value',
                    label: formatMessage({
                      id: 'financial.order.sort.amount',
                    }),
                  },
                ]}
              />
            </Form.Item>
            {/* <Form.Item name="sortVotes">
              <Select
                style={{ width: 140 }}
                placeholder="份数排序"
                options={[
                  { value: '', label: '默认' },
                  { value: '1', label: '份数降序' },
                  { value: '0', label: '份数升序' },
                ]}
              />
            </Form.Item> */}
            <Form.Item name="time">
              <RangePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="name">
              <Input
                className="filter"
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

        <>
          <Table
            columns={columns}
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
            loading={listLoading}
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
    </div>
  );
};

export default App;
