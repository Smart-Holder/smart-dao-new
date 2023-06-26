import { gql } from '@apollo/client';

const GET_DAOS_ASSET_STATISTIC_ACTION = gql`
  query QueryAssetsStatistic($first: Int!, $owner: String, $host: String) {
    members(first: $first, where: { host: $host, owner: $owner }) {
      id
      assetOrderAmount
      assetOrderTotal
      assetTotal
      incomeAmount
      incomeTotal
      incomeERC20Amount {
        amount
        erc20 {
          id
          symbol
          name
        }
      }
    }
  }
`;

const GET_DAO_LEDGER_BALANCES_ACTION = gql`
  query DAOLedgerBalances($host: String) {
    ledgerBalances(where: { host: $host }) {
      income
      erc20 {
        id
        symbol
        name
      }
    }
    ledgerPools(where: { host: $host }) {
      assetIncomeAmount
      expenditureAmount
      assetIncomeERC20Amount {
        amount
      }
      expenditureERC20Amount {
        amount
      }
    }
  }
`;
export { GET_DAOS_ASSET_STATISTIC_ACTION, GET_DAO_LEDGER_BALANCES_ACTION };
