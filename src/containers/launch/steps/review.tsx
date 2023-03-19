import { useState } from 'react';
import { Modal, Input, Button, Col, Row } from 'antd';
import { ExclamationOutlined } from '@ant-design/icons';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { prevStep } from '@/store/features/daoSlice';

import { getMakeDAOStorage } from '@/utils/launch';
import { deployAssetSalesDAO } from '@/store/features/daoSlice';
import { useIntl } from 'react-intl';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const storageValues = getMakeDAOStorage() || {};

  const { start, tax, vote, executor } = storageValues;

  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [loading, setLoading] = useState(false);
  const { web3 } = useAppSelector((store) => store.wallet);
  const { loading } = useAppSelector((store) => store.common);

  const prev = () => {
    dispatch(prevStep());
  };

  const next = () => {
    // dispatch(nextStep());
    setIsModalOpen(true);
  };

  const getParams = () => {
    return {
      web3,
      ...start,
      ...tax,
      ...vote,
      executor: executor.executor,
    };
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    console.log('params', getParams());
    dispatch(deployAssetSalesDAO(getParams()));
    // setIsModalOpen(false);
  };

  return (
    <div className="card form" style={{ margin: '40px 0 0' }}>
      <div className="h1">{formatMessage({ id: 'launch.review.title' })}</div>
      <div className="h2">
        {formatMessage({ id: 'launch.review.subtitle' })}
      </div>

      <Row style={{ marginTop: 40 }}>
        <Col span={17}>
          <Slider
            value={tax?.assetIssuanceTax}
            label={formatMessage({ id: 'launch.tax.publish' })}
            color="#FF6D4C"
            readOnly
          />
        </Col>
        <Col span={17} style={{ marginTop: 40 }}>
          <Slider
            value={tax?.assetCirculationTax}
            label={formatMessage({ id: 'launch.tax.circulation' })}
            color="#2AC154"
            readOnly
          />
        </Col>
        {/* <Slider
        style={{ padding: '10px 0' }}
        value={vote?.defaultVoteRate}
        label="Issuance Tax"
        color="#FF6D4C"
        readOnly
      />
      <Slider
        style={{ padding: '10px 0' }}
        value={vote?.defaultVotePassRate}
        label="Circulation Tax"
        color="#2AC154"
        readOnly
      /> */}

        <Col span={17} style={{ marginTop: 40 }}>
          <Slider
            value={vote?.hours}
            label={formatMessage({ id: 'launch.vote.period' })}
            unit="hr"
            max={720}
            readOnly
          />
        </Col>
        <Col span={17} style={{ marginTop: 40 }}>
          <div>
            <div className="label">
              {formatMessage({ id: 'launch.executor.address' })}
            </div>
            <Input defaultValue={executor?.address} readOnly />
          </div>
        </Col>
      </Row>

      <Footer
        prev={prev}
        next={next}
        nextLabel={formatMessage({ id: 'launch.release' })}
      />

      <Modal
        width={512}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="modal-content">
          <ExclamationOutlined style={{ fontSize: 88 }} />
          <div style={{ marginTop: 55 }} className="modal-content-text">
            {formatMessage({ id: 'launch.warning' })}
          </div>
          {/* <div className="modal-content-text">Initialization successful!</div> */}
          <div className="buttons">
            <Button
              className="button-form"
              type="primary"
              ghost
              onClick={handleCancel}
            >
              {formatMessage({ id: 'launch.think' })}
            </Button>
            <Button
              className="button-form"
              type="primary"
              onClick={handleSubmit}
              loading={loading}
            >
              {formatMessage({ id: 'launch.determine' })}
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx>
        {`
          .wrap :global(.input) {
            height: 54px;
            margin-top: 23px;
            font-size: 18px;
          }

          .label {
            height: 24px;
            margin-bottom: 10px;
            font-size: 16px;
            font-family: HelveticaNeue-Bold, HelveticaNeue;
            font-weight: bold;
            color: #2d2d2d;
            line-height: 24px;
          }

          .modal-content {
            padding: 88px 0 77px;
            text-align: center;
          }

          .modal-content-text {
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #3c4369;
            line-height: 40px;
          }

          .modal-content .buttons {
            display: flex;
            justify-content: space-between;
            margin: 58px 10px 0;
          }

          .modal-content :global(.button) {
            min-width: 120px;
            height: 54px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 27px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
