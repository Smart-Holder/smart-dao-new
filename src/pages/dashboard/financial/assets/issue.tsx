import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import IssueForm from '@/containers/dashboard/financial/issue-form';

const App: NextPageWithLayout = () => {
  return <IssueForm />;
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
