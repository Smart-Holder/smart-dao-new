import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Intro from '@/containers/home/intro';
import DAO from '@/containers/home/dao';
import NFT from '@/containers/home/nft';

const App: NextPageWithLayout = () => {
  return (
    <div className="basic-content">
      <Intro />
      <DAO />
      <NFT />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
