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

const Menu = () => {
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
    <div className="wrap">
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        trigger={['click']}
        open={isDropdownOpen}
        onOpenChange={handleOpenChange}
        overlayStyle={{}}
      >
        <Space
          className="dropdown-trigger"
          size={3}
          onClick={handleDropdownClick}
        >
          <Image src={iconUser} alt="user" width={32} height={32} />
          <span className="dropdown-trigger-content">
            {address ? formatAddress(address) : 'Connect Wallet'}
          </span>
          <DownOutlined />
        </Space>
      </Dropdown>

      <style jsx>
        {`
          .wrap :global(.dropdown-trigger) {
            height: 46px;
            padding: 0 12px 0 7px;
            color: #3e4954;
            font-size: 14px;
            background: #f9faff;
            border-radius: 23px;
            cursor: pointer;
          }

          .wrap :global(.dropdown-trigger-content) {
            padding: 0 21px 0 10px;
          }
        `}
      </style>
    </div>
  );
};

export default Menu;
