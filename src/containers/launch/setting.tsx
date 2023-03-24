import { useEffect, useRef } from 'react';
import { Col, Row, Steps } from 'antd';
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

  const template = getMakeDAOStorage('template');

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
      <div className="title">
        {step === 0 ? 'Select service stencil' : template?.title}
      </div>

      {step !== 0 && (
        <Row>
          <Col span={22}>
            <Steps
              className="steps"
              style={{ marginTop: 40 }}
              current={step - 1}
              items={items.current}
              labelPlacement="vertical"
              responsive={false}
            />
          </Col>
        </Row>
      )}

      <div>
        {step === 0 && <Template />}
        {step === 1 && <Tax />}
        {step === 2 && <Vote />}
        {step === 3 && <Executor />}
        {step === 4 && <Review />}
      </div>

      <style jsx>
        {`
          .wrap {
            padding: 30px 80px 100px;
          }

          .title {
            height: 45px;
            font-size: 38px;
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 45px;
          }

          .wrap
            :global(
              .ant-steps
                .ant-steps-item-finish
                .ant-steps-item-icon
                > .ant-steps-icon
            ) {
            color: #fff;
          }
          .wrap :global(.steps .ant-steps-item:last-child) {
            flex: 1;
          }
          .wrap :global(.steps .ant-steps-item-icon) {
            margin-left: 0;
          }
          .wrap :global(.steps .ant-steps-item-tail) {
            margin-left: 16px !important;
          }
          .wrap :global(.steps .ant-steps-item-content) {
            width: 90%;
          }
          .wrap :global(.steps .ant-steps-item-description) {
            font-size: 14px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 20px;
            text-align: left;
          }
        `}
      </style>
    </div>
  );
};

export default App;
