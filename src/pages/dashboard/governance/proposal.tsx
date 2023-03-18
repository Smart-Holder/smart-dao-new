import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Proposal from '@/containers/dashboard/governance/proposal';

const App: NextPageWithLayout = () => {
  return <Proposal />;
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
