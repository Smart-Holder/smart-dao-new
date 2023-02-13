import React, { useState, forwardRef, createRef } from 'react';
import {
  Button,
  Input,
  Space,
  Typography,
  Image,
  Row,
  Col,
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
import { formatAddress } from '@/utils';
import { Permissions } from '@/config/enum';

import TransferModal from '@/components/modal/transferModal';
import PermissionModal from '@/components/modal/permissionModal';

import { setMemberInfo } from '@/api/member';

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const App = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((store) => store.user);
  const { addressFormat } = useAppSelector((store) => store.wallet);
  const { currentMember } = useAppSelector((store) => store.dao);
  const { loading } = useAppSelector((store) => store.common);
  const [image, setImage] = useState(currentMember.image);
  const [imageMessage, setImageMessage] = useState('');

  const transferModal: any = createRef();
  const permissionModal: any = createRef();

  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    if (!image) {
      setImageMessage('Image is required');
      return;
    }

    await setMemberInfo({ ...values, image });

    message.success('success');
    window.location.reload();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  const onImageChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'done') {
      setImage(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
      setImageMessage('');
    }
  };

  const beforeUpload = (file: RcFile) => {
    const message = validateImage(file);

    return !message;
  };

  // 转让
  const transfer = () => {
    transferModal.current.show();
  };

  const onCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
  };

  // 设置权限
  const setPermission = () => {
    permissionModal.current.show();
  };

  return (
    <div className="wrap">
      <div className="h1">个人信息</div>
      <div className="h2">
        Lorem ipsum dolor sit amet, consectetur
        <div className="h2-item">
          Address: <span>{addressFormat}</span>
        </div>
        <div className="h2-item">
          User ID: <span>{userInfo.id}</span>
        </div>
      </div>

      <Form
        name="info"
        initialValues={{ name: currentMember.name }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        requiredMark={false}
        validateTrigger="onBlur"
      >
        <Form.Item
          name="name"
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

        <Form.Item
          valuePropName="fileList"
          extra={<span style={{ color: 'red' }}>{imageMessage}</span>}
        >
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

            <span className="upload-desc">Upload Images: png、jpeg… </span>
          </Space>
        </Form.Item>

        <div className="items">
          <div className="item">
            <span>{formatAddress(currentMember.host)}</span>
            <span className="label">NFTP</span>
          </div>
          <div className="item" style={{ margin: '0 20px' }}>
            <span>{currentMember.id}</span>
            <span className="label">ID</span>
          </div>
          <div className="item">
            <span>{currentMember.votes}</span>
            <span className="label">份数</span>
          </div>
        </div>

        <Form.Item>
          <div className="buttons">
            <Button
              className="button"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Save
            </Button>
            <Button
              className="button"
              type="primary"
              htmlType="button"
              onClick={transfer}
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
        defaultValue={currentMember.permissions || []}
        onChange={onCheckboxChange}
      >
        <Row style={{ width: '100%' }} gutter={[20, 48]}>
          <Col span={6}>
            <Checkbox value={Permissions.Action_VotePool_Vote}>投票</Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value={Permissions.Action_VotePool_Create}>
              发起提案
            </Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value={Permissions.Action_Member_Create}>
              添加NFTP
            </Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value={Permissions.Action_Asset_SafeMint}>
              发行资产
            </Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value={Permissions.Action_Asset_Shell_Withdraw}>
              上架资产
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value={Permissions.Action_DAO_Settings}>
              修改DAO的基础设置
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>

      <div className="buttons">
        <Button className="button" type="primary" onClick={setPermission}>
          Change
        </Button>
      </div>

      <TransferModal ref={transferModal} />
      <PermissionModal ref={permissionModal} />

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
