import 'antd/dist/reset.css';
import '@ant-design/flowchart/dist/index.css';
import '@/styles/globals.css';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import ConfigProvider from '@/components/provider';
import WalletProvider from '@/components/provider/wallet';
import APIProvider from '@/components/provider/api';

import store from '@/store';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider store={store}>
      <ConfigProvider>
        <WalletProvider>
          <APIProvider>{getLayout(<Component {...pageProps} />)}</APIProvider>
        </WalletProvider>
      </ConfigProvider>
    </Provider>
  );
}
