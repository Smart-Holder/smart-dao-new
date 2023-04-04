import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Intro from '@/containers/home/intro';
import DAO from '@/containers/home/dao';
import NFTS from '@/containers/home/nfts';

const App: NextPageWithLayout = () => {
  return (
    <div>
      <Intro />
      <DAO />
      <NFTS />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
