import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import NFTP from '@/containers/dashboard/member/nftp';

const App: NextPageWithLayout = () => {
  return (
    <div className="dashboard-content">
      <NFTP />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
