import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal, Row, Col, message } from 'antd';
import { Checkbox, Form } from 'antd';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { Permissions } from '@/config/enum';

import { createVote } from '@/api/vote';
import { useIntl } from 'react-intl';
import { isRepeateArray } from '@/utils';

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
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((store) => store.user);
  const { currentMember } = useAppSelector((store) => store.dao);

  const [isEdit, setIsEdit] = useState(false);
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
    setIsEdit(false);
  };

  const onValuesChange = (changedValues: any, values: any) => {
    setIsEdit(!isRepeateArray(currentMember.permissions, values.permissions));
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
      name: formatMessage({ id: 'proposal.basic.rights' }),
      description: JSON.stringify({
        type: 'basic',
        purpose: `${formatMessage({
          id: 'proposal.basic.rights',
        })}: ${labels.valueOf()}`,
      }),
      extra,
    };

    try {
      setLoading(true);
      await createVote(params);
      message.success('success');
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
        <div className="h1">
          {formatMessage({ id: 'my.information.rights' })}
        </div>
        {/* <div className="h2"></div> */}

        <Form
          name="info"
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
          {/* <Form.Item name="permissions" label="权限设置"> */}
          <Form.Item name="permissions">
            <Checkbox.Group
              className="checkbox-group"
              // defaultValue={currentMember.permissions || []}
            >
              <Row style={{ width: '100%' }} gutter={[0, 10]}>
                <Col span={12}>
                  <Checkbox value={Permissions.Action_VotePool_Vote}>
                    {formatMessage({ id: 'my.information.rights.vote' })}
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value={Permissions.Action_VotePool_Create}>
                    {formatMessage({ id: 'my.information.rights.proposal' })}
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value={Permissions.Action_Member_Create}>
                    {formatMessage({ id: 'my.information.rights.add' })}
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value={Permissions.Action_Asset_SafeMint}>
                    {formatMessage({ id: 'my.information.rights.publish' })}
                  </Checkbox>
                </Col>
                {/* <Col span={12}>
                  <Checkbox value={Permissions.Action_Asset_Shell_Withdraw}>
                    上架资产
                  </Checkbox>
                </Col> */}
                <Col span={16}>
                  <Checkbox value={Permissions.Action_DAO_Settings}>
                    {formatMessage({ id: 'my.information.rights.basic' })}
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
              disabled={!isEdit}
            >
              {formatMessage({ id: 'my.information.change' })}
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
            width: 168px;
            height: 54px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
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
