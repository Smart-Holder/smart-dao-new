import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Information from '@/containers/dashboard/mine/information';

const App: NextPageWithLayout = () => {
  return <Information />;
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
