import { Col, Image, Row, Typography } from 'antd';
import { useIntl } from 'react-intl';

const { Text } = Typography;

export type CardDataProps = {
  image?: string;
  value: string | number;
  label: string;
  ratio?: string;
  onClick?: () => void;
};

const Card = ({ data }: { data: CardDataProps[] }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="cards">
      <div className="cards-title">
        {formatMessage({ id: 'financial.asset.property' })}
      </div>
      <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
        {data.map((item, index) => (
          <Col span={8} key={index}>
            <div className="item">
              <Text ellipsis={true}>
                <span className="label">{item.label}</span>
              </Text>
              {item.onClick ? (
                <Text ellipsis={true}>
                  <span className="value value-hover" onClick={item.onClick}>
                    {item.value}
                  </span>
                </Text>
              ) : (
                <Text ellipsis={true}>
                  <span className="value">{item.value}</span>
                </Text>
              )}
              <Text ellipsis={true}>
                <span className="ratio">{item.ratio}</span>
              </Text>
            </div>
          </Col>
        ))}
      </Row>

      <style jsx>
        {`
          .cards {
            margin-top: 80px;
          }

          .cards-title {
            height: 45px;
            font-size: 32px;
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 45px;
          }

          .item {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            width: 100%;
            height: 160px;
            padding: 30px 24px;
            background: #ffffff;
            box-shadow: -7px 7px 29px 0px rgba(30, 30, 30, 0.05);
          }

          .card-width {
            width: 223px;
          }

          .label {
            height: 21px;
            font-size: 18px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 21px;
          }

          .value {
            display: inline-block;
            height: 26px;
            margin-top: 16px;
            font-size: 22px;
            font-family: SFUIDisplay-Bold, SFUIDisplay;
            font-weight: bold;
            color: #000000;
            line-height: 26px;
          }

          .value-hover:hover {
            text-decoration: underline;
            cursor: pointer;
          }

          .ratio {
            display: inline-block;
            height: 19px;
            margin-top: 18px;
            font-size: 16px;
            font-family: SFUIDisplay-Medium, SFUIDisplay;
            font-weight: 500;
            color: #000000;
            line-height: 19px;
          }
        `}
      </style>
    </div>
  );
};

export default Card;
