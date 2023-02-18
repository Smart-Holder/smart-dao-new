import { FC } from 'react';
import styles from './detail-attributes.module.css';

type DetailAttributesProps = {
  items?: AttributeItem[];
};

export type AttributeItem = {
  trait_type: string;
  value: string;
  ratio?: number;
};

const DetailAttributes: FC<DetailAttributesProps> = (props) => {
  const { items } = props;
  return (
    <div className={styles['container']}>
      <div className={styles['title']}>
        <div>属性</div>
        <span className={styles['s']}>Attributes</span>
      </div>
      <div className={styles['items']}>
        {items?.map((item, i) => {
          if (item.trait_type === 'tags') {
            return null;
          }
          return (
            <div className={styles['item']} key={i}>
              <div className={styles['b']}>
                <div className={styles['t']}>{item.trait_type}</div>
                <div className={styles['v']}>{item.value}</div>
                {item.ratio && (
                  <div className={styles['r']}>{item.ratio}%拥有此属性</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailAttributes;
