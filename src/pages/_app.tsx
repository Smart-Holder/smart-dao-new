import { useEffect } from 'react';
import 'antd/dist/reset.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/store';
import { ConfigProvider } from 'antd';
import { initialize } from '@/api';
// import { getQiniuToken } from '@/store/features/qiniu';
import sdk from 'hcstore/sdk';
import { setCookie } from '@/utils/cookie';

const theme = {
  token: {
    colorPrimary: '#546FF6',
  },
  components: {
    Button: {
      // colorPrimary: '#2F4CDD',
    },
  },
};

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const init = async () => {
      try {
        const res1 = await initialize();
        const token = await sdk.utils.methods.qiniuToken();

        if (token) {
          setCookie('qiniuToken', token);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <Component {...pageProps} />
      </ConfigProvider>
    </Provider>
  );
}
