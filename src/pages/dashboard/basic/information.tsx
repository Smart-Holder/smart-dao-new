import dynamic from 'next/dynamic';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

const Information = dynamic(
  () => import('@/containers/dashboard/basic/information'),
  { ssr: false },
);

const App: NextPageWithLayout = () => {
  return (
    <div className="dashboard-content">
      {/* <div>
        <div className={styles.title1}>Chose your mo ban elements</div>
        <div className={styles.title2}>Welcome to SmartDAO</div>
      </div> */}
      <Information />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
