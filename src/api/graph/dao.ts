import { useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_ALL_DAOS_ACTION, GET_CREATOR_DAOS_ACTION } from '@/api/gqls/dao';
import {
  ResponseDataType,
  assetPoolProps,
  queryRecord,
} from '@/api/typings/dao';
import dayjs from 'dayjs';
// interface Options {
//   first?: number;
//   skip?: number;
//   orderDirection?: 'desc' | 'asc';
//   orderBy?: string;
//   where?: Dict;
//   subs?: Dict<Options>;
// }

// const useAllDaos = ({ name_contains = '', first = 4 }: queryRecord) => {
//   return useQuery<ResponseDataType>(GET_ALL_DAOS_ACTION, {
//     variables: {
//       name_contains,
//       first,
//     },
//   });
// };
const useLayoutDaos = () => {
  const [fetchMore, { data, loading, error }] =
    useLazyQuery<ResponseDataType>(GET_ALL_DAOS_ACTION);
  let dataSource = useMemo(() => {
    let result = Object.assign({}, data);
    result.daos = result.daos?.map((item) => {
      let first = item.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Frist',
      )?.id;
      let second = item.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Second',
      )?.id;

      return {
        ...item,
        time: dayjs.unix(Number(item.time)).valueOf().toString(),
        ledger: item.ledgerPool?.id,
        member: item.memberPool?.id,
        host: item.host.toLocaleLowerCase(),
        root: item.votePool?.id,
        first,
        second,
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

const useCreatorDaos = () => {
  const [fetchMore, { data, loading, error }] = useLazyQuery<ResponseDataType>(
    GET_CREATOR_DAOS_ACTION(),
    {
      fetchPolicy: 'no-cache',
    },
  );
  let dataSource = useMemo(() => {
    let result = Object.assign({}, data);
    result.daos = result.daos?.map((item) => {
      let first = item.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Frist',
      )?.id;
      let second = item.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Second',
      )?.id;
      return {
        ...item,
        time: dayjs.unix(Number(item.time)).valueOf().toString(),
        ledger: item.ledgerPool?.id,
        member: item.memberPool?.id,
        root: item.votePool?.id,
        host: item.host.toLocaleLowerCase(),
        first,
        second,
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

export { useLayoutDaos, useCreatorDaos };
