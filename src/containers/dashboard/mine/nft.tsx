import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatAddress, fromToken } from '@/utils';
import { Avatar, Image, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import InfoModal from '@/components/modal/infoModal';
import WalletModal from '@/components/modal/walletModal';
import Price from '@/components/price';

import useResize from '@/hooks/useResize';
import { useRef } from 'react';
import { DAOType } from '@/config/enum';

import { setCurrentDAO, setDAOType } from '@/store/features/daoSlice';
import { request } from '@/api';

const { Paragraph, Text } = Typography;

type NFTProps = {
  data: any;
};

const App = ({ data }: NFTProps) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { nickname } = useAppSelector((store) => store.user.userInfo);
  const { isInit } = useAppSelector((store) => store.common);

  const infoModal: any = useRef(null);
  const walletModal: any = useRef(null);

  // const { currentDAO } = useAppSelector((store) => store.dao);
  const currentDAO = data?.dao;

  const { width } = useResize({ target: '.nft-item-image' });

  const handleClick = async () => {
    if (!isInit) {
      walletModal.current.show();
      return;
    }

    if (!nickname) {
      infoModal.current.show();
      return;
    }

    if (router.pathname === '/' && data.dao) {
      const [joinedDAOs, likeDAOs] = await Promise.all([
        request({
          name: 'utils',
          method: 'getDAOsFromOwner',
          params: { chain: chainId, owner: address },
        }),
        request({
          name: 'user',
          method: 'getUserLikeDAOs',
          params: { chain: chainId },
        }),
      ]);

      const isMember = (joinedDAOs || []).some(
        (item: any) => item.host === data.dao.host,
      );
      const isLike = (likeDAOs || []).some(
        (item: any) => item.host === data.dao.host,
      );

      const type = isMember
        ? DAOType.Join
        : isLike
        ? DAOType.Follow
        : DAOType.Visit;
      dispatch(setDAOType(type));
      dispatch(setCurrentDAO(data.dao));
    }

    localStorage.setItem('asset', JSON.stringify(data));
    router.push(`/dashboard/mine/assets/detail?id=${data.id}`);
  };

  return (
    <div className="nft-item">
      <div onClick={handleClick}>
        <Image
          className="image nft-item-image"
          src={data.imageOrigin}
          width="100%"
          height={width}
          preview={false}
          alt="image"
        />
        <div className="name">
          <Paragraph ellipsis className="paragraph">
            {data.name}
          </Paragraph>
        </div>

        {currentDAO?.name && (
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
        )}

        <div className="bottom">
          <div className="left">
            <span className="label">
              {formatMessage({ id: 'financial.asset.price' })}
            </span>

            <span className="value" style={{ marginLeft: 12 }}>
              <Price data={data} />
            </span>
          </div>
          {/* <div className="right">
          <span className="label">Ends in</span>
          <span className="value">11 : 03 : 35 </span>
        </div> */}
        </div>
      </div>

      <InfoModal ref={infoModal} />
      <WalletModal ref={walletModal} />

      <style jsx>
        {`
          .nft-item {
            box-sizing: border-box;
            width: 310px;
            width: 100%;
            padding: 15px 15px 20px;
            background: #ffffff;
            box-shadow: 0px 1px 5px 0px rgba(167, 167, 167, 0.5);
            border-radius: 8px;
            cursor: pointer;
          }

          .nft-item :global(.image) {
            object-fit: cover;
            border-radius: 2px;
          }

          .name {
            height: 19px;
            margin-top: 20px;
            font-size: 16px;
            font-weight: 600;
            color: #2c2c2c;
            line-height: 19px;
          }

          .name :global(.paragraph) {
            height: 19px;
            margin-bottom: 0;
            font-size: 16px;
            font-weight: 600;
            color: #2c2c2c;
            line-height: 19px;
          }

          .owner {
            margin-top: 12px;
            font-size: 12px;
            font-weight: 600;
            color: #818181;
            line-height: 24px;
          }

          .owner :global(.ant-typography) {
            font-size: 12px;
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
            font-weight: 600;
            color: #b1b1b1;
            line-height: 24px;
          }

          .value {
            display: flex;
            align-items: center;
            font-size: 15px;
            font-weight: 600;
            color: #232323;
            line-height: 20px;
          }

          @media screen and (max-width: 1280px) {
            .nft-item {
              width: 230px;
            }

            .nft-item :global(.image) {
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
