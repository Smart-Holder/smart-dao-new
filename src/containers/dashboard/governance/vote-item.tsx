import { Statistic, Typography } from 'antd';
import { FC } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Progress from '@/containers/dashboard/governance/progress';

import { formatAddress } from '@/utils';

const { Countdown } = Statistic;
const { Paragraph } = Typography;

export enum StatusKeyMap {
  processing = '投票中',
  passed = '已通过',
  rejected = '已驳回',
  executed = '已执行',
}

export enum TypeKeyMap {
  normal = '普通提案',
  finance = '财务管理',
  member = '成员管理',
  basic = '基础设置',
}

export const statusMap: any = {
  processing: <FormattedMessage id="governance.votes.sort.voting" />,
  passed: <FormattedMessage id="governance.votes.sort.adopted" />,
  rejected: <FormattedMessage id="governance.votes.sort.dismissed" />,
  executed: <FormattedMessage id="governance.votes.sort.implemented" />,
};

export const typesMap: any = {
  normal: <FormattedMessage id="governance.votes.type.normal" />,
  finance: <FormattedMessage id="governance.votes.type.financial" />,
  member: <FormattedMessage id="governance.votes.type.member" />,
  basic: <FormattedMessage id="governance.votes.type.basic" />,
};

export type StatusType = keyof typeof StatusKeyMap;
export type Type = keyof typeof TypeKeyMap;

export type VoteItemType = {
  data?: any;
};

type VoteItemProps = {
  className?: string;
  onClick: (item: any) => void;
} & VoteItemType;

const getStatus = (isClose: boolean, isAgree: boolean, isExecuted: boolean) => {
  let status: StatusType = 'processing';

  if (!isClose) {
    status = 'processing';
  } else {
    if (isAgree) {
      status = 'passed';

      if (isExecuted) {
        status = 'executed';
      }
    } else {
      status = 'rejected';
    }
  }

  return status;
};

const VoteItem: FC<VoteItemProps> = ({ data, onClick }) => {
  const { formatMessage } = useIntl();

  const status = getStatus(data.isClose, data.isAgree, data.isExecuted);

  let extra: any;

  try {
    extra = data.description ? JSON.parse(data.description || '{}') : {};
  } catch (error) {
    extra = { type: 'normal', purpose: '' };
  }

  const purpose = extra?.purpose;

  const percent =
    data?.voteTotal > 0
      ? Number((data.agreeTotal / data.voteTotal).toFixed(2)) * 100
      : 0;

  const handleClick = () => {
    onClick({ ...data, status, extra, percent });
  };

  return (
    <div className="item" onClick={handleClick}>
      <div className="item-header">
        <div className={`type ${extra.type || 'normal'}`}>
          {typesMap[extra.type || 'normal']}
        </div>
        <div style={{ flex: 1, padding: '0 20px' }}>
          <span className="id">#{data.id}</span>
        </div>
        <div className={`status ${status}`}>{statusMap[status]}</div>
      </div>

      <div className="item-content">
        <div className="item-title">{data.name}</div>
        <Paragraph ellipsis={{ rows: 2 }}>
          <div className="item-desc">{purpose}</div>
        </Paragraph>
      </div>

      <div className="item-footer">
        <div>
          <div className="item-owner-address">{formatAddress(data.origin)}</div>
        </div>

        <Progress style={{ marginTop: 15 }} data={{ ...data, percent }} />
      </div>

      <style jsx>
        {`
          .item {
            padding: 25px 30px 30px 36px;

            background: #fff;
            border: 1px solid #f5f5f5;
            border-radius: 8px;
            box-shadow: -5px 5px 20px 0px rgba(30, 30, 30, 0.03);
            cursor: pointer;
          }

          .item-header {
            display: flex;
            justify-item: space-between;
            align-items: center;
          }

          .item .type {
            height: 32px;
            padding: 0 14px;
            font-size: 16px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #6271d2;
            line-height: 32px;
            letter-spacing: 1px;
            background: rgba(98, 113, 210, 0.1);
            border-radius: 16px;
          }

          .item .type.normal {
            color: rgba(98, 113, 210, 1);
            background: rgba(98, 113, 210, 0.1);
          }
          .item .type.finance {
            color: rgba(61, 174, 67, 1);
            background: rgba(61, 174, 67, 0.1);
          }
          .item .type.member {
            color: rgba(199, 128, 94, 1);
            background: rgba(199, 128, 94, 0.1);
          }
          .item .type.basic {
            color: rgba(2, 160, 252, 1);
            background: rgba(2, 160, 252, 0.1);
          }

          .item .id {
            display: inline-block;
            height: 32px;
            padding: 0 14px;
            font-size: 16px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 32px;
            letter-spacing: 1px;
            background: rgba(177, 177, 177, 0.1);
            border-radius: 16px;
          }

          .item .status {
            position: relative;
            height: 16px;
            font-size: 14px;
            font-family: SFUIText-Bold;
            font-weight: bold;
            color: #161616;
            line-height: 16px;
          }

          .item .status::before {
            content: '';
            position: absolute;
            left: -19px;
            top: 2px;
            width: 12px;
            height: 12px;
            border: 2px solid #7f68fa;
            border-radius: 6px;
          }

          .item .status.processing::before {
            border-color: #7f68fa;
          }
          .item .status.passed::before {
            border-color: #34b53a;
          }
          .item .status.rejected::before {
            border-color: #f23c2c;
          }
          .item .status.executed::before {
            border-color: #02a0fc;
          }

          .item-content {
            margin-top: 16px;
          }

          .item-title {
            height: 24px;
            font-size: 20px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 24px;
          }

          .item-desc {
            height: 56px;
            margin-top: 2px;
            font-size: 16px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #818181;
            line-height: 28px;
          }

          .item-footer {
            margin-top: 15px;
          }

          .item-owner-address {
            height: 19px;
            font-size: 16px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 19px;
          }
        `}
      </style>
    </div>
  );
};

export default VoteItem;
