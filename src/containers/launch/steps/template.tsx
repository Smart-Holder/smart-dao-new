import { Col, Image, Row, Space } from 'antd';
import { useIntl } from 'react-intl';

import { useAppDispatch } from '@/store/hooks';
import { nextStep } from '@/store/features/daoSlice';

import { setMakeDAOStorage } from '@/utils/launch';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const handleClick1 = () => {
    setMakeDAOStorage('template', { type: 'DAO', title: 'SST 01' });
    dispatch(nextStep());
  };

  const handleClick2 = () => {
    setMakeDAOStorage('template', { type: 'DAC', title: 'SST 02' });
    dispatch(nextStep());
  };

  return (
    <Row style={{ marginTop: 50 }} gutter={80}>
      <Col span={10}>
        <div className="item" onClick={handleClick1}>
          <Image
            className="item-image"
            src="/images/launch/img_template_sst01@2x.png"
            width="100%"
            height={248}
            alt=""
            preview={false}
          />
          <div className="item-content">
            <div className="h1">SST 01</div>
            <div className="desc">
              {formatMessage({ id: 'launch.template.dao1' })}
            </div>
          </div>
        </div>
      </Col>
      <Col span={10}>
        <div className="item item-disabled">
          <Image
            className="item-image"
            src="/images/launch/img_template_sst02@2x.png"
            width="100%"
            height={248}
            alt=""
            preview={false}
          />
          <div className="item-content">
            <div className="h1">SST 02</div>
            <div className="desc">
              {formatMessage({ id: 'launch.template.dao2' })}
            </div>
          </div>
        </div>
      </Col>
      <style jsx>
        {`
          .item {
            width: 100%;
            height: 488px;

            background: #ffffff;
            box-shadow: -5px 5px 20px 0px rgba(30, 30, 30, 0.05);
            border: 2px solid #f5f5f5;
            cursor: pointer;
          }

          .item-disabled {
            cursor: not-allowed;
          }

          .item :global(.item-image) {
            width: 100%;
            height: 488px;
            object-fit: cover;
          }

          .item-content {
            padding: 40px 28px;
          }

          .item .h1 {
            height: 42px;
            font-size: 24px;
            font-family: SFUIDisplay-Bold, SFUIDisplay;
            font-weight: bold;
            color: #000000;
            line-height: 42px;
          }

          .item .desc {
            margin-top: 18px;
            font-size: 18px;
            font-family: SFUIText-Medium, SFUIText;
            font-weight: 500;
            color: #000000;
            line-height: 26px;
          }
        `}
      </style>
    </Row>
  );
};

export default App;
