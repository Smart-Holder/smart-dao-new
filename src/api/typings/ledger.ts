type gqlProps = {
  blockTimestamp_gte?: string;
  blockTimestamp_lte?: string;
  type?: string;
  ref?: string;
};

type ledgerQueryType = gqlProps & {
  first: number;
  skip: number;
  orderBy?: string;
  orderDirection?: 'desc' | 'asc';
  host: string;
};

type ledger = {
  name: string;
  description: string;

  type: string;
  balance: string;
  state: string;
  target: string;
  blockNumber: string;
  blockTimestamp: string;
  id: string;
};
type ledgerQueryResponse = {
  ledgers: ledger[];
};
type ledgerQueryGqlProps = gqlProps & {};

export type {
  ledgerQueryType,
  ledgerQueryResponse,
  ledgerQueryGqlProps,
  gqlProps,
  ledger,
};
