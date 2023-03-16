import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Order from '@/containers/dashboard/financial/order';

const App: NextPageWithLayout = () => {
  return (
    <div className="dashboard-content">
      <Order />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
