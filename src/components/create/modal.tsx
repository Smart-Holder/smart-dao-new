import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button, Modal, Typography } from 'antd';
import styles from './modal.module.css';
import Icon, { RightCircleOutlined } from '@ant-design/icons';

import { useAppDispatch } from '@/store/hooks';
import { connectWallet } from '@/store/features/walletSlice';

import { connectType } from '@/config/enum';

import iconMetamask from '/public/images/icon-metamask.png';
import iconWallet from '/public/images/icon-wallet.png';

const { Link } = Typography;

const ConnectModal = (props: any, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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

  const handleClick = () => {
    setIsModalOpen(false);
    router.push('/basic');
  };

  return (
    <Modal width={512} open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className={styles.connect}>
        <div className={styles.h1}>Welcome to SmartDAO Launch</div>
        <div className={styles.h2}>Create your own DAO in a few minutes!</div>

        <Button
          type="primary"
          shape="round"
          className={styles.button}
          onClick={handleClick}
        >
          <div className={styles['button-content']}>
            <div className={styles['button-content-left']}>
              <span>Create an DAO</span>
              <span>Start your DAO with SmartDAO launch</span>
            </div>
            <RightCircleOutlined style={{ fontSize: 40 }} />
          </div>
        </Button>
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
