import { useState } from 'react';
import { Space, Steps } from 'antd';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';

const App = () => {
  const dispatch = useAppDispatch();

  const storageValues = getMakeDAOStorage('vote') || {};

  const [defaultVoteRate, setDefaultVoteRate] = useState(
    storageValues.defaultVoteRate || 60,
  );
  const [defaultVotePassRate, setDefaultVotePassRate] = useState(
    storageValues.defaultVotePassRate || 10,
  );
  const [hours, setHours] = useState(storageValues.hours || 168);

  const onChange1 = (value: number) => {
    setDefaultVoteRate(value);
  };

  const onChange2 = (value: number) => {
    setDefaultVotePassRate(value);
  };
  const onChange3 = (value: number) => {
    setHours(value);
  };

  const prev = () => {
    dispatch(prevStep());
  };

  const next = () => {
    setMakeDAOStorage('vote', {
      defaultVoteRate,
      defaultVotePassRate,
      hours,
    });
    console.log('form:', getMakeDAOStorage('vote'));
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
        defaultValue={defaultVoteRate}
        label="Issuance Tax"
        color="#FF6D4C"
        onAfterChange={onChange1}
      />
      <Slider
        defaultValue={defaultVotePassRate}
        label="Circulation Tax"
        color="#2AC154"
        onAfterChange={onChange2}
      />
      <Slider
        defaultValue={hours}
        label="投票期"
        unit="hr"
        max={720}
        onAfterChange={onChange3}
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
