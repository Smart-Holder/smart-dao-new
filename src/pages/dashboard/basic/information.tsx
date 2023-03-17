import dynamic from 'next/dynamic';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import { Breadcrumb } from 'antd';

const Information = dynamic(
  () => import('@/containers/dashboard/basic/information'),
  { ssr: false },
);

const App: NextPageWithLayout = () => {
  return (
    <>
      {/* <Breadcrumb>
        <Breadcrumb.Item>sample</Breadcrumb.Item>
        <Breadcrumb.Item>sample</Breadcrumb.Item>
      </Breadcrumb> */}

      <Information />
    </>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
