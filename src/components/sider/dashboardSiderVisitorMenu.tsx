import React, { memo, useCallback } from 'react';
import type { MenuProps } from 'antd';
import { Menu, Image } from 'antd';
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

  const items: MenuProps['items'] = [
    // {
    //   label: formatMessage({ id: 'sider.visitor.home' }),
    //   key: '/dashboard/mine/home',
    //   icon: <MailOutlined />,
    // },
    {
      label: formatMessage({ id: 'sider.visitor.votes' }),
      key: '/dashboard/governance/votes',
      icon: (
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_polling_station_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />
      ),
    },
    {
      label: formatMessage({ id: 'sider.visitor.asset' }),
      key: '/dashboard/financial/assets',
      icon: (
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_assets_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />
      ),
    },
    {
      label: formatMessage({ id: 'sider.visitor.order' }),
      key: '/dashboard/financial/order',
      icon: (
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_order_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />
      ),
    },
    {
      label: formatMessage({ id: 'sider.visitor.income' }),
      key: '/dashboard/financial/income',
      icon: (
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_income_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />
      ),
    },
    {
      label: formatMessage({ id: 'sider.visitor.nftp' }),
      key: '/dashboard/member/nftp',
      icon: (
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_nftp_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />
      ),
    },
  ];

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
      router.push(e.key);
    },
    [router],
  );

  return (
    <Menu
      style={{ width: 234, marginTop: 12 }}
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
