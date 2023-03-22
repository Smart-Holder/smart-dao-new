import { useState } from 'react';
import { Modal, Input, Button, Col, Row } from 'antd';
import { ExclamationOutlined } from '@ant-design/icons';

import Tax from './tax';
import Vote from './vote';
import Executor from './executor';
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

  const [executorFinish, setExecutorFinish] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [loading, setLoading] = useState(false);
  const { web3 } = useAppSelector((store) => store.wallet);
  const { loading } = useAppSelector((store) => store.common);

  const prev = () => {
    dispatch(prevStep());
  };

  const next = () => {
    if (!executorFinish) {
      return;
    }

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

  const onExecutorFinish = (isFinish: boolean) => {
    setExecutorFinish(isFinish);
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
    <div className="form" style={{ margin: '40px 0 0' }}>
      <div className="setting-h1">
        {formatMessage({ id: 'launch.review.title' })}
      </div>
      <div className="setting-h2">
        {formatMessage({ id: 'launch.review.subtitle' })}
      </div>

      <Tax type="review" />
      <Vote type="review" />
      <Executor type="review" onFinish={onExecutorFinish} />

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
