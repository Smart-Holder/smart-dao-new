import React, { useState, MouseEvent, createRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Layout, Dropdown, Space, Image as Img } from 'antd';
import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { disconnect } from '@/store/features/walletSlice';

import ConnectModal from '@/components/connect/modal';
import CreateModal from '@/components/create/modal';
import InfoModal from '@/components/create/info';
import Search from '@/components/search';

import { getCookie } from '@/utils/cookie';
import { formatAddress } from '@/utils';

import iconUser from '/public/images/icon-user.png';
import { setUserInfo } from '@/store/features/userSlice';
import { setLoading } from '@/store/features/commonSlice';

import sdk from 'hcstore/sdk';

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

const Menu = () => {
  // 通过useSelector直接拿到store中定义的value
  const { address } = useAppSelector((store) => store.wallet);
  const { isInit } = useAppSelector((store) => store.common);
  const { nickname, image } = useAppSelector((store) => store.user.userInfo);
  // const address = getCookie('address');

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const connectModal: any = createRef();
  const createModal: any = createRef();
  const infoModal: any = createRef();

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

  // useEffect(() => {
  //   sdk.user.methods.getUser().then((res) => {
  //     if (res && !res.nickname) {
  //       infoModal.current.show();
  //     }

  //     if (res && res.nickname) {
  //       dispatch(setUserInfo(res));
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (isInit && !nickname) {
      infoModal.current.show();
    }
  }, [isInit]);

  // useEffect(() => {
  //   if (address && !nickname) {
  //     infoModal.current.show();
  //   }
  // }, [address, nickname]);

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
          {image ? (
            <Img
              style={{ borderRadius: '50%' }}
              src={image}
              width={32}
              height={32}
              preview={false}
              alt="avatar"
            />
          ) : (
            <Image src={iconUser} alt="user" width={32} height={32} />
          )}
          <span className="dropdown-trigger-content">
            {address ? formatAddress(address) : 'Connect Wallet'}
          </span>
          <DownOutlined />
        </Space>
      </Dropdown>

      <ConnectModal ref={connectModal} />
      <CreateModal ref={createModal} />
      <InfoModal ref={infoModal} />

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
