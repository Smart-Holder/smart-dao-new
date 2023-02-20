import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Modal, Typography, Image, Avatar } from 'antd';
import { Checkbox, Form, Upload, Tag, Space } from 'antd';
import Icon, {
  RightCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentMember } from '@/store/features/daoSlice';

import { connectType } from '@/config/enum';

import { validateChinese, validateEthAddress } from '@/utils/validator';
import { getCookie } from '@/utils/cookie';
import { validateImage, getBase64 } from '@/utils/image';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import sdk from 'hcstore/sdk';
import { formatAddress } from '@/utils';
import { useIntl } from 'react-intl';

const { Link } = Typography;

const validateMessages = {
  required: '${label} is required!',
  string: {
    range: "'${label}' must be between ${min} and ${max} characters",
  },
};

const RoleModal = (props: any, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((store) => store.user);
  const { userMembers } = useAppSelector((store) => store.dao);

  const [image, setImage] = useState();

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
    <Modal width={512} open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className="content">
        <div className="h1">{formatMessage({ id: 'home.selectIdentity' })}</div>
        {/* <div className="h2">Create your own DAO</div> */}

        <div className="roles">
          {userMembers.map((item) => (
            <div className="role-item" key={item.id}>
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
      </div>

      <style jsx>
        {`
          .content {
            padding: 25px 16px;
            text-align: center;
          }

          .h1 {
            height: 40px;
            font-size: 28px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #3c4369;
            line-height: 40px;
          }

          .h2 {
            height: 50px;
            margin-top: 7px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 50px;
          }

          .roles {
            margin-top: 75px;
          }

          .role-item {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .role-item-name {
            height: 28px;
            margin-top: 33px;
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #3c4369;
            line-height: 28px;
          }
        `}
      </style>
    </Modal>
  );
};

export default forwardRef(RoleModal);
