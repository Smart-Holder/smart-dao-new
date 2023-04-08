import { useState } from 'react';
import { Button } from 'antd';
import { ExclamationOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

import Tax from './tax';
import Vote from './vote';
import Executor from './executor';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  prevStep,
  setCurrentDAO,
  setDAOType,
  setStep,
} from '@/store/features/daoSlice';

import { clearMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';
import { useIntl } from 'react-intl';

import Modal from '@/components/modal';
import { createDAO } from '@/api/dao';
import { DAOType } from '@/config/enum';

const App = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const storageValues = getMakeDAOStorage() || {};

  const { start, tax, vote, executor } = storageValues;

  const [executorFinish, setExecutorFinish] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [loading, setLoading] = useState(false);

  const { loading } = useAppSelector((store) => store.common);
  const { chainId } = useAppSelector((store) => store.wallet);

  const prev = () => {
    dispatch(prevStep());
  };

  const next = () => {
    if (!executorFinish) {
      return;
    }

    setIsModalOpen(true);
  };

  const onExecutorFinish = (isFinish: boolean) => {
    setExecutorFinish(isFinish);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const params = {
      ...start,
      ...tax,
      ...vote,
      executor: executor.executor,
    };

    console.log('params', params);

    // dispatch(deployAssetSalesDAO(getParams()));
    const res = await createDAO(params);

    clearMakeDAOStorage();
    dispatch(setCurrentDAO(res));
    dispatch(setStep(0));
    dispatch(setDAOType(DAOType.Join));

    router.push('/dashboard/mine/home');
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

      <Modal type="normal" open={isModalOpen} onCancel={handleCancel}>
        <div className="modal-content">
          <ExclamationOutlined style={{ fontSize: 60 }} />
          <div className="modal-content-text">
            {formatMessage({ id: 'launch.warning' })}
          </div>
          {/* <div className="modal-content-text">Initialization successful!</div> */}
          <div style={{ marginTop: 60 }}>
            {/* <Button
              className="button-submit"
              type="primary"
              ghost
              onClick={handleCancel}
            >
              {formatMessage({ id: 'launch.think' })}
            </Button> */}
            <Button
              className="button-submit"
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
          .modal-content {
          }

          .modal-content-text {
            width: 300px;
            margin: 32px auto 0;
            font-size: 18px;
            font-weight: 500;
            color: #000000;
            line-height: 21px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
