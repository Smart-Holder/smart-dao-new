import { useEffect } from 'react';
import 'antd/dist/reset.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/store';
import { ConfigProvider } from 'antd';
import { initialize } from '@/api';

const theme = {
  token: {
    colorPrimary: '#546FF6',
  },
  components: {
    Button: {
      colorPrimary: '#2F4CDD',
    },
  },
};

export default function App({ Component, pageProps }: AppProps) {
  // todo
  useEffect(() => {
    initialize();
  }, []);

  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <Component {...pageProps} />
      </ConfigProvider>
    </Provider>
  );
}
