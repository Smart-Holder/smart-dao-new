import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Modal, Typography, Image } from 'antd';
import { Checkbox, Form, Upload, Tag, Space } from 'antd';
import Icon, { RightCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUserInfo } from '@/store/features/userSlice';

import { connectType } from '@/config/enum';

import { validateChinese, validateEthAddress } from '@/utils/validator';
import { getCookie } from '@/utils/cookie';
import { validateImage, getBase64 } from '@/utils/image';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import sdk from 'hcstore/sdk';

const { Link } = Typography;

const validateMessages = {
  required: '${label} is required!',
  string: {
    range: "'${label}' must be between ${min} and ${max} characters",
  },
};

const InfoModal = (props: any, ref: any) => {
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
    <Modal width={512} open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className="content">
        <div className="h1">Personal Information</div>
        <div className="h2">Lorem ipsum dolor sit amet, consectetur</div>

        <Form
          name="info"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
          requiredMark={false}
          validateMessages={validateMessages}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="nickname"
            rules={[
              { required: true },
              { type: 'string', min: 5, max: 12 },
              { validator: validateChinese },
            ]}
          >
            <Input
              className="input"
              prefix={<span style={{ color: '#000' }}>Name:</span>}
            />
          </Form.Item>

          <Form.Item valuePropName="fileList">
            <Space>
              <Upload
                action={process.env.NEXT_PUBLIC_QINIU_UPLOAD_URL}
                data={{ token: getCookie('qiniuToken') }}
                showUploadList={false}
                listType="picture-card"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {image ? (
                  <Image
                    style={{ borderRadius: 10, cursor: 'pointer' }}
                    src={image}
                    width={100}
                    height={100}
                    preview={false}
                    alt="image"
                  />
                ) : (
                  <div>
                    <PlusOutlined />
                  </div>
                )}
              </Upload>

              <span className="upload-desc">Upload Images: png、jpeg… </span>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              className="button-submit"
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>

      <style jsx>
        {`
          .content {
            padding: 25px 16px;
          }

          .h1 {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 30px;
          }

          .h2 {
            margin-top: 7px;
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .content :global(.input) {
            height: 76px;
            margin-top: 39px;

            font-size: 18px;
          }

          .upload-desc {
            height: 21px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 21px;
          }

          .content :global(.button-submit) {
            width: 170px;
            height: 54px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 27px;
          }
        `}
      </style>
    </Modal>
  );
};

export default forwardRef(InfoModal);
