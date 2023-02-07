import React, { useState } from 'react';
import { MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter } from 'next/router';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('基础设置', 'sub1', <MailOutlined />, [
    getItem('欢迎页', '/launch'),
    getItem('基础信息', '/launch/information'),
    getItem('业务模版', '/launch/setting'),
  ]),
];

const App: React.FC = () => {
  const router = useRouter();

  const [key, setKey] = useState(
    router.pathname.indexOf('/launch/setting') >= 0
      ? '/launch/setting'
      : router.pathname,
  );

  const onClick: MenuProps['onClick'] = (e) => {
    router.push(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 240 }}
      defaultSelectedKeys={[key]}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};

export default App;
