import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {
  Button,
  Input,
  Space,
  Typography,
  Image,
  Row,
  Col,
  Avatar,
} from 'antd';
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
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { loading } = useAppSelector((store) => store.common);
  const [image, setImage] = useState();
  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const initialValues = { executor: currentDAO.executor };

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
      <div className="h1">Setting Executor</div>
      <div className="h2">Lorem ipsum dolor sit amet, consectetur</div>

      {/* <div style={{ marginTop: 15 }}>
        <span className="label">User Name:</span>
        <span className="value">abc</span>
      </div> */}

      <Form
        style={{ marginTop: 16 }}
        name="info"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        requiredMark={false}
        validateTrigger="onBlur"
        layout="inline"
      >
        <Form.Item
          style={{ width: '100%' }}
          name="address"
          rules={[{ required: true }, { validator: validateEthAddress }]}
        >
          <div className="item-group">
            {/* <Input className="input" prefix={<Avatar size={30} src={url} />} /> */}
            <Input className="input" />
            <Button
              className="button"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Replace
            </Button>
          </div>
        </Form.Item>
      </Form>

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

          .wrap .label {
            height: 21px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 21px;
          }

          .wrap .value {
            height: 21px;
            margin-left: 15px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #3c4369;
            line-height: 21px;
          }

          .wrap .item-group {
            display: flex;
          }

          .wrap :global(.input) {
            flex: 1;
            height: 54px;
            font-size: 18px;
          }

          .wrap :global(.button) {
            width: 168px;
            height: 54px;
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
