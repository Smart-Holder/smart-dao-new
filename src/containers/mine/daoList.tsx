import { useEffect, useState } from 'react';
import { Space, Button, Divider, Skeleton, Empty } from 'antd';
import sdk from 'hcstore/sdk';
import { useIntl } from 'react-intl';

import { useAppSelector } from '@/store/hooks';

import Item from '@/containers/mine/daoItem';

// import { getCookie } from '@/utils/cookie';
import { getMakeDAOStorage } from '@/utils/launch';
import { request } from '@/api';

export default function List() {
  const { formatMessage } = useIntl();

  // const chainId = Number(getCookie('chainId'));
  // const address = getCookie('address');

  const { address, chainId } = useAppSelector((store) => store.wallet);

  // const { isInit } = useAppSelector((store) => store.common);
  const [active, setActive] = useState('create'); // create, join, follow

  const [createDAOs, setCreateDAOs] = useState([]);
  const [followDAOs, setFollowDAOs] = useState([]);
  const [joinDAOs, setJoinDAOs] = useState([]);

  const [list, setList] = useState(null) as any;
  const [loading, setLoading] = useState(false);

  const cacheDAO = getMakeDAOStorage('start');

  useEffect(() => {
    const getDAOList = async () => {
      setLoading(true);
      const [res1, res2, res3] = await Promise.all([
        request({
          name: 'dao',
          method: 'getDAOsFromCreatedBy',
          params: { chain: chainId, owner: address },
        }),
        request({
          name: 'utils',
          method: 'getDAOsFromOwner',
          params: { chain: chainId, owner: address },
        }),
        request({
          name: 'user',
          method: 'getUserLikeDAOs',
          params: { chain: chainId },
        }),
      ]);

      setCreateDAOs(res1);
      setJoinDAOs(res2);
      setFollowDAOs(res3);

      setList(active === 'create' ? res1 : active === 'join' ? res2 : res3);

      setLoading(false);
    };

    if (address && chainId) {
      getDAOList();
    }
  }, [address, chainId]);

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
    setList(followDAOs);
  };

  return (
    <div className="dao-list-wrap">
      <Space size={50} split={<Divider className="divider" type="vertical" />}>
        <Button
          className={`list-button ${active === 'create' ? 'active' : ''}`}
          type="link"
          onClick={handleClick1}
        >
          {formatMessage({ id: 'my.home.dao.create' })}
        </Button>
        <Button
          className={`list-button ${active === 'join' ? 'active' : ''}`}
          type="link"
          onClick={handleClick2}
        >
          {formatMessage({ id: 'my.home.dao.join' })}
        </Button>
        <Button
          className={`list-button ${active === 'follow' ? 'active' : ''}`}
          type="link"
          onClick={handleClick3}
        >
          {formatMessage({ id: 'my.home.dao.follow' })}
        </Button>
      </Space>

      <div className="dao-list">
        {loading && <Skeleton />}

        {!loading && list && list.length === 0 && <Empty />}

        {!loading && list && list.length > 0 && (
          <Space size={34} wrap>
            {(active === 'create' || active === 'join') && cacheDAO && (
              <Item data={cacheDAO} DAOType="cache" />
            )}
            {list.map((item: any) => (
              <Item data={item} DAOType={active} key={item.id} />
            ))}
          </Space>
        )}
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
