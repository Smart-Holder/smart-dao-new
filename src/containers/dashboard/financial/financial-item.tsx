import { FC, ReactNode } from 'react';
import { Image } from 'antd';
import styles from './financial-item.module.css';
import { fromToken } from '@/utils';

type FinancialItemProps = FinancialItemType & {
  priceIcon?: ReactNode;
};

export type FinancialItemType = {
  logo: string;
  title: string;
  price: number | string;
  onClick?: () => void;
};

const FinancialItem: FC<FinancialItemProps> = (props) => {
  const { title, priceIcon, price, logo, onClick } = props;
  return (
    <div className={styles['container']} onClick={onClick}>
      <div className={styles['logo']}>
        <Image src={logo} preview={false} alt="logo" width={158} height={158} />
      </div>
      <div className={styles['title']}>{title}</div>
      <div className={styles['price']}>
        {priceIcon && <div className={styles['icon']}>{priceIcon}</div>}
        {/* {price && +price / 1e18} */}
        {price && fromToken(price)}
      </div>
    </div>
  );
};

export default FinancialItem;
