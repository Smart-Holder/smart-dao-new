import { Form, Input } from 'antd';

import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

import { validateEthAddress } from '@/utils/validator';
import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';
import { useIntl } from 'react-intl';

const App = ({
  type,
  onFinish,
}: {
  type?: string;
  onFinish?: (isFinish: boolean) => void;
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const startValues = getMakeDAOStorage('start') || {};
  const storageValues = getMakeDAOStorage('executor') || {
    address: startValues.members[0].owner,
    executor: startValues.members[0].id,
  };

  const [form] = Form.useForm();

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

  const onValuesChange = (changedValues: any) => {
    // let [[key, value]]: any = Object.entries(changedValues);
    // const nextValues: any = { ...values };

    // if (!value) {
    //   delete nextValues[key];
    // } else {
    //   nextValues[key] = key === 'time' ? formatDayjsValues(value) : value;
    // }

    // console.log('values', nextValues);
    // setValues(nextValues);

    form
      .validateFields()
      .then((res) => {
        const values = { ...res };

        const member = (startValues?.members || []).find(
          (item: any) =>
            item.owner.toLowerCase() === values.address.toLowerCase(),
        );

        values.executor = member?.id || 0;

        setMakeDAOStorage('executor', values);

        if (onFinish) {
          onFinish(true);
        }
      })
      .catch(() => {
        if (onFinish) {
          onFinish(false);
        }
      });
  };

  if (type === 'review') {
    return (
      <div style={{ marginTop: 100 }}>
        <div className="setting-h1">
          {formatMessage({ id: 'launch.executor.title' })}
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
          onValuesChange={onValuesChange}
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
      </div>
    );
  }

  return (
    <div style={{ margin: '40px 0 0' }}>
      <div className="setting-h1">
        {formatMessage({ id: 'launch.executor.title' })}
      </div>
      <div className="setting-h2">
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
            height: 22px;
            margin-top: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #b1b1b1;
            line-height: 22px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
