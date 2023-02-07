import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button, Modal, Typography } from 'antd';
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
    router.push('/launch/start');
  };

  return (
    <Modal width={512} open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className="create-wrap">
        <div className="h1">Welcome to SmartDAO Launch</div>
        <div className="h2">Create your own DAO in a few minutes!</div>

        <Button
          type="primary"
          shape="round"
          className="button"
          onClick={handleClick}
        >
          <div className="button-content">
            <div className="button-content-left">
              <span>Create an DAO</span>
              <span>Start your DAO with SmartDAO launch</span>
            </div>
            <RightCircleOutlined style={{ fontSize: 40 }} />
          </div>
        </Button>
        <div className="footer">
          <Link
            href="https://smartdao.gitbook.io/smartdao/guides/shu-zi-qian-bao-cha-jian-zhun-bei"
            target="_blank"
          >
            Don&apos;t have an account?
          </Link>
        </div>

        <style jsx>
          {`
            .create-wrap {
              padding-top: 78px;
              text-align: center;
            }

            .create-wrap .h1 {
              height: 37px;
              font-size: 26px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #3c4369;
              line-height: 37px;
            }

            .create-wrap .h2 {
              height: 22px;
              margin-top: 14px;
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #969ba0;
              line-height: 22px;
            }

            .create-wrap :global(.button) {
              height: 88px;
              margin-top: 162px;
              padding-left: 38px;
              padding-right: 26px;
              background-color: #546ff6;
              border-radius: 44px;
            }

            .button-content {
              display: flex;
            }

            .button-content-left {
              display: flex;
              flex-direction: column;
              margin-right: 10px;
              font-size: 28px;
              font-family: HelveticaNeue-Bold, HelveticaNeue;
              font-weight: bold;
              color: #ffffff;
              line-height: 34px;
              text-align: right;
            }

            .button-content-left span:last-child {
              height: 18px;
              font-size: 12px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              line-height: 18px;
            }

            .footer {
              margin-top: 62px;
              margin-bottom: 21px;
              height: 16px;
              font-size: 14px;
              font-family: HelveticaNeue;
              color: #969ba0;
              line-height: 16px;
            }

            .footer a {
              color: #969ba0;
            }
          `}
        </style>
      </div>
    </Modal>
  );
};

export default forwardRef(ConnectModal);
