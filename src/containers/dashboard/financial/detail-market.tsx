import { useState } from 'react';
import { Avatar, Button, Image, message, Space } from 'antd';
import { useIntl } from 'react-intl';
import { Market } from '@/config/chains';
import { fromToken } from '@/utils';
import { revoke } from '@/api/asset';
import { useRouter } from 'next/router';

const App = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const storageData = JSON.parse(localStorage.getItem('asset') || '{}') || {};

  const list = [
    {
      name: 'Opensea',
      image: Market.Opensea.image,
    },
  ];

  // 下架
  const onRevoke = async () => {
    try {
      setLoading(true);
      await revoke(storageData.token, storageData.tokenId);
      setLoading(false);
      message.success('Success');
      router.replace('/dashboard/mine/assets');
      // fetch data and set storageData
    } catch (error: any) {
      setLoading(false);
      // console.error(error);
      // message.error(error?.message);
    }
  };

  return (
    <div className="market">
      <div className="title">
        {formatMessage({ id: 'financial.asset.listing' })}
      </div>
      <div className="market-list">
        {list.map((item) => (
          <div className="market-item" key={item.name}>
            {/* <Space size={10}>
              <Avatar size={40} src={item.image} />
              <span>{item.name}</span>
            </Space> */}
            <Image
              src="/images/dashboard/asset/img_logo_exchange_opensea@2x.png"
              width={160}
              height={38}
              preview={false}
              alt=""
            />
            <div className="market-item-center">
              {Math.max(
                fromToken(storageData.minimumPrice),
                fromToken(storageData.sellPrice || 0),
              )}{' '}
              ETH
            </div>
            <div className="market-item-bottom">
              <Button
                className="smart-button"
                type="primary"
                ghost
                onClick={onRevoke}
                loading={loading}
              >
                {formatMessage({ id: 'revoke' })}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <style jsx>
        {`
          .market {
            margin-top: 80px;
          }
          .market .title {
            height: 45px;
            font-size: 32px;
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 45px;
          }

          .market-list {
            display: flex;
            margin-top: 40px;
          }

          .market-item {
            padding: 40px 54px 28px;
            text-align: center;
            border: 2px solid #f5f5f5;
            border-radius: 14px;
          }

          .market-item-center {
            margin-top: 20px;
            font-size: 16px;
            font-family: SFUIText-Semibold, SFUIText;
            font-weight: 600;
            color: #2c2c2c;
            line-height: 21px;
          }

          .market-item-bottom {
            margin-top: 24px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
