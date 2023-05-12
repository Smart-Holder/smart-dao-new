import { gql } from '@apollo/client';

const GET_DAOS_ASSET_ACTION = gql`
  query GetAssets($vote_id: String, $first: String, $second: String) {
    votePool(id: $vote_id) {
      count
    }
    first: assetPool(id: $first) {
      ...comparisonFields
    }
    second: assetPool(id: $second) {
      ...comparisonFields
    }
  }

  fragment comparisonFields on AssetPool {
    type
    total
    orderTotal
    amountTotal
    minimumPriceTotal
  }
`;
export { GET_DAOS_ASSET_ACTION };
