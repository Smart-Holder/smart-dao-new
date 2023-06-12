import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DAOS_ASSET_STATISTIC_ACTION } from '@/api/gqls/statistic';
import { QueryStatistic, ResponseStatisticType } from '@/api/typings/statistic';

const useAssetsStatistic = ({ first = 1, host, owner }: QueryStatistic) => {
  const { data, loading, error } = useQuery<ResponseStatisticType>(
    GET_DAOS_ASSET_STATISTIC_ACTION,
    {
      variables: {
        first,
        owner,
        host,
      },
    },
  );
  const datas = useMemo(() => {
    return data?.members[0];
  }, [data]);

  return {
    data: datas,
    loading,
    error,
  };
};

export { useAssetsStatistic };
