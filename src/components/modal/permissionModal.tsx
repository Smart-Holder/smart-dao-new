import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Input,
  Modal,
  Typography,
  Image,
  Row,
  Col,
  message,
} from 'antd';
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
import { createVote } from '@/api/vote';

const { Link } = Typography;

const validateMessages = {
  required: '${label} is required!',
  string: {
    range: "'${label}' must be between ${min} and ${max} characters",
  },
};

const PermissionMap: { [index: number]: string } = {
  0x22a25870: '添加NFTP',
  0xdc6b0b72: '发起提案',
  0x678ea396: '投票',
  0x59baef2a: '发行资产',
  0xd0a4ad96: '修改DAO的基础设置',
};

const App = (props: any, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((store) => store.user);
  const { currentMember } = useAppSelector((store) => store.dao);

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  useImperativeHandle(ref, () => ({
    show: (permissions: number[]) => {
      setIsModalOpen(true);
      setInitialValues({ permissions });
    },
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    const add: any = []; // 添加的权限
    const remove: any = []; // 删除的权限

    values.permissions.forEach((v: any) => {
      if (!currentMember.permissions.includes(v)) {
        add.push(v);
      }
    });

    currentMember.permissions.forEach((v: any) => {
      if (!values.permissions.includes(v)) {
        remove.push(v);
      }
    });

    const extra = [];

    if (add.length > 0) {
      extra.push({
        abi: 'member',
        method: 'addPermissions',
        params: [[currentMember.tokenId], add],
      });
    }

    if (remove.length > 0) {
      extra.push({
        abi: 'member',
        method: 'removePermissions',
        params: [[currentMember.tokenId], remove],
      });
    }

    // 权限名称
    const labels = values.permissions.map((v: number) => PermissionMap[v]);

    const params = {
      name: '变更权限',
      description: JSON.stringify({
        type: 'basic',
        purpose: `变更权限: ${labels.valueOf()}`,
      }),
      extra,
    };

    try {
      setLoading(true);
      await createVote(params);
      message.success('生成提案');
      console.log('create success');
      setLoading(false);
      handleCancel();
      // router.push('/dashboard/governance/votes');
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  return (
    <Modal
      width={512}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <div className="content">
        <div className="h1">变更权利</div>
        {/* <div className="h2"></div> */}

        <Form
          name="info"
          initialValues={initialValues}
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
              // defaultValue={currentMember.permissions || []}
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
                {/* <Col span={8}>
                  <Checkbox value={Permissions.Action_Asset_Shell_Withdraw}>
                    上架资产
                  </Checkbox>
                </Col> */}
                <Col span={16}>
                  <Checkbox value={Permissions.Action_DAO_Settings}>
                    修改DAO的基础设置
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item style={{ margin: '60px 0 0', textAlign: 'center' }}>
            <Button
              className="button-submit"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
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
