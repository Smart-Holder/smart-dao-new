import { Avatar, Button, Modal } from 'antd';
import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './put-modal.module.css';
import { FinancialDataType } from './financial-header';

type PutModalProps = {
  open?: boolean;
  onClose?: () => void;
  data?: FinancialDataType;
  list: PutModalListItem[];
};

export type PutModalListItem = { img: string; name: string };

const renderItem = (img: string, name: string) => {
  return (
    <>
      <Image
        className={styles['item-icon']}
        src={img}
        alt={name}
        width={88}
        height={88}
      />
      <div className={styles['item-title']}>{name}</div>
    </>
  );
};

const PutModal: FC<PutModalProps> = (props) => {
  const { open = false, onClose, data, list } = props;
  const [show, setShow] = useState(false);

  useEffect(() => setShow(open), [open]);

  return (
    <Modal
      destroyOnClose
      width={512}
      open={show}
      onCancel={() => {
        onClose?.();
        setShow(false);
      }}
      footer={null}
      maskClosable={false}
    >
      {data && (
        <div className={styles['content']}>
          <div className={styles['title']}>选择交易市场</div>
          <div className={styles['sub-title']}>
            Create your own DAO in a few minutes!
          </div>
          <div className={styles['list']}>
            {list.map((item, i) => (
              <div key={i} className={styles['item']}>
                {renderItem(
                  'https://storage.nfte.ai/icon/currency/eth.svg',
                  'OpenSea',
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PutModal;
