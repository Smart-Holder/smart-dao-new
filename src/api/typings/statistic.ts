import { type } from 'os';

type QueryStatistic = {
  first: number;
  host?: string;
  owner?: string;
};

type QueryStatisticResult = {
  id: string;
  assetOrderAmount: string;
  assetOrderTotal: string;
  assetTotal: string;
  incomeAmount: string;
  incomeTotal: string;
};
type ResponseStatisticType = {
  members: Array<QueryStatisticResult>;
};

export type { QueryStatistic, ResponseStatisticType };
