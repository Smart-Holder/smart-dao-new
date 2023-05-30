import { JsonToGqlStr } from '@/utils';
import { gql } from '@apollo/client';

let gqlFragment = gql`
  fragment comparisonFields on DAO {
    asset
    executor
    host: id
    address: id
    time: blockTimestamp
    blockNumber
    extend
    name
    description
    mission
    image
    memberPool {
      count
      id
      members(orderBy: tokenId, orderDirection: asc) {
        id
        image
        name
        tokenId
        votes
      }
    }
    accounts {
      id
    }
    votePool {
      id
      lifespan
    }
    assetPool {
      type
      id
      tax
    }
    ledgerPool {
      id
    }
  }
`;

// 多个DAO查询
const GET_DAOS_ACTION = (opt?: any) => {
  let optionsStr = JsonToGqlStr(opt);
  return gql`
    query GetDaos($first: Int, $skip: Int) {
      daos(
        orderDirection: desc
        first: $first
        orderBy: blockNumber
        where: { ${optionsStr} }
        skip: $skip
      ) {
        ...comparisonFields
      }
      statistic(id: "0x0000000000000000000000000000000000000000") {
        totalDAOs
      }
    }
    ${gqlFragment}
  `;
};

// 查询DAO详情
const GET_DAO_ACTION = () => {
  return gql`
    query GetDao($host: String) {
      dao(id: $host) {
        ...comparisonFields
      }
    }
    ${gqlFragment}
  `;
};

export { GET_DAOS_ACTION, GET_DAO_ACTION };
