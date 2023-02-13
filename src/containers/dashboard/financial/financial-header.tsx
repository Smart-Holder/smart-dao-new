import { FC, useState } from 'react';
import Image from 'next/image';
import styles from './financial-header.module.css';
import { Button } from 'antd';
import PutModal, { PutModalListItem } from './put-modal';
import { FinancialItemType } from './financial-item';

type FinancialHeaderProps = {
  desc: string;
  createTime: number;
  amount: number;
} & FinancialDataType;

export type FinancialDataType = {
  title: string;
  addr: string;
  logo: string;
};

const FinancialHeader: FC<FinancialHeaderProps> = (props) => {
  const { logo, title, createTime, amount, addr, desc } = props;

  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<FinancialDataType>();
  const [currentPutList, setCurrentPutList] = useState<PutModalListItem[]>([]);

  const onShare = () => {};

  const onCreate = () => {};

  const onPut = () => {
    setCurrentItem({ logo, title, addr });
    setCurrentPutList([
      { img: 'https://storage.nfte.ai/icon/currency/eth.svg', name: 'opensea' },
      { img: 'https://storage.nfte.ai/icon/currency/eth.svg', name: 'opensea' },
      { img: 'https://storage.nfte.ai/icon/currency/eth.svg', name: 'opensea' },
      { img: 'https://storage.nfte.ai/icon/currency/eth.svg', name: 'opensea' },
    ]);
    setOpenModal(true);
  };

  const onEdit = () => {};

  const onClosePutModal = () => {
    setCurrentItem(undefined);
    setCurrentPutList([]);
    setOpenModal(false);
  };

  return (
    <>
      <div className={styles['container']}>
        <div className={styles['left']}>
          <div className={styles['logo']}>
            <Image src={logo} alt="logo" width={71} height={71} />
          </div>
          <div className={styles['base-info']}>
            <div className={styles['l1']}>
              <div className={styles['title']}>{title}</div>
              <div className={styles['created']}>
                <span>创建时间:</span>
                {createTime}
              </div>
              <div className={styles['amount']}>
                {amount}
                <span>Ethereum</span>
              </div>
            </div>
            <div className={styles['l2']}>
              <div className={styles['addr']}>{addr}</div>
              <div className={styles['desc']}>描述:{desc}</div>
            </div>
          </div>
        </div>
        <div className={styles['right']}>
          <Button onClick={onShare}>分享</Button>
          <Button onClick={onCreate}>发行</Button>
          <Button onClick={onPut}>上架交易</Button>
          <Button onClick={onEdit}>编辑</Button>
        </div>
      </div>
      <PutModal
        open={openModal}
        onClose={onClosePutModal}
        data={currentItem}
        list={currentPutList}
      />
    </>
  );
};

export default FinancialHeader;
