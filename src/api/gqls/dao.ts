import { JsonToGqlStr } from '@/utils';
import { gql } from '@apollo/client';

let gqlFragment = gql`
  fragment comparisonFields on DAO {
    host: id
    address: id
    time: blockTimestamp
    blockNumber
    extend
    name
    description
    image
    memberPool {
      count
      id
      members(orderBy: tokenId, orderDirection: asc) {
        id
        image
        name
        tokenId
      }
    }
    accounts {
      id
    }
    votePool {
      id
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

const GET_ALL_DAOS_ACTION = gql`
  query GetAllDaos($name_contains: String, $first: Int, $skip: Int) {
    daos(
      orderDirection: desc
      first: $first
      orderBy: blockNumber
      where: { name_contains: $name_contains }
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

const GET_CREATOR_DAOS_ACTION = (opt?: any) => {
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
    }
    ${gqlFragment}
  `;
};

export { GET_ALL_DAOS_ACTION, GET_CREATOR_DAOS_ACTION };
