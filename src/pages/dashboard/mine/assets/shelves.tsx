import {
  Layout as AntdLayout,
  Table,
  PaginationProps,
  Image,
  DatePicker,
  Form,
  Select,
  Tag,
  Button,
  Space,
  message,
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Layout from '@/components/layout';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import Input from '@/containers/dashboard/mine/input-price';
import { request } from '@/api';
import { useAppSelector } from '@/store/hooks';
import { getCookie } from '@/utils/cookie';
import { formatDayjsValues, fromToken, toToken } from '@/utils';
import { useIntl } from 'react-intl';
import { shelves } from '@/api/asset';

const { RangePicker } = DatePicker;

dayjs.extend(customParseFormat);

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();
  const { chainId } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { searchText } = useAppSelector((store) => store.common);
  const address = getCookie('address');

  const pageSize = 10;
  const [values, setValues] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [market, setMarket] = useState('');
  const [priceList, setPriceList] = useState({}) as any;
  const [price, setPrice] = useState('');
  const [selectedRow, setSelectedRow] = useState({}) as any;

  const [amount, setAmount] = useState({ total: 0, amount: '0' });

  const getData = useCallback(
    async (page = 1) => {
      setTableLoading(true);
      const res = await request({
        name: 'utils',
        method: 'getAssetFrom',
        params: {
          chain: chainId,
          host: currentDAO.host,
          limit: [(page - 1) * pageSize, pageSize],
          state: 0,
          // owner: address,
          ...values,
        },
      });

      setTableLoading(false);
      setData(res);
    },
    [chainId, currentDAO.host, values],
  );

  const getTotal = useCallback(async () => {
    const res = await request({
      name: 'utils',
      method: 'getAssetTotalFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        state: 0,
        ...values,
      },
    });

    setTotal(res);
  }, [chainId, currentDAO.host, values]);

  const onValuesChange = (changedValues: any) => {
    let [[key, value]]: any = Object.entries(changedValues);
    let nextValues: any = { ...values };

    if (key === 'type') {
      delete nextValues.author;
      delete nextValues.owner;
      delete nextValues.author_not;

      const obj: any = {};

      switch (value) {
        case '1':
          obj.author = address;
          break;
        case 'agree':
          obj.owner = address;
          obj.author_not = address;
          break;
        default:
          break;
      }

      nextValues = { ...nextValues, ...obj };
      console.log('values', nextValues);
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

  useEffect(() => {
    if (price && market) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [price, market]);

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRow(selectedRows[0]);
      setPrice(priceList[selectedRowKeys[0]]);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.selling !== 0, // Column configuration not to be checked
      name: record.name,
    }),
  };

  const onPriceChange = (value: string, rowKey: number | undefined) => {
    if (rowKey) {
      setPriceList({ ...priceList, [rowKey]: value });

      if (rowKey === selectedRow.id) {
        setPrice(value);
      }
    }
  };

  const onMarketSelect = (value: string) => {
    setMarket(value);
  };

  const onSubmit = async () => {
    const params = {
      token: selectedRow.token,
      tokenId: selectedRow.tokenId,
      amount: toToken(price, 18),
      market,
    };

    console.log('params', params);

    try {
      setLoading(true);
      await shelves(params);
      message.success('success');
      // window.location.reload();
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      message.error(error?.message);
      setLoading(false);
    }
  };

  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <div className={styles['dashboard-content-header']}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Form
            name="filter"
            layout="inline"
            onValuesChange={onValuesChange}
            autoComplete="off"
            labelAlign="left"
            requiredMark={false}
            validateTrigger="onBlur"
          >
            <Form.Item name="type" style={{ marginRight: 0 }}>
              <Select
                style={{ width: 140 }}
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
            {/* <Form.Item name="time" label="Time">
              <RangePicker format="MM/DD/YYYY" />
            </Form.Item> */}
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
          loading={tableLoading}
          rowKey="id"
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={[
            {
              title: '资产',
              dataIndex: 'mediaOrigin',
              key: 'mediaOrigin',
              render: (url, item: any) => (
                <Image
                  src={url}
                  alt={item.name}
                  preview={false}
                  width={30}
                  height={30}
                />
              ),
            },
            {
              title: 'Tag',
              dataIndex: 'tag',
              key: 'tag',
              render: (text: string, { properties }: any) => {
                const arr = properties.find(
                  (item: any) => item.trait_type === 'tags',
                );
                const tags = arr?.value.split(',') || [];

                return (
                  <>
                    {tags.map(
                      (tag: string) => tag && <Tag key={tag}>{tag}</Tag>,
                    )}
                  </>
                );
              },
            },
            {
              title: '名字/编号',
              dataIndex: 'name',
              key: 'name',
              render: (text: string, item: any) => text || `#${item.id}`,
            },
            {
              title: '价格',
              dataIndex: 'minimumPrice',
              key: 'minimumPrice',
              render: (value, item) => (
                <Input
                  placeholder={`不低于${fromToken(value || 0)}`}
                  // value={price}
                  rowKey={item.id}
                  onChange={onPriceChange}
                />
              ),
            },
          ]}
          dataSource={[...data]}
        />

        <div className="footer">
          <Space style={{ display: 'flex' }} direction="vertical" align="end">
            <Select
              style={{ width: 200 }}
              size="large"
              placeholder={formatMessage({
                id: 'financial.asset.tradingMarket',
              })}
              options={[
                {
                  value: 'opensea',
                  label: 'Opensea',
                },
              ]}
              onSelect={onMarketSelect}
            />
            <Button
              style={{ width: 200 }}
              type="primary"
              className="button"
              loading={loading}
              disabled={disabled}
              onClick={onSubmit}
            >
              {formatMessage({ id: 'financial.asset.listing' })}
            </Button>
          </Space>
        </div>

        <style jsx>
          {`
            .footer :global(.button) {
              height: 40px;
              margin-left: 20px;
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              line-height: 27px;
            }
          `}
        </style>
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
