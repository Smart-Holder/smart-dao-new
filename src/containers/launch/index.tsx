import { useAppSelector } from '@/store/hooks';
import { getMakeDAOStorage } from '@/utils/launch';
import { Avatar, Space } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import icon1 from '/public/images/dashboard/mine/home-icon-1.png';
import icon2 from '/public/images/dashboard/mine/home-icon-2.png';
import icon3 from '/public/images/dashboard/mine/home-icon-3.png';
import icon4 from '/public/images/dashboard/mine/home-icon-4.png';

const App = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const [cacheDAO, setCacheDAO] = useState() as any;

  const { chainId, address } = useAppSelector((store) => store.wallet);

  useEffect(() => {
    const dao = getMakeDAOStorage('start');

    if (dao) {
      setCacheDAO(dao);
    } else {
      router.replace('/');
    }
  }, [chainId, address]);

  if (!cacheDAO) {
    return null;
  }

  return (
    <div className="wrap">
      <div className="top">
        <Avatar
          size={165}
          src={cacheDAO.image}
          style={{ backgroundColor: '#fff', marginRight: 26 }}
        />
        <div>
          <div className="name">{cacheDAO.name}</div>
          <div className="total">
            {formatMessage({ id: 'my.summary.total.member' })}:
            <span>{cacheDAO.members.length}</span>
          </div>
          <Space size={82}>
            <div className="top-item">
              <span className="num">0</span>
              <span>{formatMessage({ id: 'my.summary.total.proposal' })}</span>
            </div>
            <div className="top-item">
              <span className="num">0</span>
              <span>{formatMessage({ id: 'my.summary.total.voting' })}</span>
            </div>
            <div className="top-item">
              <span className="num">0</span>
              <span>{formatMessage({ id: 'my.summary.total.complete' })}</span>
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
              <span className="num">0 ETH</span>
              <span>
                {formatMessage({ id: 'my.summary.total.assetAmount' })}
              </span>
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
              <span className="num">0</span>
              <span>{formatMessage({ id: 'my.summary.total.asset' })}</span>
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
              <span className="num">0</span>
              <span>{formatMessage({ id: 'my.summary.total.order' })}</span>
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
              <span className="num">0 ETH</span>
              <span>{formatMessage({ id: 'my.summary.total.income' })}</span>
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
