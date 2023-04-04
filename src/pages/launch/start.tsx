import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

const Start = dynamic(() => import('@/containers/launch/start'), {
  ssr: false,
});

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div className="h1">{formatMessage({ id: 'home.welcome' })}</div>
      <div className="h2">{formatMessage({ id: 'home.createOwnDAO' })}</div>

      <Start />

      <style jsx>
        {`
          .h1 {
            height: 42px;
            margin-top: 31px;
            font-size: 24px;
            font-family: var(--font-family-600);
            font-weight: 400;
            color: #000000;
            line-height: 42px;
            text-align: center;
          }

          .h2 {
            height: 27px;
            margin-bottom: 31px;
            font-size: 16px;
            font-weight: 400;
            color: #3c4369;
            line-height: 27px;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
