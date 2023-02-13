import { Layout } from 'antd';

import DashboardLayout from '@/components/layout/dashboard';
import styles from '@/styles/content.module.css';
import IssueForm from '@/containers/dashboard/financial/issue-form';

const IssueAsset = () => {
  return (
    <DashboardLayout>
      <Layout.Content className={styles['dashboard-content']}>
        <div className={styles['dashboard-content-body']}>
          <div className={styles['financial-issue']}>
            <div className={styles['financial-issue-title']}>发行资产</div>
            <div className={styles['financial-issue-sub-title']}>
              Lorem ipsum dolor sit amet, consectetur
            </div>
            <IssueForm />
          </div>
        </div>
      </Layout.Content>
    </DashboardLayout>
  );
};

export default IssueAsset;
