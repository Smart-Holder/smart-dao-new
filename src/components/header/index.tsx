import React, { useState, MouseEvent, createRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Layout, Dropdown, Space } from 'antd';
import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';
import styles from './header.module.css';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { disconnect } from '@/store/features/walletSlice';

import ConnectModal from '@/components/connect/modal';
import CreateModal from '@/components/create/modal';
import Search from '@/components/search';
import Menu from '@/components/header/menu';
import Lang from '@/components/header/lang';

import { getCookie } from '@/utils/cookie';
import { formatAddress } from '@/utils';

import iconUser from '/public/images/icon-user.png';

const items: MenuProps['items'] = [
  {
    label: 'Create DAO',
    key: 'create',
  },
  {
    label: 'Mine',
    key: 'mine',
  },
  {
    label: 'Disconnect Wallet',
    key: 'disconnect',
  },
];

const langList: MenuProps['items'] = [
  {
    label: 'English',
    key: 'en',
  },
];

const Header = () => {
  // 通过useSelector直接拿到store中定义的value
  const { address } = useAppSelector((store) => store.wallet);
  // const address = getCookie('address');

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // 通过useDispatch 派发事件
  const dispatch = useAppDispatch();

  const router = useRouter();

  const connectModal: any = createRef();
  const createModal: any = createRef();

  const handleDropdownClick = (e: MouseEvent) => {
    e.preventDefault();

    if (!getCookie('address')) {
      connectModal.current.show();
      return;
    }
  };

  const handleOpenChange = (flag: boolean) => {
    if (!getCookie('address')) {
      setDropdownOpen(false);
      return;
    }

    setDropdownOpen(flag);
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'mine') {
      router.push('/mine');
    } else if (key === 'disconnect') {
      dispatch(disconnect());
    } else if (key === 'create') {
      createModal.current.show();
    }

    setDropdownOpen(false);
  };

  return (
    <div className={styles.layout}>
      <Layout.Header className={styles.header}>
        <div className={styles.left}>
          <div className={styles.logo} />
          <span className={styles.name}>SmartDAO</span>
          <Search />
        </div>
        <div>
          <Space size={26}>
            <Menu />
            <Lang />
          </Space>
        </div>
      </Layout.Header>

      <ConnectModal ref={connectModal} />
      <CreateModal ref={createModal} />
    </div>
  );
};

export default Header;
