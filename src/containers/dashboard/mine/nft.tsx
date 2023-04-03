import EllipsisMiddle from '@/components/typography/ellipsisMiddle';
import { useAppSelector } from '@/store/hooks';
import { formatAddress, fromToken } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Image, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

const { Paragraph, Text } = Typography;

const App = ({ data }: { data: any }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const { currentDAO } = useAppSelector((store) => store.dao);

  const properties = data?.properties || [];

  const priceObj = properties.find((item: any) => item.price) || {};
  const ownerObj = properties.find((item: any) => item.owner);

  const handleClick = () => {
    localStorage.setItem('asset', JSON.stringify(data));
    router.push(`/dashboard/mine/assets/detail?id=${data.id}`);
  };

  return (
    <div className="item" onClick={handleClick}>
      <Image
        className="image"
        src={data.imageOrigin}
        preview={false}
        alt="image"
      />
      <div className="name">
        <Paragraph ellipsis className="paragraph">
          {data.name}
        </Paragraph>
      </div>

      <div className="owner">
        <Space size={6}>
          <Avatar
            style={{ borderColor: '#f5f5f5' }}
            size={26}
            src={currentDAO.image}
            shape="square"
          />
          {/* {formatAddress(data.owner)} */}
          {currentDAO.name}
        </Space>
      </div>

      <div className="bottom">
        <div className="left">
          <span className="label">
            {formatMessage({ id: 'financial.asset.price' })}
          </span>

          <span className="value" style={{ marginLeft: 12 }}>
            <Image
              src="/images/market/icon_nft_card_unit_eth_default@2x.png"
              width={20}
              height={20}
              preview={false}
              alt=""
            />
            {fromToken(Math.max(data.minimumPrice, priceObj.price || 0))} ETH
          </span>
        </div>
        {/* <div className="right">
          <span className="label">Ends in</span>
          <span className="value">11 : 03 : 35 </span>
        </div> */}
      </div>

      <style jsx>
        {`
          .item {
            box-sizing: border-box;
            width: 310px;
            width: 100%;
            padding: 15px 15px 20px;
            background: #ffffff;
            box-shadow: 0px 1px 5px 0px rgba(167, 167, 167, 0.5);
            border-radius: 8px;
            cursor: pointer;
          }

          .item :global(.ant-image) {
            width: 100%;
          }

          .item :global(.image) {
            width: 280px;
            width: 100%;
            height: 280px;
            object-fit: cover;
            border-radius: 2px;
          }

          .name {
            height: 19px;
            margin-top: 20px;
            font-size: 16px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #2c2c2c;
            line-height: 19px;
          }

          .name :global(.paragraph) {
            height: 19px;
            margin-bottom: 0;
            font-size: 16px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #2c2c2c;
            line-height: 19px;
          }

          .owner {
            margin-top: 12px;
            font-size: 12px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #818181;
            line-height: 24px;
          }

          .owner :global(.ant-typography) {
            font-size: 12px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #818181;
            line-height: 24px;
          }

          .bottom {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
          }

          .left {
            display: flex;
            align-items: center;
          }

          .right {
            display: flex;
            flex-direction: column;
          }

          .label {
            font-size: 12px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #b1b1b1;
            line-height: 24px;
          }

          .value {
            display: flex;
            align-items: center;
            font-size: 15px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #232323;
            line-height: 20px;
          }

          @media screen and (max-width: 1280px) {
            .item {
              width: 230px;
            }

            .item :global(.image) {
              width: 200px;
              height: 200px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default App;
