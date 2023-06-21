import { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Image, message, Row, Col } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dynamic from 'next/dynamic';
import web3 from 'web3';

import NftpModal from '@/components/modal/nftpModal';
import Select from '@/components/form/filter/select';
import RangePicker from '@/components/form/filter/rangePicker';
import DashboardHeader from '@/containers/dashboard/header';
import PermissionModal from '@/components/modal/permissionModal2';
import CopiesModal from '@/components/modal/copiesModal';

import { request } from '@/api';
import { Member } from '@/config/define';

import { useAppSelector } from '@/store/hooks';

import { formatAddress, formatDayjsValues } from '@/utils';
import { useIntl, FormattedMessage } from 'react-intl';

import type { PaginationProps } from 'antd';
import Card from '@/components/card';
import Ellipsis from '@/components/typography/ellipsis';
import { useMember } from '@/api/graph/member';
import { MemberResponseData } from '@/api/typings/member';
import { GqlProps } from '@/api/typings/member';
import { MEMBERS_QUERY } from '@/api/gqls/member';

const PieDonut = dynamic(() => import('@/components/charts/pieDonut'), {
  ssr: false,
});

dayjs.extend(customParseFormat);

const App = () => {
  const { formatMessage } = useIntl();
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const { loading } = useAppSelector((store) => store.common);

  const pageSize = 10;
  const [values, setValues] = useState({});
  const [queryParams, setQueryParams] = useState<GqlProps>({});

  const [memberVariables, setMemberVariables] = useState<{
    orderBy: string;
    orderDirection: 'desc' | 'asc';
  }>({
    orderBy: 'votes',
    orderDirection: 'desc',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  // const [data, setData] = useState<Member[]>([]);
  const [data, setData] = useState<MemberResponseData[]>([]);

  // const [totalVotes, setTotalVotes] = useState(0);
  const [pieData, setPieData] = useState<any[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [selectedRows, setSelectedRows] = useState<Member[]>([]);
  const [selectedRows, setSelectedRows] = useState<MemberResponseData[]>([]);

  const nftpModal: any = useRef(null);
  const permissionModal: any = useRef(null);
  const copiesModal: any = useRef(null);

  const columns = [
    {
      title: 'NFTP',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || '-',
    },
    {
      title: <FormattedMessage id="address" />,
      dataIndex: 'owner',
      key: 'owner',
      render: (text: string) => {
        return (
          <Ellipsis copyable={{ text: text }}>
            {formatAddress(text, 6, 6)}
          </Ellipsis>
        );
      },
    },
    {
      title: formatMessage({ id: 'member.nftp.copies' }),
      dataIndex: 'votes',
      key: 'votes',
    },
    {
      title: formatMessage({ id: 'member.nftp.date' }),
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => dayjs.unix(Number(text)).format('MM/DD/YYYY'),
    },
  ];

  const showModal = () => {
    nftpModal.current.show();
  };

  const getData = async (page = 1) => {
    // const res = await request({
    //   name: 'utils',
    //   method: 'getMembersFrom',
    //   params: {
    //     chain: chainId,
    //     host: currentDAO.host,
    //     limit: [(page - 1) * pageSize, pageSize],
    //     ...values,
    //   },
    // });

    // setData(res);

    await fetchMore({
      query: MEMBERS_QUERY({
        ...queryParams,
      }),
      variables: {
        host: currentDAO.host,
        first: pageSize,
        skip: page === 1 ? 0 : page - 1,
        ...memberVariables,
      },
    });
  };

  const { data: memberData, fetchMore } = useMember({
    host: currentDAO.host,
    first: pageSize,
    skip: 0,
  });

  useEffect(() => {
    if (memberData) {
      const pieData = memberData.map((item: any, index) => {
        return {
          id: index + '',
          name: item.name,
          value: Number(item.votes || 0),
        };
      });

      // setTotalVotes(totalVotes);
      setTotal(memberData.length && memberData[0].count);
      setData(memberData as []);
      setPieData(pieData);
    }
  }, [memberData]);

  const getTotal = async () => {
    const filterValues: any = { ...values };
    delete filterValues.time;

    // const total = await request({
    //   name: 'utils',
    //   method: 'getMembersTotalFrom',
    //   params: {
    //     chain: chainId,
    //     host: currentDAO.host,
    //     ...filterValues,
    //   },
    // });

    // setTotal(total);

    // const res = await request({
    //   name: 'utils',
    //   method: 'getMembersFrom',
    //   params: {
    //     chain: chainId,
    //     host: currentDAO.host,
    //     limit: [0, Math.min(total, 10000)],
    //     ...values,
    //   },
    // });

    // 缺少时间 加入DAO的时间
    await fetchMore({
      query: MEMBERS_QUERY({
        ...queryParams,
      }),
      variables: {
        host: currentDAO.host,
        first: pageSize,
        skip: 0,
        ...memberVariables,
      },
    });

    // const data = res || [];
    // let totalVotes = 0;

    // data.forEach((item: any) => {
    //   totalVotes += item.votes;
    // });

    // const per = 1 / totalVotes;

    // const pieData = data.map((item: any) => {
    //   return {
    //     id: item.id + '',
    //     name: item.name,
    //     value: item.votes,
    //     // percent: Number((per * item.votes * 100).toFixed(2)),
    //   };
    // });

    // setTotalVotes(totalVotes);
    // setData(data);
    // setPieData(pieData);
  };

  const onValuesChange = (changedValues: any) => {
    let [[key, value]]: any = Object.entries(changedValues);
    const nextValues: any = { ...values };
    let queryParamsCopy = { ...queryParams };
    let variablesCopy = { ...memberVariables };

    switch (key) {
      case 'orderBy':
        switch (value) {
          case 'time desc':
            variablesCopy.orderBy = 'blockTimestamp';
            variablesCopy.orderDirection = 'desc';
            break;
          case 'time':
            variablesCopy.orderBy = 'blockTimestamp';
            variablesCopy.orderDirection = 'asc';
            break;
          case 'votes desc':
            variablesCopy.orderBy = 'votes';
            variablesCopy.orderDirection = 'desc';
            break;
          case 'votes':
            variablesCopy.orderBy = 'votes';
            variablesCopy.orderDirection = 'asc';
            break;
          default:
            variablesCopy.orderBy = 'votes';
            variablesCopy.orderDirection = 'desc';
            break;
        }
        break;
      case 'time':
        if (value) {
          queryParamsCopy.blockTimestamp_gte = dayjs(value[0])
            .unix()
            .toString();
          queryParamsCopy.blockTimestamp_lte = dayjs(value[1])
            .unix()
            .toString();
        } else {
          delete queryParamsCopy.blockTimestamp_gte;
          delete queryParamsCopy.blockTimestamp_lte;
        }
        break;
      default:
        break;
    }

    setQueryParams(queryParamsCopy);
    setMemberVariables(variablesCopy);
    if (!value) {
      delete nextValues[key];
    } else {
      nextValues[key] = key === 'time' ? formatDayjsValues(value) : value;
    }

    setValues(nextValues);
  };

  // const onPageChange: PaginationProps['onChange'] = (p) => {
  //   setPage(p);
  //   getData(p);
  // };

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: MemberResponseData[],
  ) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    console.log('selectedRows changed: ', selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const rightsEdit = () => {
    if (selectedRowKeys.length !== 1) {
      message.warning('Select a NFTP');
      return;
    }

    permissionModal.current.show(selectedRows[0]);
  };

  const copiesChange = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Select a NFTP');
      return;
    }

    copiesModal.current.show(selectedRows);
  };

  const resetData = () => {
    getTotal();
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    // setPage(1);
    // getData(1);
    getTotal();
    setSelectedRowKeys([]);
  }, [values, chainId, address]);

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    getData(p);
  };

  return (
    <div>
      <div style={{ padding: '30px 91px 0 83px' }}>
        <DashboardHeader title={formatMessage({ id: 'sider.member.nftp' })} />
        <Card
          data={[
            {
              label: formatMessage({ id: 'member.nftp.total' }),
              value: total,
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
                style={{ width: 220 }}
                placeholder="Sort"
                options={[
                  { value: '', label: 'Default' },
                  {
                    value: 'time desc',
                    label: formatMessage({ id: 'member.nftp.sort.time.desc' }),
                  },
                  {
                    value: 'time',
                    label: formatMessage({ id: 'member.nftp.sort.time' }),
                  },
                  {
                    value: 'votes desc',
                    label: formatMessage({
                      id: 'member.nftp.sort.copies.desc',
                    }),
                  },
                  {
                    value: 'votes',
                    label: formatMessage({ id: 'member.nftp.sort.copies' }),
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
            <Form.Item name="time">
              <RangePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Form>

          {currentMember.tokenId && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                className="button-filter"
                type="primary"
                onClick={showModal}
              >
                <div className="button-image-wrap">
                  <Image
                    src="/images/filter/icon_table_add_default@2x.png"
                    width={20}
                    height={20}
                    alt=""
                    preview={false}
                  />
                  {formatMessage({ id: 'member.nftp.addNFTP' })}
                </div>
              </Button>

              {selectedRowKeys.length <= 1 && (
                <Button
                  style={{ marginLeft: 10 }}
                  className="button-filter"
                  type="primary"
                  onClick={rightsEdit}
                >
                  Edit Rights
                </Button>
              )}

              <Button
                style={{ marginLeft: 10 }}
                className="button-filter"
                type="primary"
                onClick={copiesChange}
              >
                Change Copies
              </Button>
            </div>
          )}
        </div>

        <PieDonut data={pieData} />

        <Table
          columns={columns}
          dataSource={data}
          rowKey="tokenId"
          rowSelection={
            data.findIndex(
              (item: any) =>
                item.owner?.toLocaleLowerCase() === address.toLocaleLowerCase(),
            ) != -1
              ? rowSelection
              : undefined
          }
          pagination={false}
          // pagination={{
          // position: ['bottomCenter'],
          // current: page,
          // pageSize: 10,
          // total,
          // onChange: onPageChange,
          // }}
          loading={loading}
        />

        <Row justify="center" style={{ marginTop: 20 }}>
          <Col span={3}>
            <Button
              disabled={page === 1}
              onClick={() =>
                onPageChange(page - 1 <= 1 ? 1 : page - 1, pageSize)
              }
            >
              &lt; Previous
            </Button>
          </Col>
          <Col span={2}>
            <Button
              disabled={!data.length}
              onClick={() => onPageChange(page + 1, pageSize)}
            >
              Next &gt;
            </Button>
          </Col>
        </Row>
      </div>

      <NftpModal ref={nftpModal} />
      <PermissionModal ref={permissionModal} callback={resetData} />
      <CopiesModal ref={copiesModal} callback={resetData} />
    </div>
  );
};

export default App;
