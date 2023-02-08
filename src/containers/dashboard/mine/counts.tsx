import { FC } from 'react';
import styles from './counts.module.css';

type CountsProps = {
  items: CountItem[];
};

type CountItem = {
  num: number;
  title: string;
};

const Counts: FC<CountsProps> = (props) => {
  const { items } = props;
  return (
    <div className={styles['counts']}>
      {items.map(({ num, title }, i) => (
        <div key={i} className={styles['count-item']}>
          <div className={styles['num']}>{num}</div>
          <div className={styles['title']}>{title}</div>
        </div>
      ))}
    </div>
  );
};

export default Counts;
