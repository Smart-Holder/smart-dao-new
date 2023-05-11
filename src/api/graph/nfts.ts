import { gql, useQuery, useLazyQuery } from '@apollo/client';
import web3 from 'web3';
import { request } from '@/api';
import { useCallback, useEffect, useMemo, useState } from 'react';

type owner = {
  id: string;
};
export type AssetsResponseType = {
  uri: string;
  sellPrice: string;
  minimumPrice: string;
  tokenId: string;
  ownerRecord: owner;

  name?: string;
  owner?: string;
  image?: string;
  imageOrigin?: string;
  properties?: any[];
};
type ResponseDataType = {
  assets?: AssetsResponseType[];
};
type queryRecord = {
  host: string;
  first: number;
  skip: number;
  chainId: number;
};
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

// fragment comparisonFields on AssetPool {
//   type
//   total
//   orderTotal
//   amountTotal
//   minimumPriceTotal
// }

// const useDaosNfts = ({ host = '', first = 6, skip = 0 }: queryRecord) => {
//   return useQuery<ResponseDataType>(GET_DAOS_NFTS_ACTION, {
//     variables: {
//       host,
//       first,
//       skip,
//     },
//   });
// };

const useDaosNfts = ({
  host = '',
  first = 6,
  skip = 0,
  chainId,
}: queryRecord) => {
  const [items, setItems] = useState<AssetsResponseType[]>([]);
  const { data, fetchMore, loading, error } = useQuery<ResponseDataType>(
    GET_DAOS_NFTS_ACTION,
    {
      variables: {
        host,
        first,
        skip,
      },
    },
  );
  const ids = useMemo(
    () =>
      data?.assets
        ?.slice(0, 6)
        .map((item) => web3.utils.toHex(web3.utils.toBN(item.tokenId))) || [],
    [data?.assets],
  );
  const fetch = useCallback(async () => {
    await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        chain: chainId,
        host,
        state: 0,
        limit: [0, first],
        tokens: [...ids],
      },
    }).then((res) => {
      if (data?.assets) {
        for (let i = 0; i < ids.length; i++) {
          const item = res[i];
          const item2 = data?.assets?.[i];
          const tokenID = web3.utils.toHex(web3.utils.toBN(item.tokenId));
          setItems(() =>
            res.map((i: any) => {
              let obj = {};
              if (tokenID === i.tokenId) {
                obj = { ...item, ...item2, tokenId: tokenID };
              }
              return obj;
            }),
          );
        }
      }
    });
  }, [chainId, first, host, ids, data?.assets]);

  useEffect(() => {
    if (ids.length) {
      fetch();
    }
  }, [fetch, ids]);

  return {
    error,
    loading,
    fetchMore,
    items,
  };
};

const useLayoutNfts = () => {
  return useLazyQuery<ResponseDataType>(GET_DAOS_NFTS_ACTION);
};

export { useDaosNfts, useLayoutNfts };
