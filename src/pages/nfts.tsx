import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Footer from '@/components/footer';
import List from '@/containers/nfts';

const App: NextPageWithLayout = () => {
  return (
    <div className="dashboard-content-scroll" id="nftScrollTarget">
      <div
        className="content-min-height basic-content hasShadow"
        style={{ paddingBottom: 50 }}
      >
        <List />
      </div>
      <Footer />
    </div>
  );
};

App.getLayout = (page: ReactElement) => (
  <Layout type="basic" footer={false}>
    {page}
  </Layout>
);

export default App;
