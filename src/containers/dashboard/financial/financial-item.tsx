import { FC, ReactNode } from 'react';
import Image from 'next/image';
import styles from './financial-item.module.css';

type FinancialItemProps = FinancialItemType & {
  priceIcon?: ReactNode;
};

export type FinancialItemType = {
  logo: string;
  title: string;
  price: number;
};

const FinancialItem: FC<FinancialItemProps> = (props) => {
  const { title, priceIcon, price, logo } = props;
  return (
    <div className={styles['container']}>
      <div className={styles['logo']}>
        <Image src={logo} alt="logo" width={158} height={158} />
      </div>
      <div className={styles['title']}>{title}</div>
      <div className={styles['price']}>
        {priceIcon && <div className={styles['icon']}>{priceIcon}</div>}
        {price}
      </div>
    </div>
  );
};

export default FinancialItem;
