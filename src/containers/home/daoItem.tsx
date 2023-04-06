import React, { useRef, MouseEvent } from 'react';
import { Typography, Image, Button, Avatar, Space } from 'antd';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import InfoModal from '@/components/modal/infoModal';
import { useJoin, useFollow } from './useHooks';

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

  const { readOnly } = props;
  const { id, isJoin, isLike, host, memberObjs } = props.data;

  const { address, chainId } = useAppSelector((store) => store.wallet);
  const { nickname } = useAppSelector((store) => store.user.userInfo);
  const { isInit } = useAppSelector((store) => store.common);
  const { DAOList } = useAppSelector((store) => store.dao);

  const isMember = DAOList.some((item) => item.host === host);

  const { join, setJoin, loading } = useJoin(
    props.data.root,
    props.data.member,
    address,
    isJoin,
    isMember,
  );
  const { follow, setFollow } = useFollow(id, chainId, isLike);

  // const [loading, setLoading] = useState(false);

  const infoModal: any = useRef(null);
  const walletModal: any = useRef(null);

  const img =
    'data:image/png;base64,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';

  const members =
    memberObjs?.length > 0
      ? memberObjs
      : new Array(props.data.members || 1).fill('');

  const handleClick = () => {
    // getMemberId(); // test
    if (!isInit) {
      walletModal.current.show();
      return;
    }

    if (!nickname) {
      infoModal.current.show();
      return;
    }

    const type = join ? DAOType.Join : follow ? DAOType.Follow : DAOType.Visit;
    dispatch(setDAOType(type));
    dispatch(setCurrentDAO(props.data));
    router.push('/dashboard/mine/home');
  };

  const handleJoinClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (!isInit) {
      walletModal.current.show();
      return;
    }

    if (!nickname) {
      infoModal.current.show();
      return;
    }

    dispatch(setCurrentDAO(props.data)); // 要加入的 DAO 中创建提案

    setJoin();

    // setLoading(true);

    // try {
    //   await joinDAO({ contractAddress: props.data.member });
    //   setLoading(false);
    //   setJoin();
    // } catch (error) {
    //   console.error(error);
    //   setLoading(false);
    // }
  };

  const handleFollowClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (!isInit) {
      walletModal.current.show();
      return;
    }

    if (!nickname) {
      infoModal.current.show();
      return;
    }

    setFollow();
  };

  return (
    <div className="item">
      <div className="glass"></div>

      <div className="item-content" onClick={handleClick}>
        {/* <div className="glass"></div> */}
        {/* <Image
        style={{ borderRadius: 10, cursor: 'pointer' }}
        src={props.data.image || img}
        width={196}
        height={196}
        preview={false}
        alt="avatar"
        onClick={handleClick}
      /> */}

        <div style={{ textAlign: 'right' }}>
          {!readOnly && (
            <Button
              className="button-follow"
              type="primary"
              onClick={handleFollowClick}
            >
              <div className="button-image-wrap">
                <Image
                  src="/images/home/icon_home_card_dao_add@2x.png"
                  alt=""
                  width={10}
                  height={10}
                  preview={false}
                />
                {formatMessage({
                  id: follow ? 'home.followed' : 'home.follow',
                })}
              </div>
            </Button>
          )}
        </div>

        <div className="footer">
          <Paragraph
            className="name"
            style={{ width: 386 }}
            ellipsis={{ rows: 2 }}
          >
            {props.data.name}
          </Paragraph>

          <div className="bottom">
            <Avatar.Group
              maxCount={5}
              size={42}
              maxStyle={{
                color: '#fff',
                backgroundColor: '#000',
                cursor: 'pointer',
              }}
            >
              {members.map((item: any, index: number) => {
                if (item?.image) {
                  return (
                    <Avatar
                      className="member-avatar"
                      src={item.image}
                      key={index}
                    />
                  );
                }

                return (
                  <Avatar
                    className="member-avatar"
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
                { value: props.data.members || 1 },
              )}
            </span>

            <div style={{ width: 190 }}>
              {!readOnly && (
                <Button
                  className="button-join"
                  ghost
                  disabled={join}
                  onClick={handleJoinClick}
                  loading={loading}
                >
                  {formatMessage({ id: join ? 'home.joined' : 'home.join' })}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <InfoModal ref={infoModal} />
      <WalletModal ref={walletModal} />

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
              url(${props.data.image || img}) no-repeat center;
            background-size: cover;
            border-radius: 16px;

            cursor: pointer;
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
            font-weight: 500;
            color: #ffffff;
            line-height: 18px;

            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }

          .item-content :global(.ant-btn.ant-btn-primary.button-follow) {
            box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
          }

          .item :global(.name) {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            line-height: 39px;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
          }

          .item :global(.member-avatar) {
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
            font-weight: 600;
            color: #ffffff;
            line-height: 36px;
          }

          .bottom :global(.button-join) {
            width: 190px;
            height: 46px;
            font-size: 17px;
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
