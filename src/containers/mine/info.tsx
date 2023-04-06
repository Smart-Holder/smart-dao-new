import React, { useEffect, useState } from 'react';
import { Button, Input, Image, message } from 'antd';
import { Form, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

import Upload from '@/components/form/upload';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUserInfo } from '@/store/features/userSlice';

import { request } from '@/api';
import { getCookie } from '@/utils/cookie';
import { validateImage } from '@/utils/image';
import { validateChinese } from '@/utils/validator';
import { isRepeate } from '@/utils';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const Info = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((store) => store.common);
  const { userInfo } = useAppSelector((store) => store.user);

  const [image, setImage] = useState(userInfo.image);
  const [isEdit, setIsEdit] = useState(false);
  const [initialValues, setInitialValues] = useState({
    nickname: userInfo.nickname,
  });

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ nickname: userInfo.nickname });
    setImage(userInfo.image);
  }, [userInfo]);

  const onValuesChange = (changedValues: any, values: any) => {
    setIsEdit(!isRepeate(initialValues, values));
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    if (image) {
      const params = {
        ...userInfo,
        image,
        nickname: values.nickname,
      };

      try {
        await request({
          name: 'user',
          method: 'setUser',
          params,
        });

        const res = await request({
          name: 'user',
          method: 'getUser',
          params,
        });

        if (res && res.nickname) {
          dispatch(setUserInfo(res));
          setIsEdit(false);
          message.success('success!');
        }
      } catch (error: any) {
        // message.error(error?.message);
        // console.error(error);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  const onImageChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'done') {
      setImage(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
      setIsEdit(true);
    }
  };

  return (
    <div className="card" style={{ margin: '50px 0' }}>
      <div className="h1">{formatMessage({ id: 'my.information.title' })}</div>
      {/* <div className="h2">Lorem ipsum dolor sit amet, consectetur</div> */}

      <Form
        style={{ marginTop: 40 }}
        className="form"
        name="info"
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
        <Form.Item
          name="nickname"
          label={formatMessage({ id: 'my.information.nickname' })}
          rules={[
            { required: true },
            { type: 'string', min: 5, max: 12 },
            { validator: validateChinese },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Upload Rectangle Picture" valuePropName="fileList">
          <Upload value={image} onChange={onImageChange} />
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

      <style jsx>
        {`
          .info-wrap .upload-desc {
            height: 21px;
            font-size: 14px;
            font-weight: 400;
            color: #969ba0;
            line-height: 21px;
          }
        `}
      </style>
    </div>
  );
};

export default Info;
