import { FC, ReactNode } from 'react';
import { Image } from 'antd';
import styles from './financial-item.module.css';

type FinancialItemProps = FinancialItemType & {
  priceIcon?: ReactNode;
};

export type FinancialItemType = {
  logo: string;
  title: string;
  price: number | string;
};

const FinancialItem: FC<FinancialItemProps> = (props) => {
  const { title, priceIcon, price, logo } = props;
  return (
    <div className={styles['container']}>
      <div className={styles['logo']}>
        <Image src={logo} preview={false} alt="logo" width={158} height={158} />
      </div>
      <div className={styles['title']}>{title}</div>
      <div className={styles['price']}>
        {priceIcon && <div className={styles['icon']}>{priceIcon}</div>}
        {price && +price / 1e18}
      </div>
    </div>
  );
};

export default FinancialItem;
