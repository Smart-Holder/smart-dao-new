import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import sdk from 'hcstore/sdk';

export const useJoin = (
  id: number,
  chainId: number,
  joinDAOs: Array<any>,
  DAOList: Array<any>,
) => {
  const index = (joinDAOs || []).findIndex((item: any) => item.id === id);
  const index2 = (DAOList || []).findIndex((item: any) => item.id === id);

  const [join, setJoin_] = useState(index >= 0 || index2 >= 0);

  const setJoin = () => {
    // sdk.user.methods.addLikeDAO({ dao: id, chain: chainId }).then((res) => {
    //   console.log('addLikeDAO', res);
    //   setFollow_(true);
    // });
  };

  return { join, setJoin };
};

export const useFollow = (
  id: number,
  chainId: number,
  likeDAOs: Array<any>,
) => {
  const index = (likeDAOs || []).findIndex((item: any) => item.id === id);

  const [follow, setFollow_] = useState(index >= 0);

  const setFollow = () => {
    sdk.user.methods.addLikeDAO({ dao: id, chain: chainId }).then((res) => {
      console.log('addLikeDAO', res);
      setFollow_(true);
    });
  };

  return { follow, setFollow };
};
