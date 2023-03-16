import { Col, Image, Row, Space } from 'antd';

type Data = {
  image?: string;
  value: string | number;
  label: string;
  onClick?: () => void;
};

const Card = ({ data }: { data: Data[] }) => {
  return (
    <div className="cards">
      {data.length === 4 ? (
        <Row gutter={24}>
          {data.map((item, index) => (
            <Col span={6} key={index}>
              <div className="card">
                <Image
                  src={
                    item.image ||
                    '/images/card/img_table_data-chart_default.png'
                  }
                  width={56}
                  height={56}
                  alt=""
                />
                <span className="value">{item.value}</span>
                <span className="label">{item.label}</span>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <Space size={25}>
          {data.map((item, index) => (
            <div className="card card-width" key={index}>
              <Image
                src={
                  item.image || '/images/card/img_table_data-chart_default.png'
                }
                width={56}
                height={56}
                alt=""
              />
              {item.onClick ? (
                <span className="value value-hover" onClick={item.onClick}>
                  {item.value}
                </span>
              ) : (
                <span className="value">{item.value}</span>
              )}
              <span className="label">{item.label}</span>
            </div>
          ))}
        </Space>
      )}

      <style jsx>
        {`
          .cards {
            padding: 0 59px;
          }

          .card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            height: 176px;
            padding: 18px 20px 20px;
            background: #ffffff;
            box-shadow: -5px 5px 20px 0px rgba(30, 30, 30, 0.05);
            border-radius: 12px;
          }

          .card-width {
            width: 223px;
          }

          .value {
            height: 53px;
            margin-top: 4px;
            font-size: 38px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #000000;
            line-height: 53px;
          }

          .value-hover:hover {
            text-decoration: underline;
            cursor: pointer;
          }

          .label {
            height: 22px;
            margin-top: 3px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #909090;
            line-height: 22px;
          }
        `}
      </style>
    </div>
  );
};

export default Card;
