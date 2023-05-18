type assetPoolProps = {
  id: string;
  total: string;
  type: 'Frist' | 'Second';
  orderTotal: string;
  amountTotal: string;
  orderAmountTotal: string;
  minimumPriceTotal: string;
};
type ledgerPoolsProps = {
  assetIncomeTotal: string;
};

type ResponseDataType = {
  votePool: {
    proposalTotal: string;
    votedTotal: string;
    proposalClosedTotal: string;
    proposalAgreedTotal: string;
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
