import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Executor from '@/containers/dashboard/basic/executor';

const App: NextPageWithLayout = () => {
  return (
    <>
      <Executor />
    </>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
