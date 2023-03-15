import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Mine from '@/containers/dashboard/mine';

const App: NextPageWithLayout = () => {
  return <Mine />;
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
