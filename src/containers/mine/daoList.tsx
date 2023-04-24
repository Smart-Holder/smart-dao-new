import { useEffect, useState } from 'react';
import { Space, Button, Skeleton, Empty, Row, Col } from 'antd';
import { useIntl } from 'react-intl';

import { useAppSelector } from '@/store/hooks';

import Item from '@/containers/home/daoItem';
import ItemCache from '@/containers/mine/daoItemCache';

import { getMakeDAOStorage } from '@/utils/launch';
import { request } from '@/api';
import { DAOType } from '@/config/enum';
import { DAOExtend } from '@/config/define_ext';

type Active = 'create' | DAOType.Join | DAOType.Follow;

const App = () => {
  const { formatMessage } = useIntl();

  const { address, chainId } = useAppSelector((store) => store.wallet);

  const [active, setActive] = useState<Active>('create');
  const [loading, setLoading] = useState(false);

  const [createDAOs, setCreateDAOs] = useState<DAOExtend[]>([]);
  const [followDAOs, setFollowDAOs] = useState<DAOExtend[]>([]);
  const [joinDAOs, setJoinDAOs] = useState<DAOExtend[]>([]);

  const [list, setList] = useState<DAOExtend[]>([]);

  const cacheDAO = getMakeDAOStorage('start');

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const [res1, res2, res3] = await Promise.all([
        request({
          name: 'dao',
          method: 'getDAOsFromCreatedBy',
          params: { chain: chainId, owner: address, memberObjs: 100 },
        }),
        request({
          name: 'utils',
          method: 'getDAOsFromOwner',
          params: { chain: chainId, owner: address, memberObjs: 100 },
        }),
        request({
          name: 'user',
          method: 'getUserLikeDAOs',
          params: { chain: chainId, memberObjs: 100 },
        }),
      ]);

      (res3 || []).forEach((item: DAOExtend) => {
        item.isMember =
          item.isMember ||
          (res2 || []).some((el: DAOExtend) => el.host === item.host);
      });

      setCreateDAOs(res1);
      setJoinDAOs(res2);
      setFollowDAOs(res3);

      setList(
        active === 'create' ? res1 : active === DAOType.Join ? res2 : res3,
      );

      setLoading(false);
    };

    if (address && chainId) {
      getData();
    }
  }, [address, chainId]);

  const handleClick1 = () => {
    setLoading(true);
    setActive('create');

    setTimeout(() => {
      setList(createDAOs);
      setLoading(false);
    }, 300);
  };

  const handleClick2 = () => {
    setLoading(true);
    setActive(DAOType.Join);

    setTimeout(() => {
      setList(joinDAOs);
      setLoading(false);
    }, 300);
  };

  const handleClick3 = () => {
    setLoading(true);
    setActive(DAOType.Follow);

    setTimeout(() => {
      setList(followDAOs);
      setLoading(false);
    }, 300);
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

        {!loading && list.length === 0 && <Empty />}

        {!loading && list.length > 0 && (
          <Row gutter={[16, 16]}>
            {(active === 'create' || active === DAOType.Join) && cacheDAO && (
              <Col xs={24} sm={24} lg={12}>
                <ItemCache data={cacheDAO} daoType={DAOType.Cache} readOnly />
              </Col>
            )}
            {list.map((item: DAOExtend) => (
              <Col xs={24} sm={24} lg={12} key={item.id}>
                <Item
                  data={item}
                  daoType={
                    active === 'create' || item.isMember ? DAOType.Join : active
                  }
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

          .dao-list-wrap :global(.button-tab) {
            height: 35px;

            font-size: 14px;
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
};

export default App;
