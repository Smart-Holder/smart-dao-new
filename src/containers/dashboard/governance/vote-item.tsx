import { Avatar, Statistic, Typography } from 'antd';
import { FC } from 'react';
import styles from './vote-item.module.css';
import iconUser from '/public/images/icon-user.png';
import Image from 'next/image';
import { useIntl, FormattedMessage } from 'react-intl';

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

const statusMap: any = {
  processing: <FormattedMessage id="governance.votes.sort.voting" />,
  passed: <FormattedMessage id="governance.votes.sort.voting" />,
  rejected: <FormattedMessage id="governance.votes.sort.voting" />,
  executed: <FormattedMessage id="governance.votes.sort.voting" />,
};

const types: any = {
  normal: '普通提案',
  finance: '财务管理',
  member: '成员管理',
  basic: '基础设置',
};

export type StatusType = keyof typeof StatusKeyMap;
export type Type = keyof typeof TypeKeyMap;

export type VoteItemType = {
  status: StatusType;
  title: string;
  owner: {
    avatar?: string;
    name: string;
    address: string;
  };
  number: string;
  type: Type;
  description: string;
  desc?: string;
  endTime: number;
  support: number;
  opposed: number;
  execTime?: number;
  execUser?: { avatar?: string; name: string; address: string };
  votes: number;
  proposal_id: string;
  data?: any;
};

type VoteItemProps = {
  className?: string;
  onClick?: (item: VoteItemType) => void;
} & VoteItemType;

const VoteItem: FC<VoteItemProps> = (props) => {
  const { formatMessage } = useIntl();

  const {
    status,
    title,
    owner,
    number,
    type,
    description,
    desc,
    endTime,
    className,
    support,
    opposed,
    onClick,
    execTime,
    execUser,
    votes,
    proposal_id,
    data,
  } = props;

  const extra = desc ? JSON.parse(desc || '{}') : {};
  // console.log('extra', extra);
  // console.log('-----------------', extra.type);
  const purpose = extra?.purpose;

  return (
    <div
      className={`${styles.item} ${className}`}
      onClick={() =>
        onClick?.({
          status,
          title,
          owner,
          number,
          type,
          description,
          desc,
          endTime,
          support,
          opposed,
          execTime,
          execUser,
          votes,
          proposal_id,
          data,
        })
      }
    >
      <div className={styles.header}>
        <div className={`${styles['status-box']} ${styles[status]}`}>
          {StatusKeyMap[status]}
        </div>
        <div className={styles.info}>
          <div className={`${styles.tag} ${styles[status]}`}>
            {types[extra.type || 'normal']}
          </div>
          <div className={styles.title}>{title}</div>
          <div className={styles.options}>
            <div className={styles.owner}>
              {/* <div className={styles.avatar}>
                {owner ? (
                  <Avatar
                    size={22}
                    src={owner?.avatar}
                    style={{ backgroundColor: '#c4c4c4' }}
                    shape="circle"
                  />
                ) : (
                  <Image
                    className={styles['default-avatar']}
                    src={iconUser}
                    alt="user"
                    width={22}
                    height={22}
                  />
                )}
              </div> */}
              {/* <div className={styles.name}>{owner.name}</div> */}
              <div style={{ marginLeft: 0 }} className={styles.name}>
                {formatAddress(data.origin)}
              </div>
            </div>
            <div className={styles.number}>{number}</div>
          </div>
        </div>
      </div>
      <div className={styles.description}>
        <Paragraph ellipsis={{ rows: 2 }}>{purpose}</Paragraph>
      </div>
      <div className={styles.footer}>
        <div className={styles.count}>
          <span>{support}</span>Max
        </div>
        <div className={styles.count}>
          <span>{opposed}</span>Mix
        </div>
        <div className={styles.time}>
          {data.isClose ? (
            formatMessage({ id: 'governance.votes.ended' })
          ) : (
            <Countdown
              className={styles.countdown}
              title="Times: "
              value={data.expiry * 1000}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VoteItem;
