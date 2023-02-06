import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Layout, Tabs } from 'antd';
const { Content } = Layout;
import styles from '@/styles/mine.module.css';
import { getCookie } from '@/utils/cookie';
import type { TabsProps } from 'antd';
import { Divider, Space, Button } from 'antd';

import { getDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import DAO from '@/components/mine/daoList';
import Info from '@/components/mine/info';

export default function Mine() {
  const dispatch = useAppDispatch();

  const chainId = Number(getCookie('chainId'));
  const address = getCookie('address');

  // const { DAOList } = useAppSelector((store) => store.dao);

  // useEffect(() => {
  //   dispatch(getDAOList({ chain: chainId, owner: address }));
  // }, []);

  // console.log('DAOList', DAOList);

  const [active, setActive] = useState(1);

  const handleDAOClick = () => {
    setActive(1);
  };

  const handleInfoClick = () => {
    setActive(2);
  };

  return (
    <div className="wrap">
      <Space size={50} split={<Divider className="divider" type="vertical" />}>
        <Button
          className={`button ${active === 1 ? 'active' : ''}`}
          type="link"
          onClick={handleDAOClick}
        >
          我的DAO
        </Button>
        <Button
          className={`button ${active === 2 ? 'active' : ''}`}
          type="link"
          onClick={handleInfoClick}
        >
          个人信息
        </Button>
      </Space>
      {/* <Tabs defaultActiveKey="1" items={items} onChange={onChange} /> */}
      <div>
        {active === 1 && <DAO />}
        {active === 2 && <Info />}
      </div>

      <style jsx>
        {`
          .wrap :global(.divider) {
            height: 32px;
            border-width: 3px;
            border-color: #000;
          }

          .wrap :global(.button) {
            height: 40px;
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000;
            line-height: 30px;
            outline: none;
          }

          .wrap :global(.active) {
            color: #546ff6;
          }
        `}
      </style>
    </div>
  );
}
