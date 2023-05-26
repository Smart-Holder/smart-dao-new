import { Checkbox, Row, Col } from 'antd';
import { useIntl } from 'react-intl';

import { Permissions } from '@/config/enum';

import styles from './detail.module.css';

type Props = {
  data: {
    address: string;
    votes: number;
    permissions: number[];
  };
};

const App = ({ data }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div className={styles.item} style={{ marginTop: 20 }}>
        <div className={styles.value}>
          {formatMessage({ id: 'proposal.detail.label.member.join' })}
        </div>
      </div>

      <div className={styles.item} style={{ marginTop: 20 }}>
        <span className={styles.value}>
          NFTP {formatMessage({ id: 'address' })}:
        </span>
        <span>{data.address}</span>
      </div>

      <div className={styles.item}>
        <span className={styles.value}>
          {formatMessage({ id: 'member.nftp.copies' })}:
        </span>
        <span>{data.votes}</span>
      </div>

      <div className={styles.item}>
        <div className={styles.value} style={{ marginBottom: 10 }}>
          {formatMessage({ id: 'my.information.rights' })}:
        </div>
        <Checkbox.Group
          defaultValue={data.permissions}
          className="checkbox-group"
          style={{ width: '100%' }}
          disabled
        >
          <Row style={{ width: '100%' }} gutter={[0, 10]}>
            {data.permissions.includes(Permissions.Action_VotePool_Vote) && (
              <Col span={8}>
                <Checkbox
                  value={Permissions.Action_VotePool_Vote}
                  className="checked"
                >
                  {formatMessage({ id: 'my.information.rights.vote' })}
                </Checkbox>
              </Col>
            )}
            {data.permissions.includes(Permissions.Action_VotePool_Create) && (
              <Col span={8}>
                <Checkbox
                  value={Permissions.Action_VotePool_Create}
                  className="checked"
                >
                  {formatMessage({ id: 'my.information.rights.proposal' })}
                </Checkbox>
              </Col>
            )}
            {data.permissions.includes(Permissions.Action_Member_Create) && (
              <Col span={8}>
                <Checkbox
                  value={Permissions.Action_Member_Create}
                  className="checked"
                >
                  {formatMessage({ id: 'my.information.rights.add' })}
                </Checkbox>
              </Col>
            )}
            {data.permissions.includes(Permissions.Action_Asset_SafeMint) && (
              <Col span={8}>
                <Checkbox
                  value={Permissions.Action_Asset_SafeMint}
                  className="checked"
                >
                  {formatMessage({ id: 'my.information.rights.publish' })}
                </Checkbox>
              </Col>
            )}
            {data.permissions.includes(Permissions.Action_DAO_Settings) && (
              <Col span={16}>
                <Checkbox
                  value={Permissions.Action_DAO_Settings}
                  className="checked"
                >
                  {formatMessage({ id: 'my.information.rights.basic' })}
                </Checkbox>
              </Col>
            )}
          </Row>
        </Checkbox.Group>
      </div>
    </div>
  );
};

export default App;
