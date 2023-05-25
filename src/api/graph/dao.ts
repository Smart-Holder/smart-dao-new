import { useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_DAOS_ACTION } from '@/api/gqls/dao';
import { ResponseDataType, assetPoolProps } from '@/api/typings/dao';
import dayjs from 'dayjs';

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

export { useLayoutDaos };
