import React, { useState, memo, useCallback } from 'react';
import { MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Image } from 'antd';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

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

const items: MenuProps['items'] = [
  getItem(
    <FormattedMessage id="sider.my" />,
    '/dashboard/mine',
    null,
    [
      getItem(
        <FormattedMessage id="sider.my.home" />,
        '/dashboard/mine/home',
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_home_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />,
      ),
      getItem(
        <FormattedMessage id="sider.my.information" />,
        '/dashboard/mine/information',
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_person_info_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />,
      ),
      getItem(
        <FormattedMessage id="sider.my.asset" />,
        '/dashboard/mine/assets',
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_assets_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />,
      ),
      getItem(
        <FormattedMessage id="sider.my.order" />,
        '/dashboard/mine/order',
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_order_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />,
      ),
      getItem(
        <FormattedMessage id="sider.my.income" />,
        '/dashboard/mine/income',
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_income_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />,
      ),
    ],
    'group',
  ),
  getItem(
    <FormattedMessage id="sider.management" />,
    '/dashboard/management',
    null,
    [
      getItem(
        <FormattedMessage id="sider.basic" />,
        '/dashboard/basic',
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_basic_setting_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />,
        [
          getItem(
            <FormattedMessage id="sider.basic.information" />,
            '/dashboard/basic/information',
          ),
          getItem(
            <FormattedMessage id="sider.basic.executor" />,
            '/dashboard/basic/executor',
          ),
          getItem(
            <FormattedMessage id="sider.basic.tax" />,
            '/dashboard/basic/tax',
          ),
          getItem(
            <FormattedMessage id="sider.basic.vote" />,
            '/dashboard/basic/vote',
          ),
        ],
      ),
      getItem(
        <FormattedMessage id="sider.governance" />,
        '/dashboard/governance',
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_dao_govern_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />,
        [
          getItem(
            <FormattedMessage id="sider.governance.proposal" />,
            '/dashboard/governance/proposal',
          ),
          getItem(
            <FormattedMessage id="sider.governance.votes" />,
            '/dashboard/governance/votes',
          ),
        ],
      ),
      getItem(
        <FormattedMessage id="sider.financial" />,
        '/dashboard/financial',
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_financial_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />,
        [
          getItem(
            <FormattedMessage id="sider.financial.asset" />,
            '/dashboard/financial/assets',
          ),
          getItem(
            <FormattedMessage id="sider.financial.order" />,
            '/dashboard/financial/order',
          ),
          getItem(
            <FormattedMessage id="sider.financial.income" />,
            '/dashboard/financial/income',
          ),
        ],
      ),
      getItem(
        <FormattedMessage id="sider.member" />,
        '/dashboard/member',
        <Image
          style={{ display: 'block' }}
          src="/images/sider/icon_nav_side_member_default@2x.png"
          width={20}
          height={20}
          alt="icon"
          preview={false}
        />,
        [
          getItem(
            <FormattedMessage id="sider.member.nftp" />,
            '/dashboard/member/nftp',
          ),
        ],
      ),
    ],
    'group',
  ),
];

const App: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;
  let selectedKey = pathname;

  if (selectedKey === '/dashboard/mine/assets/shelves') {
    selectedKey = '/dashboard/mine/assets';
  } else if (selectedKey === '/dashboard/mine/assets/detail') {
    selectedKey = '/dashboard/mine/assets';
  }

  // const openKey = rootSubmenuKeys.find((key) => pathname.indexOf(key) >= 0);
  // const [openKeys, setOpenKeys] = useState([openKey || '']);
  const [openKeys, setOpenKeys] = useState([
    '/dashboard/basic',
    '/dashboard/governance',
    '/dashboard/financial',
    '/dashboard/member',
  ]);

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
      router.push(e.key);
    },
    [router],
  );

  return (
    <Menu
      style={{ width: 234, paddingBottom: 66 }}
      mode="inline"
      items={items}
      openKeys={openKeys}
      selectedKeys={[selectedKey]}
      // onOpenChange={onOpenChange}
      onClick={onClick}
      expandIcon={() => null}
    />
  );
};

export default memo(App);
