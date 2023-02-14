import { Avatar, Button, Modal, Statistic } from 'antd';
import { FC, useEffect, useState } from 'react';
import { StatusKeyMap, TypeKeyMap, VoteItemType } from './vote-item';
import Image from 'next/image';
import iconUser from '/public/images/icon-user.png';
import styles from './vote-modal.module.css';
import { setVote } from '@/api/vote';

const { Countdown } = Statistic;

type VoteModalProps = {
  open?: boolean;
  onClose?: () => void;
  data?: VoteItemType;
};

const VoteModal: FC<VoteModalProps> = (props) => {
  const { open = false, onClose, data } = props;
  const [show, setShow] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => setShow(open), [open]);

  const onOk = async () => {
    try {
      setLoading1(true);
      await setVote({ vote: true, proposal_id: data?.proposal_id });
      setLoading1(false);
      window.location.reload();
    } catch (error) {
      setLoading1(false);
    }
  };
  const onCancel = async () => {
    try {
      setLoading2(true);
      await setVote({ vote: false, proposal_id: data?.proposal_id });
      setLoading2(false);
      window.location.reload();
    } catch (error) {
      setLoading2(false);
    }
  };

  let desc = data?.desc ? JSON.parse(data.desc || '{}') : {};

  return (
    <Modal
      destroyOnClose
      width={678}
      open={show}
      onCancel={() => {
        onClose?.();
        setShow(false);
      }}
      footer={null}
      // maskClosable={false}
    >
      {data && (
        <div className={styles['content']}>
          <div className={styles['header']}>
            <div className={`${styles['status']} ${styles[data.status]}`}>
              {StatusKeyMap[data.status]}
            </div>
            <div className={styles['counts']}>
              <div className={styles['count-item']}>
                <div className={styles['n']}>
                  <span className={styles['num']}>{data.support}</span>
                  <span>UP</span>
                </div>
                <span className={styles['g']}>Max</span>
              </div>
              <div className={styles['count-item']}>
                <div className={styles['n']}>
                  <span className={styles['num']}>{data.opposed}</span>
                  <span>DOWN</span>
                </div>
                <span className={styles['g']}>Mix</span>
              </div>
            </div>
            {data.status === 'executed' ? (
              <div className={styles['exec-time']}>
                <div className={styles['time']}>
                  结束时间:
                  <span className={styles['time-value']}>{data.endTime}</span>
                  {Date.now() > data.endTime && (
                    <span className={styles['time-value']}>
                      （投票已经结束）
                    </span>
                  )}
                </div>
                <div className={styles['time']}>
                  执行时间:
                  <span className={styles['time-value']}>{data.execTime}</span>
                  <span className={styles['exec-user']}>执行人：</span>
                  <span
                    className={`${styles['time-value']} ${styles['exec-addr']}`}
                  >
                    {data.execUser?.address}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles['time']}>
                {Date.now() > data.endTime ? (
                  '投票已经结束'
                ) : (
                  <>
                    距结束:
                    <span className={styles['time-value']}>
                      <Countdown
                        className={styles.countdown}
                        value={data.endTime}
                      />
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className={styles['body']}>
            <div className={styles.title}>{data.title}</div>
            <div className={styles.options}>
              <div className={styles.owner}>
                <div className={styles.avatar}>
                  {data.owner ? (
                    <Avatar
                      size={22}
                      src={data.owner?.avatar}
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
                <div className={styles.name}>{data.owner.name}</div>
              </div>
              <div className={styles.number}>{data.number}</div>
              <div className={`${styles.tag} ${styles[data.type]}`}>
                {TypeKeyMap[data.type]}
              </div>
            </div>
            <div className={styles['main-item']}>
              <div className={styles['main-title']}>提案目的</div>
              <div className={styles['main-content']}>{desc?.purpose}</div>
            </div>
            <div className={styles['main-item']}>
              <div className={styles['main-title']}>提案内容</div>
              <div className={styles['main-content']}>{desc.content}</div>
            </div>
            <div className={styles['main-item']}>
              <div className={styles['main-title']}>预期结果</div>
              <div className={styles['main-content']}>{desc.result}</div>
            </div>
          </div>
          <div className="footer">
            <Button
              className="button"
              type="primary"
              onClick={onOk}
              loading={loading1}
            >
              支持
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              className="button"
              type="primary"
              onClick={onCancel}
              loading={loading2}
            >
              反对
            </Button>
          </div>
        </div>
      )}
      <style jsx>
        {`
          .footer {
            margin-top: 20px;
            text-align: center;
          }

          .footer :global(.button) {
            width: 170px;
            height: 54px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 27px;
          }
        `}
      </style>
    </Modal>
  );
};

export default VoteModal;
