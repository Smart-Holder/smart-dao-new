import { useState } from 'react';
import { Space, Button } from 'antd';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';

const App = () => {
  const dispatch = useAppDispatch();

  const storageValues = getMakeDAOStorage('tax') || {};

  const [assetIssuanceTax, setAssetIssuanceTax] = useState(
    storageValues.assetIssuanceTax || 60,
  );
  const [assetCirculationTax, setAssetCirculationTax] = useState(
    storageValues.assetCirculationTax || 10,
  );

  const onTaxChange1 = (value: number) => {
    setAssetIssuanceTax(value);
  };

  const onTaxChange2 = (value: number) => {
    setAssetCirculationTax(value);
  };

  const prev = () => {
    dispatch(prevStep());
  };

  const next = () => {
    setMakeDAOStorage('tax', {
      assetIssuanceTax,
      assetCirculationTax,
    });
    console.log('form:', getMakeDAOStorage('tax'));
    dispatch(nextStep());
  };

  return (
    <div className="wrap">
      <div className="h1">SGE ZHI NIDE SHUISHOU GUIZI !</div>
      <div className="h2">
        Fast, professional and friendly service, we ordered the six course
        tasting menu and every dish was spectacular
      </div>

      <Slider
        style={{ padding: '23px 0' }}
        defaultValue={assetIssuanceTax}
        label="Issuance Tax"
        color="#FF6D4C"
        min={1}
        max={99}
        onAfterChange={onTaxChange1}
      />
      <Slider
        style={{ padding: '23px 0' }}
        defaultValue={assetCirculationTax}
        label="Circulation Tax"
        color="#2AC154"
        min={1}
        max={99}
        onAfterChange={onTaxChange2}
      />

      <Footer prev={prev} next={next} />

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
      `}</style>
    </div>
  );
};

export default App;
