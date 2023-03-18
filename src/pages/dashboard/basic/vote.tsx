import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Vote from '@/containers/dashboard/basic/vote';

const App: NextPageWithLayout = () => {
  return <Vote />;
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
