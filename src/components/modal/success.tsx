import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
} from 'react';
import { Button, Image } from 'antd';
// import { useIntl } from 'react-intl';

import Modal from '@/components/modal';

type Props = {
  content: ReactNode;
  okText: string;
  onOk?: () => void;
};

const App = ({ content, okText, onOk = () => {} }: Props, ref: any) => {
  // const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalOpen(true);
    },
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    onOk();
  };

  return (
    <Modal type="normal" open={isModalOpen} onCancel={handleCancel}>
      <Image
        src="/images/modal/icon_dialog_scucess@2x.png"
        width={80}
        height={80}
        alt=""
        preview={false}
      />
      <div className="modal-content-text">{content}</div>
      <div style={{ marginTop: 60 }}>
        <Button className="button-submit" type="primary" onClick={handleOk}>
          {okText}
        </Button>
      </div>

      <style jsx>
        {`
          .modal-content-text {
            width: 300px;
            margin: 32px auto 0;
            font-size: 18px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 21px;
          }
        `}
      </style>
    </Modal>
  );
};

export default forwardRef(App);
