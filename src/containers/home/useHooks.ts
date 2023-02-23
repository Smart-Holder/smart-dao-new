import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import sdk from 'hcstore/sdk';
import { join as requestJoin } from '@/api/member';
import { message } from 'antd';
import { rng } from 'somes/rng';
import { createDAOVote } from '@/api/vote';
import { Permissions } from '@/config/enum';
import { useIntl } from 'react-intl';

export const useJoin = (
  votePool: string,
  member: string,
  address: string,
  isJoin: boolean,
  isMember: boolean,
) => {
  const { formatMessage } = useIntl();
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
        name: formatMessage({ id: 'proposal.basic.addNFTP' }),
        description: JSON.stringify({
          type: 'member',
          purpose: `${formatMessage({
            id: 'proposal.basic.addNFTP',
          })}: ${address}`,
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
      await requestJoin({ votePool, module: member });
      // await createDAOVote(params);
      setLoading(false);
      message.success(formatMessage({ id: 'governance.proposal.success' }));
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
