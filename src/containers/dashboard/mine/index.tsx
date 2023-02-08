import sdk from 'hcstore/sdk';
import { Avatar, Space } from 'antd';
import Image from 'next/image';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import icon1 from '/public/images/dashboard/mine/home-icon-1.png';
import icon2 from '/public/images/dashboard/mine/home-icon-2.png';
import icon3 from '/public/images/dashboard/mine/home-icon-3.png';
import icon4 from '/public/images/dashboard/mine/home-icon-4.png';

const App = () => {
  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const { chainId } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await sdk.dao.methods.getDAOSummarys({
          chain: chainId,
          host: currentMember.host,
        });
        console.log('members', res);
      } catch (error) {
        console.error(error);
      }
    };

    console.log('-----', currentMember);

    if (currentMember.host) {
      getData();
    }
  }, [currentMember]);

  return (
    <div className="wrap">
      <div className="top">
        <Avatar
          size={165}
          src={url}
          style={{ backgroundColor: '#fff', marginRight: 26 }}
        />
        <div>
          <div className="name">James Witwitcky</div>
          <div className="total">
            成员数: <span>10</span>
          </div>
          <Space size={82}>
            <div className="top-item">
              <span className="num">100</span>
              <span>提案总数</span>
            </div>
            <div className="top-item">
              <span className="num">100</span>
              <span>正在填投票数</span>
            </div>
            <div className="top-item">
              <span className="num">100</span>
              <span>已完结投票数</span>
            </div>
          </Space>
        </div>
      </div>

      <div className="bottom">
        <Space size={[39, 46]} wrap>
          <div className="bottom-item">
            <Image
              style={{ marginRight: 28 }}
              src={icon1}
              width={84}
              height={84}
              alt="img"
            />
            <div className="bottom-item-right">
              <span className="num">100 ETH</span>
              <span>资产总价值</span>
            </div>
          </div>
          <div className="bottom-item">
            <Image
              style={{ marginRight: 28 }}
              src={icon2}
              width={84}
              height={84}
              alt="img"
            />
            <div className="bottom-item-right">
              <span className="num">100</span>
              <span>资产总数</span>
            </div>
          </div>
          <div className="bottom-item">
            <Image
              style={{ marginRight: 28 }}
              src={icon3}
              width={84}
              height={84}
              alt="img"
            />
            <div className="bottom-item-right">
              <span className="num">100</span>
              <span>订单总数</span>
            </div>
          </div>
          <div className="bottom-item">
            <Image
              style={{ marginRight: 28 }}
              src={icon4}
              width={84}
              height={84}
              alt="img"
            />
            <div className="bottom-item-right">
              <span className="num">100 ETH</span>
              <span>总收入</span>
            </div>
          </div>
        </Space>
      </div>

      <style jsx>
        {`
          .top {
            display: flex;
          }

          .top .name {
            height: 27px;
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #3c4369;
            line-height: 27px;
          }

          .top .total {
            margin-top: 14px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #393939;
            line-height: 18px;
          }

          .top .total span {
            margin-left: 4px;
            color: #546ff6;
            font-size: 30px;
            line-height: 30px;
            font-weight: bold;
          }

          .top-item {
            display: flex;
            flex-direction: column;
            margin-top: 24px;
          }

          .top-item span {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3e4954;
            line-height: 24px;
          }

          .top-item .num {
            font-size: 40px;
            font-family: AppleSystemUIFont;
            color: #0e0e0e;
            line-height: 50px;
          }

          .bottom {
            width: 720px;
            margin-top: 70px;
          }

          .bottom-item {
            display: flex;
            box-sizing: border-box;
            width: 339px;
            height: 168px;
            padding: 51px 10px 33px 30px;
            background: #ffffff;
            box-shadow: 0px 12px 23px 0px rgba(62, 73, 84, 0.04);
          }

          .bottom-item .bottom-item-right {
            display: flex;
            flex-direction: column;
          }

          .bottom-item span {
            height: 24px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3e4954;
            line-height: 24px;
          }

          .bottom-item .num {
            height: 55px;
            font-size: 40px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #0e0e0e;
            line-height: 55px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
