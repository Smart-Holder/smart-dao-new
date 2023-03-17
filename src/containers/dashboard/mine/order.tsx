import { useEffect, useState } from 'react';
import { Table, Form } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Select from '@/components/form/filter/select';
import RangePicker from '@/components/form/filter/rangePicker';

import { request } from '@/api';

import { useAppSelector } from '@/store/hooks';

import { formatDayjsValues, fromToken } from '@/utils';

import type { PaginationProps } from 'antd';

import { useIntl, FormattedMessage } from 'react-intl';
import Card from '@/components/card';

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
    render: (text: string) => fromToken(text),
  },
  {
    title: <FormattedMessage id="my.order.date" />,
    dataIndex: 'time',
    key: 'time',
    render: (text: string) => dayjs(text).format('MM/DD/YYYY'),
  },
];

const App = () => {
  const { formatMessage } = useIntl();
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const { loading, searchText } = useAppSelector((store) => store.common);

  const pageSize = 10;
  const [values, setValues] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [amount, setAmount] = useState({ total: 0, amount: '0' });

  const showModal = () => {
    setIsModalOpen(true);
    // nftpModal.current.show();
  };

  const getData = async (page = 1) => {
    const res = await request({
      name: 'utils',
      method: 'getAssetOrderFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        // tokenId: currentMember.tokenId,
        limit: [(page - 1) * pageSize, pageSize],
        name: searchText,
        toAddress: address,
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

  const onDone = () => {};

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
    if (currentDAO.host) {
      setPage(1);
      getData(1);
      getTotal();
    }
  }, [searchText, values, chainId, address, currentDAO.host]);

  return (
    <div className="wrap">
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
            value: fromToken(amount.amount || 0) + ' ETH',
          },
        ]}
      />

      <div className="table-card">
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
                style={{ width: 140 }}
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
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            position: ['bottomCenter'],
            current: page,
            pageSize,
            total,
            onChange: onPageChange,
          }}
          loading={loading}
        />
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
