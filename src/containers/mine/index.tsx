import { useState } from 'react';
import { Divider, Space, Button, Avatar, Tabs } from 'antd';
import { useIntl, FormattedMessage } from 'react-intl';

import DAO from '@/containers/mine/daoList';
import Info from '@/containers/mine/info';
import { useAppSelector } from '@/store/hooks';

import type { TabsProps } from 'antd';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: <FormattedMessage id="my.home.dao" />,
    children: <DAO />,
  },
  {
    key: '2',
    label: <FormattedMessage id="my.home.information" />,
    children: <Info />,
  },
];

export default function Mine() {
  const { formatMessage } = useIntl();

  const { userInfo } = useAppSelector((store) => store.user);

  const [active, setActive] = useState(1);
  const [current, setCurrent] = useState('mail');

  const handleDAOClick = () => {
    setActive(1);
  };

  const handleInfoClick = () => {
    setActive(2);
  };

  return (
    <div className="wrap">
      <div className="header">
        <div className="avatar">
          <Avatar
            className="avatar"
            src={userInfo.image}
            size={110}
            style={{ border: '4px solid #fff' }}
          />
        </div>
      </div>

      <Tabs defaultActiveKey="1" items={items} />

      {/* <div>
        {current === 'dao' && <DAO />}
        {current === 'information' && <Info />}
      </div> */}

      <style jsx>
        {`
          .wrap .header {
            position: relative;
            height: 300px;
            background: url('/images/my/img_me_bg.png') no-repeate center;
            background-size: cover;
          }

          .wrap .avatar {
            position: absolute;
            left: 80px;
            bottom: -55px;
          }

          .wrap :global(.divider) {
            height: 32px;
            border-width: 3px;
            border-color: #000;
          }

          .wrap :global(.button) {
            height: 40px;
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000;
            line-height: 30px;
            outline: none;
          }

          .wrap :global(.active) {
            color: #546ff6;
          }
        `}
      </style>
    </div>
  );
}
