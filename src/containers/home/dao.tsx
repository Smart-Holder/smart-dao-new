import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import Item from './daoItem';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useAllDaos, daosType } from '@/api/graph/dao';

import { Button, Image, List } from 'antd';
import WalletModal from '@/components/modal/walletModal';
import CreateModal from '@/components/modal/createModal';
import InfoModal from '@/components/modal/infoModal';
import { request } from '@/api';
import { DAOExtend } from '@/config/define_ext';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { nickname } = useAppSelector((store) => store.user.userInfo);
  const { searchText, isInit } = useAppSelector((store) => store.common);
  const { chainId, address, isSupportChain } = useAppSelector(
    (store) => store.wallet,
  );

  const { loading: allDaoDataLoading, error, data: allDaoData } = useAllDaos();

  const pageSize = useRef(4);
  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState<DAOExtend[]>([]);
  const [data, setData] = useState<daosType[]>([]);
  // const [myDAOList, setMyDAOList] = useState<DAOExtend[]>([]);
  const [total, setTotal] = useState(0);

  const defaultChain = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN);

  const walletModal: any = useRef(null);
  const createModal: any = useRef(null);
  const infoModal: any = useRef(null);

  const showModal = () => {
    if (!isInit) {
      walletModal.current.show();
      return;
    }

    if (!nickname) {
      infoModal.current.show();
      return;
    }
    createModal.current.show();
  };

  const getData = async () => {
    if (!isSupportChain) {
      return;
    }
    let allList: daosType[] = [];
    setLoading(true);

    // const t = await request({
    //   method: 'getAllDAOsTotal',
    //   name: 'dao',
    //   params: { chain: chainId || defaultChain, name: searchText },
    // });
    // setTotal(t);
    setTotal(Number(allDaoData?.statistic.totalDAOs || 0));

    // const list = (await request({
    //   method: 'getAllDAOs',
    //   name: 'dao',
    //   params: {
    //     chain: chainId || defaultChain,
    //     name: searchText,
    //     limit: [0, pageSize.current],
    //     orderBy: 'time desc',
    //     memberObjs: 100,
    //     // owner: address || '',
    //   },
    // })) as DAOExtend[];

    // if (chainId && address) {
    // const myDAOList = (await request({
    //   method: 'getDAOsFromOwner',
    //   name: 'utils',
    //   params: { chain: chainId, owner: address },
    // })) as DAOExtend[];

    // setMyDAOList(res || []);

    // (list || []).forEach((item) => {
    //   item.isMember =
    //     item.isMember || myDAOList.some((el) => el.host === item.host);
    // });
    // }
    // setData(list || []);

    (allDaoData?.daos || []).forEach((item) => {
      let items = { ...item };
      items.isMember = item.accounts.some((el) => el.id === address);
      allList.push(items);
    });
    setData(allList || []);

    setLoading(false);
  };

  useEffect(() => {
    setData([]);
    setTotal(0);
    getData();
  }, [searchText, address, chainId, allDaoData]);

  const renderItem = (item: daosType) => (
    <List.Item style={{ padding: 0 }}>
      <Item data={item} />
    </List.Item>
  );

  const viewAll = async () => {
    if (!isSupportChain) {
      return;
    }

    if (!isInit) {
      walletModal.current.show();
      return;
    }

    if (!nickname) {
      infoModal.current.show();
      return;
    }

    router.push('/daos');
  };

  return (
    <div>
      <div className="top">
        {formatMessage({ id: 'home.explore' })}
        <Button type="link" className="button-add" onClick={showModal}>
          <div className="button-image-wrap">
            <Image
              src="/images/home/icon_home_add_dao_default@2x.png"
              width={20}
              height={20}
              preview={false}
              alt="add"
            />
            {/* DAO */}
          </div>
        </Button>
      </div>

      <List
        grid={{
          gutter: 16,
          column: 2,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
        }}
        loading={loading}
        rowKey="id"
        dataSource={data}
        renderItem={renderItem}
      />

      {/* {loading && <Skeleton active />}

      {!loading && data.length === 0 && <Empty />}

      {!loading && data.length > 0 && (
        <Row gutter={[16, 16]}>
          {data.map((item: any) => (
            <Col xs={24} sm={24} lg={12} key={item.id}>
              <Item data={item} />
            </Col>
          ))}
        </Row>
      )} */}

      {data.length > 0 && pageSize.current < total && (
        <div style={{ paddingTop: 40, textAlign: 'center' }}>
          <Button
            className="button-view-all"
            type="primary"
            ghost
            onClick={viewAll}
          >
            {formatMessage({ id: 'viewAllDao' })}
          </Button>
        </div>
      )}

      <WalletModal ref={walletModal} />
      <CreateModal ref={createModal} />
      <InfoModal ref={infoModal} />

      <style jsx>
        {`
          .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 102px;
            margin-top: 99px;

            font-size: 34px;
            font-family: var(--font-family-secondary);
            font-weight: bold;
            color: #000000;
            line-height: 30px;
          }

          .top :global(.button-add) {
            height: 40px;
            padding-right: 15px;
            font-size: 32px;
            font-weight: bold;
            font-family: var(--font-family-secondary);
            color: #000000;
            line-height: 32px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
