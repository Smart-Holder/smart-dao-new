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
    }
  }
`;
export { GET_DAOS_ASSET_STATISTIC_ACTION };
