import React, { useState, forwardRef, useRef } from 'react';
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
import { useIntl } from 'react-intl';

import sdk from 'hcstore/sdk';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUserInfo } from '@/store/features/userSlice';

import { getCookie } from '@/utils/cookie';
import { validateImage, getBase64 } from '@/utils/image';
import { validateChinese, validateEthAddress } from '@/utils/validator';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { formatAddress, isRepeate, isRepeateArray } from '@/utils';
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
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((store) => store.user);
  const { addressFormat } = useAppSelector((store) => store.wallet);
  const { currentMember } = useAppSelector((store) => store.dao);
  // const { loading } = useAppSelector((store) => store.common);

  const [initialValues, setInitialValues] = useState({
    name: currentMember.name,
    image: currentMember.image,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(currentMember.image);
  const [imageMessage, setImageMessage] = useState('');
  const [permissions, setPermissions] = useState(currentMember.permissions);

  const transferModal: any = useRef(null);
  const permissionModal: any = useRef(null);

  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const onValuesChange = (changedValues: any, values: any) => {
    setIsEdit(!isRepeate(initialValues, values));
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    if (!image) {
      setImageMessage('Image is required');
      return;
    }

    setLoading(true);

    await setMemberInfo({ ...values, image });

    setLoading(false);
    setIsEdit(false);
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
      setIsEdit(true);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const message = validateImage(file);

    return !message;
  };

  // 转让
  const showTransferModal = () => {
    transferModal.current.show();
  };

  const onCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    // console.log('checked = ', checkedValues);
    setPermissions(checkedValues);
  };

  // 设置权限
  const showPermissionModal = () => {
    permissionModal.current.show(permissions);
  };

  return (
    <div className="wrap">
      <div className="h1">{formatMessage({ id: 'sider.my.information' })}</div>
      <div className="h2">
        {/* Lorem ipsum dolor sit amet, consectetur */}
        <div className="h2-item">
          {formatMessage({ id: 'my.information.address' })}:{' '}
          <span>{addressFormat}</span>
        </div>
        <div className="h2-item">
          {formatMessage({ id: 'my.information.id' })}:{' '}
          <span>{userInfo.id}</span>
        </div>
      </div>

      <Form
        name="info"
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
          name="name"
          rules={[
            { required: true },
            { type: 'string', min: 5, max: 12 },
            { validator: validateChinese },
          ]}
        >
          <Input
            className="input"
            prefix={
              <span style={{ color: '#000' }}>
                {formatMessage({ id: 'name' })}:
              </span>
            }
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

            <span className="upload-desc">
              {formatMessage({ id: 'my.information.upload' })}
            </span>
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
            <span className="label">
              {formatMessage({ id: 'my.information.copies' })}
            </span>
          </div>
        </div>

        <Form.Item>
          <div className="buttons">
            <Button
              className="button"
              type="primary"
              htmlType="submit"
              disabled={!isEdit}
              loading={loading}
            >
              {formatMessage({ id: 'my.information.save' })}
            </Button>
            <Button
              className="button"
              type="primary"
              htmlType="button"
              onClick={showTransferModal}
            >
              {formatMessage({ id: 'my.information.transfer' })}
            </Button>
          </div>
        </Form.Item>
      </Form>

      <div className="h1" style={{ marginTop: 30 }}>
        {formatMessage({ id: 'my.information.rights' })}
      </div>
      {/* <div className="h2">Lorem ipsum dolor sit amet, consectetur</div> */}

      <Checkbox.Group
        className="checkbox-group"
        defaultValue={permissions || []}
        onChange={onCheckboxChange}
      >
        <Row style={{ width: '100%' }} gutter={[20, 48]}>
          <Col span={8}>
            <Checkbox disabled value={Permissions.Action_VotePool_Vote}>
              {formatMessage({ id: 'my.information.rights.vote' })}
            </Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox disabled value={Permissions.Action_VotePool_Create}>
              {formatMessage({ id: 'my.information.rights.proposal' })}
            </Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox disabled value={Permissions.Action_Member_Create}>
              {formatMessage({ id: 'my.information.rights.add' })}
            </Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox disabled value={Permissions.Action_Asset_SafeMint}>
              {formatMessage({ id: 'my.information.rights.publish' })}
            </Checkbox>
          </Col>
          {/* <Col span={8}>
            <Checkbox value={Permissions.Action_Asset_Shell_Withdraw}>
              上架资产
            </Checkbox>
          </Col> */}
          <Col span={12}>
            <Checkbox disabled value={Permissions.Action_DAO_Settings}>
              {formatMessage({ id: 'my.information.rights.basic' })}
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>

      <div className="buttons">
        <Button className="button" type="primary" onClick={showPermissionModal}>
          {formatMessage({ id: 'my.information.change' })}
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
            margin-right: 20px;
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
            line-height: 27px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
