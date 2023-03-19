import { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Modal, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Select from '@/components/form/filter/select';
import RangePicker from '@/components/form/filter/rangePicker';
// import NftpModal from '@/components/modal/nftpModal';
import Title from '@/containers/dashboard/header/title';

import { request } from '@/api';

import styles from '@/styles/content.module.css';
import { useAppSelector } from '@/store/hooks';

import { formatDayjsValues, fromToken } from '@/utils';

import type { PaginationProps } from 'antd';
import { getBalance } from '@/api/asset';
import { createVote } from '@/api/vote';
import { useIntl, FormattedMessage } from 'react-intl';
import Card from '@/components/card';

dayjs.extend(customParseFormat);

const columns = [
  {
    title: <FormattedMessage id="my.income.id" />,
    dataIndex: 'id',
    key: 'id',
  },
  // { title: '标签', dataIndex: 'votes', key: 'votes' },
  {
    title: <FormattedMessage id="my.income.asset" />,
    dataIndex: ['asset', 'id'],
    key: 'asset.id',
    render: (text: string) => '#' + text,
  },
  // { title: '市场', dataIndex: 'votes', key: 'votes' },
  {
    title: <FormattedMessage id="my.income.type" />,
    dataIndex: 'votes',
    key: 'votes',
  },
  {
    title: <FormattedMessage id="my.income.amount" />,
    dataIndex: 'price',
    key: 'price',
    render: (text: string) => fromToken(text),
  },
  {
    title: <FormattedMessage id="my.income.date" />,
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

  const [balance, setBalance] = useState(0);

  // const nftpModal: any = useRef(null);

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
          target: currentDAO.ledger,
          method: 'release',
          params: [balance, 'description'],
        },
      ],
    };

    try {
      await createVote(params);
      Modal.success({
        title: formatMessage({ id: 'proposal.create.message' }),
        className: 'modal-small',
      });
      // window.location.reload();
      hideModal();
      getBalanceData();
    } catch (error) {
      console.error(error);
    }
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
  }, [searchText, values, balance, chainId, address]);

  const hideModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '30px 24px 50px' }}>
      <div style={{ padding: '0 59px' }}>
        <Title title={formatMessage({ id: 'sider.my.income' })} />
        <Card
          data={[
            {
              label: formatMessage({ id: 'my.income.total' }),
              value: fromToken(amount.amount) + ' ETH',
            },
            // { num: fromToken(amount.amount) + ' ETH', title: '累计发行税收入' },
            // { num: fromToken(amount.amount) + ' ETH', title: '累计交易税收入' },
            {
              label: formatMessage({ id: 'my.income.total.balance' }),
              value: fromToken(balance || 0) + ' ETH',
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
                      id: 'my.income.sort.income.desc',
                    }),
                  },
                  {
                    value: 'value',
                    label: formatMessage({
                      id: 'my.income.sort.income',
                    }),
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="type">
              <Select
                style={{ width: 140 }}
                placeholder={formatMessage({ id: 'my.income.type' })}
                options={[
                  { value: '', label: 'Default' },
                  { value: '1', label: '发行税收入' },
                  { value: '2', label: '交易税收入' },
                ]}
              />
            </Form.Item>
            <Form.Item name="time">
              <RangePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Form>

          <Button className="button-filter" type="primary" onClick={showModal}>
            {formatMessage({ id: 'financial.income.allocation' })}
          </Button>
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

      <Modal width={512} open={isModalOpen} onCancel={hideModal} footer={null}>
        <div className={styles['dashboard-modal-content']}>
          <div
            className={styles['dashboard-modal-title']}
            style={{ marginBottom: 40 }}
          >
            {formatMessage({ id: 'financial.income.auto' })}
          </div>
          {/* <div className={styles['dashboard-modal-subtitle']}>
            Create your own DAO in a few minutes!
          </div> */}
          <Button
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
