import { Avatar, Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';

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
  const { userInfo } = useAppSelector((store) => store.user);

  return (
    <div className="wrap">
      <div className="header">
        <div className="user">
          <Avatar
            className="avatar"
            src={userInfo.image}
            size={110}
            style={{ border: '4px solid #fff' }}
          />
          <div className="nickname">{userInfo.nickname}</div>
        </div>
      </div>

      <Tabs
        className="tabs"
        style={{ margin: '0 80px 50px' }}
        defaultActiveKey="1"
        items={items}
      />

      {/* <div>
        {current === 'dao' && <DAO />}
        {current === 'information' && <Info />}
      </div> */}

      <style jsx>
        {`
          .wrap .header {
            position: relative;
            width: 100%;
            height: 300px;
            margin-bottom: 134px;
            background: url('/images/me/img_me_bg@2x.png') no-repeat center;
            background-size: cover;
          }

          .wrap .user {
            position: absolute;
            left: 80px;
            top: 242px;
          }

          .wrap .nickname {
            height: 34px;
            margin-top: 20px;
            font-size: 28px;
            font-weight: bold;
            color: #000000;
            line-height: 34px;
          }

          .tabs :global(.ant-tabs-tab) {
            height: 30px;
            font-size: 14px;
            font-weight: 600;
            color: #b1b1b1;
            line-height: 30px;
          }

          .tabs :global(.ant-tabs-tab.ant-tabs-tab-active) {
            color: #000;
          }
        `}
      </style>
    </div>
  );
}
