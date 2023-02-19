import { useState } from 'react';
import { Form, Input } from 'antd';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

import { validateEthAddress } from '@/utils/validator';
import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';
import { useIntl } from 'react-intl';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const startValues = getMakeDAOStorage('start') || {};
  const storageValues = getMakeDAOStorage('executor') || {};

  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const prev = () => {
    dispatch(prevStep());
  };

  const next = () => {
    form.validateFields().then((res) => {
      const values = { ...res };

      const member = (startValues?.members || []).find(
        (item: any) =>
          item.owner.toLowerCase() === values.address.toLowerCase(),
      );

      values.executor = member?.id || 0;

      setMakeDAOStorage('executor', values);
      dispatch(nextStep());
    });
  };

  return (
    <div className="wrap">
      <div className="h1">{formatMessage({ id: 'launch.executor.title' })}</div>
      <div className="h2">
        {formatMessage({ id: 'launch.executor.subtitle' })}
      </div>

      <Form
        form={form}
        initialValues={storageValues}
        autoComplete="off"
        requiredMark={false}
        validateTrigger="onBlur"
      >
        <Form.Item
          name="address"
          rules={[{ required: true }, { validator: validateEthAddress }]}
        >
          <Input
            className="input"
            prefix={
              <span style={{ color: '#000' }}>
                {formatMessage({ id: 'launch.executor.address' })}:
              </span>
            }
          />
        </Form.Item>
      </Form>

      <div className="desc">
        {formatMessage({ id: 'launch.executor.info' })}
      </div>

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

        .wrap :global(.input) {
          height: 54px;
          margin-top: 50px;
          font-size: 18px;
        }

        .desc {
          height: 26px;
          margin-top: 19px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #969ba0;
          line-height: 26px;
        }
      `}</style>
    </div>
  );
};

export default App;
