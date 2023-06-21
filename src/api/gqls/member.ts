import { gql } from '@apollo/client';
import { GqlProps } from '@/api/typings/member';
import { JsonToGqlStr } from '@/utils';

const MEMBERS_QUERY = (opts?: GqlProps) => {
  let optionsStr = JsonToGqlStr(opts);
  return gql`
    query QueryMembers(
        $first: Int = 6
        $orderBy: String = id
        $orderDirection: String = desc
        $skip: Int = 0
        $host: String = ""
    ) {
        members(
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            skip: $skip
            where: { host: $host, ${optionsStr} }
        ) {
          id
          votes
          tokenId
          token
          name
          address
          image
          description
          time:blockTimestamp
          permissions
          memberPool {
            count
          }
          owner {
            id
          }
        }
    }`;
};

export { MEMBERS_QUERY };
