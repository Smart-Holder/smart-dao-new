import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import Slider from '@/components/slider';
import { Button } from 'antd';

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((store) => store.user);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const [image, setImage] = useState();
  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const onTaxChange1 = (value: number) => {
    console.log(value);
  };

  const onTaxChange2 = (value: number) => {
    console.log(value);
  };

  const handleSubmit = () => {};

  return (
    <div className="wrap">
      <div className="h1">{formatMessage({ id: 'basic.tax.title' })}</div>
      <div className="h2">{formatMessage({ id: 'basic.tax.subtitle' })}</div>

      <Slider
        style={{ padding: '23px 0' }}
        value={currentDAO.assetIssuanceTax / 100}
        label={formatMessage({ id: 'basic.tax.publish' })}
        color="#FF6D4C"
        readOnly
        // onAfterChange={onTaxChange1}
      />
      <Slider
        style={{ padding: '23px 0' }}
        value={currentDAO.assetCirculationTax / 100}
        label={formatMessage({ id: 'basic.tax.circulation' })}
        color="#2AC154"
        readOnly
        // onAfterChange={onTaxChange2}
      />

      <Button
        className="button"
        type="primary"
        htmlType="submit"
        onClick={handleSubmit}
        disabled
      >
        {formatMessage({ id: 'change' })}
      </Button>

      <style jsx>
        {`
          .wrap {
            max-width: 375px;
          }

          .h1 {
            height: 30px;
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 30px;
          }

          .h2 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 18px;
            margin-top: 7px;
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .wrap :global(.button) {
            width: 168px;
            height: 54px;
            margin-top: 20px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 27px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
