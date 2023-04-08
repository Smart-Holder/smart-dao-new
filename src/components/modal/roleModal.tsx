import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import { Avatar, Col, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import Modal from '@/components/modal';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentMember } from '@/store/features/daoSlice';

import { formatAddress } from '@/utils';
import { useIntl } from 'react-intl';
import { request } from '@/api';
import { Member } from '@/config/define';

// const validateMessages = {
//   required: '${label} is required!',
//   string: {
//     range: "'${label}' must be between ${min} and ${max} characters",
//   },
// };

const RoleModal = (props: any, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { currentDAO } = useAppSelector((store) => store.dao);
  const { chainId, address } = useAppSelector((store) => store.wallet);

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const getData = async () => {
      const members = await request({
        name: 'utils',
        method: 'getMembersFrom',
        params: { chain: chainId, host: currentDAO.host, owner: address },
      });

      setMembers(members || []);
    };

    getData();
  }, [chainId, currentDAO.host, address]);

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalOpen(true);
    },
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClick = (item: any) => {
    dispatch(setCurrentMember(item));
    setIsModalOpen(false);
  };

  return (
    <Modal type="normal" open={isModalOpen} onCancel={handleCancel}>
      <div className="content">
        <div className="h1">{formatMessage({ id: 'home.selectIdentity' })}</div>

        {members.length < 3 ? (
          <div className="roles">
            {members.map((item) => (
              <div className="role-item role-item-s" key={item.id}>
                {item.image ? (
                  <Avatar
                    size={88}
                    src={item.image}
                    style={{ cursor: 'pointer' }}
                    data-id={item.id}
                    onClick={() => {
                      handleClick(item);
                    }}
                  />
                ) : (
                  <Avatar size={44} icon={<UserOutlined />} />
                )}
                <span className="role-item-name">
                  {item.name || formatAddress(item.host)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Row gutter={[30, 30]} style={{ marginTop: 50 }}>
            {members.map((item) => (
              <Col span={8} key={item.id}>
                <div className="role-item">
                  {item.image ? (
                    <Avatar
                      size={88}
                      src={item.image}
                      style={{ cursor: 'pointer' }}
                      data-id={item.id}
                      onClick={() => {
                        handleClick(item);
                      }}
                    />
                  ) : (
                    <Avatar size={44} icon={<UserOutlined />} />
                  )}
                  <span className="role-item-name">
                    {item.name || formatAddress(item.host)}
                  </span>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <style jsx>
        {`
          .content {
            text-align: center;
          }

          .h1 {
            height: 29px;
            font-size: 24px;
            font-family: var(--font-family-secondary);
            font-weight: 600;
            color: #000000;
            line-height: 29px;
          }

          .roles {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 50px;
          }

          .role-item-s {
            margin: 0 30px;
          }

          .role-item {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .role-item-name {
            height: 28px;
            margin-top: 32px;
            font-size: 20px;
            font-weight: 600;
            color: #000000;
            line-height: 24px;
          }
        `}
      </style>
    </Modal>
  );
};

export default forwardRef(RoleModal);
