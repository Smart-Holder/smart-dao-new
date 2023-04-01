import React, { useRef, MouseEvent } from 'react';
import { Typography, Image, Button, Avatar, Space } from 'antd';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import InfoModal from '@/components/modal/infoModal';
import { useJoin, useFollow } from '../home/useHooks';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentDAO, setDAOType } from '@/store/features/daoSlice';

import WalletModal from '@/components/modal/walletModal';
import { UserOutlined } from '@ant-design/icons';
import { DAOType } from '@/config/enum';

const { Paragraph } = Typography;

const DAOItem = (props: any) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data } = props;

  const { address, chainId } = useAppSelector((store) => store.wallet);
  const { nickname } = useAppSelector((store) => store.user.userInfo);
  const { isInit } = useAppSelector((store) => store.common);
  const { DAOList } = useAppSelector((store) => store.dao);

  // const [loading, setLoading] = useState(false);

  const infoModal: any = useRef(null);
  const walletModal: any = useRef(null);

  const img =
    'data:image/png;base64,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';

  const handleClick = () => {
    dispatch(setDAOType(DAOType.Cache));
    router.push('/launch/setting');
  };

  return (
    <div className="item">
      <div className="glass"></div>

      <div className="item-content" onClick={handleClick}>
        <div style={{ textAlign: 'right' }}></div>

        <div className="footer">
          <Paragraph
            className="name"
            style={{ width: 386 }}
            ellipsis={{ rows: 2 }}
          >
            {data.name}
          </Paragraph>

          <div className="bottom">
            <Avatar.Group>
              {data?.members.map((item: any, index: number) => {
                if (item?.image) {
                  return <Avatar size={42} src={item.image} key={index} />;
                }

                return (
                  <Avatar
                    size={42}
                    style={{ backgroundColor: '#000' }}
                    icon={<UserOutlined />}
                    key={index}
                  />
                );
              })}
            </Avatar.Group>
            <span className="total">
              {formatMessage(
                { id: 'home.total.member' },
                { value: data?.members?.length || 1 },
              )}
            </span>

            <div style={{ width: 190 }}></div>
          </div>
        </div>
      </div>

      <InfoModal ref={infoModal} />
      <WalletModal ref={walletModal} />

      {/* background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0.16) 100%
            ); */}

      {/* background: url(${props.data.image || img}) no-repeat center,
              url('/public/images/home/img_home_card_dao_gradient.png')
                no-repeat center; */}

      {/* background: url('/images/home/img_home_card_dao_gradient.png')
                no-repeat center,
              url(${props.data.image || img}) no-repeat center;
            background-size: cover;
            backdrop-filter: blur(10px); */}

      {/* .item {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            width: 632px;
            height: 388px;
            padding: 32px 30px 26px;

            background: url('/images/home/img_home_card_dao_gradient.png')
                no-repeat center,
              url(${props.data.image || img}) no-repeat center;
            background-size: cover;
            border-radius: 16px;
          }

          .item::before {
            content: '';
            position: absolute;
            top: 238px;
            left: 0;

            width: 632px;
            height: 150px;

            background-image: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0),
              rgba(255, 255, 255, 0.5)
            );
            filter: blur(2px);
          } */}

      {/* 
.item {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            width: 632px;
            height: 388px;
            overflow: hidden;

            background: url('/images/home/img_home_card_dao_gradient.png')
                no-repeat center,
              url(${props.data.image || img}) no-repeat center;
            background-size: cover;
            border-radius: 16px;
          }

          .glass {
            position: absolute;
            top: 238px;
            left: 0;
            z-index: 2;
            box-sizing: border-box;
            width: 632px;
            height: 150px;
            padding: 0 30px 26px;

            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
          }

          .glass::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            z-index: -3;
            margin: -30px;
            background: url(${props.data.image || img}) no-repeat center;
            background-size: cover;
            filter: blur(20px);
          } */}

      <style jsx>
        {`
          .item {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            width: 100%;
            height: 388px;
            overflow: hidden;

            background: url('/images/home/img_home_card_dao_gradient@2x.png')
                no-repeat center,
              url(${props.data.image || img}) no-repeat bottom;
            background-size: cover;
            border-radius: 16px;

            cursor: pointer;
          }

          .gradient {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            height: 100%;
          }

          .glass {
            position: absolute;
            left: 0;
            right: 0;
            top: 238px;
            bottom: 0;
            display: flex;
            margin: -10px;
            box-sizing: border-box;
            background: inherit;
            filter: blur(10px);

             {
              /* background: url('/images/home/img_home_card_dao_gradient.png')
                no-repeat center,
              url(${props.data.image || img}) no-repeat center;
            background-size: cover;
            clip-path: inset(238px 0 0 0);

            border-radius: 16px; */
            }
          }

           {
            /* .glass::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: -20px;
            background: linear-gradient(
              rgba(255, 255, 255, 0),
              rgba(255, 255, 255, 0) 75%,
              rgba(243, 243, 243, 0.3) 85%,
              rgba(255, 255, 255, 0.3) 100%
            );
            filter: blur(4px);
          } */
          }

          .item-content {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 32px 30px 26px;
          }

          .item-content :global(.button-follow) {
            width: 132px;
            height: 32px;

            font-size: 16px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #ffffff;
            line-height: 18px;

            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;

            box-shadow: none;
          }

          .item :global(.name) {
            font-size: 32px;
            font-family: SFUIDisplay-Bold;
            font-weight: bold;
            color: #ffffff;
            line-height: 39px;
          }

          .bottom {
            display: flex;
            justify-content: space-between;
            margin-top: 28px;
          }

          .total {
            margin-left: 36px;
            width: 102px;
            height: 36px;
            font-size: 16px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #ffffff;
            line-height: 36px;
          }

          .bottom :global(.button-join) {
            width: 190px;
            height: 46px;
            font-size: 17px;
            font-family: SFUIText-Bold;
            font-weight: bold;
            color: #ffffff;
            line-height: 26px;
            border-radius: 4px;
            border: 1px solid #ffffff;
          }

          .bottom :global(.ant-avatar) {
            border: 0;
          }

          .buttons :global(.button-light:disabled) {
            color: rgba(0, 0, 0, 0.25);
            background-color: rgba(0, 0, 0, 0.04);
            box-shadow: none;
          }
        `}
      </style>
    </div>
  );
};

export default DAOItem;
