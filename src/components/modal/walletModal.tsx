import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import Image from 'next/image';
import { Modal, Space, Button, Typography } from 'antd';

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
      <div className="wallet">
        <div className="h1">
          <span>Select Network</span>
        </div>
        <Space size={30} className="types">
          <Button shape="round">Ethereum</Button>
          <Button shape="round">Goerli</Button>
        </Space>

        <div className="h1">
          <span>Select Wallet</span>
        </div>
        <div className="buttons">
          <div className="button" onClick={handleMetaMask}>
            <Image src={iconMetamask} width={76} height={75} alt="metamask" />
            <div style={{ marginTop: 7 }}>MetaMask</div>
          </div>
          <div className="button" onClick={handleWallet}>
            <Image src={iconWallet} width={76} height={75} alt="wallet" />
            <div style={{ marginTop: 7 }}>Wallet Connect</div>
          </div>
        </div>

        <div className="footer">
          <Link
            href="https://smartdao.gitbook.io/smartdao/guides/shu-zi-qian-bao-cha-jian-zhun-bei"
            target="_blank"
          >
            Don&apos;t have an account?
          </Link>
        </div>

        <style jsx>{`
          .wallet {
            text-align: center;
          }

          .wallet .h1 {
            margin-top: 32px;
          }

          .wallet .h1 span {
            position: relative;
            display: inline-block;
            width: 220px;
            height: 36px;
            font-size: 30px;
            font-family: HelveticaNeue-Medium, HelveticaNeue;
            font-weight: 500;
            color: #3c4369;
            line-height: 37px;
            text-align: center;
          }

          .wallet .h1 span::before {
            content: '';
            position: absolute;
            left: -81px;
            top: 18px;
            width: 68px;
            height: 1px;
            background: #696969;
          }

          .wallet .h1 span::after {
            content: '';
            position: absolute;
            right: -81px;
            top: 18px;
            width: 68px;
            height: 1px;
            background: #696969;
          }

          .wallet :global(.types) {
            margin: 31px 0 20px;
          }

          .wallet :global(.types button) {
            width: 120px;
            height: 48px;
            font-size: 16px;

            color: #3c4369;
            background-color: #f9faff;
            border: 0;
          }

          .wallet .buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 7px;
            text-align: center;
          }

          .wallet .buttons :global(.button) {
            display: inline-block;
            width: 180px;
            height: 120px;
            padding: 15px;

            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #3c4369;
            line-height: 25px;

            border-radius: 8px;
            cursor: pointer;
          }

          .footer {
            margin-top: 30px;
            margin-bottom: 14px;
            height: 16px;
            font-size: 14px;
            font-family: HelveticaNeue;
            color: #969ba0;
            line-height: 16px;
          }

          .footer a {
            color: #969ba0;
          }
        `}</style>
      </div>
    </Modal>
  );
};

export default forwardRef(ConnectModal);
