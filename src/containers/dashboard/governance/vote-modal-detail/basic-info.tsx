import { Image } from 'antd';
import { useIntl } from 'react-intl';

import styles from './detail.module.css';

type Props = {
  data: {
    mission?: string;
    description?: string;
    image?: string;
    extend?: {
      poster?: string;
    };
  };
};

const App = ({ data }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <div style={{ marginTop: 20 }}>
      {data.mission && (
        <div className={styles.item}>
          <span className={styles.label}>
            {formatMessage({ id: 'proposal.detail.label.basic.mission' })}:
          </span>
          <span className={styles.value}>{data.mission}</span>
        </div>
      )}
      {data.description && (
        <div className={styles.item}>
          <span className={styles.label}>
            {formatMessage({ id: 'proposal.detail.label.basic.description' })}:
          </span>
          <span className={styles.value}>{data.description}</span>
        </div>
      )}
      {data.image && (
        <div className={styles.item}>
          <div style={{ marginBottom: 6 }}>
            {formatMessage({ id: 'proposal.detail.label.basic.logo' })}:
          </div>
          <Image
            src={data.image}
            alt="logo"
            width={100}
            height={100}
            preview={false}
          />
        </div>
      )}
      {data?.extend?.poster && (
        <div className={styles['mb-20']}>
          <div style={{ marginBottom: 6 }}>
            {formatMessage({ id: 'proposal.detail.label.basic.poster' })}:
          </div>
          <Image
            src={data.extend.poster}
            alt="logo"
            width={380}
            height={150}
            preview={false}
          />
        </div>
      )}
    </div>
  );
};

export default App;
