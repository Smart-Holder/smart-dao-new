import { useEffect, useState, useRef } from 'react';
import { Table, Button, DatePicker, Form, Select, Modal, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Counts from '@/containers/dashboard/mine/counts';
import NftpModal from '@/components/modal/nftpModal';

import { request } from '@/api';

import styles from '@/styles/content.module.css';
import { useAppSelector } from '@/store/hooks';

import { formatAddress, formatDayjsValues, fromToken } from '@/utils';

import type { PaginationProps } from 'antd';
import { getBalance, release } from '@/api/asset';
import { createVote } from '@/api/vote';
import { useIntl, FormattedMessage } from 'react-intl';

const { RangePicker } = DatePicker;

dayjs.extend(customParseFormat);

const columns = [
  {
    title: <FormattedMessage id="financial.income.id" />,
    dataIndex: 'id',
    key: 'id',
  },
  // { title: '标签', dataIndex: 'votes', key: 'votes' },
  {
    title: <FormattedMessage id="financial.income.asset" />,
    dataIndex: ['asset', 'id'],
    key: 'asset.id',
    render: (text: string) => '#' + text,
  },
  // { title: '市场', dataIndex: 'votes', key: 'votes' },
  {
    title: <FormattedMessage id="financial.income.type" />,
    dataIndex: 'saleType',
    key: 'saleType',
  },
  {
    title: <FormattedMessage id="financial.income.amount" />,
    dataIndex: 'price',
    key: 'price',
    render: (text: string) => fromToken(text),
  },
  {
    title: <FormattedMessage id="financial.income.date" />,
    dataIndex: 'time',
    key: 'time',
    render: (text: string) => dayjs(text).format('MM/DD/YYYY'),
  },
];

const App = () => {
  const { formatMessage } = useIntl();
  const { chainId } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const { loading, searchText } = useAppSelector((store) => store.common);

  const pageSize = 10;
  const [values, setValues] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const [balance, setBalance] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [amount, setAmount] = useState({ total: 0, amount: '0' });

  const nftpModal: any = useRef(null);

  const showModal = () => {
    if (balance > 0) {
      setIsModalOpen(true);
    } else {
      message.warning('没有未分配的收入');
    }
  };

  const getBalanceData = async () => {
    const res = await getBalance();
    console.log('balance', res);
    setBalance(res || 0);
  };

  useEffect(() => {
    getBalanceData();
  }, []);

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

  // 收入分配
  const onDone = async () => {
    const params = {
      name: formatMessage({ id: 'proposal.financial' }),
      description: JSON.stringify({
        type: 'finance',
        purpose: `${formatMessage({
          id: 'proposal.financial.balance',
        })}: ${fromToken(balance || 0)} ETH`,
      }),
      extra: [
        {
          abi: 'ledger',
          method: 'release',
          params: [balance, 'description'],
        },
      ],
    };

    try {
      await createVote(params);
      message.success('success');
      // window.location.reload();
      hideModal();
      getBalanceData();
    } catch (error) {
      console.error(error);
    }

    // try {
    //   await release({ amount: balance, description: 'description' });
    //   setIsModalOpen(false);
    //   message.success('success');
    //   getBalanceData();
    // } catch (error) {
    //   console.error(error);
    // }
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
  }, [searchText, values, balance]);

  const hideModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="wrap">
      <div className={styles['dashboard-content-header']}>
        <Counts
          items={[
            {
              num: fromToken(amount.amount) + ' ETH',
              title: formatMessage({ id: 'financial.income.total' }),
            },
            // { num: fromToken(amount.amount) + ' ETH', title: '累计发行税收入' },
            // { num: fromToken(amount.amount) + ' ETH', title: '累计交易税收入' },
            {
              num: fromToken(balance || 0) + ' ETH',
              title: formatMessage({ id: 'financial.income.balance' }),
            },
          ]}
        />

        {currentMember.tokenId && (
          <Button type="primary" onClick={showModal}>
            {formatMessage({ id: 'financial.income.allocation' })}
          </Button>
        )}

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
                style={{ width: 140 }}
                placeholder="Sort"
                options={[
                  { value: '', label: 'Default' },
                  {
                    value: 'value desc',
                    label: formatMessage({
                      id: 'financial.income.sort.amount.desc',
                    }),
                  },
                  {
                    value: 'value',
                    label: formatMessage({
                      id: 'financial.income.sort.amount',
                    }),
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="type">
              <Select
                style={{ width: 140 }}
                placeholder={formatMessage({ id: 'financial.income.type' })}
                options={[
                  { value: '', label: 'Default' },
                  { value: '1', label: '发行税收入' },
                  { value: '2', label: '交易税收入' },
                ]}
              />
            </Form.Item>
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

      <Modal width={512} open={isModalOpen} onCancel={hideModal} footer={null}>
        <div className={styles['dashboard-modal-content']}>
          <div className={styles['dashboard-modal-title']}>
            {formatMessage({ id: 'financial.income.auto' })}
          </div>
          {/* <div className={styles['dashboard-modal-subtitle']}>
            {formatMessage({ id: 'financial.income.auto' })}
          </div> */}
          <Button
            style={{ marginTop: 40 }}
            type="primary"
            className={styles['dashboard-modal-button']}
            onClick={onDone}
            loading={loading}
          >
            {formatMessage({ id: 'financial.income.submit' })}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
