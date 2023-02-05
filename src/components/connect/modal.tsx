import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import Image from 'next/image';
import { Modal, Space, Button, Typography } from 'antd';
import styles from './connect.module.css';

import { useAppDispatch } from '@/store/hooks';
import { connectWallet } from '@/store/features/walletSlice';

import { connectType } from '@/config/enum';

import iconMetamask from '/public/images/icon-metamask.png';
import iconWallet from '/public/images/icon-wallet.png';

const { Link } = Typography;

const ConnectModal = (props: any, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 通过useDispatch 派发事件
  const dispatch = useAppDispatch();

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalOpen(true);
    },
  }));

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

  return (
    <Modal width={512} open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className={styles.connect}>
        <div className={styles.h1}>
          <span>Select Network</span>
        </div>
        <Space size={30} className={styles.types}>
          <Button shape="round">Ethereum</Button>
          <Button shape="round">Goerli</Button>
        </Space>

        <div className={styles.h1}>
          <span>Select Wallet</span>
        </div>
        <div className={styles.buttons}>
          <div className={styles.button} onClick={handleMetaMask}>
            <Image src={iconMetamask} width={76} height={75} alt="metamask" />
            <div style={{ marginTop: 7 }}>MetaMask</div>
          </div>
          <div className={styles.button} onClick={handleWallet}>
            <Image src={iconWallet} width={76} height={75} alt="wallet" />
            <div style={{ marginTop: 7 }}>Wallet Connect</div>
          </div>
        </div>

        <div className={styles.footer}>
          <Link
            href="https://smartdao.gitbook.io/smartdao/guides/shu-zi-qian-bao-cha-jian-zhun-bei"
            target="_blank"
          >
            Don&apos;t have an account?
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef(ConnectModal);
