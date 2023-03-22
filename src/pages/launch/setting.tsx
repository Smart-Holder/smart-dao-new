import dynamic from 'next/dynamic';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

const Setting = dynamic(() => import('@/containers/launch/setting'), {
  ssr: false,
});

const App: NextPageWithLayout = () => {
  return <Setting />;
};

App.getLayout = (page: ReactElement) => <Layout type="launch">{page}</Layout>;

export default App;
