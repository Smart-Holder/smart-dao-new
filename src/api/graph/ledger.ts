import { useLazyQuery } from '@apollo/client';
import { ledgerQueryResponse, ledgerQueryType } from '../typings/ledger';
import { LEDGER_QUERY } from '../gqls/ledgers';

const useLedgerQuery = ({
  first = 6,
  orderBy = 'balance',
  orderDirection = 'desc',
  skip = 0,
  host = '',
  blockTimestamp_gte,
  blockTimestamp_lte,
  type,
}: ledgerQueryType) => {
  const [fetchMore, { data, loading, error }] =
    useLazyQuery<ledgerQueryResponse>(
      LEDGER_QUERY({
        blockTimestamp_gte,
        blockTimestamp_lte,
        type,
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

export { useLedgerQuery };
