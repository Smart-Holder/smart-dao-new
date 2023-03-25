import sdk from 'hcstore/sdk';
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
import { rng } from 'somes/rng';

import { fromToken } from '@/utils';
import { useIntl } from 'react-intl';
import { request } from '@/api';
import { DAOType, Permissions } from '@/config/enum';
import { join } from '@/api/member';
import { getDAO, setDAOType } from '@/store/features/daoSlice';
import { UserOutlined } from '@ant-design/icons';

import NFTs from '@/containers/dashboard/mine/nfts';
import DashboardHeader from '@/containers/dashboard/header';

const { Paragraph } = Typography;

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, daoType } = useAppSelector((store) => store.dao);
  const [DAOInfo, setDAOInfo] = useState() as any;
  const [loading, setLoading] = useState(false);
  const [isLike, setIsLike] = useState(currentDAO?.isLike || false);

  useEffect(() => {
    const getData = async () => {
      const res = await request({
        name: 'dao',
        method: 'getDAOSummarys',
        params: {
          chain: chainId,
          host: currentDAO.host,
        },
      });

      setDAOInfo(res);
    };

    if (currentDAO.host && chainId) {
      getData();
    }
  }, [currentDAO.host, chainId]);

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
      console.error(error);
      message.error(error?.message);
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
              disabled={currentDAO.isJoin}
            >
              {formatMessage({
                id: currentDAO.isJoin ? 'home.joined' : 'home.join',
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
                ellipsis={{
                  rows: 4,
                  expandable: true,
                  symbol: (
                    <div style={{ color: '#000' }}>
                      {formatMessage({ id: 'viewMore' })}
                    </div>
                  ),
                }}
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
              {currentDAO?.memberObjs?.length > 0 && (
                <Avatar.Group
                  maxCount={6}
                  size={52}
                  maxStyle={{
                    color: '#fff',
                    backgroundColor: '#000',
                    cursor: 'pointer',
                  }}
                >
                  {currentDAO.memberObjs.map((item: any, index: number) => {
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
                  })}
                </Avatar.Group>
              )}
            </div>
          </Col>
        </Row>
      </DashboardHeader>
      {/* <div className="image">
        <Image
          src={currentDAO.image || img}
          width="100%"
          height={425}
          preview={false}
          alt="image"
        />
      </div> */}

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
              <span className="num">{DAOInfo.voteProposalTotal}</span>
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
                  {fromToken(DAOInfo.assetAmountTotal)} ETH
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
                <span className="num">{DAOInfo.assetTotal}</span>
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
                <span className="num">{DAOInfo.assetOrderTotal}</span>
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
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 50px;
          }

          .desc-header {
            font-size: 22px;
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 30px;
          }

          .desc-content {
            margin-top: 22px;
          }

          .desc-content :global(.ant-typography) {
            font-size: 14px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #818181;
            line-height: 28px;
          }

          .member-header {
            font-size: 22px;
            font-family: SFUIDisplay-Medium;
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
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 28px;
          }

          .total-item .num {
            font-size: 32px;
            font-family: SFUIDisplay-Semibold;
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
            font-family: SFUIDisplay-Medium;
            font-weight: 500;
            color: #282d32;
            line-height: 29px;
          }

          .total-item-2 .num {
            height: 59px;
            font-size: 42px;
            font-family: SFUIDisplay-Medium;
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
