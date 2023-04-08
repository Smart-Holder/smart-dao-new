import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useIntl } from 'react-intl';

import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

import Upload from '@/components/form/upload';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getDAO, setCurrentDAO } from '@/store/features/daoSlice';

import { isRepeate } from '@/utils';
import { validateChinese } from '@/utils/validator';
import { formatToObj } from '@/utils/extend';

import { request } from '@/api';
import { setInformation } from '@/api/dao';

// const validateMessages = {
//   required: '${label} is required!',
//   string: {
//     range: "'${label}' must be between ${min} and ${max} characters",
//   },
// };

const App: React.FC = () => {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { loading } = useAppSelector((store) => store.common);

  const [initialValues, setInitialValues] = useState() as any;
  const [isEdit, setIsEdit] = useState(false);

  const [logo, setLogo] = useState(currentDAO.image);
  const [poster, setPoster] = useState();

  useEffect(() => {
    const getDAO = async () => {
      try {
        const res = await request({
          name: 'utils',
          method: 'getDAO',
          params: { chain: chainId, address: currentDAO.address },
        });

        if (res) {
          dispatch(setCurrentDAO(res));

          const extend = formatToObj(res?.extend?.data);
          setLogo(res.image);
          setPoster(extend.poster || res.image);

          setInitialValues({
            name: res.name,
            mission: res.mission,
            description: res.description,
            image: res.image,
            poster: extend.poster || res.image,
          });

          form.setFieldsValue({
            name: res.name,
            mission: res.mission,
            description: res.description,
            image: res.image,
            poster: extend.poster || res.image,
          });

          setIsEdit(false);
        }
      } catch (error) {}
    };

    getDAO();
  }, [chainId, address]);

  const onValuesChange = (changedValues: any, values: any) => {
    setIsEdit(!isRepeate(initialValues, values));
  };

  const onFinish = async (values: any) => {
    const params: any = {};

    Object.entries(values).forEach(([key, value]) => {
      if (value !== initialValues[key]) {
        params[key] = value;
      }
    });

    if (logo !== initialValues.image) {
      params.image = logo;
    }

    if (poster !== initialValues.poster) {
      params.extend = { poster };
    }

    try {
      await setInformation(params);
      dispatch(getDAO({ chain: chainId, address: currentDAO.address }));
      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('form Failed:', errorInfo);
  };

  const handleLogoChange: UploadProps['onChange'] = async (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'done') {
      const newLogo =
        process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key;

      setLogo(newLogo);
      setIsEdit(true);
    }
  };

  const handlePosterChange: UploadProps['onChange'] = async (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'done') {
      const newPoster =
        process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key;
      setPoster(newPoster);
      setIsEdit(true);
    }
  };

  if (!initialValues) {
    return null;
  }

  return (
    <div className="card">
      <Form
        className="form"
        name="basic"
        form={form}
        wrapperCol={{ span: 17 }}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
        autoComplete="off"
        labelAlign="left"
        layout="vertical"
        requiredMark={false}
        validateTrigger="onBlur"
      >
        <div className="h1">{formatMessage({ id: 'start.basic' })}</div>
        <div className="h2">{formatMessage({ id: 'start.desc' })}</div>

        <Form.Item
          name="name"
          style={{ marginTop: 40 }}
          label={formatMessage({ id: 'start.name' })}
          rules={[
            { required: true },
            { type: 'string', min: 5, max: 12 },
            { validator: validateChinese },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="mission"
          label={formatMessage({ id: 'start.mission' })}
          rules={[{ required: true }, { type: 'string', min: 20, max: 150 }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'start.introduce' })}
          name="description"
          rules={[{ required: true }, { type: 'string', min: 20, max: 150 }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>

        <Form.Item label="Logo" valuePropName="fileList">
          <Upload value={logo} onChange={handleLogoChange} />
        </Form.Item>

        <Form.Item label="Poster" valuePropName="fileList">
          <Upload
            type="rectangle"
            value={poster}
            onChange={handlePosterChange}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 100 }}>
          <Button
            className="button-submit"
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!isEdit}
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
