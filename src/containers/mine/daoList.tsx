import { useEffect, useState } from 'react';
import { Space, Button, Divider, Skeleton, Empty, Row, Col } from 'antd';
import sdk from 'hcstore/sdk';
import { useIntl } from 'react-intl';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import Item from '@/containers/home/daoItem';
import ItemCache from '@/containers/mine/daoItemCache';

// import { getCookie } from '@/utils/cookie';
import { getMakeDAOStorage } from '@/utils/launch';
import { request } from '@/api';
import { DAOType } from '@/config/enum';
import { setDAOList } from '@/store/features/daoSlice';

type Active = 'create' | DAOType.Join | DAOType.Follow;

export default function List() {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  // const chainId = Number(getCookie('chainId'));
  // const address = getCookie('address');

  const { address, chainId } = useAppSelector((store) => store.wallet);

  // const { isInit } = useAppSelector((store) => store.common);
  const [active, setActive] = useState<Active>('create'); // create, join, follow

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

      dispatch(setDAOList(res2));

      setList(
        active === 'create' ? res1 : active === DAOType.Join ? res2 : res3,
      );

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
    setActive(DAOType.Join);
    setList(joinDAOs);
  };

  const handleClick3 = () => {
    setActive(DAOType.Follow);
    setList(followDAOs);
  };

  return (
    <div className="dao-list-wrap">
      <Space size={28}>
        <Button
          className="button-tab"
          type={active === 'create' ? 'primary' : 'link'}
          onClick={handleClick1}
        >
          {formatMessage({ id: 'my.home.dao.create' })}
        </Button>
        <Button
          className="button-tab"
          type={active === DAOType.Join ? 'primary' : 'link'}
          onClick={handleClick2}
        >
          {formatMessage({ id: 'my.home.dao.join' })}
        </Button>
        <Button
          className="button-tab"
          type={active === DAOType.Follow ? 'primary' : 'link'}
          onClick={handleClick3}
        >
          {formatMessage({ id: 'my.home.dao.follow' })}
        </Button>
      </Space>

      <div className="dao-list">
        {loading && <Skeleton active />}

        {!loading && list && list.length === 0 && <Empty />}

        {!loading && list && list.length > 0 && (
          <Row gutter={[16, 16]}>
            {(active === 'create' || active === DAOType.Join) && cacheDAO && (
              <Col xs={24} sm={24} lg={12}>
                <ItemCache data={cacheDAO} daoType={DAOType.Cache} />
              </Col>
            )}
            {list.map((item: any) => (
              <Col xs={24} sm={24} lg={12} key={item.id}>
                <Item
                  data={item}
                  daoType={active === 'create' ? DAOType.Join : active}
                  readOnly
                />
              </Col>
            ))}
          </Row>
        )}
      </div>

      <style jsx>
        {`
          .dao-list-wrap {
            margin-top: 9px;
          }

          .dao-list-wrap :global(.divider) {
            height: 22px;
            border-width: 2px;
            border-color: #000;
          }

          .dao-list-wrap :global(.button-tab) {
            height: 35px;

            font-size: 14px;
            font-family: SFUIText-Bold, SFUIText;
            font-weight: bold;
            line-height: 17px;

            border-radius: 18px;
            outline: none;
          }

          .dao-list-wrap :global(.button-tab.ant-btn-link) {
            color: #000;
          }

          .dao-list {
            margin-top: 25px;
          }
        `}
      </style>
    </div>
  );
}
