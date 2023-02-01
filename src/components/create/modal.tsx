import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { Modal } from 'antd';
import styles from './modal.module.css';

import { useAppDispatch } from '@/store/hooks';
import { connectWallet } from '@/store/features/walletSlice';

import { connectType } from '@/config/enum';

import iconMetamask from '/public/images/icon-metamask.png';
import iconWallet from '/public/images/icon-wallet.png';

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
    <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className={styles.connect}>
        <h1>Welcome to SmartDAO Launch</h1>
        <h2>Create your own DAO in a few minutes!</h2>
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
  );
};

export default forwardRef(ConnectModal);
