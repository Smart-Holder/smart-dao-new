import { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Image, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dynamic from 'next/dynamic';

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
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<Member[]>([]);
  // const [totalVotes, setTotalVotes] = useState(0);
  const [pieData, setPieData] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Member[]>([]);

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
      render: (text: string) => dayjs(text).format('MM/DD/YYYY'),
    },
  ];

  const showModal = () => {
    nftpModal.current.show();
  };

  // const getData = async (page = 1) => {
  //   const res = await request({
  //     name: 'utils',
  //     method: 'getMembersFrom',
  //     params: {
  //       chain: chainId,
  //       host: currentDAO.host,
  //       limit: [(page - 1) * pageSize, pageSize],
  //       ...values,
  //     },
  //   });

  //   setData(res);
  // };

  const getTotal = async () => {
    const filterValues: any = { ...values };
    delete filterValues.time;

    const total = await request({
      name: 'utils',
      method: 'getMembersTotalFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        ...filterValues,
      },
    });

    setTotal(total);

    const res = await request({
      name: 'utils',
      method: 'getMembersFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        limit: [0, Math.min(total, 10000)],
        ...values,
      },
    });

    const data = res || [];
    // let totalVotes = 0;

    // data.forEach((item: any) => {
    //   totalVotes += item.votes;
    // });

    // const per = 1 / totalVotes;

    const pieData = data.map((item: any) => {
      return {
        id: item.id + '',
        name: item.name,
        value: item.votes,
        // percent: Number((per * item.votes * 100).toFixed(2)),
      };
    });

    // setTotalVotes(totalVotes);
    setData(data);
    setPieData(pieData);
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

  // const onPageChange: PaginationProps['onChange'] = (p) => {
  //   setPage(p);
  //   getData(p);
  // };

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: Member[],
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
          rowSelection={rowSelection}
          pagination={{
            position: ['bottomCenter'],
            // current: page,
            pageSize: 10,
            // total,
            // onChange: onPageChange,
          }}
          loading={loading}
        />
      </div>

      <NftpModal ref={nftpModal} />
      <PermissionModal ref={permissionModal} callback={resetData} />
      <CopiesModal ref={copiesModal} callback={resetData} />
    </div>
  );
};

export default App;
