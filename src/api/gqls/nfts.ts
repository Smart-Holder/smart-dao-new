import { gql } from '@apollo/client';
import { daosNftsGqlProps } from '../typings/nfts';

const JsonToGqlStr = (options: any) => {
  let optionsStr = ``;
  for (let key of Object.keys(options)) {
    if (key && (options[key] != undefined || options[key] != null)) {
      if (typeof options[key] === 'boolean') {
        optionsStr += `${key}:${options[key]},`;
      } else {
        optionsStr += `${key}:"${options[key]}",`;
      }
    }
  }

  return optionsStr;
};

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
