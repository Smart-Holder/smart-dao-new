import React, { useState } from 'react';
import { Col, Image, Row, Slider, Space } from 'antd';

type Params = {
  style?: {};
  value: number;
  // defaultValue?: number;
  color?: string;
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  // onAfterChange?: (value: number) => void;
};

const App = ({
  style,
  value,
  // defaultValue = 0,
  // color = '#546FF6',
  color = '#000',
  label,
  unit,
  min = 0,
  max = 100,
  readOnly = false,
  disabled = false,
  onChange,
}: // onAfterChange,
Params) => {
  const [v, setValue] = useState(value);

  const handleChange = (v: number) => {
    if (readOnly) {
      return;
    }

    setValue(v);

    if (onChange) {
      onChange(v);
    }
  };

  const add = () => {
    if (v + 1 <= max) {
      handleChange(v + 1);
    }
  };

  const subtract = () => {
    if (v - 1 >= min) {
      handleChange(v - 1);
    }
  };

  return (
    <div className="wrap" style={style}>
      {label && <div className="label">{label}</div>}

      <div className="item">
        <Slider
          value={value}
          // defaultValue={defaultValue}
          min={min}
          max={max}
          onChange={handleChange}
          // onAfterChange={onAfterChange}
          disabled={disabled}
        />

        <Space size={0} style={{ marginLeft: 65 }}>
          <Image
            className="subtract"
            src="/images/slider/icon_form_button_add@2x.png"
            width={40}
            height={40}
            alt=""
            preview={false}
            onClick={subtract}
          />
          <span className="value">
            {v || value}
            {unit || '%'}
          </span>
          <Image
            className="add"
            src="/images/slider/icon_form_button_minus@2x.png"
            width={40}
            height={40}
            alt=""
            preview={false}
            onClick={add}
          />
        </Space>
      </div>

      <style jsx>
        {`
          .wrap {
            cursor: ${disabled ? 'not-allowed' : 'default'};
          }

          .label {
            height: 22px;
            font-size: 16px;
            font-weight: 600;
            color: #818181;
            line-height: 22px;
          }

          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .value {
            display: inline-block;
            width: 56px;
            font-size: 16px;
            font-weight: 600;
            color: #000000;
            line-height: 19px;
            text-align: center;
          }

          .wrap :global(.subtract) {
            cursor: pointer;
          }

          .wrap :global(.add) {
            cursor: pointer;
          }

          .wrap :global(.ant-slider-horizontal) {
            flex: 1;
            height: 26px;
            padding-block: 10px;
            margin: 9px 0;
          }

          .wrap :global(.ant-slider-horizontal .ant-slider-rail) {
            height: 6px;
            background-color: #cdcdcd;
            border-radius: 3px;
          }
          .wrap :global(.ant-slider-horizontal .ant-slider-track) {
            height: 6px;
             {
              /* background-color: ${color}; */
            }
            border-radius: 3px;
          }
          .wrap :global(.ant-slider-horizontal .ant-slider-handle) {
            width: 26px;
            height: 26px;
          }
          .wrap :global(.ant-slider-horizontal .ant-slider-handle::after) {
            top: 0;
            width: 26px;
            height: 26px;
            inset-inline-start: 0;
            inset-block-start: 0;
            border: 3px solid #000;
            box-shadow: none;
             {
              /* background-color: ${color}; */
            }
             {
              /* box-shadow: 0 0 0 2px ${color}; */
            }
          }
          .wrap
            :global(.ant-slider-horizontal .ant-slider-handle:hover::after) {
            width: 26px;
            height: 26px;
            inset-inline-start: 0;
            inset-block-start: 0;
            border: 3px solid #000;
            box-shadow: none;
          }
        `}
      </style>
    </div>
  );
};

export default App;
