import { useQuery } from '@apollo/client';
import { GET_DAOS_ASSET_ACTION } from '@/api/gqls/asset';
import { ResponseDataType, queryRecord } from '@/api/typings/asset';

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

export { useDaosAsset };
