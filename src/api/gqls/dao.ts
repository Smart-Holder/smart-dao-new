import { gql } from '@apollo/client';

const GET_ALL_DAOS_ACTION = gql`
  query GetAllDaos($name_contains: String, $first: Int, $skip: Int) {
    daos(
      orderDirection: desc
      first: $first
      orderBy: blockNumber
      where: { name_contains: $name_contains }
      skip: $skip
    ) {
      host: id
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
      }
    }
    statistic(id: "0x0000000000000000000000000000000000000000") {
      totalDAOs
    }
  }
`;

export { GET_ALL_DAOS_ACTION };
