import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Tax from '@/containers/dashboard/basic/tax';

const App: NextPageWithLayout = () => {
  return <Tax />;
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
