import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Input, Form } from 'antd';
import { useIntl } from 'react-intl';

import Modal from '@/components/modal';

export type AttrParams = {
  trait_type: string;
  value: string;
  ratio?: string;
};

type Props = {
  onOk: (values: AttrParams) => void;
};

const App = ({ onOk }: Props, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    onOk(values);
    hideModal();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  return (
    <Modal type="form" open={isModalOpen} onCancel={hideModal}>
      <div className="title">
        {formatMessage({ id: 'financial.asset.issue.add' })}
      </div>

      <Form
        className="form"
        name="attr"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        layout="vertical"
        requiredMark={true}
        validateTrigger="onBlur"
      >
        <Form.Item
          name="trait_type"
          label={formatMessage({ id: 'financial.asset.issue.label' })}
          rules={[{ required: true }, { type: 'string', max: 20 }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="value"
          label={formatMessage({ id: 'financial.asset.issue.value' })}
          rules={[{ required: true }, { type: 'string', max: 20 }]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          name="ratio"
          label={formatMessage({ id: 'financial.asset.issue.rate' })}
          rules={[
            { required: true },
            {
              pattern: /^([1-9][0-9]?|100)$/,
              message: 'not a valid number',
            },
          ]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item style={{ marginTop: 50, marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              className="button-submit"
              type="primary"
              ghost
              onClick={hideModal}
            >
              {formatMessage({ id: 'cancel' })}
            </Button>
            <Button className="button-submit" type="primary" htmlType="submit">
              {formatMessage({ id: 'add' })}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default forwardRef(App);
