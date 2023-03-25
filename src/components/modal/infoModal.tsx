import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Image } from 'antd';
import { Form, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import Modal from '@/components/modal';
import Upload from '@/components/form/upload';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUserInfo } from '@/store/features/userSlice';

import { validateChinese } from '@/utils/validator';
import { getCookie } from '@/utils/cookie';
import { validateImage, getBase64 } from '@/utils/image';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import sdk from 'hcstore/sdk';
import { useIntl } from 'react-intl';

const validateMessages = {
  required: '${label} is required!',
  string: {
    range: "'${label}' must be between ${min} and ${max} characters",
  },
};

const InfoModal = (props: any, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((store) => store.user);

  const [image, setImage] = useState();

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalOpen(true);
    },
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    console.log('validate Success:', values);

    if (image) {
      const params = {
        ...userInfo,
        image,
        nickname: values.nickname,
      };

      sdk.user.methods.setUser(params).then(() => {
        handleCancel();
        sdk.user.methods.getUser().then((res) => {
          if (res && res.nickname) {
            dispatch(setUserInfo(res));
          }
        });
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'done') {
      console.log('upload', info.file);
      setImage(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const message = validateImage(file);

    return !message;
  };

  const handleSubmit = () => {};

  return (
    <Modal type="form" open={isModalOpen} onCancel={handleCancel}>
      <div className="title">
        {formatMessage({ id: 'my.information.title' })}
      </div>

      <Form
        className="form"
        name="info"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        layout="vertical"
        requiredMark={false}
        validateMessages={validateMessages}
        validateTrigger="onBlur"
      >
        <Form.Item
          name="nickname"
          label={formatMessage({ id: 'name' })}
          rules={[
            { required: true },
            { type: 'string', min: 5, max: 12 },
            { validator: validateChinese },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Image" required valuePropName="fileList">
          <Upload value={image} onChange={handleChange} />
        </Form.Item>

        <Form.Item style={{ marginTop: 50, marginBottom: 0 }}>
          <Button
            className="button-submit"
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default forwardRef(InfoModal);
