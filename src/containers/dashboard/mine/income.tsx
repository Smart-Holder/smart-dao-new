import { useEffect, useState, useRef } from 'react';
import { Table, Button, DatePicker, Form, Select, Modal } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Counts from '@/containers/dashboard/mine/counts';
import NftpModal from '@/components/modal/nftpModal';

import { request } from '@/api';

import styles from '@/styles/content.module.css';
import { useAppSelector } from '@/store/hooks';

import { formatAddress, formatDayjsValues } from '@/utils';

import type { PaginationProps } from 'antd';

const { RangePicker } = DatePicker;

dayjs.extend(customParseFormat);

const columns = [
  {
    title: '订单ID',
    dataIndex: 'id',
    key: 'id',
  },
  { title: '标签', dataIndex: 'votes', key: 'votes' },
  {
    title: '资产',
    dataIndex: ['asset', 'id'],
    key: 'asset.id',
    render: (text: string) => '#' + text,
  },
  { title: '市场', dataIndex: 'votes', key: 'votes' },
  { title: '收入类型', dataIndex: 'votes', key: 'votes' },
  {
    title: '收入金额',
    dataIndex: ['asset', 'sellPrice'],
    key: 'asset.sellPrice',
  },
  {
    title: '日期',
    dataIndex: 'time',
    key: 'time',
    render: (text: string) => dayjs(text).format('MM/DD/YYYY'),
  },
];

const App = () => {
  const { chainId } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const { loading, searchText } = useAppSelector((store) => store.common);

  const pageSize = 10;
  const [values, setValues] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [amount, setAmount] = useState({ total: 0, amount: '0' });

  const nftpModal: any = useRef(null);

  const showModal = () => {
    setIsModalOpen(true);
    // nftpModal.current.show();
  };

  const getData = async (page = 1) => {
    const res = await request({
      name: 'utils',
      method: 'getLedgerItemsFromHost',
      params: {
        chain: chainId,
        host: currentDAO.host,
        // tokenId: currentMember.tokenId,
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
      method: 'getLedgerItemsTotalFromHost',
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
    <div className="wrap">
      <div className={styles['dashboard-content-header']}>
        <Counts
          items={[
            { num: amount.total, title: '累计收入' },
            { num: Number(amount.amount), title: '累计发行税收入' },
            { num: Number(amount.amount), title: '累计交易税收入' },
            { num: Number(amount.amount), title: '未分配收入' },
          ]}
        />

        <Button type="primary" onClick={showModal}>
          分配
        </Button>

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

      <Modal
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
      </Modal>
    </div>
  );
};

export default App;
