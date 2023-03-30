import React, { useState, MouseEvent, useEffect, useRef } from 'react';
import { Dropdown, Image, Avatar, Button } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
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

import iconAdd from '/public/images/icon-add.png';

import { useIntl } from 'react-intl';
import EllipsisMiddle from '../typography/ellipsisMiddle';

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
      dispatch(disconnect());
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

  const handleMenuTopClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  // const disconnectClick = (e: any) => {
  //   e.stopPropagation();
  //   setDropdownOpen(false);
  //   dispatch(disconnect());
  // };

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
        <div className="connect-menu-top" onClick={handleMenuTopClick}>
          <div className="connect-menu-top-item">
            <span className="label">{formatMessage({ id: 'network' })}</span>
            <span className="connect-type">
              {ETH_CHAINS_INFO[chainId]?.name}
            </span>
          </div>
          <div className="connect-menu-top-item" style={{ marginTop: 32 }}>
            <span className="label">{formatMessage({ id: 'wallet' })}</span>

            {type.MetaMask === connectType && (
              <div className="connect-menu-wallet">
                <Image
                  src="/images/wallet/icon-metamask@2x.png"
                  width={57}
                  height={57}
                  alt="metamask"
                  preview={false}
                />
                <span style={{ marginTop: 5 }}>MetaMask</span>
              </div>
            )}
            {type.WalletConnect === connectType && (
              <div className="connect-menu-wallet">
                <Image
                  src="/images/wallet/icon-wallet@2x.png"
                  width={57}
                  height={57}
                  alt="wallet"
                  preview={false}
                />
                <span style={{ marginTop: 5 }}>WalletConnect</span>
              </div>
            )}
          </div>

          <div className="connect-menu-top-item" style={{ marginTop: 20 }}>
            {/* {formatAddress(address, 14)} */}
            <EllipsisMiddle style={{ width: 200 }} suffixCount={4} copyable>
              {address}
            </EllipsisMiddle>
          </div>
        </div>
      ),
      key: 'info',
    },
    {
      label: (
        <div className="connect-menu-item">
          <Image
            src="/images/header/icon_dropdown_add_dao@2x.png"
            width={20}
            height={20}
            alt=""
            preview={false}
          />
          <span style={{ marginLeft: 16 }}>
            {formatMessage({ id: 'home.create' })}
          </span>
        </div>
      ),
      key: 'create',
    },

    {
      label: (
        <div className="connect-menu-item">
          <Image
            src="/images/header/icon_dropdown_profile@2x.png"
            width={20}
            height={20}
            alt=""
            preview={false}
          />
          <span style={{ marginLeft: 16 }}>
            {formatMessage({ id: 'home.my' })}
          </span>
        </div>
      ),
      key: 'mine',
    },
    {
      label: (
        <div className="connect-menu-item">
          <Image
            src="/images/header/icon_dropdown_disconnect@2x.png"
            width={20}
            height={20}
            alt=""
            preview={false}
          />
          <span style={{ marginLeft: 16 }}>
            {formatMessage({ id: 'home.disconnectWallet' })}
          </span>
        </div>
      ),
      key: 'disconnect',
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        trigger={['click']}
        open={isDropdownOpen}
        onOpenChange={handleOpenChange}
        overlayClassName="connect-menu"
      >
        <div className="dropdown-trigger" onClick={handleDropdownClick}>
          {address && image ? (
            <Avatar size={34} src={image} />
          ) : (
            <Avatar
              size={34}
              src="/images/header/img_circle_no_avatar@2x.png"
            />
          )}

          <style jsx>
            {`
              .dropdown-trigger {
                height: 34px;
                line-height: 0;
                cursor: pointer;
              }
            `}
          </style>
        </div>
      </Dropdown>

      <WalletModal ref={walletModal} />
      <CreateModal ref={createModal} />
      <InfoModal ref={infoModal} />
    </>
  );
};

export default Menu;
