import { useEffect, useRef, useState } from 'react';
import sdk from 'hcstore/sdk';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl } from 'react-intl';

import Item from './daoItem';

// import { getDAOList, setDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

// import { getCookie } from '@/utils/cookie';
import { debounce } from '@/utils';
import { Skeleton, Empty } from 'antd';
// import {
//   setLikeDAOs,
//   setDAOList as setMyDAOList,
// } from '@/store/features/daoSlice';

const DAOList = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  // const chainId = Number(getCookie('chainId'));
  // const address = getCookie('address');

  const { searchText, isInit } = useAppSelector((store) => store.common);
  const { chainId, address, isSupportChain } = useAppSelector(
    (store) => store.wallet,
  );

  const pageSize = useRef(20);
  const [width, setWidth] = useState('');
  const [DAOList, setDAOList] = useState<any>([]);
  const [pageStart, setPageStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);

  const defaultChain = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN);

  const onResize = () => {
    const el = document.querySelector('.wrap1') as any;
    const col = Math.floor(el.offsetWidth / (196 + 15));
    const w = 100 / col;

    setWidth(w ? w + '%' : 'auto');
  };

  useEffect(() => {
    onResize();
  }, []);

  useEffect(() => {
    const resize = debounce(onResize, 200);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const getData = async () => {
    if (!isSupportChain) {
      return;
    }

    setLoading(true);
    const res = await sdk.dao.methods.getAllDAOs({
      chain: chainId || defaultChain,
      name: searchText,
      limit: [pageStart, pageSize.current],
      // owner: address || '',
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
      // owner: address || '',
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
      {width && (
        <div className="h1-2">
          <div className="h1-2-content">
            {formatMessage({ id: 'home.explore' })}
          </div>
        </div>
      )}
      {/* <div className="h1">Discovery! Most Favorites Items</div> */}
      {/* <div className="h2">Lorem ipsum dolor sit amet, consectetur</div> */}

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

          {DAOList.length === 0 && !loading && init && (
            <div className="empty">
              <Empty />
            </div>
          )}
        </div>
      </InfiniteScroll>

      {/* <Space size={[15, 59]} wrap>
        {DAOList.map((item: any) => (
          <Item data={item} key={item.id} />
        ))}
      </Space> */}

      <style jsx>{`
        .h1-2 {
          width: ${width};
          height: 30px;
          margin-bottom: 44px;
        }

        .h1-2-content {
          width: 196px;
          margin: 0 auto;
          font-size: 20px;
          font-weight: 400;
          color: #000000;
          line-height: 30px;
        }

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

        .empty {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default DAOList;
