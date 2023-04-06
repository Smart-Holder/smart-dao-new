import { useEffect, useRef, useState } from 'react';
import sdk from 'hcstore/sdk';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl } from 'react-intl';

import Item from '@/containers/home/daoItem';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { Skeleton, Empty, Row, Col } from 'antd';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const { searchText, isInit } = useAppSelector((store) => store.common);
  const { chainId, address, isSupportChain } = useAppSelector(
    (store) => store.wallet,
  );

  const pageSize = useRef(10);
  const [width, setWidth] = useState('');
  const [DAOList, setDAOList] = useState<any>([]);
  const [pageStart, setPageStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);

  const defaultChain = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN);

  const getData = async () => {
    if (!isSupportChain) {
      return;
    }

    setLoading(true);
    const res = await sdk.dao.methods.getAllDAOs({
      chain: chainId || defaultChain,
      name: searchText,
      limit: [pageStart, pageSize.current],
      orderBy: 'time desc',
    });

    const nextList = [...DAOList, ...res];

    setPageStart(pageStart + pageSize.current);
    setDAOList(nextList);
    setLoading(false);
  };

  const resetData = async () => {
    if (!isSupportChain) {
      return;
    }

    setLoading(true);
    const t = await sdk.dao.methods.getAllDAOsTotal({
      chain: chainId || defaultChain,
      name: searchText,
    });

    setTotal(t);

    const list = await sdk.dao.methods.getAllDAOs({
      chain: chainId || defaultChain,
      name: searchText,
      limit: [0, pageSize.current],
      orderBy: 'time desc',
    });

    setPageStart(pageSize.current);
    setDAOList(list);
    setLoading(false);
    setInit(true);
  };

  useEffect(() => {
    setDAOList([]);
    setTotal(0);
    resetData();
  }, [searchText, address, chainId]);

  return (
    <div>
      <div className="h1">DAOs</div>

      <InfiniteScroll
        dataLength={DAOList.length}
        next={getData}
        hasMore={DAOList.length < total}
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
            {DAOList.map((item: any) => (
              <Col xs={24} sm={24} lg={12} key={item.id}>
                <Item data={item} />
              </Col>
            ))}

            {DAOList.length === 0 && !loading && init && (
              <div className="empty">
                <Empty />
              </div>
            )}
          </Row>
        </div>
      </InfiniteScroll>

      {/* <Space size={[15, 59]} wrap>
        {DAOList.map((item: any) => (
          <Item data={item} key={item.id} />
        ))}
      </Space> */}

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
