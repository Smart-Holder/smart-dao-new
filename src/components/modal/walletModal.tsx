import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { Modal, Space, Button, Typography } from 'antd';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { connectWallet } from '@/store/features/walletSlice';

import { connectType as types } from '@/config/enum';

import iconMetamask from '/public/images/icon-metamask.png';
import iconWallet from '/public/images/icon-wallet.png';

import { useIntl } from 'react-intl';
import { ETH_CHAINS_INFO } from '@/config/chains';

const { Link } = Typography;

const ConnectModal = (props: any, ref: any) => {
  const { formatMessage } = useIntl();
  const { connectType, chainId, isSupportChain } = useAppSelector(
    (store) => store.wallet,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chainData = ETH_CHAINS_INFO[chainId];

  const [active, setActive] = useState(chainData?.name);

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
    if (!isSupportChain) {
      Modal.warning({
        title: 'Supported networks: Ethereum, Goerli',
        className: 'modal-small',
      });

      handleCancel();

      return;
    }

    dispatch(connectWallet(types.MetaMask));
    handleCancel();
  };

  const handleWallet = () => {
    if (!isSupportChain) {
      Modal.warning({
        title: 'Supported networks: Ethereum, Goerli',
        className: 'modal-small',
      });

      handleCancel();

      return;
    }

    dispatch(connectWallet(types.WalletConnect));
    handleCancel();
  };

  return (
    <Modal width={512} open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className="wallet">
        <div className="h1">
          <span>{formatMessage({ id: 'home.selectNetwork' })}</span>
        </div>
        <Space size={30} className="types">
          <Button
            className={active === 'Ethereum' ? 'active' : ''}
            shape="round"
            onClick={() => {
              setActive('Ethereum');
            }}
          >
            Ethereum
          </Button>
          <Button
            className={active === 'Goerli' ? 'active' : ''}
            shape="round"
            onClick={() => {
              setActive('Goerli');
            }}
          >
            Goerli
          </Button>
        </Space>

        <div className="h1">
          <span>{formatMessage({ id: 'home.selectWallet' })}</span>
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
            {formatMessage({ id: 'home.noAccount' })}
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

          .wallet :global(.types .active) {
            background: #546ff6;
            color: #fff;
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
