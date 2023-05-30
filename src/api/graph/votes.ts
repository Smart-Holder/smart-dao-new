import { useQuery, useLazyQuery } from '@apollo/client';
import { VOTE_QUERY } from '@/api/gqls/votes';
import { voteQueryType, voteQueryResponse } from '@/api/typings/votes';
import { useMemo } from 'react';
import dayjs from 'dayjs';

const useVoteQuery = ({
  first = 6,
  orderBy = 'number',
  orderDirection = 'desc',
  skip = 0,
  host = '',
  name_contains_nocase,
  target_not,
  status,
}: voteQueryType) => {
  const [fetchMore, { data, loading, error }] = useLazyQuery<voteQueryResponse>(
    VOTE_QUERY({
      name_contains_nocase,
      status,
      target_not,
    }),
    {
      variables: {
        first,
        skip,
        orderBy,
        orderDirection,
        host,
      },
      fetchPolicy: 'no-cache',
    },
  );

  const dataSource = useMemo(() => {
    return {
      ...data,
      proposals: data?.proposals.map((item) => {
        let index_ = item.proposal_id.indexOf('-') + 1;
        return {
          ...item,
          time: Number(item.time) * 1000,
          proposal_id:
            index_ !== 0
              ? item.proposal_id.slice(index_, item.proposal_id.length)
              : item.proposal_id,
        };
      }),
    };
  }, [data]);

  return {
    data: dataSource,
    loading,
    error,
    fetchMore,
  };
};

export { useVoteQuery };
