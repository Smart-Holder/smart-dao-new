type assetPoolProps = {
  id: string;
  total: string;
  type: 'Frist' | 'Second';
  orderTotal: string;
  amountTotal: string;
  minimumPriceTotal: string;
};
type ledgerPoolsProps = {
  assetIncomeTotal: string;
};

type ResponseDataType = {
  votePool: {
    count: string;
  };
  first: assetPoolProps;
  second: assetPoolProps;
  ledgerPools: ledgerPoolsProps[];
};
type queryRecord = {
  vote_id?: string;
  first?: string;
  second?: string;
  host?: string;
};

export type { ResponseDataType, queryRecord };
