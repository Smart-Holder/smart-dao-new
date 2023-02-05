import 'antd/dist/reset.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import ConfigProvider from '@/components/provider';
import WalletProvider from '@/components/provider/wallet';
import APIProvider from '@/components/provider/api';

import store from '@/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <WalletProvider>
          <APIProvider>
            <Component {...pageProps} />
          </APIProvider>
        </WalletProvider>
      </ConfigProvider>
    </Provider>
  );
}
