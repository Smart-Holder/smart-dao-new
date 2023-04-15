import React, { useState, useEffect } from 'react';

import { useIntl } from 'react-intl';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import Slider from '@/components/slider';

import { getLifespan } from '@/api/vote';
import { Button, Col, Row } from 'antd';

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
    <div className="card">
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

      <Row>
        <Col span={17}>
          <Slider
            style={{ marginTop: 40 }}
            value={value}
            label={formatMessage({ id: 'basic.vote.period' })}
            unit="h"
            min={min}
            max={720}
            readOnly
            // onAfterChange={onTaxChange2}
          />
        </Col>
      </Row>

      <Button
        style={{ marginTop: 100 }}
        className="button-submit"
        type="primary"
        htmlType="submit"
        onClick={handleSubmit}
        disabled
      >
        {formatMessage({ id: 'change' })}
      </Button>
    </div>
  );
};

export default App;
