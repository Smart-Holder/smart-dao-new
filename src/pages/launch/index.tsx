import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Index from '@/containers/launch';

const App: NextPageWithLayout = () => {
  return <Index />;
};

App.getLayout = (page: ReactElement) => <Layout type="launch">{page}</Layout>;

export default App;
