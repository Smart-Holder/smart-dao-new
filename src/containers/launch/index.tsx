import { useAppSelector } from '@/store/hooks';
import { getMakeDAOStorage } from '@/utils/launch';
import { Avatar, Space, Image, Row, Col, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

const { Paragraph } = Typography;

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
      <div className="image">
        <Image
          src={cacheDAO.image}
          width="100%"
          height={425}
          preview={false}
          alt="image"
        />
      </div>

      <div className="content">
        <Row gutter={24}>
          <Col span={12}>
            <div className="name">{cacheDAO.name}</div>
          </Col>
        </Row>

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
                {cacheDAO.description}
              </Paragraph>
            </div>
          </Col>
          <Col span={10} offset={2}>
            <div className="member-header">
              {cacheDAO.members.length}{' '}
              {formatMessage({
                id: cacheDAO.members.length === 1 ? 'member' : 'members',
              })}
            </div>
            <div className="member-content">
              <Avatar.Group
                maxCount={6}
                size={52}
                maxStyle={{
                  color: '#fff',
                  backgroundColor: '#000',
                  cursor: 'pointer',
                }}
              >
                {cacheDAO.members.map((item: any) => (
                  <Avatar
                    style={{ backgroundColor: '#000', borderWidth: 3 }}
                    src={item.image}
                    key={item.id}
                  />
                ))}
              </Avatar.Group>
            </div>
          </Col>
        </Row>

        <Row gutter={24} style={{ marginTop: 55 }}>
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
              <span className="num">0</span>
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
              <span className="num">0</span>
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
              <span className="num">0</span>
            </div>
          </Col>
        </Row>

        <Row gutter={[37, 40]} style={{ marginTop: 55 }}>
          <Col span={12}>
            <div className="total-item-2">
              <div className="total-item-right">
                <span className="num">0 ETH</span>
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
                <span className="num">0</span>
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
                <span className="num">0</span>
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
                <span className="num">0 ETH</span>
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
      </div>

      <style jsx>
        {`
          .content {
            padding: 75px 60px 50px;
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
            max-width: 306px;
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
            max-width: 465px;
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
