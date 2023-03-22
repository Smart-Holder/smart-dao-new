import { useState } from 'react';
import { Avatar, Button, message, Space } from 'antd';
import { useIntl } from 'react-intl';
import { Market } from '@/config/chains';
import { fromToken } from '@/utils';
import { revoke } from '@/api/asset';

const App = () => {
  const { formatMessage } = useIntl();

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
      // fetch data and set storageData
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      message.error(error?.message);
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
            <Space size={10}>
              <Avatar size={40} src={item.image} />
              <span>{item.name}</span>
            </Space>
            <div className="market-item-center">
              {Math.max(
                fromToken(storageData.minimumPrice),
                fromToken(storageData.sellPrice || 0),
              )}{' '}
              ETH
            </div>
            <div className="market-item-bottom">
              <Button type="primary" onClick={onRevoke} loading={loading}>
                {formatMessage({ id: 'revoke' })}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <style jsx>
        {`
          .market {
            margin-top: 40px;
          }
          .market .title {
            font-size: 22px;
            color: #3c4369;
            font-weight: bold;
          }

          .market-list {
            display: flex;
            margin-top: 20px;
          }

          .market-item {
            padding: 20px;
            text-align: center;
            border: 1px solid #e5e7e8;
            border-radius: 8px;
          }

          .market-item-center {
            margin-top: 20px;
          }

          .market-item-bottom {
            margin-top: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
