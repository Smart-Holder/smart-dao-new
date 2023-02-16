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
  message,
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

import Slider from '@/components/slider';
import { createVote } from '@/api/vote';
import { useRouter } from 'next/router';

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const App = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((store) => store.user);
  const { address } = useAppSelector((store) => store.wallet);
  const { loading } = useAppSelector((store) => store.common);
  const [image, setImage] = useState();

  const initialValues = {
    executor: address,
  };

  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const onFinish = async (values: any) => {
    console.log('form success:', values);

    const params = {
      name: values.name,
      description: JSON.stringify({
        type: 'normal',
        ...values,
      }),
    };

    try {
      await createVote(params);
      message.success('success');
      console.log('create success');
      router.push('/dashboard/governance/votes');
    } catch (error) {
      console.error(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('form Failed:', errorInfo);
  };

  const onExecutorChange = () => {};
  const handleSubmit = () => {};

  return (
    <div className="wrap">
      <div className="h1">发起普通提案</div>
      <div className="h2">Lorem ipsum dolor sit amet, consectetur</div>

      <Form
        name="basic"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        layout="vertical"
        requiredMark={false}
        validateTrigger="onBlur"
      >
        <Form.Item
          label="提案标题"
          name="name"
          rules={[
            { required: true },
            { type: 'string', min: 5, max: 30 },
            { validator: validateChinese },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="提案目的" name="purpose">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="提案内容" name="content">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="预期结果" name="result">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          style={{ width: '100%' }}
          label="执行人"
          name="executor"
          rules={[{ required: true }, { validator: validateEthAddress }]}
        >
          <Input className="input" prefix={<Avatar size={30} src={url} />} />
          {/* <div className="item-group">
            <Button
              className="button"
              type="primary"
              htmlType="button"
              onClick={onExecutorChange}
            >
              Replace
            </Button>
          </div> */}
        </Form.Item>

        <Form.Item>
          <Button
            className="button-submit"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Save
          </Button>
        </Form.Item>
      </Form>

      <style jsx>
        {`
          .wrap {
            max-width: 375px;
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
            margin-bottom: 44px;
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .wrap .item-group {
            display: flex;
            align-items: center;
          }

          .wrap :global(.button-submit) {
            width: 170px;
            height: 54px;
            font-size: 18px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
