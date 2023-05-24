import { gql } from '@apollo/client';
import { daosNftsGqlProps, Daos_Nft_List_Props } from '../typings/nfts';
import { JsonToGqlStr } from '@/utils';

const GET_DAOS_NFTS_ACTION = (opt: daosNftsGqlProps) => {
  let optionsStr = JsonToGqlStr(opt);
  return gql`
    query GetNfts(
      $host: String!
      $first: Int! = 6
      $skip: Int! = 0
      $orderBy: String = blockNumber
      $orderDirection: String = desc
    ) {
      assets(
        where: { host: $host,  ${optionsStr} }
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
};

const GET_DAOS_NFT_LIST = (opt: Daos_Nft_List_Props) => {
  let optionsStr = JsonToGqlStr(opt);
  return gql`
    query GetNftList(
      $first: Int! = 6
      $orderBy: String = blockNumber
      $orderDirection: String = desc
      $skip: Int = 0
    ) {
      assetOrders(
        first: $first
        orderBy: $orderBy
        orderDirection: $orderDirection
        skip: $skip
        where: { ${optionsStr} }
      ) {
        id
        txHash
        value
        from
        to
        blockTimestamp
        blockNumber
      }
    }
  `;
};

export { GET_DAOS_NFTS_ACTION, GET_DAOS_NFT_LIST };
