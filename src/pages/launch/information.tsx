import dynamic from 'next/dynamic';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

const Information = dynamic(() => import('@/containers/launch/information'), {
  ssr: false,
});

const App: NextPageWithLayout = () => {
  return <Information />;
};

App.getLayout = (page: ReactElement) => <Layout type="launch">{page}</Layout>;

export default App;
