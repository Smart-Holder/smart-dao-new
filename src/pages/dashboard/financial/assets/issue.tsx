import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import { Breadcrumb } from 'antd';

import IssueForm from '@/containers/dashboard/financial/issue-form';
import { useIntl } from 'react-intl';

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="/dashboard/financial/assets">
          {formatMessage({ id: 'sider.financial.asset' })}
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {formatMessage({ id: 'financial.asset.publish' })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <IssueForm />
    </>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
