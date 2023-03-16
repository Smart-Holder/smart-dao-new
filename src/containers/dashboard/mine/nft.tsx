import { formatAddress, fromToken } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Image, Space, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const testImage =
  'https://smart-dao-res.stars-mine.com/FvCDcP23jHCCRbAJY_x3yK0c7vSx';

const App = ({ data }: { data: any }) => {
  return (
    <div className="item">
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
          <Avatar size={28} icon={<UserOutlined />} />
          {formatAddress(data.owner)}
        </Space>
      </div>

      <div className="bottom">
        <div className="left">
          <span className="label">Current Bid</span>
          <span className="value">
            {fromToken(Math.max(data.minimumPrice, data.sellPrice))} ETH
          </span>
        </div>
        <div className="right">
          <span className="label">Ends in</span>
          <span className="value">11 : 03 : 35 </span>
        </div>
      </div>

      <style jsx>
        {`
          .item {
            box-sizing: border-box;
            width: 310px;
            padding: 15px 15px 20px;
            background: #ffffff;
            box-shadow: 0px 1px 5px 0px rgba(167, 167, 167, 0.5);
            border-radius: 8px;
          }

          .item :global(.image) {
            width: 280px;
            height: 280px;
            object-fit: cover;
            border-radius: 2px;
          }

          .name {
            height: 22px;
            margin-top: 16px;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #232323;
            line-height: 22px;
          }

          .name :global(.paragraph) {
            margin-bottom: 0;
          }

          .owner {
            margin-top: 12px;
            font-size: 12px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #6d6d6d;
            line-height: 24px;
          }

          .bottom {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
          }

          .left,
          .right {
            display: flex;
            flex-direction: column;
          }

          .label {
            font-size: 10px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #b1b1b1;
            line-height: 24px;
          }

          .value {
            font-size: 15px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #232323;
            line-height: 21px;
          }

          @media screen and (max-width: 1440px) {
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
