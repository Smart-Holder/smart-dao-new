import { gql } from '@apollo/client';

const JsonToGqlStr = (options: any) => {
  let optionsStr = ``;
  if (options) {
    for (let key of Object.keys(options)) {
      if (key && (options[key] != undefined || options[key] != null)) {
        if (typeof options[key] === 'boolean') {
          optionsStr += `${key}:${options[key]},`;
        } else if (typeof options[key] === 'string') {
          optionsStr += `${key}:"${options[key]}",`;
        } else if (typeof options[key] === 'object') {
          optionsStr += `${key}: { ${JsonToGqlStr(options[key])} }`;
        }
      }
    }
  }
  return optionsStr;
};

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
      }
      ledgerPool {
        id
      }
    }
    statistic(id: "0x0000000000000000000000000000000000000000") {
      totalDAOs
    }
  }
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
        }
        ledgerPool {
          id
        }
      }
    }
  `;
};

export { GET_ALL_DAOS_ACTION, GET_CREATOR_DAOS_ACTION };