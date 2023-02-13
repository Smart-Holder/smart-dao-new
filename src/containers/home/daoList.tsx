import { useEffect, useState } from 'react';
import sdk from 'hcstore/sdk';
import InfiniteScroll from 'react-infinite-scroll-component';

import Item from './daoItem';

// import { getDAOList, setDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { getCookie } from '@/utils/cookie';
import { debounce } from '@/utils';
import { Divider, Skeleton } from 'antd';
// import {
//   setLikeDAOs,
//   setDAOList as setMyDAOList,
// } from '@/store/features/daoSlice';

const testData = [
  {
    id: 1,
    name: 'dao1',
    avatar:
      'data:image/png;base64,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',
    status1: 1,
    status2: 1,
  },
];

const DAOList = () => {
  const dispatch = useAppDispatch();

  const chainId = Number(getCookie('chainId'));
  const address = getCookie('address');

  const { searchText, isInit } = useAppSelector((store) => store.common);
  // const DAOList = testData;
  const [width, setWidth] = useState('');
  const [DAOList, setDAOList] = useState<any>([]);
  const [pageStart, setPageStart] = useState(0);
  const [total, setTotal] = useState(-1);
  const [hasMore, setHasMore] = useState(true);
  const defaultChain = process.env.NEXT_PUBLIC_DEFAULT_CHAIN;

  const onResize = () => {
    console.log('onSesize');
    const el = document.querySelector('.wrap1') as any;

    const col = Math.floor(el.offsetWidth / (196 + 15));
    const w = 100 / col;
    setWidth(w ? w + '%' : 'auto');
  };

  useEffect(() => {
    onResize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', debounce(onResize, 200));
    return () => {
      window.removeEventListener('resize', debounce(onResize, 200));
    };
  }, []);

  const getData = async () => {
    // const t = await sdk.dao.methods.getAllDAOsTotal({
    //   chain: chainId || defaultChain,
    //   name: searchText,
    // });

    // setTotal(t);

    const res = await sdk.dao.methods.getAllDAOs({
      chain: chainId || defaultChain,
      name: searchText,
      limit: [pageStart, 20],
      owner: address || '',
    });

    const nextList = [...DAOList, ...res];

    // if (nextList.length >= t) {
    //   setHasMore(false);
    // }

    setPageStart(pageStart + 20);
    setDAOList(nextList);
  };

  const resetData = async () => {
    setDAOList([]);

    const t = await sdk.dao.methods.getAllDAOsTotal({
      chain: chainId || defaultChain,
      name: searchText,
    });

    setTotal(t);

    const list = await sdk.dao.methods.getAllDAOs({
      chain: chainId || defaultChain,
      name: searchText,
      limit: [0, 20],
      owner: address || '',
    });

    setPageStart(20);
    setDAOList(list);
  };

  useEffect(() => {
    console.log('resetData');
    resetData();
  }, [isInit, searchText, address, chainId]);

  // useEffect(() => {
  //   if (searchText) {
  //     resetData();
  //   }
  // }, [searchText]);

  // useEffect(() => {
  //   const getLikeDAOS = async () => {
  //     const res = await sdk.user.methods.getUserLikeDAOs({ chain: chainId });

  //     dispatch(setLikeDAOs(res));
  //   };

  //   getLikeDAOS();
  // }, []);

  // useEffect(() => {
  //   const getDAOList = async () => {
  //     const res = await sdk.utils.methods.getDAOsFromOwner({
  //       chain: chainId,
  //       owner: address,
  //     });

  //     dispatch(setMyDAOList(res));
  //   };

  //   if (address && chainId) {
  //     getDAOList();
  //   }
  // }, [isInit]);

  return (
    <div>
      <div className="h1">Discovery! Most Favorites Items</div>
      <div className="h2">Lorem ipsum dolor sit amet, consectetur</div>

      {/* <Row justify="center" gutter={[30, 59]}>
        {DAOList.map((item: any) => (
          <Col key={item.id}>
            <Item data={item} />
          </Col>
        ))}
      </Row> */}

      <InfiniteScroll
        dataLength={DAOList.length}
        next={getData}
        hasMore={DAOList.length < total}
        // loader={<p style={{ textAlign: 'center' }}>Loading...</p>}
        loader={<Skeleton paragraph={{ rows: 1 }} active />}
        // endMessage={
        //   total >= 0 ? (
        //     <div style={{ textAlign: 'center' }}>It is all, nothing more</div>
        //   ) : null
        // }
        scrollableTarget="scrollableDiv"
      >
        <div className="wrap1">
          {width &&
            DAOList.map((item: any) => (
              <div className="wrap2" key={item.id}>
                <Item data={item} />
              </div>
            ))}
        </div>
      </InfiniteScroll>

      {/* <Space size={[15, 59]} wrap>
        {DAOList.map((item: any) => (
          <Item data={item} key={item.id} />
        ))}
      </Space> */}

      <style jsx>{`
        .h1 {
          height: 30px;
          font-size: 20px;
          font-weight: 400;
          color: #000000;
          line-height: 30px;
        }

        .h2 {
          height: 18px;
          margin-bottom: 44px;
          font-size: 12px;
          font-weight: 400;
          color: #969ba0;
          line-height: 18px;
        }

        .wrap1 {
          display: flex;
          flex-wrap: wrap;
        }

        .wrap2 {
          display: flex;
          justify-content: center;
          flex-basis: ${width};
          margin-bottom: 59px;
        }
      `}</style>
    </div>
  );
};

export default DAOList;
