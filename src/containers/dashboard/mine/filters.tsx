import { Space, SelectProps } from 'antd';
import { FC } from 'react';
import styles from './counts.module.css';

import Select from '@/components/form/filter/select';

type FiltersProps = {
  items?: Pick<
    SelectProps,
    'defaultValue' | 'options' | 'onSelect' | 'onChange' | 'disabled'
  >[];
};

const Filters: FC<FiltersProps> = (props) => {
  const { items = [] } = props;
  return (
    <Space className={styles['filters']} direction="horizontal" size={10}>
      {items.map((item, index) => {
        return (
          <Select
            key={index}
            disabled={item.disabled}
            defaultValue={item.defaultValue}
            style={{ width: 200 }}
            options={item.options}
            onSelect={item.onSelect}
            onChange={item.onChange}
          />
        );
      })}
    </Space>
  );
};

export default Filters;
