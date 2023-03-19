import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Income from '@/containers/dashboard/mine/income';

const App: NextPageWithLayout = () => {
  return <Income />;
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
