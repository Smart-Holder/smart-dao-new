type AssetsResponseType = {
  id: string;
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
};
type assetOrdersProps = {
  assetOrders?: assetOrdersPropsType[];
};

export type {
  assetOrdersProps,
  ResponseDataType,
  queryRecord,
  AssetsResponseType,
};
