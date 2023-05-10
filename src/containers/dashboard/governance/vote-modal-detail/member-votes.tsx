import { useIntl } from 'react-intl';

import styles from './detail.module.css';

type Props = {
  data: {
    address: string;
    former: string;
  };
};

const App = ({ data }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <div className={styles.item} style={{ marginTop: 20 }}>
        <span className={styles.label}>
          {formatMessage({ id: 'proposal.detail.label.basic.executor' })}:
        </span>
        <span className={styles.value}>{data.address}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>
          {formatMessage({ id: 'proposal.detail.label.basic.executor.former' })}
          :
        </span>
        <span className={styles.value}>{data.former}</span>
      </div>
    </>
  );
};

export default App;
