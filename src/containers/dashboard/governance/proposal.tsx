import React, { useEffect, useState } from 'react';
import { Button, Input, Avatar, message, Modal } from 'antd';
import { Form } from 'antd';

import { useIntl } from 'react-intl';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { validateChinese, validateEthAddress } from '@/utils/validator';

import { createVote } from '@/api/vote';
import { useRouter } from 'next/router';
import { isPermission } from '@/api/member';
import { Permissions } from '@/config/enum';

const App = () => {
  const [form] = Form.useForm();
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

  useEffect(() => {
    form.setFieldsValue({ executor: address });
  }, [address, form]);

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
    <div className="card">
      <div className="h1">
        {formatMessage({ id: 'governance.proposal.title' })}
      </div>
      {/* <div className="h2">
        {formatMessage({ id: 'governance.proposal.subtitle' })}
      </div> */}

      <Form
        style={{ marginTop: 40 }}
        className="form"
        name="basic"
        form={form}
        wrapperCol={{ span: 17 }}
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
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'governance.proposal.purpose' })}
          name="purpose"
        >
          <Input.TextArea
            rows={8}
            placeholder={formatMessage({
              id: 'governance.proposal.purpose.placeholder',
            })}
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'governance.proposal.content' })}
          name="content"
        >
          <Input.TextArea
            rows={8}
            placeholder={formatMessage({
              id: 'governance.proposal.content.placeholder',
            })}
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'governance.proposal.result' })}
          name="result"
        >
          <Input.TextArea
            rows={8}
            placeholder={formatMessage({
              id: 'governance.proposal.result.placeholder',
            })}
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'governance.proposal.executor' })}
          name="executor"
          rules={[{ required: true }, { validator: validateEthAddress }]}
        >
          <Input />
          {/* <Input prefix={<Avatar size={30} src={url} />} /> */}
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

        <Form.Item style={{ marginTop: 100 }}>
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
    </div>
  );
};

export default App;
