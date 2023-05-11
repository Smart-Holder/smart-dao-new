import { ReactElement, useEffect } from 'react';

import BasicLayout from './basic';
import LaunchLayout from './launch';
import DashboardLayout from './dashboard';
import { useAppSelector } from '@/store/hooks';

import { useRouter } from 'next/router';
import { getSessionStorage } from '@/utils';
import { DAOType } from '@/config/enum';

const visitablePage = [
  '/dashboard/mine/home',
  '/dashboard/governance/votes',
  '/dashboard/financial/assets',
  '/dashboard/mine/assets/detail',
  '/dashboard/financial/order',
  '/dashboard/financial/income',
  '/dashboard/member/nftp',
];

const App = ({
  children,
  type,
  footer,
}: {
  children: ReactElement;
  type?: string;
  footer?: boolean;
}) => {
  // const dispatch = useAppDispatch();
  const router = useRouter();

  const { isInit } = useAppSelector((store) => store.common);

  useEffect(() => {
    if (type === 'basic' || type === 'launch') {
      return;
    }

    const dao = getSessionStorage('currentDAO');
    let daoType = localStorage.getItem('daoType');

    if (!dao || !dao.host) {
      router.replace('/');
      return;
    }

    if (daoType === DAOType.Visit || daoType === DAOType.Follow) {
      const { pathname } = router;
      const visitable = visitablePage.some((path) => pathname.includes(path));

      if (!visitable) {
        router.replace('/dashboard/mine/home');
        return;
      }
    }
  }, [router]);

  if (router.pathname !== '/' && !isInit) {
    return null;
  }

  if (type === 'basic') {
    return <BasicLayout footer={footer}>{children}</BasicLayout>;
  } else if (type === 'launch') {
    return <LaunchLayout>{children}</LaunchLayout>;
  }

  return <DashboardLayout footer={footer}>{children}</DashboardLayout>;
};

export default App;
