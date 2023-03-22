import { Col, Image, Row, Typography } from 'antd';

const { Text } = Typography;

export type CardDataProps = {
  image?: string;
  value: string | number;
  label: string;
  onClick?: () => void;
};

const Card = ({ data }: { data: CardDataProps[] }) => {
  return (
    <div className="cards">
      <Row gutter={[24, 24]}>
        {data.map((item, index) => (
          <Col span={6} key={index}>
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
            </div>
          </Col>
        ))}
      </Row>

      <style jsx>
        {`
          .cards {
            margin-top: 40px;
          }

          .item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            width: 100%;
            height: 145px;
            padding: 38px 14px 36px 18px;
            background: #ffffff;
            box-shadow: -7px 7px 29px 0px rgba(30, 30, 30, 0.05);
          }

          .card-width {
            width: 223px;
          }

          .label {
            height: 21px;
            font-size: 18px;
            font-family: SFUIDisplay-Semibold, SFUIDisplay;
            font-weight: 600;
            color: #000000;
            line-height: 21px;
          }

          .value {
            height: 36px;
            font-size: 30px;
            font-family: SFUIDisplay-Bold, SFUIDisplay;
            font-weight: bold;
            color: #000000;
            line-height: 36px;
          }

          .value-hover:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default Card;
