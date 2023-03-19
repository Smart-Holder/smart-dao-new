import { Button, Col, Row } from 'antd';
import { useIntl } from 'react-intl';

type Params = {
  prev: () => void;
  next: () => void;
  nextLabel?: string;
};

const App = ({ prev, next, nextLabel }: Params) => {
  const { formatMessage } = useIntl();

  return (
    <Row style={{ marginTop: 77 }}>
      <Col span={17}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button className="button-form" type="primary" onClick={prev}>
            {formatMessage({ id: 'launch.back' })}
          </Button>

          <Button className="button-form" type="primary" onClick={next}>
            {nextLabel || formatMessage({ id: 'launch.next' })}
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default App;
