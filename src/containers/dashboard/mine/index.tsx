import {
  Avatar,
  Space,
  Image,
  Button,
  message,
  Row,
  Col,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// import { rng } from 'somes/rng';

import { fromToken } from '@/utils';
import { useIntl } from 'react-intl';
import { request } from '@/api';
import { DAOType, Permissions } from '@/config/enum';
import { join } from '@/api/member';
import { setDAOType } from '@/store/features/daoSlice';
import { UserOutlined } from '@ant-design/icons';
import { useDaosAsset } from '@/api/graph/asset';
import { assetPoolProps } from '@/api/graph/dao';

import NFTs from '@/containers/dashboard/mine/nfts';
import DashboardHeader from '@/containers/dashboard/header';

const { Paragraph } = Typography;

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, daoType } = useAppSelector((store) => store.dao);
  const [DAOInfo, setDAOInfo] = useState() as any;
  const [likeDAO, setLikeDAO] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLike, setIsLike] = useState(currentDAO?.isLike || false);
  const {
    loading: assetLoading,
    error,
    data: assetData,
  } = useDaosAsset({
    vote_id: currentDAO.votePool.id,
    first: currentDAO.assetPool.find(
      (item: assetPoolProps) => item.type === 'Frist',
    ).id,
    second: currentDAO.assetPool.find(
      (item: assetPoolProps) => item.type === 'Second',
    ).id,
  });

  useEffect(() => {
    const getData = async () => {
      const [res, res2] = await Promise.all([
        request({
          name: 'dao',
          method: 'getDAOSummarys',
          params: {
            chain: chainId,
            host: currentDAO.id,
          },
        }),
        request({
          name: 'user',
          method: 'getUserLikeDAOs',
          params: { chain: chainId },
        }),
      ]);

      setDAOInfo(res);
      setLikeDAO(res2);

      if (res2) {
        const like = res2.some((item: any) => item.host === currentDAO.id);

        if (like) {
          setIsLike(true);
        }
      }
    };

    if (currentDAO.id && chainId) {
      getData();
    }
  }, [currentDAO.id, chainId]);

  const setJoin = async () => {
    try {
      // const params = {
      //   name: formatMessage({ id: 'proposal.basic.addNFTP' }),
      //   description: JSON.stringify({
      //     type: 'member',
      //     purpose: `${formatMessage({
      //       id: 'proposal.basic.addNFTP',
      //     })}: ${address}`,
      //   }),
      //   extra: [
      //     {
      //       abi: 'member',
      //       method: 'requestJoin',
      //       params: [
      //         address,
      //         {
      //           id: '0x' + rng(32).toString('hex'),
      //           name: '',
      //           description: '',
      //           image: '',
      //           votes: 1,
      //         },
      //         [
      //           Permissions.Action_VotePool_Vote,
      //           Permissions.Action_VotePool_Create,
      //         ],
      //       ],
      //     },
      //   ],
      // };

      setLoading(true);
      await join({ votePool: currentDAO.root, member: currentDAO.member });
      message.success(formatMessage({ id: 'governance.proposal.success' }));
      setLoading(false);
      // dispatch(setDAOType('joining'));
      // window.location.reload();
    } catch (error: any) {
      setLoading(false);
      // console.error(error);
      // message.error(error?.message);
    }
  };

  const setFollow = async () => {
    try {
      await request({
        name: 'user',
        method: 'addLikeDAO',
        params: { dao: currentDAO.id, chain: chainId },
      });

      message.success('success');

      if (daoType !== DAOType.Join) {
        dispatch(setDAOType(DAOType.Follow));
      }

      setIsLike(true);
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  if (!DAOInfo) {
    return null;
  }

  return (
    <div style={{ padding: '24px 33px 0 24px' }}>
      <DashboardHeader
        padding
        buttons={
          <>
            <Button
              className="smart-button"
              type="primary"
              ghost
              onClick={setFollow}
              disabled={isLike}
            >
              {formatMessage({
                id: isLike ? 'home.followed' : 'home.follow',
              })}
            </Button>
            <Button
              className="smart-button"
              type="primary"
              onClick={setJoin}
              loading={loading}
              disabled={daoType === DAOType.Join}
            >
              {formatMessage({
                id: daoType === DAOType.Join ? 'home.joined' : 'home.join',
              })}
            </Button>
          </>
        }
      >
        <Row gutter={24} style={{ marginTop: 55 }}>
          <Col span={12}>
            <div className="desc-header">
              {formatMessage({ id: 'description' })}
            </div>
            <div className="desc-content">
              <Paragraph
              // ellipsis={{
              //   rows: 4,
              //   expandable: true,
              //   symbol: (
              //     <div style={{ color: '#000' }}>
              //       {formatMessage({ id: 'viewMore' })}
              //     </div>
              //   ),
              // }}
              >
                {currentDAO.description}
              </Paragraph>
            </div>
          </Col>
          <Col span={10} offset={2}>
            <div className="member-header">
              {DAOInfo.membersTotal}{' '}
              {formatMessage({
                id: DAOInfo.membersTotal === 1 ? 'member' : 'members',
              })}
            </div>
            <div className="member-content">
              {currentDAO?.memberInfo?.count > 0 && (
                <Avatar.Group
                  maxCount={6}
                  size={52}
                  maxStyle={{
                    color: '#fff',
                    backgroundColor: '#000',
                    cursor: 'pointer',
                  }}
                >
                  {currentDAO.memberInfo?.members.map(
                    (item: any, index: number) => {
                      if (item.image) {
                        return (
                          <Avatar
                            style={{ backgroundColor: '#000', borderWidth: 3 }}
                            src={item.image}
                            key={index}
                          />
                        );
                      }

                      return (
                        <Avatar
                          style={{ backgroundColor: '#000', borderWidth: 3 }}
                          icon={<UserOutlined />}
                          key={index}
                        />
                      );
                    },
                  )}
                </Avatar.Group>
              )}
            </div>
          </Col>
        </Row>
      </DashboardHeader>

      <div className="content">
        <Row gutter={24}>
          <Col span={8}>
            <div className="total-item">
              <div className="total-item-top">
                {formatMessage({ id: 'my.summary.total.proposal' })}
                <Image
                  src="/images/dashboard/summary/img_dao_dashboard_card_proposal_default@2x.png"
                  width={45}
                  height={46}
                  alt="img"
                  preview={false}
                />
              </div>
              {/* <span className="num">{DAOInfo.voteProposalTotal}</span> */}
              <span className="num">{assetData?.votePool?.count}</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="total-item">
              <div className="total-item-top">
                {formatMessage({ id: 'my.summary.total.voting' })}
                <Image
                  src="/images/dashboard/summary/img_dao_dashboard_card_total_vote_default@2x.png"
                  width={45}
                  height={46}
                  alt="img"
                  preview={false}
                />
              </div>
              <span className="num">{DAOInfo.voteProposalPendingTotal}</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="total-item">
              <div className="total-item-top">
                {formatMessage({ id: 'my.summary.total.complete' })}
                <Image
                  src="/images/dashboard/summary/img_dao_dashboard_card_voted_default@2x.png"
                  width={45}
                  height={46}
                  alt="img"
                  preview={false}
                />
              </div>
              <span className="num">{DAOInfo.voteProposalResolveTotal}</span>
            </div>
          </Col>
        </Row>

        <Row gutter={[37, 40]} style={{ marginTop: 55 }}>
          <Col span={12}>
            <div className="total-item-2">
              <div className="total-item-right">
                <span className="num">
                  {/* {fromToken(DAOInfo.assetAmountTotal)} ETH */}
                  {fromToken(assetData?.first.amountTotal) +
                    fromToken(assetData?.second.amountTotal) +
                    ' '}
                  ETH
                </span>
                <span>
                  {formatMessage({ id: 'my.summary.total.assetAmount' })}
                </span>
              </div>
              <Image
                src="/images/dashboard/summary/icon_dao_dashboard_card_assets_value_default@2x.png"
                width={60}
                height={60}
                alt="img"
                preview={false}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="total-item-2">
              <div className="total-item-right">
                {/* <span className="num">{DAOInfo.assetTotal}</span> */}
                <span className="num">
                  {Number(assetData?.second.total) +
                    Number(assetData?.first.total)}
                </span>
                <span>{formatMessage({ id: 'my.summary.total.asset' })}</span>
              </div>
              <Image
                src="/images/dashboard/summary/icon_dao_dashboard_card_assets_default@2x.png"
                width={60}
                height={60}
                alt="img"
                preview={false}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="total-item-2">
              <div className="total-item-right">
                {/* <span className="num">{DAOInfo.assetOrderTotal}</span> */}
                <span className="num">
                  {Number(assetData?.second.orderTotal) +
                    Number(assetData?.first.orderTotal)}
                </span>
                <span>{formatMessage({ id: 'my.summary.total.order' })}</span>
              </div>
              <Image
                src="/images/dashboard/summary/icon_dao_dashboard_card_order_default@2x.png"
                width={60}
                height={60}
                alt="img"
                preview={false}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="total-item-2">
              <div className="total-item-right">
                <span className="num">
                  {fromToken(DAOInfo.assetLedgerIncomeTotal)} ETH
                </span>
                <span>{formatMessage({ id: 'my.summary.total.income' })}</span>
              </div>
              <Image
                src="/images/dashboard/summary/icon_dao_dashboard_card_income_default@2x.png"
                width={60}
                height={60}
                alt="img"
                preview={false}
              />
            </div>
          </Col>
        </Row>

        {/* {!currentDAO.isJoin && !currentDAO.isMember && <NFTs />} */}
        {daoType !== DAOType.Join && <NFTs />}
      </div>

      <style jsx>
        {`
          .content {
            padding: 55px 58px 50px;
          }

          .info1 {
            display: flex;
            justify-content: space-between;
          }

          .name {
            width: 395px;
            height: 50px;
            font-size: 36px;
            font-weight: 600;
            color: #000000;
            line-height: 50px;
          }

          .desc-header {
            font-size: 22px;
            font-weight: 600;
            color: #000000;
            line-height: 30px;
          }

          .desc-content {
            margin-top: 22px;
          }

          .desc-content :global(.ant-typography) {
            font-size: 14px;
            font-weight: 500;
            color: #818181;
            line-height: 28px;
          }

          .member-header {
            font-size: 22px;
            font-weight: 500;
            color: #000000;
            line-height: 30px;
          }

          .member-content {
            margin-top: 20px;
          }

          .total-item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            height: 160px;
            padding: 26px 26px 30px 24px;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #eaeaea;
          }

          .total-item-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 20px;
            font-weight: 500;
            color: #000000;
            line-height: 28px;
          }

          .total-item .num {
            font-size: 32px;
            font-weight: 600;
            color: #000000;
            line-height: 45px;
          }

          .total-item-2 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            height: 180px;
            padding: 0 45px;
            background: #ffffff;
            box-shadow: -5px 5px 20px 0px rgba(30, 30, 30, 0.05);
          }

          .total-item-2 .total-item-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .total-item-2 span {
            height: 29px;
            font-size: 21px;
            font-weight: 500;
            color: #282d32;
            line-height: 29px;
          }

          .total-item-2 .num {
            height: 59px;
            font-size: 42px;
            font-weight: 500;
            color: #282d32;
            line-height: 59px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
