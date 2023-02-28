import React, { useState } from 'react';
import { Slider } from 'antd';

type Params = {
  style?: {};
  value?: number;
  defaultValue?: number;
  color?: string;
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  readOnly?: boolean;
  disabled?: boolean;
  onAfterChange?: (value: number) => void;
};

const App = ({
  style,
  value,
  defaultValue = 0,
  color = '#546FF6',
  label,
  unit,
  min = 0,
  max = 100,
  readOnly = false,
  disabled = false,
  onAfterChange,
}: Params) => {
  const [v, setValue] = useState(defaultValue);

  const handleChange = (v: number) => {
    if (readOnly) {
      return;
    }

    setValue(v);
  };

  return (
    <div className="wrap" style={style}>
      {label && (
        <div className="extra">
          <div className="value">
            {v || value}
            {unit || '%'}
          </div>
          <div className="label">{label}</div>
        </div>
      )}
      <Slider
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        onChange={handleChange}
        onAfterChange={onAfterChange}
        disabled={disabled}
      />

      <style jsx>{`
        .wrap {
          display: flex;
          align-items: center;
        }

        .extra {
          width: 120px;
          margin-right: 10px;
        }

        .value {
          height: 59px;
          font-size: 42px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3e4954;
          line-height: 59px;
        }

        .label {
          height: 21px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3e4954;
          line-height: 21px;
        }

        .wrap :global(.ant-slider-horizontal) {
          flex: 1;
          height: 30px;
          padding-block: 9px;
        }

        .wrap :global(.ant-slider-horizontal .ant-slider-rail) {
          height: 12px;
          background-color: #f3f3f3;
          border-radius: 6px;
        }
        .wrap :global(.ant-slider-horizontal .ant-slider-track) {
          height: 12px;
          background-color: ${color};
          border-radius: 6px;
        }
        .wrap :global(.ant-slider-horizontal .ant-slider-handle) {
          width: 30px;
          height: 30px;
        }
        .wrap :global(.ant-slider-horizontal .ant-slider-handle::after) {
          top: 0;
          width: 30px;
          height: 30px;
          background-color: ${color};
          box-shadow: 0 0 0 2px ${color};
        }
        .wrap :global(.ant-slider-horizontal .ant-slider-handle:hover::after) {
          inset-inline-start: 0;
          inset-block-start: 0;
        }
      `}</style>
    </div>
  );
};

export default App;
