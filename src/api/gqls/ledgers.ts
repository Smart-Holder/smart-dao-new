import { gql } from '@apollo/client';
import { ledgerQueryGqlProps } from '../typings/ledger';

const JsonToGqlStr = (options: any) => {
  let optionsStr = ``;
  for (let key of Object.keys(options)) {
    if (key && (options[key] != undefined || options[key] != null)) {
      if (typeof options[key] === 'boolean') {
        optionsStr += `${key}:${options[key]},`;
      } else {
        optionsStr += `${key}:"${options[key]}",`;
      }
    }
  }

  return optionsStr;
};

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
