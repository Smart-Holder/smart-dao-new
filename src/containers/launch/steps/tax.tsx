import { useState } from 'react';
import { useIntl } from 'react-intl';

import Slider from '@/components/slider';
import Footer from '@/containers/launch/steps/footer';

import { useAppDispatch } from '@/store/hooks';
import { prevStep, nextStep } from '@/store/features/daoSlice';

import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';
import { Col, Row } from 'antd';

const App = ({ type }: { type?: string }) => {
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

    if (type === 'review') {
      setMakeDAOStorage('tax', {
        assetIssuanceTax: value,
        assetCirculationTax,
      });
    }
  };

  const onTaxChange2 = (value: number) => {
    setAssetCirculationTax(value);

    if (type === 'review') {
      setMakeDAOStorage('tax', {
        assetIssuanceTax,
        assetCirculationTax: value,
      });
    }
  };

  const prev = () => {
    dispatch(prevStep());
  };

  const next = () => {
    setMakeDAOStorage('tax', {
      assetIssuanceTax,
      assetCirculationTax,
    });

    dispatch(nextStep());
  };

  if (type === 'review') {
    return (
      <div style={{ margin: '76px 0 0' }}>
        <div className="setting-h1">
          {formatMessage({ id: 'launch.tax.title' })}
        </div>

        <Row style={{ marginTop: 50 }}>
          <Col span={17}>
            <Slider
              label={formatMessage({ id: 'launch.tax.publish' })}
              value={assetIssuanceTax}
              min={1}
              max={99}
              onChange={onTaxChange1}
            />
          </Col>
          <Col span={17} style={{ marginTop: 50 }}>
            <Slider
              label={formatMessage({ id: 'launch.tax.circulation' })}
              value={assetCirculationTax}
              min={1}
              max={99}
              onChange={onTaxChange2}
            />
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div style={{ margin: '40px 0 0' }}>
      <div className="setting-h1">
        {formatMessage({ id: 'launch.tax.title' })}
      </div>

      <div className="setting-h2">
        {formatMessage({ id: 'launch.tax.subtitle' })}
      </div>

      <Row style={{ marginTop: 50 }}>
        <Col span={17}>
          <Slider
            label={formatMessage({ id: 'launch.tax.publish' })}
            value={assetIssuanceTax}
            min={1}
            max={99}
            onChange={onTaxChange1}
          />
        </Col>
        <Col span={17} style={{ marginTop: 55 }}>
          <Slider
            label={formatMessage({ id: 'launch.tax.circulation' })}
            value={assetCirculationTax}
            min={1}
            max={99}
            onChange={onTaxChange2}
          />
        </Col>

        <Col span={17}>
          <div className="desc">
            {/* Asset issuance tax is The percentage of revenue received from the
            initial sale of an asset. Asset circulation tax The percentage of
            revenue earned from secondary sales of the asset. It can be modified
            by dao governance. */}
            {formatMessage({ id: 'launch.tax.info' })}
          </div>
        </Col>
      </Row>

      <Footer prev={prev} next={next} />

      <style jsx>
        {`
          .desc {
            height: 66px;
            margin-top: 50px;
            font-size: 16px;
            font-weight: 600;
            color: #818181;
            line-height: 22px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
