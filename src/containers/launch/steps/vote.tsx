import { useState } from 'react';
import { Space, Steps } from 'antd';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const [tax1, setTax1] = useState(0);
  const [tax2, setTax2] = useState(0);

  const onTaxChange1 = (value: number) => {
    console.log(value);
  };

  const onTaxChange2 = (value: number) => {
    console.log(value);
  };

  const prev = () => {
    dispatch(prevStep());
  };

  const next = () => {
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
        style={{ paddingTop: 23 }}
        defaultValue={60}
        label="Issuance Tax"
        color="#FF6D4C"
        onAfterChange={onTaxChange1}
      />
      <Slider
        defaultValue={30}
        label="Circulation Tax"
        color="#2AC154"
        onAfterChange={onTaxChange2}
      />
      <Slider
        defaultValue={30}
        label="投票期"
        unit="hr"
        max={200}
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
