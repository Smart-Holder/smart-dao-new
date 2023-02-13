import { FC } from 'react';
import Image from 'next/image';
import styles from './financial-header.module.css';
import { Button } from 'antd';

type FinancialHeaderProps = {
  title: string;
  addr: string;
  desc: string;
  createTime: number;
  amount: number;
};

const FinancialHeader: FC<FinancialHeaderProps> = (props) => {
  const { title, createTime, amount, addr, desc } = props;

  const onShare = () => {};
  const onCreate = () => {};
  const onPut = () => {};
  const onEdit = () => {};

  return (
    <div className={styles['container']}>
      <div className={styles['left']}>
        <div className={styles['logo']}>
          <Image
            src="/images/icon-user.png"
            alt="logo"
            width={71}
            height={71}
          />
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
  );
};

export default FinancialHeader;
