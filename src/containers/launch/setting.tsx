import { useEffect, useRef } from 'react';
import { Steps } from 'antd';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import Template from '@/containers/launch/steps/template';
import Tax from '@/containers/launch/steps/tax';
import Vote from '@/containers/launch/steps/vote';
import Executor from '@/containers/launch/steps/executor';
import Review from '@/containers/launch/steps/review';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { resetStep } from '@/store/features/daoSlice';

import { getMakeDAOStorage } from '@/utils/launch';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { step } = useAppSelector((store) => store.dao);

  const items = useRef([
    { description: formatMessage({ id: 'launch.tax.title' }) },
    { description: formatMessage({ id: 'launch.vote.title' }) },
    { description: formatMessage({ id: 'launch.executor.title' }) },
    { description: formatMessage({ id: 'launch.review.title' }) },
  ]);

  useEffect(() => {
    const cacheDAO = getMakeDAOStorage('start');

    if (cacheDAO) {
      dispatch(resetStep());
    } else {
      router.replace('/');
    }
  }, [chainId, address]);

  return (
    <div className="wrap">
      {step !== 0 && (
        <Steps
          current={step - 1}
          items={items.current}
          labelPlacement="vertical"
          responsive={false}
        />
      )}

      {step === 0 && <Template />}

      <div>
        {step === 1 && <Tax />}
        {step === 2 && <Vote />}
        {step === 3 && <Executor />}
        {step === 4 && <Review />}
      </div>

      <style jsx>
        {`
          .wrap
            :global(
              .ant-steps
                .ant-steps-item-finish
                .ant-steps-item-icon
                > .ant-steps-icon
            ) {
            color: #fff;
          }
        `}
      </style>
    </div>
  );
};

export default App;
