import { Avatar } from 'antd';
import { FC } from 'react';
import styles from './vote-item.module.css';
import iconUser from '/public/images/icon-user.png';
import Image from 'next/image';

export enum StatusKeyMap {
  processing = '投票中',
  passed = '已通过',
  rejected = '已驳回',
  executed = '已执行',
}

export enum TypeKeyMap {
  normal = '普通',
  finance = '财务',
  member = '成员',
  basic = '基础',
}

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
  endTime: number;
  support: number;
  opposed: number;
  execTime?: number;
  execUser?: { avatar?: string; name: string; address: string };
};

type VoteItemProps = {
  className?: string;
  onClick?: (item: VoteItemType) => void;
} & VoteItemType;

const VoteItem: FC<VoteItemProps> = (props) => {
  const {
    status,
    title,
    owner,
    number,
    type,
    description,
    endTime,
    className,
    support,
    opposed,
    onClick,
    execTime,
    execUser,
  } = props;

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
          endTime,
          support,
          opposed,
          execTime,
          execUser,
        })
      }
    >
      <div className={styles.header}>
        <div className={`${styles['status-box']} ${styles[status]}`}>
          {StatusKeyMap[status]}
        </div>
        <div className={styles.info}>
          <div className={`${styles.tag} ${styles[type]}`}>
            {TypeKeyMap[type]}
          </div>
          <div className={styles.title}>{title}</div>
          <div className={styles.options}>
            <div className={styles.owner}>
              <div className={styles.avatar}>
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
              </div>
              <div className={styles.name}>{owner.name}</div>
            </div>
            <div className={styles.number}>{number}</div>
          </div>
        </div>
      </div>
      <div className={styles.description}>{description}</div>
      <div className={styles.footer}>
        <div className={styles.count}>
          <span>{support}</span>Max
        </div>
        <div className={styles.count}>
          <span>{opposed}</span>Mix
        </div>
        <div className={styles.time}>
          {Date.now() > endTime ? '投票已经结束' : `Times: ${endTime}`}
        </div>
      </div>
    </div>
  );
};

export default VoteItem;
