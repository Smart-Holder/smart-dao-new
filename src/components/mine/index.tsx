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

import List from '@/components/mine/daoList';

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

  const handleClick1 = () => {
    setActive(1);
  };
  const handleClick2 = () => {
    setActive(2);
  };
  const handleClick3 = () => {
    setActive(3);
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      {/* <Tabs defaultActiveKey="1" items={items} onChange={onChange} /> */}
      <Space split={<Divider type="vertical" />}>
        <Button type="link" onClick={handleClick1}>
          我创建的
        </Button>
        <Button type="link" onClick={handleClick2}>
          我加入的
        </Button>
        <Button type="link" onClick={handleClick3}>
          我关注的
        </Button>
      </Space>
      <List type={active} />
    </>
  );
}
