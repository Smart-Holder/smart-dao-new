import { useState } from 'react';
import sdk from 'hcstore/sdk';
import { join as requestJoin } from '@/api/member';
import { message } from 'antd';
import { useIntl } from 'react-intl';

export const useJoin = (
  votePool: string,
  member: string,
  isMember: boolean | undefined,
) => {
  const { formatMessage } = useIntl();
  const [join, setJoin_] = useState(isMember);
  const [loading, setLoading] = useState(false);

  const setJoin = async () => {
    if (isMember) {
      return;
    }

    try {
      setLoading(true);
      await requestJoin({ votePool, member });
      setLoading(false);
      message.success(formatMessage({ id: 'governance.proposal.success' }));
      // setJoin_(true);
    } catch (error) {
      setLoading(false);
    }
  };

  return { join, setJoin, loading };
};

export const useFollow = (
  id: number | string,
  chainId: number,
  isLike: boolean,
) => {
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
