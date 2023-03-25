import { useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Button, Col, Row, Image } from 'antd';
import { useIntl } from 'react-intl';

import WalletModal from '@/components/modal/walletModal';

const App = () => {
  const { formatMessage } = useIntl();

  const { address } = useAppSelector((store) => store.wallet);

  const walletModal: any = useRef(null);

  const showWalletModal = () => {
    walletModal.current.show();
  };

  return (
    <>
      <Row style={{ marginTop: 89 }} align="middle">
        <Col span={8} offset={2}>
          <div className="left">
            <div className="h1">{formatMessage({ id: 'home.intro.h1' })}</div>
            <div className="h2">{formatMessage({ id: 'home.intro.h2' })}</div>
            {!address && (
              <Button
                type="primary"
                className="button-connect-home"
                onClick={showWalletModal}
              >
                {formatMessage({ id: 'home.connectWallet' })}
              </Button>
            )}
          </div>
        </Col>
        <Col span={12}>
          <Image
            src="/images/home/img_home_banner@2x.png"
            width="100%"
            height="auto"
            preview={false}
            alt="banner"
          />
        </Col>
      </Row>

      <WalletModal ref={walletModal} />

      <style jsx>
        {`
          .h1 {
            font-size: 80px;
            font-family: SFUIDisplay-Bold;
            font-weight: bold;
            color: #000000;
            line-height: 81px;
          }

          .h2 {
            margin-top: 25px;
            font-size: 28px;
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            color: #323232;
            line-height: 40px;
          }

          .left :global(.button-connect-home) {
            width: 238px;
            height: 58px;
            margin-top: 44px;

            font-size: 20px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            line-height: 32px;

            background: #2c2c2c;
            border-radius: 5px;
          }
        `}
      </style>
    </>
  );
};

export default App;
