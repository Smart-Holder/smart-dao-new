import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_DAOS_ASSET_STATISTIC_ACTION,
  GET_DAO_LEDGER_BALANCES_ACTION,
} from '@/api/gqls/statistic';
import {
  QueryStatistic,
  ResponseStatisticType,
  ResponseLedgerDataType,
} from '@/api/typings/statistic';

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

const useLedgerBalances = ({ host }: { host: string }) => {
  const { data, loading, error, refetch } = useQuery<ResponseLedgerDataType>(
    GET_DAO_LEDGER_BALANCES_ACTION,
    {
      variables: {
        host,
      },
    },
  );

  const datas = useMemo(() => {
    return data;
  }, [data]);

  return {
    data: datas,
    loading,
    error,
    refetch,
  };
};

export { useAssetsStatistic, useLedgerBalances };
