import { useEffect, useState, useRef } from 'react';
import { Table, DatePicker, Form, Select, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Counts from '@/containers/dashboard/mine/counts';
import NftpModal from '@/components/modal/nftpModal';

import { request } from '@/api';

import styles from '@/styles/content.module.css';
import { useAppSelector } from '@/store/hooks';

import { formatAddress, formatDayjsValues, fromToken } from '@/utils';

import type { PaginationProps } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useIntl, FormattedMessage } from 'react-intl';

const { RangePicker } = DatePicker;

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
  {
    title: <FormattedMessage id="financial.order.id" />,
    dataIndex: 'id',
    key: 'id',
  },
  // { title: '市场', dataIndex: 'votes', key: 'votes' },
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
      return (
        <>
          <span style={{ marginRight: 4 }}>{formatAddress(text)}</span>
          <CopyOutlined
            onClick={() => {
              copy(text);
            }}
          />
        </>
      );
    },
  },
  {
    title: <FormattedMessage id="financial.order.recipient" />,
    dataIndex: 'toAddress',
    key: 'toAddress',
    render: (text: string) => {
      return (
        <>
          <span style={{ marginRight: 4 }}>{formatAddress(text)}</span>
          <CopyOutlined
            onClick={() => {
              copy(text);
            }}
          />
        </>
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
  const [data, setData] = useState([]);

  const [amount, setAmount] = useState({ total: 0, amount: '0' });

  const nftpModal: any = useRef(null);

  const showModal = () => {
    nftpModal.current.show();
  };

  const getData = async (page = 1) => {
    const res = await request({
      name: 'utils',
      method: 'getAssetOrderFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        limit: [(page - 1) * pageSize, pageSize],
        name: searchText,
        ...values,
      },
    });

    setData(res);
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
        ...filterValues,
      },
    });

    setTotal(res);
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

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    getData(p);
  };

  useEffect(() => {
    const getAmount = async () => {
      const res = await request({
        name: 'utils',
        method: 'getOrderTotalAmount',
        params: { chain: chainId, host: currentDAO.host },
      });

      console.log('amount', res);
      if (res) {
        setAmount(res);
      }
    };

    getAmount();
  }, []);

  useEffect(() => {
    setPage(1);
    getData(1);
    getTotal();
  }, [searchText, values, chainId, address]);

  return (
    <div className="wrap">
      <div className={styles['dashboard-content-header']}>
        <Counts
          items={[
            {
              num: amount.total,
              title: formatMessage({
                id: 'financial.order.total',
              }),
            },
            {
              num: fromToken(amount.amount || 0) + ' ETH',
              title: formatMessage({
                id: 'financial.order.total.amount',
              }),
            },
          ]}
        />

        <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <Form.Item name="time" label="Time">
              <RangePicker format="MM/DD/YYYY" />
            </Form.Item>
          </Form>

          {/* <Button type="primary" onClick={showModal}>
            添加NFTP
          </Button> */}
        </div>
      </div>

      <div className={styles['dashboard-content-body']}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: onPageChange,
          }}
          loading={loading}
        />
      </div>

      <NftpModal ref={nftpModal} />
    </div>
  );
};

export default App;
