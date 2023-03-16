import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Intro from '@/containers/home/intro';
import DAO from '@/containers/home/dao';

const App: NextPageWithLayout = () => {
  return (
    <div>
      <Intro />
      <DAO />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
