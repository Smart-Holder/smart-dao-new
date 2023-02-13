import { useEffect, useState } from 'react';
import { Space, Button, Divider } from 'antd';
import { getDAOList, setDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import sdk from 'hcstore/sdk';

import Item from '@/containers/mine/daoItem';

import { getCookie } from '@/utils/cookie';
import { getMakeDAOStorage } from '@/utils/launch';

export default function List() {
  const dispatch = useAppDispatch();

  const chainId = Number(getCookie('chainId'));
  const address = getCookie('address');

  const { isInit } = useAppSelector((store) => store.common);
  const [active, setActive] = useState('create');
  // const { DAOList } = useAppSelector((store) => store.dao);
  const [likeDAOs, setLikeDAOs] = useState([]);
  const [joinDAOs, setJoinDAOs] = useState([]);
  const [createDAOs, setCreateDAOs] = useState([]);

  const [list, setList] = useState([]) as any;

  const cacheDAO = getMakeDAOStorage('start');

  useEffect(() => {
    const getDAOList = async () => {
      const res = await sdk.utils.methods.getDAOsFromCreateBy({
        chain: chainId,
        owner: address,
      });

      setCreateDAOs(res);
      setList(res);
    };

    if (address && chainId) {
      getDAOList();
    }
  }, [isInit]);

  useEffect(() => {
    const getDAOList = async () => {
      const res = await sdk.utils.methods.getDAOsFromOwner({
        chain: chainId,
        owner: address,
      });

      dispatch(setDAOList(res));
      setJoinDAOs(res);
    };

    if (address && chainId) {
      getDAOList();
    }
  }, [isInit]);

  useEffect(() => {
    const getLikeDAOS = async () => {
      const res = await sdk.user.methods.getUserLikeDAOs({ chain: chainId });

      setLikeDAOs(res);
    };

    getLikeDAOS();
  }, []);

  const handleClick1 = () => {
    setActive('create');
    setList(createDAOs);
  };
  const handleClick2 = () => {
    setActive('join');
    setList(joinDAOs);
  };
  const handleClick3 = () => {
    setActive('follow');
    setList(likeDAOs);
  };

  return (
    <div className="dao-list-wrap">
      <Space size={50} split={<Divider className="divider" type="vertical" />}>
        <Button
          className={`list-button ${active === 'create' ? 'active' : ''}`}
          type="link"
          onClick={handleClick1}
        >
          我创建的
        </Button>
        <Button
          className={`list-button ${active === 'join' ? 'active' : ''}`}
          type="link"
          onClick={handleClick2}
        >
          我加入的
        </Button>
        <Button
          className={`list-button ${active === 'follow' ? 'active' : ''}`}
          type="link"
          onClick={handleClick3}
        >
          我关注的
        </Button>
      </Space>

      <div className="dao-list">
        <Space size={34} wrap>
          {(active === 'create' || active === 'join') && cacheDAO && (
            <Item data={cacheDAO} DAOType="cache" />
          )}
          {list.map((item: any) => (
            <Item data={item} DAOType={active} key={item.id} />
          ))}
          {/* <Item data={{ name: '123' }} />
          <Item data={{ name: '123' }} />
          <Item data={{ name: '123' }} />
          <Item data={{ name: '123' }} /> */}
        </Space>
      </div>

      <style jsx>
        {`
          .dao-list-wrap {
            margin-top: 60px;
          }

          .dao-list-wrap :global(.divider) {
            height: 22px;
            border-width: 2px;
            border-color: #000;
          }

          .dao-list-wrap :global(.list-button) {
            height: 40px;

            height: 30px;
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000;
            line-height: 20px;

            outline: none;
          }

          .dao-list-wrap :global(.active) {
            color: #546ff6;
          }

          .dao-list {
            padding: 57px 0 0 14px;
          }
        `}
      </style>
    </div>
  );
}