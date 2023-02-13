import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Modal, Typography, Image, Row, Col } from 'antd';
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

import { Permissions } from '@/config/enum';

import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const { Link } = Typography;

const validateMessages = {
  required: '${label} is required!',
  string: {
    range: "'${label}' must be between ${min} and ${max} characters",
  },
};

const App = (props: any, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((store) => store.user);
  const { currentMember } = useAppSelector((store) => store.dao);

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

  const onCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
  };

  const handleSubmit = () => {};

  return (
    <Modal width={512} open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className="content">
        <div className="h1">变更权利</div>
        {/* <div className="h2"></div> */}

        <Form
          name="info"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
          layout="vertical"
          requiredMark={false}
          validateTrigger="onBlur"
        >
          <Form.Item name="permissions" label="权限设置">
            <Checkbox.Group
              className="checkbox-group"
              defaultValue={currentMember.permissions || []}
            >
              <Row style={{ width: '100%' }} gutter={[0, 10]}>
                <Col span={8}>
                  <Checkbox value={Permissions.Action_VotePool_Vote}>
                    投票
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={Permissions.Action_VotePool_Create}>
                    发起提案
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={Permissions.Action_Member_Create}>
                    添加NFTP
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={Permissions.Action_Asset_SafeMint}>
                    发行资产
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={Permissions.Action_Asset_Shell_Withdraw}>
                    上架资产
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={Permissions.Action_DAO_Settings}>
                    修改DAO的基础设置
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item style={{ margin: '60px 0 0', textAlign: 'center' }}>
            <Button className="button-submit" type="primary" htmlType="submit">
              变更并生成提案
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
            margin-bottom: 30px;
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 30px;
          }

          .h2 {
            margin-top: 7px;
            margin-bottom: 30px;
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .content :global(.input) {
            height: 76px;
            font-size: 18px;
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

          .content :global(.ant-form-item .ant-form-item-label > label) {
            font-size: 16px;
          }
        `}
      </style>
    </Modal>
  );
};

export default forwardRef(App);
