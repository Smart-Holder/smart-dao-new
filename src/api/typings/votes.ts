type gqlProps = {
  status?: -1 | 1 | 2 | 3 | 4;
  name_contains_nocase?: string;
  target_not: null | undefined | [];
};
type voteQueryType = gqlProps & {
  first: number;
  skip: number;
  orderBy?: string;
  orderDirection?: 'desc' | 'asc';
  host: string;
};

type Proposal = {
  name: string;
  description: string;

  isClose: boolean;
  isAgree: boolean;
  isExecuted: boolean;
  origin: string;
  voteTotal: string;
  agreeTotal: string;
  modify: string;
  expiry: string;
  time: string;
  proposal_id: string;
};
type voteQueryResponse = {
  proposals: Proposal[];
};
type voteQueryGqlProps = gqlProps & {};

export type { voteQueryType, voteQueryResponse, voteQueryGqlProps };
