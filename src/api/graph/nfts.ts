import web3 from 'web3';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import { request } from '@/api';
import { GET_DAOS_NFTS_ACTION, GET_DAOS_NFT_LIST } from '@/api/gqls/nfts';
import {
  assetOrdersProps,
  ResponseDataType,
  AssetsResponseType,
  queryRecord,
  assetOrdersPropsType,
  listDataType,
  LayoutNftListProps,
} from '@/api/typings/nfts';

const useDaosNfts = ({
  host = '',
  first = 6,
  skip = 0,
  chainId,
  destroyed,
  name_contains_nocase,
  orderBy = 'blockNumber',
  orderDirection = 'desc',
}: queryRecord) => {
  const [items, setItems] = useState<AssetsResponseType[]>([]);
  const [fetchMore, { data, loading, error }] = useLazyQuery<ResponseDataType>(
    GET_DAOS_NFTS_ACTION({ name_contains_nocase, destroyed }),
    {
      variables: {
        host,
        first,
        skip,
        orderBy,
        orderDirection,
      },
      fetchPolicy: 'no-cache',
    },
  );

  const ids = useMemo(
    () =>
      (data?.assets || [])?.map((item) =>
        web3.utils.padLeft(
          web3.utils.numberToHex(web3.utils.toBN(item.tokenId)),
          64,
        ),
      ) || [],
    [data],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps

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
        let arr: any = [];
        for (let i = 0; i < ids.length; i++) {
          let item2 = data?.assets?.[i];
          const tokenID = web3.utils.padLeft(
            web3.utils.toHex(web3.utils.toBN(item2.tokenId)),
            64,
          );

          res.map((item: any) => {
            if (tokenID === item.tokenId) {
              let obj = {
                ...item,
                ...item2,
                tokenId: tokenID,
                id: item.id,
                assetId: item2.id,
                sellPrice: item2.sellPrice || item2.minimumPrice,
              };
              arr.push(obj);
            }
          });
        }
        setItems(arr);
      }
    });
  }, [chainId, first, host, ids, data?.assets]);

  useEffect(() => {
    if (ids.length > 0) {
      fetch();
    } else {
      setItems([]);
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
  asset,
  host,
  blockTimestamp_gte,
  blockTimestamp_lte,
  asset_contains_nocase,
}: LayoutNftListProps) => {
  const [fetchMore, { data, loading, error }] = useLazyQuery<assetOrdersProps>(
    GET_DAOS_NFT_LIST({
      asset,
      blockTimestamp_gte,
      blockTimestamp_lte,
      host,
      asset_contains_nocase,
    }),
    {
      variables: {
        first,
        skip,
        orderBy,
        orderDirection,
      },
      fetchPolicy: 'no-cache',
    },
  );

  const recombineData: listDataType[] = useMemo(
    () =>
      data?.assetOrders?.map((item, index) => {
        const { id, from, to, value, blockTimestamp, blockNumber } = item;
        return {
          id,
          value,
          blockNumber,
          fromAddres: from,
          toAddress: to,
          time: dayjs.unix(Number(blockTimestamp)).toString(),
        };
      }) || [],
    [data?.assetOrders],
  );

  return {
    data: recombineData,
    error,
    loading,
    fetchMore,
  };
};

export { useDaosNfts, useLayoutNftList };
