import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Input, Modal, Row, Col, message } from 'antd';
import { Checkbox, Form } from 'antd';

import { useAppSelector } from '@/store/hooks';

import { Permissions } from '@/config/enum';

import { validateEthAddress } from '@/utils/validator';
import { addNFTP } from '@/api/member';

const validateMessages = {
  required: '${label} is required!',
  string: {
    range: "'${label}' must be between ${min} and ${max} characters",
  },
};

const App = (props: any, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading } = useAppSelector((store) => store.common);

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalOpen(true);
    },
  }));

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    try {
      await addNFTP({ ...values, votes: Number(values.votes) });
      message.success('success');
      window.location.reload();
      hideModal();
    } catch (error) {
      console.error(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  return (
    <Modal
      title={<span style={{ paddingLeft: 16, fontSize: 26 }}>添加NFTP</span>}
      width={512}
      open={isModalOpen}
      onCancel={hideModal}
      footer={null}
      destroyOnClose
    >
      <div className="content">
        {/* <div className="h1">添加NFTP</div> */}

        <Form
          name="info"
          initialValues={{
            permissions: [
              Permissions.Action_VotePool_Vote,
              Permissions.Action_VotePool_Create,
            ],
            votes: 1,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
          layout="vertical"
          requiredMark={false}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }, { validator: validateEthAddress }]}
          >
            <Input className="input" />
            {/* <Input
              className="input"
              prefix={<span style={{ color: '#000' }}>Address:</span>}
            /> */}
          </Form.Item>

          <Form.Item
            name="votes"
            label="份数"
            // rules={[{ required: true }, { type: 'number', min: 1, max: 100 }]}
            rules={[
              { required: true },
              {
                pattern: /^[1-9][0-9]*$/,
                message: 'votes is not a valid number',
              },
            ]}
          >
            <Input className="input" />
            {/* <Input
              className="input"
              prefix={<span style={{ color: '#000' }}>份数:</span>}
            /> */}
          </Form.Item>

          <Form.Item label="设置权限" name="permissions">
            <Checkbox.Group className="checkbox-group">
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

          <Form.Item style={{ margin: '40px 0 0', textAlign: 'center' }}>
            <Button
              className="button-submit"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              添加并生成提案
            </Button>
          </Form.Item>
        </Form>
      </div>

      <style jsx>
        {`
          .content {
            padding: 25px 16px;
            font-size: 18px;
          }

          .h1 {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 30px;
          }

          .content :global(.input) {
            height: 76px;
            font-size: 16px;
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