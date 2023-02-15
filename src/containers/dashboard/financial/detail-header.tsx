import { FC } from 'react';
import styles from './detail-header.module.css';
import Image from 'next/image';
import { Button } from 'antd';

type DetailHeaderProps = {
  logo: string;
  title: string;
};

const DetailHeader: FC<DetailHeaderProps> = (props) => {
  const { logo, title } = props;

  const onShare = () => {};

  return (
    <div className={styles['container']}>
      <div className={styles['img']}>
        <Image src={logo} alt="logo" width={71} height={71} />
      </div>
      <div className={styles['info']}>
        <div className={styles['t1']}>
          <div className={styles['title']}>
            <span>{title}</span>
            <span className={styles['sub-title']}>(标签#8790)</span>
          </div>
          <div className={styles['buttons']}>
            <Button onClick={onShare}>分享</Button>
          </div>
        </div>
        <div className={styles['t2']}>
          <div className={styles['left']}>
            <div className={styles['item']}>拥有者: Allen.hou</div>
          </div>
          <div className={styles['right']}>
            <div className={styles['item']}>合约地址: 0xC……4F5C</div>
            <div className={styles['item']}>代币ID: 8790</div>
            <div className={styles['item']}>链: Ethereum</div>
            <div className={styles['item']}>原数据: hotps…derrs</div>
            <div className={styles['item']}>版税: 3%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;
