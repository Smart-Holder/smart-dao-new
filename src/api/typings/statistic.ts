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
  incomeERC20Amount: ERC20Amount[];
};
type ResponseStatisticType = {
  members: Array<QueryStatisticResult>;
};

type erc20 = {
  id: string;
  symbol: string;
  name: string;
};
type ledgerBalancesData = {
  income: string;
  erc20?: erc20;
};
type ERC20Amount = {
  amount?: string;
  erc20?: erc20;
};
type ledgerPoolsData = {
  id: string;
  assetIncomeAmount: string;
  expenditureAmount: string;
  assetIncomeERC20Amount: ERC20Amount[];
  expenditureERC20Amount: ERC20Amount[];
};
type ResponseLedgerDataType = {
  ledgerBalances: ledgerBalancesData[];
  ledgerPools: ledgerPoolsData[];
};

export type { QueryStatistic, ResponseStatisticType, ResponseLedgerDataType };
