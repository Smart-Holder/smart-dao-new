import { Select, Space } from 'antd';
import { FC } from 'react';
import styles from './counts.module.css';

type FiltersProps = {};

const Filters: FC<FiltersProps> = () => {
  return (
    <Space className={styles['filters']} direction="horizontal" size={10}>
      <Select
        defaultValue="All taps"
        style={{ width: 120 }}
        options={[
          { value: '', label: 'All taps' },
          { value: '1', label: '1' },
        ]}
      />
      <Select
        defaultValue="All Times"
        style={{ width: 120 }}
        options={[
          { value: '', label: 'All Times' },
          { value: '1', label: '1' },
        ]}
      />
      <Select
        defaultValue="Cash"
        style={{ width: 120 }}
        options={[
          { value: '', label: 'Cash' },
          { value: '2', label: '2' },
        ]}
      />
      <Select
        defaultValue="All Markets"
        style={{ width: 120 }}
        options={[
          { value: '', label: 'All Markets' },
          { value: '2', label: '2' },
        ]}
      />
      <Select
        defaultValue="All Date"
        style={{ width: 120 }}
        options={[
          { value: '', label: 'All Date' },
          { value: '2', label: '2' },
        ]}
      />
    </Space>
  );
};

export default Filters;
