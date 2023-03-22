import { Image, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

import type { RangePickerProps } from 'antd/es/date-picker';

const App = (props: RangePickerProps) => {
  const { className, ...rest } = props;

  return (
    <RangePicker
      {...rest}
      className={`${className || ''} filter`}
      suffixIcon={
        <Image
          src="/images/filter/icon_table_calender_default@2x.png"
          width={20}
          height={20}
          alt=""
          preview={false}
        />
      }
    />
  );
};

export default App;
