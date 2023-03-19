import { useState } from 'react';
import { useIntl } from 'react-intl';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';
import { Col, Row } from 'antd';

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
    <div className="card" style={{ margin: '40px 0 0' }}>
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

      <Row style={{ marginTop: 40 }}>
        <Col span={17}>
          <Slider
            defaultValue={hours}
            label={formatMessage({ id: 'launch.vote.period' })}
            unit="hr"
            min={min}
            max={720}
            onAfterChange={onChange3}
          />
        </Col>
      </Row>

      <Footer prev={prev} next={next} />
    </div>
  );
};

export default App;
