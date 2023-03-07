import React, { useEffect, useState } from 'react';
import { Button, Input, Image, message } from 'antd';
import { Form, Upload, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

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
        message.error(error?.message);
        console.error(error);
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

  const beforeUpload = (file: RcFile) => {
    const message = validateImage(file);

    return !message;
  };

  return (
    <div className="info-wrap">
      <div className="h1">{formatMessage({ id: 'my.information.title' })}</div>
      {/* <div className="h2">Lorem ipsum dolor sit amet, consectetur</div> */}

      <Form
        name="info"
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
        autoComplete="off"
        labelAlign="left"
        requiredMark={false}
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
            className="smart-input"
            prefix={
              <span className="smart-input-prefix">
                {formatMessage({ id: 'name' })}:
              </span>
            }
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
              onChange={onImageChange}
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

            <span className="upload-desc">
              {formatMessage({ id: 'my.information.upload' })}
            </span>
          </Space>
        </Form.Item>

        <Form.Item>
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
          .info-wrap {
            max-width: 690px;
            padding: 60px 0 0 16px;
          }

          .h1 {
            height: 30px;
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 30px;
          }

          .h2 {
            height: 18px;
            margin-top: 7px;
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .info-wrap .upload-desc {
            height: 21px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 21px;
          }

          .info-wrap :global(.button-submit) {
            width: 168px;
            height: 53px;
            margin-top: 132px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 27px;
          }
        `}
      </style>
    </div>
  );
};

export default Info;
