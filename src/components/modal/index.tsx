import { ExclamationOutlined } from '@ant-design/icons';
import { Button, Image, Modal, ModalProps } from 'antd';

type Props = {
  type?: 'normal' | 'form';
} & ModalProps;

const App = ({ type, className, children, ...rest }: Props) => {
  return (
    <Modal
      className={className ? `${className} modal` : 'modal'}
      width={560}
      destroyOnClose
      footer={null}
      closeIcon={
        <Image
          src="/images/modal/icon_dialog_close@2x.png"
          width={20}
          height={20}
          alt=""
          preview={false}
        />
      }
      {...rest}
    >
      {type ? <div className={`modal-${type}`}>{children}</div> : children}
    </Modal>
  );
};

App.success = ({ title, ...rest }: ModalProps) => {
  Modal.success({
    className: 'modal',
    width: 560,
    content: (
      <>
        <Image
          src="/images/modal/icon_dialog_scucess@2x.png"
          width={80}
          height={80}
          alt=""
          preview={false}
        />
        <div className="modal-content-text">{title}</div>
      </>
    ),
    closable: true,
    closeIcon: (
      <Image
        src="/images/modal/icon_dialog_close@2x.png"
        width={20}
        height={20}
        alt=""
        preview={false}
      />
    ),
    ...rest,
  });
};
App.warning = ({ title, ...rest }: ModalProps) => {
  Modal.warning({
    className: 'modal',
    width: 560,
    content: (
      <>
        <ExclamationOutlined style={{ fontSize: 60 }} />
        <div className="modal-content-text">{title}</div>
      </>
    ),
    closable: true,
    closeIcon: (
      <Image
        src="/images/modal/icon_dialog_close@2x.png"
        width={20}
        height={20}
        alt=""
        preview={false}
      />
    ),
    ...rest,
  });
};
App.error = Modal.error;
App.info = Modal.info;

export default App;
