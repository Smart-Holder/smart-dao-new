import type { ReactElement } from 'react';
import { useRouter } from 'next/router';

import BasicLayout from './basic';
import LaunchLayout from './launch';
import DashboardLayout from './dashboard';

const App = ({ children, type }: { children: ReactElement; type?: string }) => {
  const router = useRouter();

  const beforeHistoryChange = (url: any) => {
    console.log('-----beforePopState', url);
    // // I only want to allow these two routes!
    // if (as !== '/' && as !== '/other') {
    //   // Have SSR render bad routes as a 404.
    //   window.location.href = as
    //   return false
    // }

    return true;
  };

  const routeChangeComplete = (url: any) => {
    console.log('-----routeChangeComplete', url);
    return true;
  };

  const routeChangeStart = (url: any) => {
    console.log('-----routeChangeStart', url);
    return true;
  };

  router.events.on('beforeHistoryChange', beforeHistoryChange);
  router.events.on('routeChangeComplete', routeChangeComplete);
  router.events.on('routeChangeStart', routeChangeStart);

  if (type === 'basic') {
    return <BasicLayout>{children}</BasicLayout>;
  } else if (type === 'launch') {
    return <LaunchLayout>{children}</LaunchLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default App;
