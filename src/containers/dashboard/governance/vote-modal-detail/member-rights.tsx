import { Checkbox, Row, Col } from 'antd';

import { useIntl } from 'react-intl';

import { Permissions } from '@/config/enum';

import styles from './detail.module.css';

type Props = {
  data: {
    address: string;
    permissions: number[];
  };
};

const App = ({ data }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <div className={styles.item} style={{ marginTop: 20 }}>
        <span className={styles.value}>
          {formatMessage({ id: 'proposal.detail.label.member.create' })}:
        </span>
        <span>{data.address}</span>
      </div>
      <div className={styles.item}>
        <div className={styles.value} style={{ marginBottom: 10 }}>
          {formatMessage({ id: 'my.information.rights' })}:
        </div>
        <Checkbox.Group
          defaultValue={data.permissions}
          className="checkbox-group"
          disabled
        >
          <Row style={{ width: '100%' }} gutter={[0, 10]}>
            <Col span={12}>
              <Checkbox value={Permissions.Action_VotePool_Vote}>
                {formatMessage({ id: 'my.information.rights.vote' })}
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value={Permissions.Action_VotePool_Create}>
                {formatMessage({ id: 'my.information.rights.proposal' })}
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value={Permissions.Action_Member_Create}>
                {formatMessage({ id: 'my.information.rights.add' })}
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value={Permissions.Action_Asset_SafeMint}>
                {formatMessage({ id: 'my.information.rights.publish' })}
              </Checkbox>
            </Col>
            <Col span={16}>
              <Checkbox value={Permissions.Action_DAO_Settings}>
                {formatMessage({ id: 'my.information.rights.basic' })}
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </div>
    </>
  );
};

export default App;
