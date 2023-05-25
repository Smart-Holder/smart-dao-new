import { useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_DAOS_ACTION, GET_DAO_ACTION } from '@/api/gqls/dao';
import { ResponseDataType, assetPoolProps, daosType } from '@/api/typings/dao';
import dayjs from 'dayjs';
import { formatAddress } from '@/utils';

const useLayoutDaos = () => {
  const [fetchMore, { data, loading, error }] = useLazyQuery<ResponseDataType>(
    GET_DAOS_ACTION(),
    {
      fetchPolicy: 'no-cache',
    },
  );
  let dataSource = useMemo(() => {
    let result = Object.assign({}, data);
    result.daos = result.daos?.map((item) => {
      let first = item.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Frist',
      );
      let second = item.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Second',
      );
      return {
        ...item,
        time: dayjs.unix(Number(item.time)).valueOf().toString(),
        ledger: item.ledgerPool?.id,
        member: item.memberPool?.id,
        root: item.votePool?.id,
        host: item.host.toLocaleLowerCase(),
        first: first?.id,
        second: second?.id,
        assetIssuanceTax: first?.tax,
        assetCirculationTax: second?.tax,
        executor: formatAddress(item.executor),
        defaultVoteTime: item.votePool.lifespan,
      };
    });
    return result;
  }, [data]);

  return {
    fetchMore,
    data: dataSource,
    loading,
    error,
  };
};

const useDao = () => {
  const [fetchMore, { data, loading, error }] = useLazyQuery<ResponseDataType>(
    GET_DAO_ACTION(),
    {
      fetchPolicy: 'no-cache',
    },
  );

  let dataSource = useMemo(() => {
    if (data?.dao) {
      let result = Object.assign({}, data?.dao);

      let first = result.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Frist',
      );
      let second = result.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Second',
      );

      return {
        ...result,
        time: dayjs.unix(Number(result.time)).valueOf().toString(),
        ledger: result.ledgerPool?.id,
        member: result.memberPool?.id,
        root: result.votePool?.id,
        host: result.host.toLocaleLowerCase(),
        first: first?.id,
        second: second?.id,
        assetIssuanceTax: first?.tax,
        assetCirculationTax: second?.tax,
        executor: formatAddress(result.executor),
        defaultVoteTime: result.votePool.lifespan,
      };
    }
  }, [data]);

  return {
    fetchMore,
    data: dataSource,
    loading,
    error,
  };
};

export { useLayoutDaos, useDao };
