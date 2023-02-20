import React, { useState, MouseEvent, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Dropdown, Image as Img, Avatar, Divider, Button } from 'antd';
import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { disconnect } from '@/store/features/walletSlice';

import WalletModal from '@/components/modal/walletModal';
import CreateModal from '@/components/modal/createModal';
import InfoModal from '@/components/modal/infoModal';

import { getCookie } from '@/utils/cookie';
import { formatAddress } from '@/utils';
import { ETH_CHAINS_INFO } from '@/config/chains';
import { connectType as type } from '@/config/enum';

import iconUser from '/public/images/icon-user.png';

import iconMetamask from '/public/images/icon-metamask.png';
import iconWallet from '/public/images/icon-wallet.png';
import iconAdd from '/public/images/icon-add.png';

import { useIntl } from 'react-intl';

const Menu = () => {
  const { formatMessage } = useIntl();
  // 通过useSelector直接拿到store中定义的value
  const { address, chainId, connectType } = useAppSelector(
    (store) => store.wallet,
  );
  const { isInit } = useAppSelector((store) => store.common);
  const { nickname, image } = useAppSelector((store) => store.user.userInfo);
  // const address = getCookie('address');

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const walletModal: any = useRef(null);
  const createModal: any = useRef(null);
  const infoModal: any = useRef(null);

  const handleDropdownClick = (e: MouseEvent) => {
    e.preventDefault();

    if (!getCookie('address')) {
      walletModal.current.show();
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
      if (!nickname) {
        infoModal.current.show();
        setDropdownOpen(false);
        return;
      }
      router.push('/mine');
    } else if (key === 'disconnect') {
      // dispatch(disconnect());
    } else if (key === 'create') {
      if (!nickname) {
        infoModal.current.show();
        setDropdownOpen(false);
        return;
      }
      createModal.current.show();
    }

    setDropdownOpen(false);
  };

  const disconnectClick = (e: any) => {
    e.stopPropagation();
    setDropdownOpen(false);
    dispatch(disconnect());
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

  const items: MenuProps['items'] = [
    {
      label: (
        <div className="connect-menu-item">
          {type.MetaMask === connectType && (
            <div className="connect-menu-info-left">
              <Image src={iconMetamask} width={24} height={24} alt="img" />
              <span>MetaMask</span>
            </div>
          )}
          {type.WalletConnect === connectType && (
            <div className="connect-menu-info-left">
              <Image src={iconWallet} width={24} height={24} alt="img" />
              <span>WalletConnect</span>
            </div>
          )}
          <div>{formatAddress(address)}</div>
        </div>
      ),
      key: 'info',
    },

    {
      label: (
        <div className="connect-menu-item">
          <Image src={iconAdd} width={25} height={25} alt="img" />
          <span style={{ marginLeft: 20 }}>
            {formatMessage({ id: 'home.create' })}
          </span>
        </div>
      ),
      key: 'create',
    },

    {
      label: (
        <div className="connect-menu-item">
          <Image src={iconAdd} width={25} height={25} alt="img" />
          <span style={{ marginLeft: 20 }}>
            {formatMessage({ id: 'home.my' })}
          </span>
        </div>
      ),
      key: 'mine',
    },
    // {
    //   type: 'divider',
    // },
    {
      label: (
        <div className="connect-menu-item">
          <Button
            style={{ width: '100%', height: 46 }}
            type="primary"
            onClick={disconnectClick}
          >
            Disconnect Wallet
          </Button>
        </div>
      ),
      key: 'disconnect',
    },
  ];

  return (
    <div className="wrap">
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        trigger={['click']}
        open={isDropdownOpen}
        onOpenChange={handleOpenChange}
        overlayClassName="connect-menu"
        // overlayStyle={{ background: '#F9FAFF' }}
      >
        <div className="dropdown-trigger" onClick={handleDropdownClick}>
          {image ? (
            // <Img
            //   style={{ borderRadius: '50%' }}
            //   src={image}
            //   width={32}
            //   height={32}
            //   preview={false}
            //   alt="avatar"
            // />
            <Avatar size={32} src={image} style={{ backgroundColor: '#fff' }} />
          ) : (
            <Image src={iconUser} alt="user" width={32} height={32} />
          )}
          <span className="dropdown-trigger-content">
            {address ? (
              <div className="label">
                <span>{formatAddress(address)}</span>
                <span>{ETH_CHAINS_INFO[chainId]?.name}</span>
              </div>
            ) : (
              formatMessage({ id: 'home.connectWallet' })
            )}
          </span>
          <DownOutlined />
        </div>
      </Dropdown>

      <WalletModal ref={walletModal} />
      <CreateModal ref={createModal} />
      <InfoModal ref={infoModal} />

      <style jsx>
        {`
          .dropdown-trigger {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 200px;
            height: 46px;
            padding: 0 12px 0 7px;
            color: #3e4954;
            font-size: 14px;
            background: #f9faff;
            border-radius: 23px;
            cursor: pointer;
          }

          .dropdown-trigger-content {
            flex: 1;
            padding-left: 10px;
          }

          .dropdown-trigger-content .label {
            display: flex;
            flex-direction: column;
            padding: 0 13px 0 4px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3e4954;
            line-height: 21px;
          }
        `}
      </style>
    </div>
  );
};

export default Menu;
