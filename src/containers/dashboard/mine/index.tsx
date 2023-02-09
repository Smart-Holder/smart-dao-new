import sdk from 'hcstore/sdk';
import { Avatar, Space } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import icon1 from '/public/images/dashboard/mine/home-icon-1.png';
import icon2 from '/public/images/dashboard/mine/home-icon-2.png';
import icon3 from '/public/images/dashboard/mine/home-icon-3.png';
import icon4 from '/public/images/dashboard/mine/home-icon-4.png';

const App = () => {
  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const img =
    'data:image/png;base64,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';

  const { chainId } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const [DAOInfo, setDAOInfo] = useState() as any;

  useEffect(() => {
    const getData = async () => {
      const res = await sdk.dao.methods.getDAOSummarys({
        chain: chainId,
        host: currentDAO.host,
      });
      console.log('members', res);
      setDAOInfo(res);
      // try {
      // } catch (error) {
      //   console.error(error);
      // }
    };

    getData();
  }, []);

  if (!DAOInfo) {
    return null;
  }

  return (
    <div className="wrap">
      <div className="top">
        <Avatar
          size={165}
          src={currentMember.image || img}
          style={{ backgroundColor: '#fff', marginRight: 26 }}
        />
        <div>
          <div className="name">{currentDAO.name}</div>
          <div className="total">
            成员数: <span>{DAOInfo.membersTotal}</span>
          </div>
          <Space size={82}>
            <div className="top-item">
              <span className="num">{DAOInfo.voteProposalTotal}</span>
              <span>提案总数</span>
            </div>
            <div className="top-item">
              <span className="num">{DAOInfo.voteProposalPendingTotal}</span>
              <span>正在填投票数</span>
            </div>
            <div className="top-item">
              <span className="num">{DAOInfo.voteProposalResolveTotal}</span>
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
              <span className="num">{DAOInfo.assetAmountTotal} ETH</span>
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
              <span className="num">{DAOInfo.assetTotal}</span>
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
              <span className="num">{DAOInfo.assetOrderTotal}</span>
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
              <span className="num">{DAOInfo.assetLedgerIncomeTotal} ETH</span>
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
