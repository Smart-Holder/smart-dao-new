import { Progress, Statistic } from 'antd';
import { CSSProperties } from 'react';
import { useIntl } from 'react-intl';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Countdown } = Statistic;

const App = ({
  data,
  style,
  showDetail = false,
}: {
  data: any;
  style?: CSSProperties;
  showDetail?: boolean;
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Progress
        style={style}
        className="vote-progress"
        percent={data.percent}
        showInfo={false}
      />

      <div className="item-number">
        <span>{data.agreeTotal} Support</span>
        {data.isClose ? (
          <>
            {showDetail && (
              <span className="end">
                {/* {formatMessage({ id: 'governance.votes.ended' })} */}
                {formatMessage({ id: 'governance.votes.endtime' })}:&nbsp;
                {dayjs(data.modify).format('A HH:mm, MM/DD/YYYY')}
              </span>
            )}
          </>
        ) : (
          <Countdown className="countdown" value={data.expiry * 1000} />
        )}
        <span>{data.voteTotal - data.agreeTotal} Against</span>
      </div>

      <style jsx>
        {`
          .item-number {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 20px;
            margin-top: 11px;
            font-size: 14px;
            font-family: SFUIText-Medium, SFUIText;
            font-weight: 500;
            color: #000000;
            line-height: 20px;
          }

          .item-number .end {
            font-size: 14px;
            font-family: SFUIText-Medium, SFUIText;
            font-weight: 500;
            color: #818181;
            line-height: 16px;
          }

          .item-number :global(.countdown .ant-statistic-content-value) {
            font-size: 14px;
            font-family: SFUIText-Medium, SFUIText;
            font-weight: 500;
            color: #818181;
            line-height: 16px;
          }
        `}
      </style>
    </>
  );
};

export default App;
