import React, {
  useState,
  useMemo,
  useCallback,
  MouseEvent,
  useEffect,
} from 'react';
import Image from 'next/image';
import { Layout, theme, Button, Dropdown, Space, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';
import styles from './header.module.css';
import { connectType } from '@/config/enum';
import { getCookie } from '@/utils/cookie';
import { formatAddress } from '@/utils';

// 引入对应的方法
// import { increment, decrement } from '@/store/features/counterSlice';
// import { getMovieData } from '@/store/features/movieSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { connectWallet, disconnect } from '@/store/features/walletSlice';

import iconMetamask from '/public/images/icon-metamask.png';
import iconWallet from '/public/images/icon-wallet.png';

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

const Header = () => {
  // 通过useSelector直接拿到store中定义的value
  const { address } = useAppSelector((store) => store.wallet);
  // const address = getCookie('address');

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 通过useDispatch 派发事件
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleDropdownClick = (e: MouseEvent) => {
    e.preventDefault();

    if (!getCookie('address')) {
      setIsModalOpen(true);
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
    }

    setDropdownOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleMetaMask = () => {
    dispatch(connectWallet(connectType.MetaMask));
    handleCancel();
  };

  const handleWallet = () => {
    dispatch(connectWallet(connectType.WalletConnect));
    handleCancel();
  };

  // useEffect(() => {
  //   if (address) {
  //     handleCancel();
  //   }
  // }, [address]);

  return (
    <div className={styles.layout}>
      <Layout.Header className={styles.header}>
        <div className={styles.left}>
          <div className={styles.logo} />
          <span className={styles.name}>SmartDAO</span>
        </div>
        <div className={styles.right}>
          <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={['click']}
            open={isDropdownOpen}
            onOpenChange={handleOpenChange}
          >
            <a onClick={handleDropdownClick}>
              <Space>
                {address ? formatAddress(address) : 'Connect Wallet'}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </Layout.Header>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div className={styles.connect}>
          <h1>Select Wallet</h1>
          <div className={styles.buttons}>
            <div className={styles.button} onClick={handleMetaMask}>
              <Image src={iconMetamask} alt="metamask" />
              <p>MetaMask</p>
            </div>
            <div className={styles.button} onClick={handleWallet}>
              <Image src={iconWallet} alt="wallet" />
              <p>Wallet Connect</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
