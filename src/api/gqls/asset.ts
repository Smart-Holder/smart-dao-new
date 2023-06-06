import { gql } from '@apollo/client';

const GET_DAOS_ASSET_ACTION = gql`
  query GetAssets(
    $vote_id: String
    $first: String
    $second: String
    $host: String
  ) {
    votePool(id: $vote_id) {
      proposalClosedTotal
      proposalTotal
      votedTotal
      proposalAgreedTotal
    }
    first: assetPool(id: $first) {
      ...comparisonFields
    }
    second: assetPool(id: $second) {
      ...comparisonFields
    }
    ledgerPools(where: { host: $host }) {
      assetIncomeAmount
    }
  }

  fragment comparisonFields on AssetPool {
    type
    total
    orderTotal
    amountTotal
    orderAmountTotal
    minimumPriceTotal
  }
`;
export { GET_DAOS_ASSET_ACTION };
