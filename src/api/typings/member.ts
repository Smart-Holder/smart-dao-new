import { type } from 'os';

type GqlProps = {
  blockTimestamp_gte?: string;
  blockTimestamp_lte?: string;
};
type QueryMembersType = GqlProps & {
  first: number;
  skip: number;
  orderBy?: string;
  orderDirection?: 'desc' | 'asc';
  host: string;
};

type MemberResponseData = {
  id: string;
  votes: string;
  tokenId: string;
  token: string;
  name: string;
  address: string;
  image: string;
  description: string;
  blockTimestamp: string;
  permissions: string[];
  owner: {
    id: string;
  };
  memberPool: {
    count: number;
  };
};

type QueryMembersResponse = {
  members: MemberResponseData[];
};

export type {
  QueryMembersType,
  QueryMembersResponse,
  GqlProps,
  MemberResponseData,
};
