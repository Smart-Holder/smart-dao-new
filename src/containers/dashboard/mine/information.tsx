import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Input, Space, Typography, Image, Row, Col } from 'antd';
import { Checkbox, Form, Upload, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import sdk from 'hcstore/sdk';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUserInfo } from '@/store/features/userSlice';

import { getCookie } from '@/utils/cookie';
import { validateImage, getBase64 } from '@/utils/image';
import { validateChinese, validateEthAddress } from '@/utils/validator';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const App = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((store) => store.user);
  const [image, setImage] = useState();
  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const onFinish = (values: any) => {
    console.log('validate Success:', values);

    if (image) {
      const params = {
        ...userInfo,
        image,
        nickname: values.nickname,
      };

      sdk.user.methods.setUser(params).then(() => {
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
      setImage(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const message = validateImage(file);

    return !message;
  };

  const handleSubmit = () => {};

  const onCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
  };

  return (
    <div className="wrap">
      <div className="h1">SGE ZHI NIDE SHUISHOU GUIZI !</div>
      <div className="h2">
        Lorem ipsum dolor sit amet, consectetur
        <div className="h2-item">
          Address: <span>0x232...2312</span>
        </div>
        <div className="h2-item">
          User ID: <span>12</span>
        </div>
      </div>

      <Form
        name="info"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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

        <div className="items">
          <div className="item">
            <span>0x8……78cs</span>
            <span className="label">NFTP</span>
          </div>
          <div className="item" style={{ margin: '0 20px' }}>
            <span>428Edm23</span>
            <span className="label">Identity Document</span>
          </div>
          <div className="item">
            <span>1234</span>
            <span className="label">Frantes</span>
          </div>
        </div>

        <Form.Item>
          <div className="buttons">
            <Button
              className="button"
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button
              className="button"
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
            >
              Transfer
            </Button>
          </div>
        </Form.Item>
      </Form>

      <div className="h1" style={{ marginTop: 30 }}>
        NFTP Rights
      </div>
      <div className="h2">Lorem ipsum dolor sit amet, consectetur</div>

      <Checkbox.Group
        className="checkbox-group"
        defaultValue={['Pear']}
        onChange={onCheckboxChange}
      >
        <Row style={{ width: '100%' }} gutter={[20, 48]}>
          <Col span={6}>
            <Checkbox value="1">Issued</Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value="2">Issued</Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value="3">Issued</Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value="4">Issued</Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value="5">Issued</Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value="6">Issued</Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>

      <div className="buttons">
        <Button
          className="button"
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
        >
          Change
        </Button>
      </div>

      <style jsx>
        {`
          .wrap {
            max-width: 690px;
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
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 18px;
            margin-top: 7px;
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .h2-item {
            display: flex;
            align-items: center;
            height: 21px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 21px;
          }

          .h2-item span {
            height: 21px;
            margin-left: 9px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #3c4369;
            line-height: 21px;
          }

          .wrap :global(.input) {
            height: 76px;
            margin-top: 39px;

            font-size: 18px;
          }

          .wrap .upload-desc {
            height: 21px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 21px;
          }

          .items {
            display: flex;
            justify-content: space-between;
          }

          .items .item {
            display: flex;
            flex-direction: column;
            min-width: 200px;
            height: 113px;
            padding: 24px 16px 15px;
            border: 1px solid #f2f2f2;
            border-radius: 10px;

            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3c4369;
            line-height: 48px;
          }

          .items .item .label {
            font-size: 14px;
            color: #969ba0;
            line-height: 27px;
          }

          .wrap :global(.checkbox-group) {
            width: 100%;
            margin-top: 55px;
          }

          .wrap :global(.ant-checkbox-wrapper span:last-child) {
            padding-inline-start: 12px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 19px;
          }

          .wrap :global(.ant-checkbox-inner) {
            width: 19px;
            height: 19px;
          }

          .wrap .buttons {
            margin-top: 40px;
            text-align: right;
          }

          .wrap :global(.button) {
            width: 168px;
            height: 53px;
            margin-left: 20px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 27px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
