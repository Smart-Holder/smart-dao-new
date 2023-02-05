import React, { useEffect, useState, memo, useCallback } from 'react';
import { MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Router, { useRouter } from 'next/router';

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
    // onTitleClick: ({ key }) => {
    //   console.log('onTitleClick', key);
    //   // Router.push('/dashboard/mine/information');
    // },
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Mine', '/dashboard/mine', <MailOutlined />, [
    getItem('Home', '/dashboard/mine/home'),
    getItem('Information', '/dashboard/mine/information'),
    getItem('Assets', '/dashboard/mine/assets'),
    getItem('Order', '/dashboard/mine/order'),
    getItem('Income', '/dashboard/mine/income'),
  ]),
  getItem('Basic Settings', '/dashboard/basic', <MailOutlined />, [
    getItem('Information', '/dashboard/basic/information'),
    getItem('Executor', '/dashboard/basic/executor'),
    getItem('Tax', '/dashboard/basic/tax'),
    getItem('Vote', '/dashboard/basic/vote'),
  ]),
  getItem('Governance', '/dashboard/governance', <MailOutlined />, [
    getItem('发起提案', '/dashboard/governance/proposal'),
    getItem('投票站', '/dashboard/governance/vote'),
  ]),
  getItem('财务管理', '/dashboard/financial', <MailOutlined />, [
    getItem('Assets', '/dashboard/financial/assets'),
    getItem('Order', '/dashboard/financial/order'),
    getItem('Income', '/dashboard/financial/income'),
  ]),
  getItem('Member', '/dashboard/member', <MailOutlined />, [
    getItem('NFTP List', '/dashboard/member/nftp'),
  ]),
];

const rootSubmenuKeys = [
  '/dashboard/mine',
  '/dashboard/basic',
  '/dashboard/governance',
  '/dashboard/financial',
  '/dashboard/member',
];

const App: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  const openKey = rootSubmenuKeys.find((key) => pathname.indexOf(key) >= 0);

  const [openKeys, setOpenKeys] = useState([openKey || '']);
  // const [selectedKeys, setSelectedKeys] = useState([pathname]);

  const onOpenChange: MenuProps['onOpenChange'] = useCallback(
    (keys: any) => {
      const latestOpenKey = keys.find(
        (key: string) => openKeys.indexOf(key) === -1,
      );
      if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
        setOpenKeys(keys);
      } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
    },
    [openKeys],
  );

  const onClick: MenuProps['onClick'] = useCallback(
    (e: any) => {
      router.replace(e.key);
    },
    [router],
  );

  return (
    <Menu
      style={{ width: 240 }}
      mode="inline"
      items={items}
      // defaultOpenKeys={openKeys}
      openKeys={openKeys}
      // defaultSelectedKeys={selectedKeys}
      selectedKeys={[pathname]}
      onOpenChange={onOpenChange}
      onClick={onClick}
    />
  );
};

export default memo(App);
