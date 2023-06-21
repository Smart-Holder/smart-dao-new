import { useQuery, useLazyQuery } from '@apollo/client';
import { MEMBERS_QUERY } from '@/api/gqls/member';
import { QueryMembersType, QueryMembersResponse } from '@/api/typings/member';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { tokenIdFormat } from '@/utils';
import Web3 from 'web3';

const useMember = ({
  first = 6,
  orderBy = 'id',
  orderDirection = 'desc',
  skip = 0,
  host = '',
}: QueryMembersType) => {
  const [fetchMore, { data, loading, error }] =
    useLazyQuery<QueryMembersResponse>(MEMBERS_QUERY(), {
      variables: {
        first,
        skip,
        orderBy,
        orderDirection,
        host,
      },
      fetchPolicy: 'no-cache',
    });

  const dataSource = useMemo(() => {
    if (data?.members) {
      return [...data?.members].map((item) => {
        return {
          ...item,
          tokenId: tokenIdFormat(item.tokenId),
          owner: item.owner?.id.toLocaleLowerCase(),
          permissions: item.permissions.map((item) =>
            Number(Web3.utils.toBN(item).toString()),
          ),
          count: item.memberPool?.count || 0,
        };
      });
    }
  }, [data]);

  return {
    data: dataSource,
    loading,
    error,
    fetchMore,
  };
};

export { useMember };
