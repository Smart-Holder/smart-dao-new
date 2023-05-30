import { gql } from '@apollo/client';
import { voteQueryGqlProps } from '@/api/typings/votes';

const VOTE_QUERY = ({
  name_contains_nocase,
  status,
  target_not,
}: voteQueryGqlProps) => {
  let optionsStr = ``;
  let options: any = {};

  // 若status有值则为有筛选条件 全部不传递status
  switch (status) {
    // 投票中
    case 1:
      options.isClose = false;
      break;
    // 已通过
    case 2:
      options.isAgree = true;
      break;
    // 未通过
    case 3:
      options.isAgree = false;
      break;
    // 已执行
    case 4:
      options.isExecuted = true;
      break;
    default:
      break;
  }

  if (status && status !== -1) {
    // 非投票中状态 isClose = true
    options.isClose = true;
  }

  if (name_contains_nocase) {
    options.name_contains_nocase = name_contains_nocase;
  }

  for (let key of Object.keys(options)) {
    if (key) {
      if (typeof options[key] === 'boolean') {
        optionsStr += `${key}:${options[key]},`;
      } else {
        optionsStr += `${key}:"${options[key]}",`;
      }
    }
  }
  if (target_not) {
    optionsStr += `target_not:[],`;
  }

  return gql`
    query QueryVote(
        $first: Int = 6
        $orderBy: String = number
        $orderDirection: String = desc
        $skip: Int = 0
        $host: String = ""
    ) {
        proposals(
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            skip: $skip
            where: { host: $host, ${optionsStr} }
        ) {
            id:number
            proposal_id:id
            name
            expiry
            target
            isClose
            isAgree
            isExecuted
            origin:originAddress
            voteTotal
            agreeTotal
            modify:modifyTime
            time:blockTimestamp
        }
    }`;
};

export { VOTE_QUERY };
