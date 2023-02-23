import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Input, Modal, Row, Col, message } from 'antd';
import { Checkbox, Form } from 'antd';
import { rng } from 'somes/rng';

import { useAppSelector } from '@/store/hooks';

import { Permissions } from '@/config/enum';

import { validateEthAddress } from '@/utils/validator';
import { addNFTP, isCanAddNFTP } from '@/api/member';
import { createVote } from '@/api/vote';
import { useIntl } from 'react-intl';

const validateMessages = {
  required: '${label} is required!',
  string: {
    range: "'${label}' must be between ${min} and ${max} characters",
  },
};

const App = (props: any, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading } = useAppSelector((store) => store.common);
  const { currentMember } = useAppSelector((store) => store.dao);

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
    const { address, votes, permissions } = values;

    const extra = [
      {
        abi: 'member',
        method: 'create',
        params: [
          address,
          {
            id: '0x' + rng(32).toString('hex'),
            name: '',
            description: '',
            image: '',
            votes: votes || 1,
          },
          permissions,
        ],
      },
    ];

    const params = {
      name: formatMessage({ id: 'proposal.basic.addNFTP' }),
      description: JSON.stringify({
        type: 'member',
        purpose: `${formatMessage({
          id: 'proposal.basic.addNFTP',
        })}: ${address}`,
      }),
      extra,
    };

    try {
      if (await isCanAddNFTP()) {
        await addNFTP({ ...values, votes: Number(values.votes) });
      } else {
        await createVote(params);
      }
      message.success(formatMessage({ id: 'governance.proposal.success' }));
      // window.location.reload();
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
      title={
        <span style={{ paddingLeft: 16, fontSize: 26 }}>
          {formatMessage({ id: 'member.nftp.addNFTP' })}
        </span>
      }
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
            label={formatMessage({ id: 'address' })}
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
            label={formatMessage({ id: 'member.nftp.copies' })}
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

          <Form.Item
            label={formatMessage({ id: 'my.information.rights' })}
            name="permissions"
          >
            <Checkbox.Group className="checkbox-group">
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

          <Form.Item style={{ margin: '40px 0 0', textAlign: 'center' }}>
            <Button
              className="button-submit"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {formatMessage({ id: 'member.nftp.submit' })}
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
