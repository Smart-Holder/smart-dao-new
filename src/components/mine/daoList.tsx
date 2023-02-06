import { useEffect, useState } from 'react';
import { Space, Button, Divider } from 'antd';
import { getDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import Item from '@/components/mine/daoItem';

import { getCookie } from '@/utils/cookie';

export default function List() {
  const dispatch = useAppDispatch();

  const chainId = Number(getCookie('chainId'));
  const address = getCookie('address');

  const [active, setActive] = useState(1);
  const { DAOList } = useAppSelector((store) => store.dao);
  const { isInit } = useAppSelector((store) => store.common);

  useEffect(() => {
    if (address && chainId) {
      dispatch(getDAOList({ chain: chainId, owner: address }));
    }
  }, [isInit]);

  const handleClick1 = () => {
    setActive(1);
  };
  const handleClick2 = () => {
    setActive(2);
  };
  const handleClick3 = () => {
    setActive(3);
  };

  return (
    <div className="dao-list-wrap">
      <Space size={50} split={<Divider className="divider" type="vertical" />}>
        <Button
          className={`button ${active === 1 ? 'active' : ''}`}
          type="link"
          onClick={handleClick1}
        >
          我创建的
        </Button>
        <Button
          className={`button ${active === 2 ? 'active' : ''}`}
          type="link"
          onClick={handleClick2}
        >
          我加入的
        </Button>
        <Button
          className={`button ${active === 3 ? 'active' : ''}`}
          type="link"
          onClick={handleClick3}
        >
          我关注的
        </Button>
      </Space>

      <div className="dao-list">
        <Space size={34}>
          {DAOList.map((item) => (
            <Item data={item} key={item.id} />
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

          .dao-list-wrap :global(.button) {
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
