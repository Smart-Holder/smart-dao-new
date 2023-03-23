import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Input, Row, Col } from 'antd';
import { Checkbox, Form } from 'antd';
import { rng } from 'somes/rng';
import { useAppSelector } from '@/store/hooks';
import { Permissions } from '@/config/enum';
import { validateEthAddress } from '@/utils/validator';
import { addNFTP, isCanAddNFTP } from '@/api/member';
import { createVote } from '@/api/vote';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import store from '../../store';
import Modal from '@/components/modal';

// const validateMessages = {
//   required: '${label} is required!',
//   string: {
//     range: "'${label}' must be between ${min} and ${max} characters",
//   },
// };

const App = (props: any, ref: any) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { nickname, image, description } = useAppSelector(
    (store) => store.user.userInfo,
  );

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
    const { currentDAO } = store.getState().dao;

    const extra = [
      {
        abi: 'member',
        target: currentDAO.member,
        method: 'create',
        params: [
          address,
          {
            id: '0x' + rng(32).toString('hex'),
            name: nickname,
            description,
            image,
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
      setLoading(true);
      if (await isCanAddNFTP()) {
        await addNFTP({ ...values, votes: Number(values.votes) });
        router.reload();
      } else {
        await createVote(params);
        Modal.success({
          title: formatMessage({ id: 'proposal.create.message' }),
        });
      }
      // window.location.reload();
      hideModal();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  return (
    <Modal type="form" open={isModalOpen} onCancel={hideModal}>
      <div className="title">
        {formatMessage({ id: 'member.nftp.addNFTP' })}
      </div>

      <Form
        className="form"
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
          <Input />
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
          <Input />
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

        <Form.Item style={{ marginTop: 50, marginBottom: 0 }}>
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
    </Modal>
  );
};

export default forwardRef(App);
