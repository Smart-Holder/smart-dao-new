import { Image, Select, SelectProps } from 'antd';

const App = (props: SelectProps) => {
  const { className, popupClassName, ...rest } = props;

  return (
    <Select
      {...rest}
      className={`${className || ''} form`}
      popupClassName={`${popupClassName || ''} form`}
      suffixIcon={
        <Image
          src="/images/filter/icon_table_drop_down_default@2x.png"
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
