import { Avatar, Button, Modal } from 'antd';
import { FC, useEffect, useState } from 'react';
import { StatusKeyMap, TypeKeyMap, VoteItemType } from './vote-item';
import Image from 'next/image';
import iconUser from '/public/images/icon-user.png';
import styles from './vote-modal.module.css';

type VoteModalProps = {
  open?: boolean;
  onClose?: () => void;
  data?: VoteItemType;
};

const VoteModal: FC<VoteModalProps> = (props) => {
  const { open = false, onClose, data } = props;
  const [show, setShow] = useState(false);

  useEffect(() => setShow(open), [open]);

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
      maskClosable={false}
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
            <div className={styles['time']}>
              {Date.now() > data.endTime ? (
                '投票已经结束'
              ) : (
                <>
                  Times:
                  <span className={styles['time-value']}>{data.endTime}</span>
                </>
              )}
            </div>
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
              <div className={styles['main-content']}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                euismod bibendum laoreet. Proin gravida dolor sit amet lacus
                accumsan et viverra justo commodo. Proin sodales pulvinar sic
                tempor. Sociis natoque penatibus et magnis dis parturient
                montes, nascetur ridiculus mus.
              </div>
            </div>
            <div className={styles['main-item']}>
              <div className={styles['main-title']}>提案内容</div>
              <div className={styles['main-content']}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                euismod bibendum laoreet. Proin gravida dolor sit amet lacus
                accumsan et viverra justo commodo. Proin sodales pulvinar sic
                tempor. Sociis natoque penatibus et magnis dis parturient
                montes, nascetur ridiculus mus. Nam fermentum, nulla luctus
                pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin
                sapien nunc accuan eget.
              </div>
            </div>
            <div className={styles['main-item']}>
              <div className={styles['main-title']}>预期结果</div>
              <div className={styles['main-content']}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                euismod bibendum laoreet. Proin gravida
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default VoteModal;
