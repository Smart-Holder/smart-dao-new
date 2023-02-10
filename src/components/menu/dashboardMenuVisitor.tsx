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
  {
    label: 'Home',
    key: '/dashboard/mine/home',
    icon: <MailOutlined />,
  },
  {
    label: '投票站',
    key: '/dashboard/governance/votes',
    icon: <MailOutlined />,
  },
  {
    label: '资产',
    key: '/dashboard/financial/assets',
    icon: <MailOutlined />,
  },
  {
    label: '订单',
    key: '/dashboard/financial/order',
    icon: <MailOutlined />,
  },
  {
    label: '收入',
    key: '/dashboard/financial/income',
    icon: <MailOutlined />,
  },
  {
    label: 'NFTP',
    key: '/dashboard/member/nftp',
    icon: <MailOutlined />,
  },
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

  // const openKey = rootSubmenuKeys.find((key) => pathname.indexOf(key) >= 0);

  // const [openKeys, setOpenKeys] = useState([openKey || '']);
  // const [selectedKeys, setSelectedKeys] = useState([pathname]);

  // const onOpenChange: MenuProps['onOpenChange'] = useCallback(
  //   (keys: any) => {
  //     const latestOpenKey = keys.find(
  //       (key: string) => openKeys.indexOf(key) === -1,
  //     );
  //     if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
  //       setOpenKeys(keys);
  //     } else {
  //       setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  //     }
  //   },
  //   [openKeys],
  // );

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
      // openKeys={openKeys}
      // defaultSelectedKeys={selectedKeys}
      selectedKeys={[pathname]}
      // onOpenChange={onOpenChange}
      onClick={onClick}
    />
  );
};

export default memo(App);
