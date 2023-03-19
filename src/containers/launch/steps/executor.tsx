import { Form, Input } from 'antd';

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

  const validateExist = (rule: any, value: string) => {
    const member = (startValues?.members || []).find(
      (item: any) => item.owner.toLowerCase() === value?.toLowerCase(),
    );

    if (value && !member?.id) {
      // callback(new Error(i18n.t('rules.ethAddress')));
      return Promise.reject(new Error('no such member'));
    }

    return Promise.resolve();
  };

  return (
    <div className="card" style={{ margin: '40px 0 0' }}>
      <div className="h1">{formatMessage({ id: 'launch.executor.title' })}</div>
      <div className="h2">
        {formatMessage({ id: 'launch.executor.subtitle' })}
      </div>

      <Form
        className="form"
        form={form}
        wrapperCol={{ span: 17 }}
        initialValues={storageValues}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
        validateTrigger="onBlur"
      >
        <Form.Item
          name="address"
          style={{ marginTop: 40 }}
          label={formatMessage({ id: 'launch.executor.address' })}
          rules={[
            { required: true },
            { validator: validateEthAddress },
            { validator: validateExist },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>

      <div className="desc">
        {formatMessage({ id: 'launch.executor.info' })}
      </div>

      <Footer prev={prev} next={next} />

      <style jsx>
        {`
          .desc {
            height: 26px;
            margin-top: 19px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 26px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
