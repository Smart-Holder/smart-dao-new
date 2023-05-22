import { Typography, Image, Row, Col, Tag } from 'antd';
import { useIntl } from 'react-intl';

import { AttrParams } from '@/components/modal/assetAttrModal';
import Card, { CardDataProps } from '@/components/card';

import styles from './detail.module.css';
import { getUnit } from '@/utils';

const { Paragraph } = Typography;

type Props = {
  data: {
    name: string;
    tags: string[];
    description?: string;
    image: string;
    attributes?: AttrParams[];
    price: string;
    listingPrice: string;
    supply: string;
    blockchain: string;
    assetIssuanceTax: number;
    assetCirculationTax: number;
  };
};

const App = ({ data }: Props) => {
  const { formatMessage } = useIntl();

  const cardData: CardDataProps[] = [];

  data?.attributes?.forEach((item: any) => {
    if (item.trait_type && item.trait_type !== 'tags') {
      cardData.push({
        label: item.trait_type,
        value: item.value,
        ratio: item.ratio || '',
      });
    }
  });

  return (
    <div>
      <div className="asset-detail-header">
        <Row gutter={24}>
          <Col span={13}>
            <Image
              className="asset-image"
              src={data.image}
              width={270}
              height={270}
              preview={false}
              alt=""
            />
          </Col>
          <Col span={11}>
            <div className="asset-detail-header-right">
              <div className="asset-name">{data.name}</div>
              <div className="asset-tags">
                {data.tags.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>

              <Row style={{ marginTop: 20 }}>
                <Col span={10}>
                  <span className="dao-info-item-label">
                    {formatMessage({ id: 'financial.asset.price' })}:
                  </span>
                </Col>
                <Col span={14}>
                  <span className="dao-info-item-value">
                    {data.price} {getUnit()}
                  </span>
                </Col>
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col span={10}>
                  <span className="dao-info-item-label">
                    {formatMessage({ id: 'my.asset.shelves.listingPrice' })}:
                  </span>
                </Col>
                <Col span={14}>
                  <span className="dao-info-item-value">
                    {data.listingPrice} {getUnit()}
                  </span>
                </Col>
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col span={10}>
                  <span className="dao-info-item-label">
                    {formatMessage({ id: 'financial.asset.issue.blockchain' })}:
                  </span>
                </Col>
                <Col span={14}>
                  <span className="dao-info-item-value">{data.blockchain}</span>
                </Col>
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col span={10}>
                  <span className="dao-info-item-label">
                    {formatMessage({ id: 'financial.asset.issue.supply' })}:
                  </span>
                </Col>
                <Col span={14}>
                  <span className="dao-info-item-value">{data.supply}</span>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {data.description && (
          <div className="asset-desc">
            <div className="asset-desc-title">
              {formatMessage({ id: 'description' })}
            </div>

            <Paragraph>{data.description}</Paragraph>
          </div>
        )}
      </div>

      <Card
        style={{ marginTop: 30 }}
        title={formatMessage({ id: 'financial.asset.property' })}
        data={cardData}
        size="small"
      />

      <div className={styles.value} style={{ marginTop: 30 }}>
        Taxes and dues (Set by the DAO system)
      </div>
      <div className="tax">
        <span>
          {formatMessage({ id: 'launch.tax.publish' })}:{' '}
          {data.assetIssuanceTax / 100}%
        </span>
        <span style={{ marginLeft: 100 }}>
          {formatMessage({ id: 'launch.tax.circulation' })}:{' '}
          {data.assetCirculationTax / 100}%
        </span>
      </div>

      <style jsx>
        {`
          .asset-detail-header :global(.asset-image) {
            object-fit: cover;
          }

          .asset-name {
            height: 25px;
            font-size: 18px;
            font-weight: 600;
            color: #000000;
            line-height: 25px;
          }

          .asset-tags {
            display: flex;
            align-items: center;
            margin-top: 10px;
            font-size: 12px;
            font-weight: 500;
            color: #000000;
            line-height: 17px;
          }

          .dao-info-item {
            display: flex;
            height: 22px;
            margin-top: 20px;
            font-size: 16px;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .dao-info-item-label {
            font-size: 12px;
            font-weight: 500;
            color: #000000;
            line-height: 14px;
          }
          .dao-info-item-value {
            font-size: 12px;
            font-weight: 500;
            color: #000000;
            line-height: 14px;
          }

          .dao-info-item-value :global(.ant-typography) {
            font-size: 12px;
            font-weight: 500;
            color: #000000;
            line-height: 14px;
          }

          .asset-desc {
            margin-top: 28px;
          }

          .asset-desc-title {
            height: 28px;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 600;
            color: #000000;
            line-height: 28px;
          }

          .asset-desc :global(.ant-typography) {
            font-size: 14px;
            font-weight: 500;
            color: #818181;
            line-height: 28px;
          }

          .tax {
            display: flex;
            align-items: center;
            height: 40px;
            padding-left: 12px;
            margin-top: 10px;

            font-size: 12px;
            font-weight: 400;
            color: #000000;
            line-height: 20px;

            background: #fafafa;
            border-radius: 4px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
