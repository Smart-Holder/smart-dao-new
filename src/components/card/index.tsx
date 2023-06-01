import { Col, Image, Row, Typography } from 'antd';
import { CSSProperties } from 'react';
import { useIntl } from 'react-intl';

const { Text } = Typography;

export type CardDataProps = {
  image?: string;
  value: string | number | any[];
  label: string;
  ratio?: string;

  onClick?: () => void;
};

const Card = ({
  data,
  title,
  style,
  size = 'normal',
}: {
  data: CardDataProps[];
  title?: string;
  style?: CSSProperties;
  size?: string;
}) => {
  const { formatMessage } = useIntl();
  return (
    <div
      className={size === 'small' ? 'cards cards-small' : 'cards'}
      style={style}
    >
      {title && <div className="cards-title">{title}</div>}
      <Row gutter={[24, 24]} style={{ marginTop: size === 'small' ? 10 : 40 }}>
        {data.map((item, index) => (
          <Col span={8} key={index}>
            <div className="item">
              <Text ellipsis={true}>
                <span className="label">{item.label}</span>
              </Text>

              {Array.isArray(item.value) ? (
                item.value.map((k, i) => (
                  <Text ellipsis={true} key={i}>
                    <span
                      className="value value-hover"
                      onClick={item.onClick ? item.onClick : undefined}
                    >
                      {k.value}
                    </span>
                  </Text>
                ))
              ) : (
                <Text ellipsis={true}>
                  <span
                    className="value value-hover"
                    onClick={item.onClick ? item.onClick : undefined}
                  >
                    {item.value}
                  </span>
                </Text>
              )}

              {item.ratio && (
                <Text ellipsis={true}>
                  <span className="ratio">
                    {formatMessage(
                      { id: 'financial.asset.own' },
                      { value: item.ratio },
                    )}
                  </span>
                </Text>
              )}
            </div>
          </Col>
        ))}
      </Row>

      <style jsx>
        {`
          .cards {
            margin-top: 30px;
          }

          .cards-title {
            height: 45px;
            font-size: 32px;
            font-family: var(--font-family-secondary);
            font-weight: 600;
            color: #000000;
            line-height: 45px;
          }

          .cards-small .cards-title {
            height: 28px;
            font-size: 20px;
            line-height: 28px;
            font-family: var(--font-family-primary);
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

          .cards-small .item {
            height: 99px;
            padding: 15px;
          }

          .card-width {
            width: 223px;
          }

          .label {
            height: 21px;
            font-size: 18px;
            font-weight: 600;
            color: #000000;
            line-height: 21px;
          }

          .cards-small .label {
            height: 14px;
            font-size: 12px;
            line-height: 14px;
          }

          .value {
            display: inline-block;
            height: 26px;
            margin-top: 16px;
            font-size: 22px;
            font-weight: bold;
            color: #000000;
            line-height: 26px;
          }

          .cards-small .value {
            height: 16px;
            margin-top: 9px;
            font-size: 14px;
            line-height: 16px;
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
            font-weight: 500;
            color: #000000;
            line-height: 19px;
          }

          .cards-small .ratio {
            height: 14px;
            margin-top: 9px;
            font-size: 12px;
            line-height: 14px;
          }
        `}
      </style>
    </div>
  );
};

export default Card;
