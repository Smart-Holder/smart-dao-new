import React, { useState, useEffect } from 'react';

import { useIntl } from 'react-intl';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import Slider from '@/components/slider';

import { getLifespan } from '@/api/vote';
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
  const [image, setImage] = useState();
  const { currentDAO } = useAppSelector((store) => store.dao);
  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  const [min, setMin] = useState(0);

  useEffect(() => {
    getLifespan()
      .then((res) => {
        setMin(Math.floor(res / 3600) || 12);
      })
      .catch((err) => {
        setMin(12);
      });

    getLifespan();
  }, []);

  const onTaxChange1 = (value: number) => {
    console.log(value);
  };

  const onTaxChange2 = (value: number) => {
    console.log(value);
  };

  const handleSubmit = () => {};

  const value = currentDAO.defaultVoteTime
    ? Math.floor(currentDAO.defaultVoteTime / 3600)
    : 0;

  if (!min) {
    return null;
  }

  return (
    <div className="wrap">
      <div className="h1">{formatMessage({ id: 'basic.vote.title' })}</div>
      <div className="h2">{formatMessage({ id: 'basic.vote.subtitle' })}</div>

      {/* <Slider
        value={60}
        label="Issuance Tax"
        color="#FF6D4C"
        onAfterChange={onTaxChange1}
      />
      <Slider
        value={30}
        label="Circulation Tax"
        color="#2AC154"
        onAfterChange={onTaxChange2}
      /> */}
      <Slider
        value={value}
        label={formatMessage({ id: 'basic.vote.period' })}
        unit="hr"
        min={min}
        max={720}
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
            margin-bottom: 23px;
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .wrap :global(.button) {
            width: 168px;
            height: 54px;
            margin-top: 40px;
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
