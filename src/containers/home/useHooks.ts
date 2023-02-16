import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import sdk from 'hcstore/sdk';
import { join as requestJoin } from '@/api/member';
import { message } from 'antd';
import { rng } from 'somes/rng';
import { createDAOVote } from '@/api/vote';
import { Permissions } from '@/config/enum';

export const useJoin = (
  contractAddress: string,
  address: string,
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

    try {
      const params = {
        name: '增加成员',
        description: JSON.stringify({
          type: 'member',
          purpose: `将${address}增加为DAO成员`,
        }),
        extra: [
          {
            abi: 'member',
            method: 'requestJoin',
            params: [
              address,
              {
                id: '0x' + rng(32).toString('hex'),
                name: '',
                description: '',
                image: '',
                votes: 1,
              },
              [
                Permissions.Action_VotePool_Vote,
                Permissions.Action_VotePool_Create,
              ],
            ],
          },
        ],
      };

      setLoading(true);
      // await requestJoin({ contractAddress });
      await createDAOVote(params);
      setLoading(false);
      message.success('生成提案');
      // setJoin_(true);
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
        message.success('已关注');
        setFollow_(true);
      });
    } else {
      sdk.user.methods.deleteLikeDAO({ dao: id, chain: chainId }).then(() => {
        message.success('取消关注');
        setFollow_(false);
      });
    }
  };

  return { follow, setFollow };
};
