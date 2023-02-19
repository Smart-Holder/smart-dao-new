import { Button } from 'antd';
import { useIntl } from 'react-intl';

type Params = {
  prev: () => void;
  next: () => void;
  nextLabel?: string;
};

const App = ({ prev, next, nextLabel }: Params) => {
  const { formatMessage } = useIntl();

  return (
    <div className="buttons">
      <Button className="button" type="primary" onClick={prev}>
        {formatMessage({ id: 'launch.back' })}
      </Button>

      <Button className="button" type="primary" onClick={next}>
        {nextLabel || formatMessage({ id: 'launch.next' })}
      </Button>

      <style jsx>
        {`
          .buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
          }

          .wrap :global(.button) {
            width: 168px;
            height: 53px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 27px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
