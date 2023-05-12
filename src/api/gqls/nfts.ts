import { gql } from '@apollo/client';

const GET_DAOS_NFTS_ACTION = gql`
  query GetNfts(
    $host: String!
    $first: Int! = 6
    $state: String = Enable
    $skip: Int! = 0
    $orderBy: String = blockNumber
    $orderDirection: String = desc
  ) {
    assets(
      where: { host: $host, state: $state }
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      skip: $skip
    ) {
      id
      tokenId
      uri
      sellPrice
      minimumPrice
      ownerRecord: owner {
        id
      }
    }
  }
`;

const GET_DAOS_NFT_LIST = gql`
  query GetNftList(
    $first: Int! = 6
    $orderBy: String = blockNumber
    $orderDirection: String = desc
    $skip: Int = 0
    $asset: String! = ""
  ) {
    assetOrders(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      skip: $skip
      where: { asset: $asset }
    ) {
      id
      txHash
      value
      from
      to
      blockTimestamp
    }
  }
`;

export { GET_DAOS_NFTS_ACTION, GET_DAOS_NFT_LIST };
