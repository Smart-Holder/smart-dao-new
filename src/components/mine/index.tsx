import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Layout, Tabs } from 'antd';
const { Content } = Layout;
import styles from '@/styles/mine.module.css';
import { getCookie } from '@/utils/cookie';
import type { TabsProps } from 'antd';

import { getDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: `我创建的`,
    children: `Content of Tab Pane 1`,
  },
  {
    key: '2',
    label: `我加入的`,
    children: `Content of Tab Pane 2`,
  },
  {
    key: '3',
    label: `我关注的`,
    children: `Content of Tab Pane 3`,
  },
];

export default function Mine() {
  const dispatch = useAppDispatch();

  const chainId = Number(getCookie('chainId'));
  const address = getCookie('address');

  // const { DAOList } = useAppSelector((store) => store.dao);

  // useEffect(() => {
  //   dispatch(getDAOList({ chain: chainId, owner: address }));
  // }, []);

  // console.log('DAOList', DAOList);

  const onChange = (key: string) => {
    console.log(key);
  };

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
}
