import { useEffect, useRef, useState } from 'react';
import { Button, Space, Steps } from 'antd';

import Template from '@/containers/launch/steps/template';
import Tax from '@/containers/launch/steps/tax';
import Vote from '@/containers/launch/steps/vote';
import Executor from '@/containers/launch/steps/executor';
import Review from '@/containers/launch/steps/review';
import { useIntl } from 'react-intl';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setStep,
  prevStep,
  nextStep,
  resetStep,
} from '@/store/features/daoSlice';
import { getCookie } from '@/utils/cookie';

// const items = [
//   { title: '税收规则' },
//   { title: '基础投票规则' },
//   { title: '执行人' },
//   { title: '预览&发布' },
// ];

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { step } = useAppSelector((store) => store.dao);

  const items = [
    { description: formatMessage({ id: 'launch.tax.title' }) },
    { description: formatMessage({ id: 'launch.vote.title' }) },
    { description: formatMessage({ id: 'launch.executor.title' }) },
    { description: formatMessage({ id: 'launch.review.title' }) },
  ];

  useEffect(() => {
    dispatch(resetStep());
  }, []);

  // useEffect(() => {
  //   const s = Number(localStorage.getItem('step'));

  //   if (s) {
  //     setStep(s);
  //   }
  // }, []);

  const next = () => {
    // setCurrent(current + 1);
    dispatch(nextStep());
  };

  const prev = () => {
    // setCurrent(current - 1);
    dispatch(prevStep());
  };

  return (
    <div className="wrap">
      {step !== 0 && (
        <Steps
          current={step - 1}
          items={items}
          labelPlacement="vertical"
          responsive={false}
        />
      )}

      {step === 0 && <Template />}

      <div style={{ width: 550 }}>
        {step === 1 && <Tax />}
        {step === 2 && <Vote />}
        {step === 3 && <Executor />}
        {step === 4 && <Review />}

        {/* <div className="buttons">
          {step > 0 && step < items.length && (
            <Button className="button" type="primary" onClick={prev}>
              Back
            </Button>
          )}

          {step > 0 && step < items.length && (
            <Button className="button" type="primary" onClick={next}>
              Next
            </Button>
          )}
        </div> */}
      </div>

      <style jsx>{`
        .buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
        }

        .wrap :global(.button) {
          width: 168px;
          height: 53px;
          font-size: 18px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 27px;
        }

         {
          /* .wrap :global(.ant-steps-item-title) {
          width: 200px;
          text-align: left;
        } */
        }
      `}</style>
    </div>
  );
};

export default App;
