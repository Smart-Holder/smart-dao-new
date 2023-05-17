type Daos = {
  id: string;
};
type statisticProps = {
  totalDAOs: string;
};

type membersType = {
  id: string;
  name: string;
  image: string;
  tokenId: string;
};

type votePoolProps = {
  id: string;
};
export type assetPoolProps = {
  id: String;
  type: 'Frist' | 'Second';
};

type memberPoolType = {
  count: string;
  id: string;
  members: membersType[];
};
export interface daosType extends Daos {
  blockNumber: string;
  memberPool: memberPoolType;
  accounts: Daos[];
  isMember?: boolean;
  name: string;
  description: string;
  extend: string;
  image: string;
  votePool: votePoolProps;
  isLike?: boolean;
  assetPool?: assetPoolProps;
  host: string;
  root: string;
}

type ResponseDataType = {
  daos: daosType[];
  statistic: statisticProps;
};
type queryRecord = {
  name_contains?: String;
  first?: number;
};

export type { ResponseDataType, queryRecord };
