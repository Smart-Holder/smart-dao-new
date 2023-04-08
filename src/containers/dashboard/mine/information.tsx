import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Row, Col, message } from 'antd';
import { Checkbox, Form } from 'antd';
import { useIntl } from 'react-intl';

import { useAppSelector } from '@/store/hooks';

import { validateChinese } from '@/utils/validator';

import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { isRepeate } from '@/utils';
import { Permissions } from '@/config/enum';

import TransferModal from '@/components/modal/transferModal';
import PermissionModal from '@/components/modal/permissionModal';
import Upload from '@/components/form/upload';

import { setMemberInfo } from '@/api/member';
import EllipsisMiddle from '@/components/typography/ellipsisMiddle';

const App = () => {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();

  const { userInfo } = useAppSelector((store) => store.user);
  const { address } = useAppSelector((store) => store.wallet);
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

  useEffect(() => {
    form.setFieldsValue({
      name: currentMember.name,
      image: currentMember.image,
    });
    setImage(currentMember.image);
    setPermissions(currentMember.permissions);
  }, [currentMember, form]);

  const onValuesChange = (changedValues: any, values: any) => {
    setIsEdit(!isRepeate(initialValues, values));
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    if (!image) {
      setImageMessage('Image is required');
      return;
    }

    try {
      setLoading(true);

      await setMemberInfo({ ...values, image });

      setLoading(false);
      setIsEdit(false);
      message.success('success');
      window.location.reload();
    } catch (error) {
      setLoading(false);
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
      setImageMessage('');
      setIsEdit(true);
    }
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
    <div className="card">
      <div className="h1">{formatMessage({ id: 'sider.my.information' })}</div>

      <div className="info">
        <div className="info-item">
          <span className="label">
            {formatMessage({ id: 'my.information.address' })}:
          </span>
          <span className="value">
            <EllipsisMiddle suffixCount={4} copyable>
              {address}
            </EllipsisMiddle>
          </span>
        </div>
        <div className="info-item">
          <span className="label">
            {formatMessage({ id: 'my.information.id' })}:
          </span>
          <span className="value">{userInfo.id}</span>
        </div>

        <div className="info-item">
          <span className="label">NFTP:</span>
          <span className="value">
            <EllipsisMiddle suffixCount={4} copyable>
              {currentMember.host}
            </EllipsisMiddle>
          </span>
        </div>
        <div className="info-item">
          <span className="label">ID:</span>
          <span className="value">{currentMember.id}</span>
        </div>
        <div className="info-item">
          <span className="label">
            {formatMessage({ id: 'my.information.copies' })}:
          </span>
          <span className="value">{currentMember.votes}</span>
        </div>
      </div>

      <Form
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
          name="name"
          label={formatMessage({ id: 'name' })}
          rules={[
            { required: true },
            { type: 'string', min: 5, max: 12 },
            { validator: validateChinese },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'avatar' })}
          valuePropName="fileList"
          extra={<span style={{ color: 'red' }}>{imageMessage}</span>}
        >
          <Upload value={image} onChange={onImageChange} />
        </Form.Item>

        <Form.Item style={{ marginTop: 50 }} wrapperCol={{ span: 24 }}>
          <Button
            className="button-submit"
            type="primary"
            ghost
            htmlType="submit"
            disabled={!isEdit}
            loading={loading}
          >
            {formatMessage({ id: 'my.information.save' })}
          </Button>
          <Button
            style={{ marginLeft: 25 }}
            className="button-submit"
            type="primary"
            htmlType="button"
            onClick={showTransferModal}
          >
            {formatMessage({ id: 'my.information.transfer' })}
          </Button>
        </Form.Item>
      </Form>

      <div className="h1" style={{ marginTop: 100 }}>
        {formatMessage({ id: 'my.information.rights' })}
      </div>
      {/* <div className="h2">Lorem ipsum dolor sit amet, consectetur</div> */}

      <Checkbox.Group
        className="checkbox-group"
        value={permissions || []}
        // defaultValue={permissions || []}
        onChange={onCheckboxChange}
      >
        <Row style={{ width: '100%' }} gutter={[20, 48]}>
          <Col span={6}>
            <Checkbox disabled value={Permissions.Action_VotePool_Vote}>
              {formatMessage({ id: 'my.information.rights.vote' })}
            </Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox disabled value={Permissions.Action_VotePool_Create}>
              {formatMessage({ id: 'my.information.rights.proposal' })}
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox disabled value={Permissions.Action_Member_Create}>
              {formatMessage({ id: 'my.information.rights.add' })}
            </Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox disabled value={Permissions.Action_Asset_SafeMint}>
              {formatMessage({ id: 'my.information.rights.publish' })}
            </Checkbox>
          </Col>
          {/* <Col span={6}>
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

      <div style={{ marginTop: 50 }}>
        <Button
          className="button-submit"
          type="primary"
          onClick={showPermissionModal}
        >
          {formatMessage({ id: 'my.information.change' })}
        </Button>
      </div>

      <TransferModal ref={transferModal} />
      <PermissionModal ref={permissionModal} />

      <style jsx>
        {`
          .info-item {
            margin: 40px 0;
          }

          .info-item .label {
            display: inline-block;
            width: 113px;
            height: 24px;
            font-size: 16px;
            font-weight: bold;
            color: #000000;
            line-height: 24px;
          }

          .info-item .value {
            height: 24px;
            font-size: 16px;
            font-weight: 600;
            color: #818181;
            line-height: 24px;
          }

          .info-item .value :global(.ant-typography) {
            font-size: 16px;
            font-weight: 600;
            color: #818181;
            line-height: 24px;
          }

          .card :global(.checkbox-group) {
            width: 100%;
            margin-top: 55px;
          }

          .card :global(.ant-checkbox-wrapper span:last-child) {
            padding-inline-start: 12px;
            font-size: 16px;
            font-weight: 400;
            color: #000000;
            line-height: 19px;
          }

          .card :global(.ant-checkbox-inner) {
            width: 19px;
            height: 19px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
