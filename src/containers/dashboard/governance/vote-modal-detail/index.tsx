import React from 'react';
import { useIntl } from 'react-intl';

import BasicInfo from './basic-info';
import BasicExecutor from './basic-executor';
import MemberCreate from './member-create';
import MemberJoin from './member-join';
import MemberRights from './member-rights';
import MemberVotes from './member-votes';
import AssetPublish from './asset-publish';
import IncomeAllocate from './income-allocate';

import { proposalType as Types } from '@/config/enum';

import styles from './detail.module.css';

type Props = {
  data: {
    type: string;
    proposalType: Types;
    values: any;
  };
};

const App = ({ data }: Props) => {
  const { formatMessage } = useIntl();

  const proposalType = data?.proposalType;
  const values = data?.values || {};

  return (
    <div className={styles['vote-detail']}>
      <div className={styles['vote-detail-title']}>
        {formatMessage({ id: 'governance.proposal.purpose' })}
      </div>
      <div className={styles['vote-detail-content']}>
        {proposalType === Types.Basic_Information && (
          <BasicInfo data={values} />
        )}
        {proposalType === Types.Basic_Executor && (
          <BasicExecutor data={values} />
        )}
        {proposalType === Types.Member_Create && <MemberCreate data={values} />}
        {proposalType === Types.Member_Join && <MemberJoin data={values} />}
        {proposalType === Types.Member_Rights && <MemberRights data={values} />}
        {proposalType === Types.Member_Votes && <MemberVotes data={values} />}
        {proposalType === Types.Asset_Publish && <AssetPublish data={values} />}
        {proposalType === Types.Income_Allocate && (
          <IncomeAllocate data={values} />
        )}
      </div>
    </div>
  );
};

export default App;
