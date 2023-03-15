import { useEffect, useRef, useState } from 'react';
import sdk from 'hcstore/sdk';
import { useIntl } from 'react-intl';

import Item from './daoItem';

// import { getDAOList, setDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

// import { getCookie } from '@/utils/cookie';
import { debounce } from '@/utils';
import { Skeleton, Empty, Button, Row, Col, Image, Space, Avatar } from 'antd';
// import {
//   setLikeDAOs,
//   setDAOList as setMyDAOList,
// } from '@/store/features/daoSlice';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  // const chainId = Number(getCookie('chainId'));
  // const address = getCookie('address');

  const { searchText, isInit } = useAppSelector((store) => store.common);
  const { chainId, address, isSupportChain } = useAppSelector(
    (store) => store.wallet,
  );

  const pageSize = useRef(20);
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
      // owner: address || '',
    });

    const nextList = [...DAOList, ...res];

    setPageStart(pageStart + pageSize.current);
    setDAOList(nextList);
    setLoading(false);
  };

  const getAllData = async () => {
    if (!isSupportChain) {
      return;
    }

    setLoading(true);
    const res = await sdk.dao.methods.getAllDAOs({
      chain: chainId || defaultChain,
      name: searchText,
      limit: [pageStart, 100],
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
      limit: [0, 4],
      // owner: address || '',
    });

    setPageStart(4);
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
    <>
      <div className="top">
        {formatMessage({ id: 'home.explore' })}
        <Button
          type="link"
          className="button-add"
          icon={
            <Image
              style={{ display: 'block' }}
              src="/images/home/icon_home_add_dao.png"
              width={20}
              height={20}
              preview={false}
              alt="add"
            />
          }
        >
          DAO
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {DAOList.map((item: any) => (
          <Col xs={24} sm={24} lg={12} key={item.id}>
            <Item data={item} />
          </Col>
        ))}
      </Row>

      {/* <div className="wrap1">
        {DAOList.map((item: any) => (
          <div className="wrap2" key={item.id}>
            <Item data={item} />
          </div>
        ))}

        {DAOList.length === 0 && !loading && init && (
          <div className="empty">
            <Empty />
          </div>
        )}
      </div> */}

      {/* <Space size={[15, 59]} wrap>
        {DAOList.map((item: any) => (
          <Item data={item} key={item.id} />
        ))}
      </Space> */}

      <div className="footer">
        {DAOList.length < total && (
          <Button className="button-all" onClick={getAllData}>
            VIEW ALL DAO
          </Button>
        )}
      </div>

      <style jsx>{`
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 102px;

          font-size: 34px;
          font-family: AdobeDevanagari-Bold, AdobeDevanagari;
          font-weight: bold;
          color: #000000;
          line-height: 30px;
        }

        .top :global(.button-add) {
          height: 40px;
          font-size: 32px;
          font-family: AdobeDevanagari-Bold, AdobeDevanagari;
          font-weight: bold;
          color: #000000;
          line-height: 32px;
        }

        .top :global(.button-add span) {
          margin-left: 8px;
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
          margin-bottom: 59px;
        }

        .empty {
          width: 100%;
        }

        .footer {
          padding: 40px 0 50px;
          text-align: center;
        }

        .footer :global(.button-all) {
          width: 260px;
          height: 46px;
          font-size: 18px;
          font-family: AdobeGurmukhi-Bold, AdobeGurmukhi;
          font-weight: bold;
          color: #000000;
          line-height: 27px;
          background: #ffffff;
          border-radius: 5px;
          border: 1px solid #000000;
        }
      `}</style>
    </>
  );
};

export default App;
