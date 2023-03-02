import { useState } from 'react';
import { useIntl } from 'react-intl';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const storageValues = getMakeDAOStorage('vote') || {};

  const [defaultVoteRate, setDefaultVoteRate] = useState(
    storageValues.defaultVoteRate || 60,
  );
  const [defaultVotePassRate, setDefaultVotePassRate] = useState(
    storageValues.defaultVotePassRate || 10,
  );
  const [hours, setHours] = useState(storageValues.hours || 12);
  const [min, setMin] = useState(12);

  // useEffect(() => {
  //   getLifespan()
  //     .then((res) => {
  //       const r = Math.floor(res / 3600) || 12;
  //       setMin(r);

  //       if (!storageValues.hours) {
  //         setHours(r);
  //       }
  //     })
  //     .catch(() => {
  //       setMin(12);

  //       if (!storageValues.hours) {
  //         setHours(12);
  //       }
  //     });

  //   getLifespan();
  // }, []);

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

  if (!min) {
    return null;
  }

  return (
    <div className="wrap">
      <div className="h1">{formatMessage({ id: 'launch.tax.title' })}</div>
      <div className="h2">{formatMessage({ id: 'launch.vote.subtitle' })}</div>

      {/* <Slider
        defaultValue={defaultVoteRate}
        label="Issuance Tax"
        color="#FF6D4C"
        min={1}
        max={99}
        onAfterChange={onChange1}
      />
      <Slider
        defaultValue={defaultVotePassRate}
        label="Circulation Tax"
        color="#2AC154"
        min={1}
        max={99}
        onAfterChange={onChange2}
      /> */}
      <Slider
        defaultValue={hours}
        label={formatMessage({ id: 'launch.vote.period' })}
        unit="hr"
        min={min}
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
          margin-bottom: 23px;
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
