import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import IssueForm from '@/containers/dashboard/financial/issue-form';

import { useIntl } from 'react-intl';

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();
  return (
    <div className="dashboard-content">
      <div className={styles['dashboard-content-body']}>
        <div className={styles['financial-issue']}>
          <div className={styles['financial-issue-title']}>
            {formatMessage({ id: 'financial.asset.publish' })}
          </div>
          {/* <div className={styles['financial-issue-sub-title']}>
            Lorem ipsum dolor sit amet, consectetur
          </div> */}
          <IssueForm />
        </div>
      </div>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
