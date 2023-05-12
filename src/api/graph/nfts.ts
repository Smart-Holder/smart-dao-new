import web3 from 'web3';
import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { request } from '@/api';
import { GET_DAOS_NFTS_ACTION, GET_DAOS_NFT_LIST } from '@/api/gqls/nfts';
import {
  assetOrdersProps,
  ResponseDataType,
  AssetsResponseType,
  queryRecord,
} from '@/api/typings/nfts';

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
      data?.assets?.map((item) =>
        web3.utils.padLeft(
          web3.utils.numberToHex(web3.utils.toBN(item.tokenId)),
          64,
        ),
      ) || [],
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
        tokenIds: [...ids],
      },
    }).then((res) => {
      if (data?.assets) {
        for (let i = 0; i < ids.length; i++) {
          const item = res[i];
          const item2 = data?.assets?.[i];
          const tokenID = web3.utils.padLeft(
            web3.utils.toHex(web3.utils.toBN(item2.tokenId)),
            64,
          );
          setItems(() =>
            res.map((i: any) => {
              let obj = {};
              if (tokenID === i.tokenId) {
                obj = {
                  ...item,
                  ...item2,
                  tokenId: tokenID,
                  id: i.id,
                  sellPrice: item.sellPrice || item.minimumPrice,
                };
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

const useLayoutNftList = ({
  first = 6,
  skip = 0,
  orderBy = 'blockNumber',
  orderDirection = 'desc',
  asset = '',
}) => {
  const { data, fetchMore, loading, error } = useQuery<assetOrdersProps>(
    GET_DAOS_NFT_LIST,
    {
      variables: {
        first,
        skip,
        asset,
        orderBy,
        orderDirection,
      },
    },
  );

  return {
    data,
    error,
    loading,
    fetchMore,
  };
};

export { useDaosNfts, useLayoutNftList };
