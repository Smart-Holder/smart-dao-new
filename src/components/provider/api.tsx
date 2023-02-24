import { useEffect, useState } from 'react';
import sdk from 'hcstore/sdk';

import { initialize } from '@/api';
import { setCookie } from '@/utils/cookie';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setIsInit } from '@/store/features/commonSlice';
import { setUserInfo } from '@/store/features/userSlice';

/**
 * 初始化 api, qiniu, user
 * @param props
 * @returns
 */
const App = (props: any) => {
  const dispatch = useAppDispatch();
  const { address, chainId } = useAppSelector((store) => store.wallet);
  const [init, setInit] = useState(false); // init api

  // init api
  useEffect(() => {
    const init = async () => {
      try {
        const res1 = await initialize();
        const qiniuToken = await sdk.utils.methods.qiniuToken();
        setCookie('qiniuToken', qiniuToken);
        console.log('init api');
        setInit(true);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  // 连接钱包后，init api, qiniu and user
  useEffect(() => {
    const init = async () => {
      try {
        const res1 = await initialize(address);

        const [token, user] = await Promise.all([
          sdk.utils.methods.qiniuToken(),
          sdk.user.methods.getUser(),
        ]);

        if (token) {
          setCookie('qiniuToken', token);
        }

        if (user && user.nickname) {
          dispatch(setUserInfo(user));
        }

        console.log('init api, qiniu and user');
        dispatch(setIsInit(true));
      } catch (error) {
        console.error(error);
      }
    };

    if (address && chainId) {
      init();
    }
  }, [address, chainId]);

  if (!init) {
    return null;
  }

  return <>{props.children}</>;
};

export default App;
