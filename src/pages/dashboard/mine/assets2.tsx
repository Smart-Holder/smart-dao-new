import {
  Layout as AntdLayout,
  Table,
  PaginationProps,
  Image,
  DatePicker,
  Form,
} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Layout from '@/components/layout';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import Counts from '@/containers/dashboard/mine/counts';
import { request } from '@/api';
import { useAppSelector } from '@/store/hooks';
import { getCookie } from '@/utils/cookie';
import { formatAddress, formatDayjsValues } from '@/utils';

const { RangePicker } = DatePicker;

dayjs.extend(customParseFormat);

const App: NextPageWithLayout = () => {
  const { chainId } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { loading, searchText } = useAppSelector((store) => store.common);
  const address = getCookie('address');

  const pageSize = 10;
  const [values, setValues] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const [amount, setAmount] = useState({ total: 0, amount: '0' });

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
      },
    });

    setTotal(res);
  }, [chainId, currentDAO.host]);

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
        method: 'getLedgerTotalAmount',
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
  }, [searchText, values]);

  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <div className={styles['dashboard-content-header']}>
        <Counts
          items={[
            { num: amount.total, title: '订单总数' },
            { num: Number(amount.amount), title: '总交易额' },
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
            {/* <Form.Item name="orderBy">
              <Select
                style={{ width: 140 }}
                placeholder="加入时间排序"
                options={[
                  { value: '', label: '默认' },
                  // { value: '1', label: '加入时间降序' },
                  { value: 'id', label: '加入时间升序' },
                ]}
              />
            </Form.Item> */}
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
          className={styles['dashboard-content-table']}
          pagination={{
            position: ['bottomRight'],
            current: page,
            pageSize,
            total,
            onChange: onPageChange,
          }}
          loading={loading}
          rowKey="id"
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
              title: '市场',
              dataIndex: 'mediaOrigin',
              key: 'mediaOrigin',
              render: (url, item: { name: string; properties: any[] }) => (
                <Image
                  src={url}
                  alt={item.name}
                  preview={false}
                  width={30}
                  height={30}
                />
              ),
            },
            { title: '金额', dataIndex: 'sellPrice', key: 'sellPrice' },
            { title: 'Tag', dataIndex: 'tag', key: 'tag' },
            {
              title: '发送方',
              dataIndex: 'fromAddres',
              key: 'fromAddres',
              render: (text: string) => formatAddress(text),
            },
            {
              title: '接收方',
              dataIndex: 'toAddress',
              key: 'toAddress',
              render: (text: string) => formatAddress(text),
            },
            {
              title: '日期',
              dataIndex: 'time',
              key: 'time',
              render: (text: string) => dayjs(text).format('MM/DD/YYYY'),
            },
            // {
            //   title: 'Selling Price',
            //   dataIndex: 'sellPrice',
            //   key: 'sellPrice',
            // },
            // {
            //   title: 'Blockchain',
            //   key: 'blockchain',
            //   render: (_, item: { name: string; properties: any[] }) =>
            //     item.properties[1].value,
            // },
            // { key: 'action', render: () => <EllipsisOutlined /> },
          ]}
          dataSource={[...data]}
        />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
