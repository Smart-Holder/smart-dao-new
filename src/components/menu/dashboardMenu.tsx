import React, { useState, memo, useCallback } from 'react';
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
    // onTitleClick: ({ key }) => {
    //   console.log('onTitleClick', key);
    //   // Router.push('/dashboard/mine/information');
    // },
  } as MenuItem;
}

const rootSubmenuKeys = [
  '/dashboard/mine',
  '/dashboard/basic',
  '/dashboard/governance',
  '/dashboard/financial',
  '/dashboard/member',
];

const App: React.FC = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { pathname } = router;

  const openKey = rootSubmenuKeys.find((key) => pathname.indexOf(key) >= 0);

  const [openKeys, setOpenKeys] = useState([openKey || '']);
  // const [selectedKeys, setSelectedKeys] = useState([pathname]);

  const items: MenuProps['items'] = [
    getItem(
      formatMessage({ id: 'sider.my' }),
      '/dashboard/mine',
      <MailOutlined />,
      [
        getItem(formatMessage({ id: 'sider.my.home' }), '/dashboard/mine/home'),
        getItem(
          formatMessage({ id: 'sider.my.information' }),
          '/dashboard/mine/information',
        ),
        getItem(
          formatMessage({ id: 'sider.my.asset' }),
          '/dashboard/mine/assets',
        ),
        getItem(
          formatMessage({ id: 'sider.my.order' }),
          '/dashboard/mine/order',
        ),
        getItem(
          formatMessage({ id: 'sider.my.income' }),
          '/dashboard/mine/income',
        ),
      ],
    ),
    getItem(
      formatMessage({ id: 'sider.basic' }),
      '/dashboard/basic',
      <MailOutlined />,
      [
        getItem(
          formatMessage({ id: 'sider.basic.information' }),
          '/dashboard/basic/information',
        ),
        getItem(
          formatMessage({ id: 'sider.basic.executor' }),
          '/dashboard/basic/executor',
        ),
        getItem(
          formatMessage({ id: 'sider.basic.tax' }),
          '/dashboard/basic/tax',
        ),
        getItem(
          formatMessage({ id: 'sider.basic.vote' }),
          '/dashboard/basic/vote',
        ),
      ],
    ),
    getItem(
      formatMessage({ id: 'sider.governance' }),
      '/dashboard/governance',
      <MailOutlined />,
      [
        getItem(
          formatMessage({ id: 'sider.governance.proposal' }),
          '/dashboard/governance/proposal',
        ),
        getItem(
          formatMessage({ id: 'sider.governance.votes' }),
          '/dashboard/governance/votes',
        ),
      ],
    ),
    getItem(
      formatMessage({ id: 'sider.financial' }),
      '/dashboard/financial',
      <MailOutlined />,
      [
        getItem(
          formatMessage({ id: 'sider.financial.asset' }),
          '/dashboard/financial/assets',
        ),
        getItem(
          formatMessage({ id: 'sider.financial.order' }),
          '/dashboard/financial/order',
        ),
        getItem(
          formatMessage({ id: 'sider.financial.income' }),
          '/dashboard/financial/income',
        ),
      ],
    ),
    getItem(
      formatMessage({ id: 'sider.member' }),
      '/dashboard/member',
      <MailOutlined />,
      [
        getItem(
          formatMessage({ id: 'sider.member.nftp' }),
          '/dashboard/member/nftp',
        ),
      ],
    ),
  ];

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
      router.push(e.key);
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
