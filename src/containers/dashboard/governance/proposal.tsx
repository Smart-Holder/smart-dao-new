import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Input, Avatar, message, Modal } from 'antd';
import { Checkbox, Form, Upload, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useIntl } from 'react-intl';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { validateChinese, validateEthAddress } from '@/utils/validator';

import { createVote } from '@/api/vote';
import { useRouter } from 'next/router';
import { isPermission } from '@/api/member';
import { Permissions } from '@/config/enum';

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const App = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((store) => store.user);
  const { address } = useAppSelector((store) => store.wallet);
  // const { loading } = useAppSelector((store) => store.common);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    executor: address,
  };

  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const onFinish = async (values: any) => {
    console.log('form success:', values);

    const params = {
      name: values.name,
      description: JSON.stringify({
        type: 'normal',
        ...values,
      }),
    };

    try {
      setLoading(true);

      if (!(await isPermission(Permissions.Action_VotePool_Create))) {
        message.warning('No permission');
        setLoading(false);
        return;
      }

      await createVote(params);

      setLoading(false);

      Modal.success({
        title: formatMessage({ id: 'proposal.create.message' }),
        className: 'modal-small',
        onOk: () => {
          router.push('/dashboard/governance/votes');
        },
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('form Failed:', errorInfo);
  };

  const onExecutorChange = () => {};
  const handleSubmit = () => {};

  return (
    <div className="wrap">
      <div className="h1" style={{ marginBottom: 44 }}>
        {formatMessage({ id: 'governance.proposal.title' })}
      </div>
      {/* <div className="h2">
        {formatMessage({ id: 'governance.proposal.subtitle' })}
      </div> */}

      <Form
        name="basic"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        layout="vertical"
        requiredMark={true}
        validateTrigger="onBlur"
      >
        <Form.Item
          label={formatMessage({ id: 'governance.proposal.name' })}
          name="name"
          rules={[
            { required: true },
            { type: 'string', min: 5, max: 30 },
            { validator: validateChinese },
          ]}
        >
          <Input
            placeholder={formatMessage({
              id: 'governance.proposal.name.placeholder',
            })}
            style={{ height: 76, fontSize: 18 }}
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'governance.proposal.purpose' })}
          name="purpose"
        >
          <Input.TextArea
            rows={4}
            placeholder={formatMessage({
              id: 'governance.proposal.purpose.placeholder',
            })}
            style={{ fontSize: 18 }}
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'governance.proposal.content' })}
          name="content"
        >
          <Input.TextArea
            rows={4}
            placeholder={formatMessage({
              id: 'governance.proposal.content.placeholder',
            })}
            style={{ fontSize: 18 }}
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'governance.proposal.result' })}
          name="result"
        >
          <Input.TextArea
            rows={4}
            placeholder={formatMessage({
              id: 'governance.proposal.result.placeholder',
            })}
            style={{ fontSize: 18 }}
          />
        </Form.Item>

        <Form.Item
          style={{ width: '100%' }}
          label={formatMessage({ id: 'governance.proposal.executor' })}
          name="executor"
          rules={[{ required: true }, { validator: validateEthAddress }]}
        >
          <Input
            style={{ height: 76, fontSize: 18 }}
            prefix={<Avatar size={30} src={url} />}
          />
          {/* <div className="item-group">
            <Button
              className="button"
              type="primary"
              htmlType="button"
              onClick={onExecutorChange}
            >
              Replace
            </Button>
          </div> */}
        </Form.Item>

        <Form.Item>
          <Button
            className="button-submit"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </Form.Item>
      </Form>

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
            margin-bottom: 44px;
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .wrap .item-group {
            display: flex;
            align-items: center;
          }

          .wrap :global(.button-submit) {
            width: 170px;
            height: 54px;
            margin-top: 40px;
            font-size: 18px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
