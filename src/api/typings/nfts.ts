type AssetsResponseType = {
  id: string;
  uri: string;
  sellPrice: string;
  minimumPrice: string;
  tokenId: string;
  ownerRecord: owner;

  // graph 查询ID
  assetId?: string;

  name?: string;
  owner?: string;
  image?: string;
  imageOrigin?: string;
  properties?: any[];
};
type owner = {
  id: string;
};
type ResponseDataType = {
  assets?: AssetsResponseType[];
};
type queryRecord = {
  host: string;
  first: number;
  skip: number;
  chainId: number;
  name_contains_nocase?: string;
  orderBy?: string;
  orderDirection?: string;
  destroyed?: boolean;
};

type daosNftsGqlProps = {
  name_contains_nocase?: string;
  destroyed?: boolean;
  owner_?: {
    id: string;
  };
  author_?: {
    id?: string;
    id_not?: string;
  };
};

/**
 *资产列表
 */
type assetOrdersPropsType = {
  id: string;
  txHash: string;
  value: string;
  from: string;
  to: string;
  blockTimestamp: string;
  blockNumber: string;
  asset: {
    tokenId: string;
  };
};
type assetOrdersProps = {
  assetOrders?: assetOrdersPropsType[];
};
type listDataType = {
  id: string;
  value: string;
  time: string;
  fromAddres: string;
  toAddress: string;
  tokenId: string;
};

type Daos_Nft_List_Props = {
  asset?: string;
  host?: string;
  blockTimestamp_gte?: string;
  blockTimestamp_lte?: string;
  asset_contains_nocase?: string;
  from?: string;
  to?: string;
  asset_?: {
    owner?: string;
    owner_not?: string;
  };
};

type LayoutNftListProps = Daos_Nft_List_Props & {
  first: number;
  skip: number;
  orderBy?: string;
  orderDirection?: string;
  // asset?: string;
  // host?: string;
  // blockTimestamp_gte?: string;
  // blockTimestamp_lte?: string;
  // asset_contains_nocase?: string;
};

export type {
  assetOrdersProps,
  ResponseDataType,
  queryRecord,
  AssetsResponseType,
  assetOrdersPropsType,
  listDataType,
  daosNftsGqlProps,
  LayoutNftListProps,
  Daos_Nft_List_Props,
};
