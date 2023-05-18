import { Button, Col, Form, Image, Input, Row, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useRouter } from 'next/router';

import Select from '@/components/form/filter/select';
import Layout from '@/components/layout';
import Footer from '@/components/footer';
import { ReactElement, useMemo } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import Title from '@/containers/dashboard/header/title';

import { useIntl } from 'react-intl';

import VoteItem, {
  VoteItemType,
} from '@/containers/dashboard/governance/vote-item';
import VoteModal from '@/containers/dashboard/governance/vote-modal';
import { useEffect, useState } from 'react';
import { request } from '@/api';
import { formatDayjsValues } from '@/utils';

import { useAppSelector } from '@/store/hooks';
import { useVoteQuery } from '@/api/graph/votes';
import { VOTE_QUERY } from '@/api/gqls/votes';

dayjs.extend(customParseFormat);

const App: NextPageWithLayout = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { loading, searchText } = useAppSelector((store) => store.common);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(-1);
  const [values, setValues] = useState<any>({ orderBy: 'time desc' });
  const [variables, setVariables] = useState<any>({});
  const [target, setTarget] = useState<null | undefined | []>();
  const [data, setData] = useState([]) as any;
  const [resData, setResData] = useState() as any;
  const [status, setStatus] = useState<any>();

  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<VoteItemType>();

  const {
    data: voteData,
    loading: fetchMoreLoading,
    fetchMore,
  } = useVoteQuery({
    first: pageSize,
    host: currentDAO.host,
    skip: 0,
    orderBy: 'blockTimestamp',
    orderDirection: 'desc',
    target_not: target,
  });

  const getData = async () => {
    const res = await request({
      name: 'utils',
      method: 'getVoteProposalFrom',
      params: {
        chain: chainId,
        address: currentDAO.root,
        limit: [(page - 1) * pageSize, pageSize],
        // proposal_id: searchText,
        ...values,
      },
    });

    await fetchMore({
      query: VOTE_QUERY({
        status,
        name_contains_nocase: values?.name,
        target_not: target,
      }),
      variables: {
        first: pageSize,
        skip: data.length || 0,
        host: currentDAO.host,
        ...variables,
      },
    });
    setPage(page + 1);
    // setData([...data, ...res]);

    // 获取old 数据的origin 作为key 合并到相同orgin新的数组数据中内
    let obj: any = {};
    [...res].map((item: any) => {
      let origin = item.origin.toLocaleLowerCase();
      obj[origin] = item;
    });
    setResData(obj);
  };

  const resetData = async () => {
    const t = await request({
      name: 'utils',
      method: 'getVoteProposalTotalFrom',
      params: {
        chain: chainId,
        address: currentDAO.root,
        // proposal_id: searchText,
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
        // proposal_id: searchText,
        ...values,
      },
    });
    await fetchMore({
      query: VOTE_QUERY({
        status,
        name_contains_nocase: values?.name,
        target_not: target,
      }),
      variables: {
        first: pageSize,
        skip: 0,
        host: currentDAO.host,
        ...variables,
      },
    });
    setPage(1);

    // setPage(2);

    let obj: any = {};
    [...res].map((item: any) => {
      let origin = item.origin.toLocaleLowerCase();
      obj[origin] = item;
    });
    setResData(obj);
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

  const onValuesChange = async (changedValues: any) => {
    let [[key, value]]: any = Object.entries(changedValues);
    let nextValues: any = { ...values };

    if (key === 'status') {
      delete nextValues.isClose;
      delete nextValues.isAgree;
      delete nextValues.isExecuted;
      let status;
      const obj: any = {};

      switch (value) {
        case 'voting':
          obj.isClose = false;
          status = 1;
          break;
        case 'agree':
          obj.isAgree = true;
          obj.isClose = true;
          status = 2;
          break;
        case 'disagree':
          obj.isAgree = false;
          obj.isClose = true;
          status = 3;
          break;
        case 'execute':
          obj.isExecuted = true;
          obj.isClose = true;
          status = 4;
          break;
        case '':
          status = -1;
          break;
        default:
          break;
      }

      nextValues = { ...nextValues, ...obj };
      console.log('values', nextValues);
      setValues(nextValues);
      setStatus(status);
      return;
    }

    if (!value) {
      delete nextValues[key];
    } else {
      nextValues[key] = key === 'time' ? formatDayjsValues(value) : value;
    }

    console.log('values', nextValues);
    setVariables({
      orderDirection:
        !nextValues.orderBy || nextValues.orderBy.includes('desc')
          ? 'desc'
          : 'asc',
      orderBy: nextValues.orderBy ? 'blockTimestamp' : 'number',
    });
    setTarget(nextValues.target ? [] : undefined);

    setValues(nextValues);
  };

  // useEffect(() => {
  //   if (currentDAO.root) {
  //     getData();
  //   }
  // }, [currentDAO]);
  useEffect(() => {
    if (currentDAO.root) {
      // setData([]);
      setTotal(0);
      resetData();
      // getTotal();
    }
  }, [searchText, values, chainId, address, currentDAO.root]);

  useEffect(() => {
    if (voteData?.proposals) {
      let list = [...voteData?.proposals].map((item) => {
        return {
          ...resData[item.origin],
          ...item,
          modify: dayjs.unix(Number(item.modify)),
        };
      });
      if (page === 1) {
        setData([...list]);
      } else {
        setData([...data, ...list]);
      }
    }
  }, [voteData?.proposals, resData]);

  const onClickItem = (item: any) => {
    console.log(data, 'item', item);
    setCurrentItem(item);
    setOpenModal(true);
  };

  const onCloseModal = () => {
    setCurrentItem(undefined);
    setOpenModal(false);
  };

  const handleGovernanceProposal = () => {
    router.push('/dashboard/governance/proposal');
  };

  return (
    <div className="dashboard-content-scroll" id="scrollTarget">
      <div
        style={{
          margin: '30px 80px 0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Title title={formatMessage({ id: 'sider.governance.votes' })} />
        <Button
          type="primary"
          className="button-filter"
          onClick={handleGovernanceProposal}
        >
          {formatMessage({
            id: 'sider.governance.proposal',
          })}
        </Button>
      </div>

      <div className="content-min-height" style={{ margin: '40px 80px 50px' }}>
        <div className="table-filter">
          <Form
            name="filter"
            layout="inline"
            initialValues={{ orderBy: 'time desc' }}
            onValuesChange={onValuesChange}
            autoComplete="off"
            labelAlign="left"
            requiredMark={false}
            validateTrigger="onBlur"
          >
            <Form.Item name="name" style={{ marginBottom: 20 }}>
              <Input
                className="filter"
                placeholder="Search name"
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
            <Form.Item name="status">
              <Select
                style={{ width: 200 }}
                placeholder="Status"
                options={[
                  { value: '', label: 'All' },
                  {
                    value: 'voting',
                    label: formatMessage({
                      id: 'governance.votes.sort.voting',
                    }),
                  },
                  {
                    value: 'agree',
                    label: formatMessage({
                      id: 'governance.votes.sort.adopted',
                    }),
                  },
                  {
                    value: 'disagree',
                    label: formatMessage({
                      id: 'governance.votes.sort.dismissed',
                    }),
                  },
                  {
                    value: 'execute',
                    label: formatMessage({
                      id: 'governance.votes.sort.implemented',
                    }),
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="orderBy">
              <Select
                style={{ width: 200 }}
                placeholder="Sort"
                options={[
                  { value: '', label: 'Default' },
                  {
                    value: 'time',
                    label: formatMessage({ id: 'governance.votes.sort.time' }),
                  },
                  {
                    value: 'time desc',
                    label: formatMessage({
                      id: 'governance.votes.sort.time.desc',
                    }),
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="target">
              <Select
                style={{ width: 200 }}
                placeholder="Type"
                options={[
                  { value: '', label: 'All' },
                  // { value: '1', label: '财务管理' },
                  // { value: '2', label: '成员管理' },
                  // { value: '3', label: '基础设置' },
                  // { value: '4', label: '普通提案' },
                  {
                    value: '[]',
                    label: formatMessage({
                      id: 'governance.votes.sort.normal',
                    }),
                  },
                ]}
              />
            </Form.Item>
            {/* <Form.Item name="mine" valuePropName="checked">
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
            <Form.Item name="orderBy">
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
            </Form.Item> */}
          </Form>
        </div>

        <div>
          <InfiniteScroll
            dataLength={data.length}
            next={getData}
            hasMore={data.length < total}
            loader={
              (loading || fetchMoreLoading) && (
                <Skeleton paragraph={{ rows: 1 }} active />
              )
            }
            scrollableTarget="scrollTarget"
          >
            <Row gutter={[35, 35]} style={{ width: '100%' }}>
              {data.map((item: any) => (
                <Col span={12} key={item.id}>
                  <VoteItem data={item} onClick={onClickItem} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        </div>
      </div>

      <Footer />

      <VoteModal open={openModal} onClose={onCloseModal} data={currentItem} />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout footer={false}>{page}</Layout>;

export default App;
