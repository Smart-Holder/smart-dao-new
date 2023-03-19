import { useState } from 'react';
import { useIntl } from 'react-intl';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';
import { Col, Row } from 'antd';

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const storageValues = getMakeDAOStorage('tax') || {};

  const [assetIssuanceTax, setAssetIssuanceTax] = useState(
    storageValues.assetIssuanceTax || 60,
  );
  const [assetCirculationTax, setAssetCirculationTax] = useState(
    storageValues.assetCirculationTax || 10,
  );

  const onTaxChange1 = (value: number) => {
    setAssetIssuanceTax(value);
  };

  const onTaxChange2 = (value: number) => {
    setAssetCirculationTax(value);
  };

  const prev = () => {
    dispatch(prevStep());
  };

  const next = () => {
    setMakeDAOStorage('tax', {
      assetIssuanceTax,
      assetCirculationTax,
    });
    console.log('form:', getMakeDAOStorage('tax'));
    dispatch(nextStep());
  };

  return (
    <div className="card" style={{ margin: '40px 0 0' }}>
      <div className="h1">{formatMessage({ id: 'launch.tax.title' })}</div>
      <div className="h2">{formatMessage({ id: 'launch.tax.subtitle' })}</div>

      <Row style={{ marginTop: 20 }}>
        <Col span={17}>
          <Slider
            style={{ padding: '20px 0' }}
            defaultValue={assetIssuanceTax}
            label={formatMessage({ id: 'launch.tax.publish' })}
            color="#FF6D4C"
            min={1}
            max={99}
            onAfterChange={onTaxChange1}
          />
        </Col>
      </Row>

      <Row>
        <Col span={17}>
          <Slider
            style={{ padding: '23px 0' }}
            defaultValue={assetCirculationTax}
            label={formatMessage({ id: 'launch.tax.circulation' })}
            color="#2AC154"
            min={1}
            max={99}
            onAfterChange={onTaxChange2}
          />
        </Col>
      </Row>

      <Footer prev={prev} next={next} />
    </div>
  );
};

export default App;
