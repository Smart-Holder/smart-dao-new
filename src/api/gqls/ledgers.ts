import { gql } from '@apollo/client';
import { ledgerQueryGqlProps } from '../typings/ledger';
import { JsonToGqlStr } from '@/utils';

const LEDGER_QUERY = (opt: ledgerQueryGqlProps) => {
  let optionsStr = JsonToGqlStr(opt);
  return gql`
    query QueryVote(
        $first: Int = 10
        $orderBy: String = balance
        $orderDirection: String = desc
        $skip: Int = 0
        $host: String = ""
    ) {
      ledgers(
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            skip: $skip
            where: { host: $host, ${optionsStr} }
        ) {
          id
          name
          state
          target
          balance
          type
          description
          address
          blockNumber
          blockTimestamp
        }
    }`;
};

export { LEDGER_QUERY };
