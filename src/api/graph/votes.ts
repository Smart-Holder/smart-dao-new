import { useQuery, useLazyQuery } from '@apollo/client';
import { VOTE_QUERY } from '@/api/gqls/votes';
import { voteQueryType, voteQueryResponse } from '@/api/typings/votes';

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

  return {
    data,
    loading,
    error,
    fetchMore,
  };
};

export { useVoteQuery };
