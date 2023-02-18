import { FC } from 'react';
import styles from './counts.module.css';

type CountsProps = {
  items: CountItem[];
};

type CountItem = {
  num: number | string;
  title: string;
  onClick?: () => void;
};

const Counts: FC<CountsProps> = (props) => {
  const { items } = props;
  return (
    <div className={styles['counts']}>
      {items.map(({ num, title, onClick }, i) => (
        <div key={i} className={styles['count-item']}>
          {onClick ? (
            <div
              className={`${styles['num']} ${styles['num-hover']}`}
              onClick={onClick}
            >
              {num}
            </div>
          ) : (
            <div className={styles['num']}>{num}</div>
          )}
          <div className={styles['title']}>{title}</div>
        </div>
      ))}
    </div>
  );
};

export default Counts;
