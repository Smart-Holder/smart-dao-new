import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import Slider from '@/components/slider';
import { Button, Col, Row } from 'antd';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((store) => store.user);
  const { currentDAO } = useAppSelector((store) => store.dao);
  const [image, setImage] = useState();

  const onTaxChange1 = (value: number) => {
    console.log(value);
  };

  const onTaxChange2 = (value: number) => {
    console.log(value);
  };

  const handleSubmit = () => {};

  return (
    <div className="card">
      <div className="h1">{formatMessage({ id: 'basic.tax.title' })}</div>
      <div className="h2">{formatMessage({ id: 'basic.tax.subtitle' })}</div>

      <Row>
        <Col span={17}>
          <Slider
            style={{ marginTop: 40 }}
            value={currentDAO.assetIssuanceTax / 100}
            label={formatMessage({ id: 'basic.tax.publish' })}
            color="#FF6D4C"
            readOnly
            // onAfterChange={onTaxChange1}
          />
        </Col>
      </Row>

      <Row>
        <Col span={17}>
          <Slider
            style={{ marginTop: 40 }}
            value={currentDAO.assetCirculationTax / 100}
            label={formatMessage({ id: 'basic.tax.circulation' })}
            color="#2AC154"
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
