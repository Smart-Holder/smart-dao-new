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

export { GET_DAOS_ACTION };
