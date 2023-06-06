import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Space, Button, Typography, Image } from 'antd';

import Modal from '@/components/modal';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { connectWallet } from '@/store/features/walletSlice';

import { connectType as types } from '@/config/enum';

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

  const [active, setActive] = useState(chainData?.name || 'Ethereum');

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
    // if (!isSupportChain) {
    //   Modal.warning({
    //     title: 'Supported networks: Ethereum, Goerli',
    //   });

    //   handleCancel();

    //   return;
    // }

    if (!window.ethereum) {
      Modal.warning({
        title: 'Please install MetaMask!',
        onOk: () => {
          window.open('https://metamask.io/download/');
        },
      });
    }

    dispatch(connectWallet(types.MetaMask));
    handleCancel();
  };

  const handleWallet = () => {
    dispatch(connectWallet(types.WalletConnect));
    handleCancel();
  };

  return (
    <Modal open={isModalOpen} onCancel={handleCancel}>
      <div className="wallet">
        <div className="title">
          {/* <span>{formatMessage({ id: 'home.selectNetwork' })}</span> */}
        </div>

        {/* <Space size={30} className="types">
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
        </Space> */}

        <div className="title" style={{ marginTop: 64 }}>
          <span>{formatMessage({ id: 'home.selectWallet' })}</span>
        </div>

        <div className="buttons">
          <div className="button" onClick={handleMetaMask}>
            <Image
              src="/images/wallet/icon-metamask@2x.png"
              width={76}
              height={75}
              alt="metamask"
              preview={false}
            />
            <div style={{ marginTop: 7 }}>MetaMask</div>
          </div>
          <div className="button" onClick={handleWallet}>
            <Image
              src="/images/wallet/icon-wallet@2x.png"
              width={76}
              height={75}
              alt="wallet"
              preview={false}
            />
            <div style={{ marginTop: 7 }}>Wallet Connect</div>
          </div>
        </div>

        <div className="footer">
          <Link
            style={{ color: '#818181' }}
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

          .wallet .title {
            height: 26px;
            font-size: 22px;
            font-weight: 600;
            color: #2c2c2c;
            line-height: 26px;
          }

          .wallet :global(.types) {
            margin-top: 50px;
          }

          .wallet :global(.types button) {
            width: 120px;
            height: 48px;
            font-size: 16px;

            color: #3c4369;
            background-color: #f9faff;
            border: 0;
          }

          .wallet :global(.types .active) {
            background: #000;
            color: #fff;
          }

          .wallet .buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 15px;
            text-align: center;
          }

          .wallet .buttons :global(.button) {
            display: inline-block;
            width: 180px;
            height: 120px;
            padding: 15px;

            font-size: 18px;
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
