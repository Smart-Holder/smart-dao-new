import { gql, useQuery, useLazyQuery } from '@apollo/client';

type assetPoolProps = {
  id: String;
  count: String;
  type: 'Frist' | 'Second';
  amountTotal: String;
  minimumPriceTotal: String;
};

type ResponseDataType = {
  votePool: {
    count: String;
  };
  first: assetPoolProps;
  second: assetPoolProps;
};
type queryRecord = {
  vote_id?: String;
  first?: String;
  second?: String;
};

const GET_ALL_DAOS_ACTION = gql`
  query GetVotes($vote_id: String, $first: String, $second: String) {
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
    count
    amountTotal
    minimumPriceTotal
  }
`;

const useDaosAsset = ({
  vote_id = '',
  first = '',
  second = '',
}: queryRecord) => {
  return useQuery<ResponseDataType>(GET_ALL_DAOS_ACTION, {
    variables: {
      vote_id,
      first,
      second,
    },
  });
};

const useLayoutDaos = () => {
  return useLazyQuery<ResponseDataType>(GET_ALL_DAOS_ACTION);
};

export { useDaosAsset, useLayoutDaos };
