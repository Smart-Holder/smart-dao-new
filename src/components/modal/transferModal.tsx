import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Input } from 'antd';
import { Form } from 'antd';

import { validateEthAddress } from '@/utils/validator';

import Modal from '@/components/modal';

import { transfer } from '@/api/member';
import { useIntl } from 'react-intl';

// const validateMessages = {
//   required: '${label} is required!',
//   string: {
//     range: "'${label}' must be between ${min} and ${max} characters",
//   },
// };

const App = (props: any, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalOpen(true);
    },
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    try {
      setLoading(true);
      await transfer({ to: values.address });
      setLoading(false);
      handleCancel();
      Modal.success({
        title: 'Transfer successful.',
        onOk: () => {
          router.push('/');
        },
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  return (
    <>
      <Modal type="form" open={isModalOpen} onCancel={handleCancel}>
        <div className="content">
          <div className="title">
            {formatMessage({ id: 'my.information.transfer' })}
          </div>
          {/* <div className="h2">将您的身份与权利转让给他人</div> */}

          <Form
            className="form"
            name="info"
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
              // label="受让方地址"
              label={formatMessage({ id: 'address' })}
              rules={[{ required: true }, { validator: validateEthAddress }]}
            >
              <Input />
            </Form.Item>

            <Form.Item style={{ marginTop: 50, marginBottom: 0 }}>
              <Button
                className="button-submit"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                {formatMessage({ id: 'my.information.transfer' })}
              </Button>
            </Form.Item>
          </Form>
        </div>

        <style jsx>{``}</style>
      </Modal>
    </>
  );
};

export default forwardRef(App);
