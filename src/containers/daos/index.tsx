import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton, Empty, Row, Col } from 'antd';

import Item from '@/containers/home/daoItem';

import { useAppSelector } from '@/store/hooks';

import { DAOExtend } from '@/config/define_ext';
import { request } from '@/api';
import { daosType, useLayoutDaos } from '@/api/graph/dao';

const App = () => {
  const { searchText } = useAppSelector((store) => store.common);
  const { chainId, address, isSupportChain } = useAppSelector(
    (store) => store.wallet,
  );

  const pageSize = useRef(5);
  // const [pageStart, setPageStart] = useState(0);
  const [pageStart, setPageStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  // const [data, setData] = useState<DAOExtend[]>([]);
  const [data, setData] = useState<daosType[]>([]);
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);

  const [myDAOList, setMyDAOList] = useState<DAOExtend[]>([]);

  const defaultChain = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN);

  const [getLayoutData] = useLayoutDaos();

  const getData = async () => {
    if (!isSupportChain) {
      return;
    }
    // setLoading(true);
    // const res = (await request({
    //   method: 'getAllDAOs',
    //   name: 'dao',
    //   params: {
    //     chain: chainId || defaultChain,
    //     name: searchText,
    //     limit: [pageStart, pageSize.current],
    //     orderBy: 'time desc',
    //     memberObjs: 100,
    //   },
    // })) as DAOExtend[];

    // (res || []).forEach((item) => {
    //   item.isMember =
    //     item.isMember || myDAOList.some((el) => el.host === item.host);
    // });
    // setPageStart(pageStart + pageSize.current);
    // setData([...data, ...res]);

    const {
      loading,
      error,
      data: dataDaos,
    } = await getLayoutData({
      variables: {
        name_contains: searchText,
        first: pageSize.current,
        skip: pageStart + pageSize.current,
      },
    });
    setTotal(Number(dataDaos?.statistic?.totalDAOs || 0));
    setCurrentTotal(Number(dataDaos?.daos.length));
    setPageStart(pageStart + pageSize.current);
    setData([...data, ...(dataDaos?.daos || [])]);
    setLoading(loading);
    setInit(false);
  };

  const resetData = async () => {
    if (!isSupportChain) {
      return;
    }
    let allList: daosType[] = [];

    // const t = await request({
    //   method: 'getAllDAOsTotal',
    //   name: 'dao',
    //   params: { chain: chainId || defaultChain, name: searchText },
    // });

    // const list = (await request({
    //   method: 'getAllDAOs',
    //   name: 'dao',
    //   params: {
    //     chain: chainId || defaultChain,
    //     name: searchText,
    //     limit: [0, pageSize.current],
    //     orderBy: 'time desc',
    //     memberObjs: 100,
    //   },
    // })) as DAOExtend[];

    // if (chainId && address) {
    //   const myDAOList = (await request({
    //     method: 'getDAOsFromOwner',
    //     name: 'utils',
    //     params: { chain: chainId, owner: address },
    //   })) as DAOExtend[];

    //   setMyDAOList(myDAOList || []);

    //   (list || []).forEach((item) => {
    //     item.isMember =
    //       item.isMember || myDAOList.some((el) => el.host === item.host);
    //   });
    // }
    // setPageStart(pageSize.current);
    // setData(list);
    const {
      loading,
      error,
      data: dataDaos,
    } = await getLayoutData({
      variables: {
        name_contains: searchText,
        first: pageSize.current,
        skip: 0,
      },
    });
    setLoading(loading);

    (dataDaos?.daos || []).forEach((item) => {
      let items = { ...item };
      items.isMember = item.accounts.some((el) => el.id === address);
      allList.push(items);
    });
    setTotal(Number(dataDaos?.statistic?.totalDAOs || 0));
    setCurrentTotal(Number(dataDaos?.daos.length));
    setPageStart(0);
    setData([...allList]);
    // setLoading(false);
    setInit(true);
  };

  useEffect(() => {
    setData([]);
    setTotal(0);
    setCurrentTotal(0);
    resetData();
  }, [searchText, address, chainId]);

  console.log(data.length < total, data.length, total, '999', loading);
  return (
    <div>
      <div className="h1">DAOs</div>

      <InfiniteScroll
        dataLength={data.length}
        next={getData}
        // hasMore={data.length < total}
        hasMore={currentTotal >= pageSize.current}
        loader={
          <Skeleton style={{ marginTop: 20 }} paragraph={{ rows: 1 }} active />
        }
        // endMessage={
        //   total >= 0 ? (
        //     <div style={{ textAlign: 'center' }}>It is all, nothing more</div>
        //   ) : null
        // }
        scrollableTarget="daoScrollTarget"
      >
        <div style={{ overflow: 'hidden' }}>
          <Row gutter={[16, 16]}>
            {data.map((item: any) => (
              <Col xs={24} sm={24} lg={12} key={item.id}>
                <Item data={item} />
              </Col>
            ))}

            {data.length === 0 && !loading && init && (
              <div className="empty">
                <Empty />
              </div>
            )}
          </Row>
        </div>
      </InfiniteScroll>

      <style jsx>
        {`
          .h1 {
            height: 58px;
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 48px;
            font-family: var(--font-family-secondary);
            font-weight: bold;
            color: #000000;
            line-height: 58px;
          }

          .empty {
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default App;
