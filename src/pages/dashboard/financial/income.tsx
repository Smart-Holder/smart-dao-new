import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Income from '@/containers/dashboard/financial/income';

const App: NextPageWithLayout = () => {
  return (
    <div className="dashboard-content">
      <Income />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
