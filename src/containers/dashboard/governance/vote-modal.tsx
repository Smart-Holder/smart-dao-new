import { Button, Statistic, Skeleton, Space, Image } from 'antd';
import { FC, useEffect, useState } from 'react';
import { statusMap, TypeKeyMap, Type, typesMap } from './vote-item';
import { setVote } from '@/api/vote';
import { request } from '@/api';
import { useAppSelector } from '@/store/hooks';
import Progress from '@/containers/dashboard/governance/progress';
import Modal from '@/components/modal';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { formatAddress } from '@/utils';

import { useIntl } from 'react-intl';

dayjs.extend(customParseFormat);

const { Countdown } = Statistic;

type VoteModalProps = {
  open?: boolean;
  onClose?: () => void;
  data?: any;
};

const VoteModal: FC<VoteModalProps> = (props) => {
  const { formatMessage } = useIntl();
  const { open = false, onClose, data } = props;

  const { chainId, address, web3 } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isVote, setIsVote] = useState(true);
  const [yourVote, setYourVote] = useState(0);

  const type: Type = data?.extra?.type;

  useEffect(() => setShow(open), [open]);

  useEffect(() => {
    const getData = async () => {
      const [res] = await Promise.all([
        request({
          name: 'utils',
          method: 'getVotesFrom',
          params: {
            chain: chainId,
            address: currentDAO.root,
            proposal_id: data?.proposal_id,
          },
        }),
        // isPermission(Permissions.Action_VotePool_Vote),
      ]);

      console.log('permission', data?.time, currentMember.time);
      const permission = data?.time > currentMember.time;

      if (permission && res?.length === 0) {
        // 未投票
        setIsVote(false);
        setYourVote(0);
      } else {
        // 已投票或没有权限
        setIsVote(true);
        setYourVote(res[0]?.votes || 0);
      }
      console.log(res);
      setLoading(false);
    };

    if (data) {
      getData();
    }
  }, [data]);

  const onOk = async () => {
    try {
      setLoading1(true);
      await setVote({
        vote: true,
        proposal_id: data?.proposal_id,
        type: type,
      });
      setLoading1(false);
      window.location.reload();
    } catch (error) {
      setLoading1(false);
    }
  };
  const onCancel = async () => {
    try {
      setLoading2(true);
      await setVote({
        vote: false,
        proposal_id: data?.proposal_id,
        type: type,
      });
      setLoading2(false);
      window.location.reload();
    } catch (error) {
      setLoading2(false);
    }
  };

  return (
    <Modal
      className="modal-vote"
      width={720}
      open={show}
      onCancel={() => {
        onClose?.();
        setShow(false);
        setIsVote(true);
        setYourVote(0);
        setLoading(true);
      }}
    >
      {loading && (
        <div className="content">{loading && <Skeleton active />}</div>
      )}
      {!loading && data && (
        <div className="content">
          <div className="h1">{data.name}</div>
          <Space size={20} style={{ marginTop: 30 }}>
            <div className={`type ${data.extra.type || 'normal'}`}>
              {typesMap[data.extra.type || 'normal']}
            </div>
            <span className="id">#{data.id}</span>
          </Space>

          <div className="owner">
            <div className="address">{formatAddress(data.origin)}</div>
            <div className={`status ${data.status}`}>
              {statusMap[data.status]}
            </div>
          </div>

          <Progress style={{ marginTop: 36 }} data={data} showDetail />

          {data.status === 'executed' && (
            <div style={{ marginTop: 25 }}>
              {data.extra.executor && (
                <div className="item-result">
                  <span className="label">Executor:</span>
                  <span className="value">
                    {formatAddress(data.extra.executor)}
                  </span>
                </div>
              )}
              <div className="item-result">
                <span className="label">Executor time:</span>
                <span className="value">
                  {dayjs(data.executeTime).format('A HH:mm, MM/DD/YYYY')}
                </span>
              </div>
            </div>
          )}

          {/* {data?.isClose && (
            <div className={styles['time']}>
              {formatMessage({ id: 'governance.votes.endtime' })}:
              <span className={styles['time-value']}>
                {dayjs(data.modify).format('A HH:mm, MM/DD/YYYY')}
              </span>
              <span className={styles['time-value']}>
                ({formatMessage({ id: 'governance.votes.ended' })})
              </span>
            </div>
          )} */}
          {/* {!data?.isClose && (
            <div className={styles['time']}>
              {formatMessage({ id: 'governance.votes.fromEnd' })}:
              <span className={styles['time-value']}>
                <Countdown
                  className={styles.countdown}
                  value={data.expiry * 1000}
                />
              </span>
            </div>
          )} */}
          {/* {data.status === 'executed' ? (
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
            )} */}
          {data?.extra?.purpose && (
            <div className="vote-detail">
              <div className="vote-detail-title">
                {formatMessage({ id: 'governance.proposal.purpose' })}
              </div>
              <div className="vote-detail-content">{data.extra.purpose}</div>
            </div>
          )}

          {data?.extra?.content && (
            <div className="vote-detail">
              <div className="vote-detail-title">
                {formatMessage({ id: 'governance.proposal.content' })}
              </div>
              <div className="vote-detail-content">{data.extra.content}</div>
            </div>
          )}

          {data?.extra?.result && (
            <div className="vote-detail">
              <div className="vote-detail-title">
                {formatMessage({ id: 'governance.proposal.result' })}
              </div>
              <div className="vote-detail-content">{data.extra.result}</div>
            </div>
          )}

          {currentMember.tokenId && !isVote && (
            <div className="footer">
              <Button
                className="button-submit"
                type="primary"
                ghost
                onClick={onOk}
                loading={loading1}
              >
                {formatMessage({ id: 'governance.votes.support' })}
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                className="button-submit"
                type="primary"
                onClick={onCancel}
                loading={loading2}
              >
                {formatMessage({ id: 'governance.votes.against' })}
              </Button>
            </div>
          )}
        </div>
      )}
      <style jsx>
        {`
          .content {
            padding: 32px;
          }

          .h1 {
            height: 24px;
            font-size: 22px;
            font-family: SFUIText-Semibold, SFUIText;
            font-weight: 600;
            color: #000000;
            line-height: 24px;
          }

          .type {
            height: 32px;
            padding: 0 14px;
            font-size: 16px;
            font-family: SFUIText-Semibold, SFUIText;
            font-weight: 600;
            color: #6271d2;
            line-height: 32px;
            letter-spacing: 1px;
            background: rgba(98, 113, 210, 0.1);
            border-radius: 16px;
          }

          .type.normal {
            color: rgba(98, 113, 210, 1);
            background: rgba(98, 113, 210, 0.1);
          }
          .type.financial {
            color: rgba(98, 113, 210, 1);
            background: rgba(98, 113, 210, 0.1);
          }
          .type.member {
            color: rgba(199, 128, 94, 1);
            background: rgba(199, 128, 94, 0.1);
          }
          .type.basic {
            color: rgba(2, 160, 252, 1);
            background: rgba(2, 160, 252, 0.1);
          }

          .id {
            display: inline-block;
            height: 32px;
            padding: 0 14px;
            font-size: 16px;
            font-family: SFUIText-Semibold, SFUIText;
            font-weight: 600;
            color: #000000;
            line-height: 32px;
            letter-spacing: 1px;
            background: rgba(177, 177, 177, 0.1);
            border-radius: 16px;
          }

          .status {
            position: relative;
            height: 16px;
            font-size: 14px;
            font-family: SFUIText-Bold, SFUIText;
            font-weight: bold;
            color: #161616;
            line-height: 16px;
          }

          .status::before {
            content: '';
            position: absolute;
            left: -19px;
            top: 2px;
            width: 12px;
            height: 12px;
            border: 2px solid #7f68fa;
            border-radius: 6px;
          }

          .status.processing::before {
            border-color: #7f68fa;
          }
          .status.passed::before {
            border-color: #34b53a;
          }
          .status.rejected::before {
            border-color: #7f68fa;
          }
          .status.executed::before {
            border-color: #02a0fc;
          }

          .owner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 32px;
          }

          .address {
            height: 19px;
            font-size: 16px;
            font-family: SFUIText-Medium, SFUIText;
            font-weight: 500;
            color: #000000;
            line-height: 19px;
          }

          .item-result {
            margin-top: 16px;
          }

          .item-result .label {
            display: inline-block;
            width: 126px;
            height: 24px;
            font-size: 14px;
            font-family: SFUIText-Bold, SFUIText;
            font-weight: bold;
            color: #000000;
            line-height: 24px;
          }

          .item-result .value {
            height: 24px;
            font-size: 14px;
            font-family: SFUIText-Semibold, SFUIText;
            font-weight: 600;
            color: #818181;
            line-height: 24px;
          }

          .vote-detail {
            margin-top: 40px;
          }

          .vote-detail-title {
            height: 19px;
            margin-top: 32px;
            font-size: 16px;
            font-family: SFUIText-Semibold, SFUIText;
            font-weight: 600;
            color: #000000;
            line-height: 19px;
          }

          .vote-detail-content {
            margin-top: 12px;
            font-size: 14px;
            font-family: SFUIText-Medium, SFUIText;
            font-weight: 500;
            color: #818181;
            line-height: 24px;
          }

          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
          }
        `}
      </style>
    </Modal>
  );
};

export default VoteModal;
