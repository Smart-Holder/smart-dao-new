import React, { useState } from 'react';

import { Input } from 'antd';

interface NumericInputProps {
  style?: React.CSSProperties;
  // value: string;
  rowKey?: number;
  placeholder?: string;
  onChange: (value: string, rowKey: number | undefined) => void;
}

const App = (props: NumericInputProps) => {
  const { onChange, rowKey, ...rest } = props;

  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    // const reg = /^-?\d*(\.\d*)?$/;
    const reg = /^\d*(\.\d*)?$/;

    // if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
    if (reg.test(inputValue) || inputValue === '') {
      setValue(inputValue);
      onChange(inputValue, rowKey);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    let valueTemp = value;

    if (value.charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }

    const v = valueTemp.replace(/0*(\d+)/, '$1');

    setValue(v);
    onChange(v, rowKey);
  };

  return (
    <Input
      style={{ width: 200 }}
      {...rest}
      value={value}
      suffix="ETH"
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default App;
