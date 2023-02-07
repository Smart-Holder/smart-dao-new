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

import Slider from '@/components/slider';

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

  const onTaxChange1 = (value: number) => {
    console.log(value);
  };

  const onTaxChange2 = (value: number) => {
    console.log(value);
  };

  const handleSubmit = () => {};

  return (
    <div className="wrap">
      <div className="h1">Setting Executor</div>
      <div className="h2">Lorem ipsum dolor sit amet, consectetur</div>

      <Slider
        style={{ paddingTop: 23 }}
        defaultValue={60}
        label="Issuance Tax"
        color="#FF6D4C"
        onAfterChange={onTaxChange1}
      />
      <Slider
        defaultValue={30}
        label="Circulation Tax"
        color="#2AC154"
        onAfterChange={onTaxChange2}
      />
      <Slider
        defaultValue={30}
        label="投票期"
        unit="hr"
        max={200}
        onAfterChange={onTaxChange2}
      />

      <Button
        className="button"
        type="primary"
        htmlType="submit"
        onClick={handleSubmit}
      >
        Change
      </Button>

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
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .wrap :global(.button) {
            width: 168px;
            height: 54px;
            margin-top: 40px;
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
