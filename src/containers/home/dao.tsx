import { useEffect, useRef, useState } from 'react';
import sdk from 'hcstore/sdk';
import { useIntl } from 'react-intl';

import Item from './daoItem';

// import { getDAOList, setDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

// import { getCookie } from '@/utils/cookie';
import { debounce } from '@/utils';
import { Skeleton, Empty, Button, Row, Col, Image, Space, Avatar } from 'antd';
import { getDAOList } from '@/store/features/daoSlice';
import WalletModal from '@/components/modal/walletModal';
import CreateModal from '@/components/modal/createModal';
import InfoModal from '@/components/modal/infoModal';

// import {
//   setLikeDAOs,
//   setDAOList as setMyDAOList,
// } from '@/store/features/daoSlice';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  // const chainId = Number(getCookie('chainId'));
  // const address = getCookie('address');

  const { nickname } = useAppSelector((store) => store.user.userInfo);
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

  useEffect(() => {
    if (address && chainId) {
      dispatch(getDAOList({ chain: chainId, owner: address }));
    }
  }, [address, chainId, dispatch]);

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
      orderBy: 'time desc',
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
      orderBy: 'time desc',
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
        <Button type="link" className="button-add" onClick={showModal}>
          <div className="button-image-wrap">
            <Image
              src="/images/home/icon_home_add_dao_default@2x.png"
              width={20}
              height={20}
              preview={false}
              alt="add"
            />
            DAO
          </div>
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
          <Button
            className="button-view-all"
            type="primary"
            ghost
            onClick={getAllData}
          >
            {formatMessage({ id: 'viewAllDao' })}
          </Button>
        )}
      </div>

      <WalletModal ref={walletModal} />
      <CreateModal ref={createModal} />
      <InfoModal ref={infoModal} />

      <style jsx>{`
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 102px;

          font-size: 34px;
          font-family: var(--font-family-lg);
          font-weight: bold;
          color: #000000;
          line-height: 30px;
        }

        .top :global(.button-add) {
          height: 40px;
          font-size: 32px;
          font-weight: bold;
          font-family: var(--font-family-lg);
          color: #000000;
          line-height: 32px;
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
          padding-top: 40px;
          text-align: center;
        }
      `}</style>
    </>
  );
};

export default App;
