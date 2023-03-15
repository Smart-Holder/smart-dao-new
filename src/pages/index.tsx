import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Intro from '@/containers/home/intro';
import DAO from '@/containers/home/dao';

const App: NextPageWithLayout = () => {
  return (
    <div className="home">
      <Intro />
      <DAO />

      <style jsx>
        {`
          .home {
            box-sizing: border-box;
            max-width: var(--width);
            padding: 0 80px;
            margin: 0 auto;
          }
        `}
      </style>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
