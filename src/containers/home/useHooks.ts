import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import sdk from 'hcstore/sdk';
import { join as requestJoin } from '@/api/member';

export const useJoin = (
  contractAddress: string,
  isJoin: boolean,
  isMember: boolean,
) => {
  // const index = (joinDAOs || []).findIndex((item: any) => item.id === id);
  // const index2 = (DAOList || []).findIndex((item: any) => item.id === id);
  // const [join, setJoin_] = useState(index >= 0 || index2 >= 0);

  const [join, setJoin_] = useState(isJoin || isMember);
  const [loading, setLoading] = useState(false);

  const setJoin = async () => {
    if (isJoin || isMember) {
      return;
    }

    setLoading(true);

    try {
      await requestJoin({ contractAddress });
      setLoading(false);
      setJoin_(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return { join, setJoin, loading };
};

export const useFollow = (id: number, chainId: number, isLike: boolean) => {
  // const index = (likeDAOs || []).findIndex((item: any) => item.id === id);

  const [follow, setFollow_] = useState(isLike);

  const setFollow = () => {
    if (!follow) {
      sdk.user.methods.addLikeDAO({ dao: id, chain: chainId }).then(() => {
        setFollow_(true);
      });
    } else {
      sdk.user.methods.deleteLikeDAO({ dao: id, chain: chainId }).then(() => {
        setFollow_(false);
      });
    }
  };

  return { follow, setFollow };
};
