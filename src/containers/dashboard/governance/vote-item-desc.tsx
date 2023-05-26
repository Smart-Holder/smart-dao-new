import { Typography } from 'antd';
import { useIntl } from 'react-intl';

import { fromToken, getUnit } from '@/utils';
import { proposalType as Types } from '@/config/enum';

const { Paragraph } = Typography;

type Props = {
  data: {
    type: string;
    proposalType: Types;
    values: any;
  };
};

const App = ({ data }: Props) => {
  const { formatMessage } = useIntl();

  const { proposalType, values } = data;

  let desc = '';

  if (proposalType === Types.Basic_Information) {
    desc += values.mission
      ? `${formatMessage({ id: 'proposal.detail.label.basic.mission' })}: ${
          values.mission
        }`
      : '';
    desc += values.description
      ? `${formatMessage({ id: 'proposal.detail.label.basic.description' })}: ${
          values.description
        }`
      : '';
    desc += values.image
      ? `${formatMessage({
          id: 'proposal.detail.label.basic.logo',
        })}, click for details.`
      : '';
    desc += values?.extend?.poster
      ? `${formatMessage({
          id: 'proposal.detail.label.basic.poster',
        })}, click for details.`
      : '';
  } else if (proposalType === Types.Basic_Executor) {
    desc += `${formatMessage({
      id: 'proposal.detail.label.basic.executor',
    })}: ${values.address}`;
  } else if (proposalType === Types.Member_Rights) {
    desc += `${formatMessage({
      id: 'proposal.detail.label.member.rights',
    })}, click for details.`;
  } else if (proposalType === Types.Member_Create) {
    desc += `${formatMessage({ id: 'proposal.detail.label.member.create' })}: ${
      values.address
    }`;
  } else if (proposalType === Types.Member_Join) {
    desc += `${formatMessage({
      id: 'proposal.detail.label.member.join',
    })}, ${formatMessage({ id: 'address' })}: ${values.address}`;
  } else if (proposalType === Types.Member_Votes) {
    desc += `${formatMessage({
      id: 'proposal.detail.label.member.votes',
    })}, click for details.`;
  } else if (proposalType === Types.Asset_Publish) {
    desc += `${formatMessage({
      id: 'proposal.detail.label.asset.publish',
    })}, click for details.`;
  } else if (proposalType === Types.Income_Allocate) {
    desc += `${formatMessage({
      id: 'proposal.detail.label.income.allocate',
    })}: ${fromToken(values.balance)} ${getUnit()}`;
  }

  return (
    <div>
      <Paragraph ellipsis={{ rows: 2 }}>
        <div className="item-desc">{desc}</div>
      </Paragraph>

      <style jsx>
        {`
          .item-desc {
            height: 56px;
            margin-top: 2px;
            font-size: 16px;
            font-weight: 500;
            color: #818181;
            line-height: 28px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
