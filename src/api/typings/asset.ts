type assetPoolProps = {
  id: string;
  total: string;
  type: 'Frist' | 'Second';
  orderTotal: string;
  amountTotal: string;
  minimumPriceTotal: string;
};

type ResponseDataType = {
  votePool: {
    count: string;
  };
  first: assetPoolProps;
  second: assetPoolProps;
};
type queryRecord = {
  vote_id?: string;
  first?: string;
  second?: string;
};

export type { ResponseDataType, queryRecord };
