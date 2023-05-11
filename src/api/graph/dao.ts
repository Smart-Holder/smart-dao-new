import { gql, useQuery, useLazyQuery } from '@apollo/client';

// interface QueryDaosType {
//   fn: string;
//   uri: string;
//   uriParams: {};
// }

// const GET_ATIONS = ({ fn, uri, uriParams }: any) => {
//   console.log(uriParams, 'uriParams');
//   //   console.log(fnName);
//   return gql`
//     query ${fn}( $orderBy:String!, $orderDirection:String!, $first:Number! ) {
//       ${uri}( ${
//     uriParams.orderBy ? 'orderBy:${uriParams.orderBy}' : ''
//   }:, orderDirection:$orderDirection, first:$first ) {
//         id
//         ${uriParams.extend ? 'extend' : ''}
//       }
//     }
//   `;
// };

// const useRequestGraphQuery = ({ fn, uri, uriParams }: any) => {
//   const client = useQuery(GET_ATIONS({ fn, uri }), {
//     variables: uriParams,
//   });
//   return client;
// };

type Daos = {
  id: string;
};
type statisticProps = {
  totalDAOs: string;
};

type membersType = {
  id: string;
  name: string;
  image: string;
  tokenId: string;
};

type votePoolProps = {
  id: string;
};
export type assetPoolProps = {
  id: String;
  type: 'Frist' | 'Second';
};

type memberPoolType = {
  count: string;
  id: string;
  members: membersType[];
};
export interface daosType extends Daos {
  blockNumber: string;
  memberPool: memberPoolType;
  accounts: Daos[];
  isMember?: boolean;
  name: string;
  description: string;
  extend: string;
  image: string;
  votePool: votePoolProps;
  isLike?: boolean;
  assetPool?: assetPoolProps;
  host: string;
}

type ResponseDataType = {
  daos: daosType[];
  statistic: statisticProps;
};
type queryRecord = {
  name_contains?: String;
  first?: number;
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

interface Options {
  first?: number;
  skip?: number;
  orderDirection?: 'desc' | 'asc';
  orderBy?: string;
  where?: Dict;
  subs?: Dict<Options>;
}

export function stringify(opts?: Options, defaults?: Options) {
  let opts_ = { ...defaults, opts };
  let str = ``;
  for (let [k, v] of Object.entries(opts_)) {
    if (v !== null && v !== undefined) {
      if ('where' == k || typeof v == 'object') {
        str += `,${k}: { ${stringify(v as any)} }`;
      } else {
        str += `,${k}: ${v}`;
      }
    }
  }
  return str;
}

const GET_ALL_DAOS_ACTION_DEMO = (opts: Options) => gql`
  query GetAllDaos {
    daos(${stringify(opts, {
      orderDirection: 'desc',
      first: 4,
      orderBy: 'blockNumber',
    })}) {
      id
      blockNumber
      extend
      name
      description
      image
      memberPool {
        count
        id
        members(${stringify(opts.subs?.members, {
          orderBy: 'tokenId',
          orderDirection: 'asc',
        })}) {
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
    }
    statistic(id: "0x0000000000000000000000000000000000000000") {
      totalDAOs
    }
  }
`;

export const useAllDaos_demo = ({
  first,
  skip,
  image,
  id,
}: {
  first?: number;
  skip?: number;
  image?: string;
  id?: number;
}) => {
  return useQuery<ResponseDataType>(
    GET_ALL_DAOS_ACTION_DEMO({ first, skip, where: { image, id } }),
  );
};

const useAllDaos = ({ name_contains = '', first = 4 }: queryRecord) => {
  return useQuery<ResponseDataType>(GET_ALL_DAOS_ACTION, {
    variables: {
      name_contains,
      first,
    },
  });
};
const useLayoutDaos = () => {
  return useLazyQuery<ResponseDataType>(GET_ALL_DAOS_ACTION);
};

export { useAllDaos, useLayoutDaos };
