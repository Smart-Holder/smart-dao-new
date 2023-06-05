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
  const { address, chainId, isSupportChain } = useAppSelector(
    (store) => store.wallet,
  );
  const [init, setInit] = useState(false); // init api

  // init api
  useEffect(() => {
    const init = async () => {
      try {
        await initialize();
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
        await initialize(address);

        const [qiniu, user] = await Promise.all([
          sdk.utils.methods.qiniuConfig(),
          sdk.user.methods.getUser(),
        ]);

        if (qiniu) {
          setCookie('qiniuToken', qiniu.token);
          setCookie('qiniuUploadUrl', `https://${qiniu.config.cdnUpHosts[0]}/`);
          setCookie('qiniuImgUrl', `${qiniu.prefix}/`);
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

    if (address && chainId && isSupportChain) {
      init();
    }
  }, [address, chainId, isSupportChain, dispatch]);

  if (!init) {
    return null;
  }

  return <>{props.children}</>;
};

export default App;
