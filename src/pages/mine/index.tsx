import Mine from '@/containers/mine';
import Layout from '@/components/layout';

import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

const App: NextPageWithLayout = () => {
  return (
    <div className="basic-content basic-content-padding-0">
      <Mine />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
