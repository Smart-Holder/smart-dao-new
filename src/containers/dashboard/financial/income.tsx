import { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, message, Image } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Modal from '@/components/modal';
import NftpModal from '@/components/modal/nftpModal';
import Select from '@/components/form/filter/select';
import RangePicker from '@/components/form/filter/rangePicker';
import DashboardHeader from '@/containers/dashboard/header';
import Ellipsis from '@/components/typography/ellipsis';
import Price from '@/components/price';

import { request } from '@/api';

import { useAppSelector } from '@/store/hooks';

import {
  formatAddress,
  formatDayjsValues,
  fromToken,
  getChain,
  getUnit,
} from '@/utils';

import type { PaginationProps } from 'antd';
import { getBalance, release } from '@/api/asset';
import { createVote } from '@/api/vote';
import { useIntl, FormattedMessage } from 'react-intl';
import Card from '@/components/card';
import { isPermission } from '@/api/member';
import { Permissions, proposalType } from '@/config/enum';
import { LedgerType } from '@/config/enum';
import { getMessage } from '@/utils/language';
import { Amount } from '@/config/enum';

dayjs.extend(customParseFormat);

const types = Object.keys(LedgerType);
const typeOptions = types.map((key, index) => ({ value: index, label: key }));

const columns = [
  {
    title: <FormattedMessage id="financial.income.id" />,
    dataIndex: 'id',
    key: 'id',
  },
  // { title: '标签', dataIndex: 'votes', key: 'votes' },
  // {
  //   title: <FormattedMessage id="financial.income.asset" />,
  //   // dataIndex: ['asset', 'id'],
  //   // key: 'asset.id',
  //   dataIndex: 'asset_id',
  //   key: 'asset_id',
  //   render: (text: string) => (text ? '#' + text : '-'),
  // },
  // { title: '市场', dataIndex: 'votes', key: 'votes' },
  {
    title: <FormattedMessage id="financial.income.type" />,
    dataIndex: 'type',
    key: 'type',
    render: (text: string) => types[Number(text)] || '-',
  },
  {
    title: <FormattedMessage id="financial.income.amount" />,
    dataIndex: 'amount',
    key: 'amount',
    render: (text: string, row: any) => (
      <Price value={fromToken(text)} unit={row.symbol} />
    ),
  },
  {
    title: 'Target',
    dataIndex: 'target',
    key: 'target',
    render: (text: string) => {
      return (
        <Ellipsis copyable={{ text: text }}>
          {formatAddress(text, 6, 6)}
        </Ellipsis>
      );
    },
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
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const { loading, searchText } = useAppSelector((store) => store.common);

  const pageSize = 10;
  const [values, setValues] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const [balance, setBalance] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [amount, setAmount] = useState<Amount>();

  const nftpModal: any = useRef(null);

  const getBalanceData = async () => {
    const res = await getBalance();
    // console.log('balance', res);
    setBalance(res || 0);
  };

  useEffect(() => {
    getBalanceData();
  }, []);

  const getAmount = async () => {
    const res = await request({
      name: 'utils',
      method: 'getLedgerTotalAmount',
      params: { chain: chainId, host: currentDAO.host },
    });

    if (res) {
      // const symbol = getChain('symbol2');
      // const ledgerItem: Amount = res.find(
      //   (item: Amount) => item.balance.symbol === symbol,
      // );
      // setAmount(ledgerItem);
      setAmount(res[0]);
    }
  };

  useEffect(() => {
    getAmount();
  }, []);

  // const getData = async (page = 1) => {
  //   const res = await request({
  //     name: 'ledger',
  //     method: 'getLedgerAssetIncomeFrom',
  //     params: {
  //       chain: chainId,
  //       host: currentDAO.host,
  //       // fromAddress_not: '0x0000000000000000000000000000000000000000',
  //       // toAddress_not: '0x0000000000000000000000000000000000000000',
  //       // tokenId: currentMember.tokenId,
  //       limit: [(page - 1) * pageSize, pageSize],
  //       name: searchText,
  //       ...values,
  //     },
  //   });

  //   setData(res);
  // };

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

  // const getTotal = async () => {
  //   const filterValues: any = { ...values };
  //   delete filterValues.time;

  //   const res = await request({
  //     name: 'ledger',
  //     method: 'getLedgerAssetIncomeTotalFrom',
  //     params: {
  //       chain: chainId,
  //       host: currentDAO.host,
  //       fromAddress_not: '0x0000000000000000000000000000000000000000',
  //       toAddress_not: '0x0000000000000000000000000000000000000000',
  //       name: searchText,
  //       ...filterValues,
  //     },
  //   });

  //   setTotal(res);
  // };

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

  const onCreateVote = async () => {
    const params = {
      name: formatMessage({ id: 'proposal.financial.balance' }),
      description: JSON.stringify({
        type: 'finance',
        proposalType: proposalType.Income_Allocate,
        values: { balance },
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
      });
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

  // 收入分配
  const allocation = async () => {
    if (balance <= 0) {
      return;
    }

    if (await isPermission(Permissions.Action_Ledger_Release)) {
      try {
        await release({ amount: balance, description: 'description' });
        setIsModalOpen(false);
        message.success('success');
        getBalanceData();
        getAmount();
        setPage(1);
        getData(1);
        getTotal();
      } catch (error) {
        console.error(error);
      }
      return;
    }

    onCreateVote();
  };

  useEffect(() => {
    if (currentDAO.host) {
      setPage(1);
      getData(1);
      getTotal();
    }
  }, [searchText, values, balance, chainId, address, currentDAO.host]);

  const hideModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ padding: '30px 91px 0 83px' }}>
        <DashboardHeader
          title={formatMessage({ id: 'sider.financial.income' })}
        />
        <Card
          data={[
            {
              label: formatMessage({ id: 'financial.income.total' }),
              value: `${fromToken(amount?.amount)} ${
                amount?.balance.symbol || ''
              }`,
            },
            {
              label: formatMessage({ id: 'financial.income.balance' }),
              // value: fromToken(balance || 0) + ' ' + getUnit(),
              value: `${fromToken(amount?.balance.value)} ${
                amount?.balance.symbol || ''
              }`,
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
                // options={[
                //   { value: '', label: 'Default' },
                //   { value: '1', label: '发行税收入' },
                //   { value: '2', label: '交易税收入' },
                // ]}
                options={typeOptions}
              />
            </Form.Item>
            <Form.Item name="time">
              <RangePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Form>
          {currentMember.tokenId && (
            <Button
              className="button-filter"
              type="primary"
              onClick={allocation}
            >
              {formatMessage({ id: 'financial.income.allocation' })}
            </Button>
          )}
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

      <NftpModal ref={nftpModal} />

      <Modal type="normal" open={isModalOpen} onCancel={hideModal}>
        <div className="title">
          {formatMessage({ id: 'financial.income.auto' })}
        </div>
        <Button
          style={{ marginTop: 50 }}
          className="button-submit"
          type="primary"
          onClick={onCreateVote}
          loading={loading}
        >
          {formatMessage({ id: 'financial.income.submit' })}
        </Button>
      </Modal>
    </div>
  );
};

export default App;
