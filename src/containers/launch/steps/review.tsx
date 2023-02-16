import { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { ExclamationOutlined } from '@ant-design/icons';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';
import { deployAssetSalesDAO } from '@/store/features/daoSlice';

const App = () => {
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
    <div className="wrap">
      <div className="h1">SGE ZHI NIDE SHUISHOU GUIZI !</div>
      <div className="h2">
        Fast, professional and friendly service, we ordered the six course
        tasting menu and every dish was spectacular
      </div>

      <Slider
        style={{ padding: '23px 0 10px' }}
        value={tax?.assetIssuanceTax}
        label="Issuance Tax"
        color="#FF6D4C"
        readOnly
      />
      <Slider
        style={{ padding: '10px 0' }}
        value={tax?.assetCirculationTax}
        label="Circulation Tax"
        color="#2AC154"
        readOnly
      />

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
      <Slider
        style={{ padding: '10px 0' }}
        value={vote?.hours}
        label="投票期"
        unit="hr"
        max={720}
        readOnly
      />

      <Input
        className="input"
        defaultValue={executor?.address}
        prefix={<span style={{ color: '#000' }}>Address:</span>}
        readOnly
      />

      <Footer prev={prev} next={next} nextLabel="Launch" />

      <Modal
        width={512}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="modal-content">
          <ExclamationOutlined style={{ fontSize: 88 }} />
          <div style={{ marginTop: 55 }} className="modal-content-text">
            Acation!
          </div>
          <div className="modal-content-text">Initialization successful!</div>
          <div className="buttons">
            <Button className="button" type="primary" onClick={handleCancel}>
              再考虑一下
            </Button>
            <Button
              className="button"
              type="primary"
              onClick={handleSubmit}
              loading={loading}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .h1 {
          height: 42px;
          margin-top: 59px;
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 42px;
        }

        .h2 {
          height: 52px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3c4369;
          line-height: 26px;
        }

        .wrap :global(.input) {
          height: 54px;
          margin-top: 23px;
          font-size: 18px;
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
          width: 350px;
          margin: 58px auto 0;
        }

        .modal-content :global(.button) {
          width: 169px;
          height: 54px;
          font-size: 18px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 27px;
        }
      `}</style>
    </div>
  );
};

export default App;
