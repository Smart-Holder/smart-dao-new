import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Order from '@/containers/dashboard/mine/order';

const App: NextPageWithLayout = () => {
  return <Order />;
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
