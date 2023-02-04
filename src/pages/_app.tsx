import 'antd/dist/reset.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import ConfigProvider from '@/components/provider';

import store from '@/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <Component {...pageProps} />
      </ConfigProvider>
    </Provider>
  );
}
