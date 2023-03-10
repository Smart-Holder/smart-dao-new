import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Modal } from 'antd';
import { Form } from 'antd';

import { validateEthAddress } from '@/utils/validator';

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

  const [modal, contextHolder] = Modal.useModal();

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
      modal.success({
        title: 'Transfer successful.',
        className: 'modal-small',
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
      <Modal
        width={512}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <div className="content">
          <div className="h1">
            {formatMessage({ id: 'my.information.transfer' })}
          </div>
          <div className="h2">将您的身份与权利转让给他人</div>

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
            <Form.Item
              name="address"
              label="受让方地址"
              rules={[{ required: true }, { validator: validateEthAddress }]}
            >
              <Input className="input" />
            </Form.Item>

            <Form.Item style={{ margin: '60px 0 0', textAlign: 'center' }}>
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

        <style jsx>
          {`
            .content {
              padding: 25px 16px;
            }

            .h1 {
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
              font-size: 16px;
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

      {contextHolder}
    </>
  );
};

export default forwardRef(App);
