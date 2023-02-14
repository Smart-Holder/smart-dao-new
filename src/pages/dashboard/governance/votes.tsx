import {
  Form,
  Layout as AntdLayout,
  Select,
  Skeleton,
  Radio,
  Checkbox,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Filters from '@/containers/dashboard/mine/filters';

import styles from '@/styles/content.module.css';
import VoteItem, {
  StatusType,
  VoteItemType,
} from '@/containers/dashboard/governance/vote-item';
import VoteModal from '@/containers/dashboard/governance/vote-modal';
import { useEffect, useState } from 'react';
import { request } from '@/api';
import { formatDayjsValues } from '@/utils';

import { useAppSelector } from '@/store/hooks';

dayjs.extend(customParseFormat);

const App: NextPageWithLayout = () => {
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { loading, searchText } = useAppSelector((store) => store.common);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(-1);
  const [values, setValues] = useState({});
  const [data, setData] = useState([]) as any;

  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<VoteItemType>();

  const getData = async () => {
    const res = await request({
      name: 'utils',
      method: 'getVoteProposalFrom',
      params: {
        chain: chainId,
        address: currentDAO.root,
        limit: [(page - 1) * pageSize, pageSize],
        name: searchText,
        ...values,
      },
    });

    setPage(page + 1);
    setData([...data, ...res]);
  };

  const resetData = async () => {
    const t = await request({
      name: 'utils',
      method: 'getVoteProposalTotalFrom',
      params: {
        chain: chainId,
        address: currentDAO.root,
        name: searchText,
        ...values,
      },
    });

    setTotal(t);

    const res = await request({
      name: 'utils',
      method: 'getVoteProposalFrom',
      params: {
        chain: chainId,
        address: currentDAO.root,
        limit: [0, pageSize],
        name: searchText,
        ...values,
      },
    });

    setPage(2);
    setData(res);
  };

  // const getTotal = async () => {
  //   const filterValues: any = { ...values };

  //   const res = await request({
  //     name: 'utils',
  //     method: 'getVoteProposalTotalFrom',
  //     params: {
  //       chain: chainId,
  //       address: currentDAO.root,
  //       name: searchText,
  //       ...filterValues,
  //     },
  //   });

  //   setTotal(res);
  // };

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

  // useEffect(() => {
  //   if (currentDAO.root) {
  //     getData();
  //   }
  // }, [currentDAO]);
  useEffect(() => {
    setData([]);
    setTotal(0);
    resetData();
    // getTotal();
  }, [searchText, values]);

  const onClickItem = (item: VoteItemType) => {
    setCurrentItem(item);
    setOpenModal(true);
  };

  const onCloseModal = () => {
    setCurrentItem(undefined);
    setOpenModal(false);
  };

  const getStatus = (item: any) => {
    let status: StatusType = 'processing';

    if (!item.isClose) {
      status = 'processing';
    } else {
      if (item.isAgree) {
        status = 'passed';

        if (item.isExecuted) {
          status = 'executed';
        }
      } else {
        status = 'rejected';
      }
    }

    return status;
  };

  return (
    <AntdLayout.Content
      className={`${styles['dashboard-content']} ${styles['dashboard-content-scroll']}`}
    >
      <div className={styles['dashboard-content-header']}>
        <div>
          <div className={styles.title1}>Governance</div>
          <div className={styles.title2}>Welcome to SmartDAO</div>
        </div>

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
            <Form.Item name="mine" valuePropName="checked">
              <Checkbox value="1">与我相关</Checkbox>
            </Form.Item>
            <Form.Item name="status">
              <Select
                style={{ width: 140 }}
                placeholder="状态"
                options={[
                  { value: '', label: '全部' },
                  { value: '1', label: '投票中' },
                  { value: '2', label: '已通过' },
                  { value: '3', label: '已驳回' },
                  { value: '4', label: '已执行' },
                ]}
              />
            </Form.Item>
            <Form.Item name="sortTime">
              <Select
                style={{ width: 140 }}
                placeholder="排序"
                options={[
                  { value: '', label: '默认' },
                  { value: '1', label: '快要结束' },
                  { value: '2', label: '时间降序' },
                  { value: '3', label: '时间升序' },
                ]}
              />
            </Form.Item>
            <Form.Item name="type">
              <Select
                style={{ width: 140 }}
                placeholder="类型"
                options={[
                  { value: '', label: '默认' },
                  { value: '1', label: '财务管理' },
                  { value: '2', label: '成员管理' },
                  { value: '3', label: '基础设置' },
                  { value: '4', label: '普通提案' },
                ]}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div
        style={{ padding: '38px 16px' }}
        className={`${styles['dashboard-content-body']}`}
        id="scrollableVotes"
      >
        <InfiniteScroll
          dataLength={data.length}
          next={getData}
          hasMore={data.length < total}
          loader={<Skeleton paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableVotes"
        >
          <div className={styles['vote-list']}>
            {data.map((item: any) => (
              <div className={styles['vote-item']} key={item.id}>
                <VoteItem
                  status={getStatus(item)}
                  title={item.name}
                  owner={{
                    name: 'Willy Wonca',
                    address: item.origin,
                  }}
                  number={`#${item.id}`}
                  description=""
                  desc={item.description}
                  type="normal"
                  support={item.agreeTotal}
                  opposed={item.voteTotal - item.agreeTotal}
                  endTime={item.expiry * 1000}
                  onClick={onClickItem}
                  votes={item.votes}
                  proposal_id={item.proposal_id}
                  data={item}
                />
              </div>
            ))}
            {/* <div className={styles['vote-item']}>
            <VoteItem
              status="processing"
              title="Meidum Spicy Spagethi Italiano"
              owner={{
                name: 'Willy Wonca',
                address: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
              }}
              number="#123123"
              description="The service was excellent; our waiter was  knowledgeable and attentive 
                without being intrusive. "
              type="normal"
              support={1}
              opposed={0}
              endTime={1675845670252}
              onClick={onClickItem}
              votes={1}
              proposal_id="1"
            />
          </div>
          <div className={styles['vote-item']}>
            <VoteItem
              status="rejected"
              title="Meidum Spicy Spagethi Italiano"
              owner={{
                name: 'Willy Wonca',
                address: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
              }}
              number="#123123"
              type="member"
              description="The service was excellent; our waiter was  knowledgeable and attentive 
                without being intrusive. "
              support={1}
              opposed={0}
              onClick={onClickItem}
              endTime={1675845670252}
              votes={1}
              proposal_id="1"
            />
          </div>
          <div className={styles['vote-item']}>
            <VoteItem
              status="passed"
              title="Meidum Spicy Spagethi Italiano"
              owner={{
                name: 'Willy Wonca',
                address: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
              }}
              number="#123123"
              type="basic"
              description="The service was excellent; our waiter was  knowledgeable and attentive 
                without being intrusive. "
              support={1}
              opposed={0}
              onClick={onClickItem}
              endTime={1875885670252}
              votes={1}
              proposal_id="1"
            />
          </div>
          <div className={styles['vote-item']}>
            <VoteItem
              status="executed"
              execTime={1475885670252}
              execUser={{
                name: 'Willy Wonca',
                address: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
              }}
              title="Meidum Spicy Spagethi Italiano"
              owner={{
                name: 'Willy Wonca',
                address: '0x0b3E9A6950e4C434E927A4B1ec28593F6b283311',
              }}
              number="#123123"
              type="basic"
              description="The service was excellent; our waiter was  knowledgeable and attentive 
                without being intrusive. "
              support={1}
              opposed={0}
              onClick={onClickItem}
              endTime={1475885670252}
              votes={1}
              proposal_id="1"
            />
          </div> */}
          </div>
        </InfiniteScroll>
      </div>
      <VoteModal open={openModal} onClose={onCloseModal} data={currentItem} />
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
