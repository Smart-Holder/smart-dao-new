import { gql, useQuery, useLazyQuery } from '@apollo/client';

type assetPoolProps = {
  id: string;
  total: string;
  type: 'Frist' | 'Second';
  orderTotal: string;
  amountTotal: string;
  minimumPriceTotal: string;
};

type ResponseDataType = {
  votePool: {
    count: string;
  };
  first: assetPoolProps;
  second: assetPoolProps;
};
type queryRecord = {
  vote_id?: string;
  first?: string;
  second?: string;
};

const GET_DAOS_ASSET_ACTION = gql`
  query GetAssets($vote_id: String, $first: String, $second: String) {
    votePool(id: $vote_id) {
      count
    }
    first: assetPool(id: $first) {
      ...comparisonFields
    }
    second: assetPool(id: $second) {
      ...comparisonFields
    }
  }

  fragment comparisonFields on AssetPool {
    type
    total
    orderTotal
    amountTotal
    minimumPriceTotal
  }
`;

const useDaosAsset = ({
  vote_id = '',
  first = '',
  second = '',
}: queryRecord) => {
  return useQuery<ResponseDataType>(GET_DAOS_ASSET_ACTION, {
    variables: {
      vote_id,
      first,
      second,
    },
  });
};

// const useLayoutDaos = () => {
//   return useLazyQuery<ResponseDataType>(GET_DAOS_ASSET_ACTION);
// };

export { useDaosAsset };
