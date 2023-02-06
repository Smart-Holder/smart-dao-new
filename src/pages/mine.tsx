import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Layout, Tabs } from 'antd';
const { Content } = Layout;
import styles from '@/styles/content.module.css';
import { getCookie } from '@/utils/cookie';
import type { TabsProps } from 'antd';
import { Divider, Space, Button } from 'antd';

import { getDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import BasicLayout from '@/components/layout/basic';
import Mine from '@/components/mine';

// const items: TabsProps['items'] = [
//   {
//     key: '1',
//     label: `我的DAO`,
//     children: <DAO />,
//   },
//   {
//     key: '2',
//     label: `个人信息`,
//     children: <Info />,
//   },
// ];

export default function App() {
  const dispatch = useAppDispatch();

  // const { chainId, address } = useAppSelector((store) => store.wallet);
  const chainId = Number(getCookie('chainId'));
  const address = getCookie('address');

  const { DAOList } = useAppSelector((store) => store.dao);

  const [active, setActive] = useState(1);

  // useEffect(() => {
  //   dispatch(getDAOList({ chain: chainId, owner: address }));
  // }, []);

  // console.log('DAOList', DAOList);

  const handleDAOClick = () => {
    setActive(1);
  };

  const handleInfoClick = () => {
    setActive(2);
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <BasicLayout>
      <Content className={styles.content}>
        <div>
          <div className={styles.title1}>
            Welcome! Discovery the hole magic worlds !
          </div>
          <div className={styles.title2}>Welcome to SmartDAO</div>
        </div>
        <div className={styles.box}>
          <Mine />
        </div>
      </Content>
    </BasicLayout>
  );
}
