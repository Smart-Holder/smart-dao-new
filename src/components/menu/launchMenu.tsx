import React, { useState } from 'react';
import { MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

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
    // icon,
    children,
    label,
    type,
  } as MenuItem;
}

const App: React.FC = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const items: MenuProps['items'] = [
    getItem(formatMessage({ id: 'sider.launch' }), 'sub1', <MailOutlined />, [
      getItem(formatMessage({ id: 'sider.launch.home' }), '/launch'),
      getItem(
        formatMessage({ id: 'sider.launch.information' }),
        '/launch/information',
      ),
      getItem(
        formatMessage({ id: 'sider.launch.template' }),
        '/launch/setting',
      ),
    ]),
  ];

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
