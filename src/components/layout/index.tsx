import type { ReactElement } from 'react';

import BasicLayout from './basic';
import LaunchLayout from './launch';
import DashboardLayout from './dashboard';

const App = ({ children, type }: { children: ReactElement; type?: string }) => {
  if (type === 'basic') {
    return <BasicLayout>{children}</BasicLayout>;
  } else if (type === 'launch') {
    return <LaunchLayout>{children}</LaunchLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default App;
