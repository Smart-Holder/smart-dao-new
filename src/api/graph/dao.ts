import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_ALL_DAOS_ACTION } from '@/api/gqls/dao';
import { ResponseDataType, queryRecord } from '@/api/typings/dao';
// interface Options {
//   first?: number;
//   skip?: number;
//   orderDirection?: 'desc' | 'asc';
//   orderBy?: string;
//   where?: Dict;
//   subs?: Dict<Options>;
// }

const useAllDaos = ({ name_contains = '', first = 4 }: queryRecord) => {
  return useQuery<ResponseDataType>(GET_ALL_DAOS_ACTION, {
    variables: {
      name_contains,
      first,
    },
  });
};
const useLayoutDaos = () => {
  return useLazyQuery<ResponseDataType>(GET_ALL_DAOS_ACTION);
};

export { useAllDaos, useLayoutDaos };
