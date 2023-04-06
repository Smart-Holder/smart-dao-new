import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

import Modal from '@/components/modal';

import { useAppDispatch } from '@/store/hooks';

const ConnectModal = (props: any, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // 通过useDispatch 派发事件
  const dispatch = useAppDispatch();

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalOpen(true);
    },
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClick = () => {
    setIsModalOpen(false);
    router.push('/launch/start');
  };

  return (
    <Modal type="normal" open={isModalOpen} onCancel={handleCancel}>
      <div className="title">{formatMessage({ id: 'home.welcome' })}</div>
      <div className="subtitle">
        {formatMessage({ id: 'home.createOwnDAO' })}
      </div>

      <div className="button-wrap">
        <Button
          className="button"
          type="primary"
          shape="round"
          onClick={handleClick}
        >
          <div className="button-content">
            <div className="button-content-left">
              <span>{formatMessage({ id: 'home.createDAO' })}</span>
              <span>{formatMessage({ id: 'home.openDAO' })}</span>
            </div>
            <RightCircleOutlined style={{ fontSize: 40 }} />
          </div>
        </Button>
      </div>

      <style jsx>
        {`
          .button-wrap :global(.button) {
            height: 88px;
            margin-top: 50px;
            padding-left: 38px;
            padding-right: 26px;
            background-color: #000;
            border-radius: 44px;
          }

          .button-content {
            display: flex;
          }

          .button-content-left {
            display: flex;
            flex-direction: column;
            margin-right: 10px;
            font-size: 28px;
            font-weight: bold;
            color: #ffffff;
            line-height: 34px;
            text-align: right;
          }

          .button-content-left span:last-child {
            height: 18px;
            font-size: 12px;
            font-weight: 500;
            line-height: 18px;
          }
        `}
      </style>
    </Modal>
  );
};

export default forwardRef(ConnectModal);
