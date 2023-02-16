import { getContract, contractSend, contractCall } from '@/utils/contract';
import Vote from '@/config/abi/VotePool.json';
import DAO from '@/config/abi/DAO.json';
import Member from '@/config/abi/Member.json';
import { rng } from 'somes/rng';
import store from '@/store';

const abiList: any = {
  member: Member,
  dao: DAO,
};

export function getLifespan() {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  return contractCall(contract, 'lifespan');
}

// 创建提案
export async function createVote({
  name,
  description,
  extra,
}: {
  name: string;
  description: string;
  extra?: any;
}) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  const lifespan = await contract.methods.lifespan().call();

  const data: any = []; // 提案通过后自动执行

  (extra || []).forEach((item: any) => {
    const abi = abiList[item?.abi] as any;

    if (abi) {
      data.push(
        web3.eth.abi.encodeFunctionCall(
          abi.abi.find((e: any) => e.name == item.method),
          item.params,
        ),
      );
    }
  });

  const params = [
    '0x' + rng(32).toString('hex'),
    data.length > 0 ? [currentDAO.address] : [],
    Math.max(currentDAO.defaultVoteTime || 0, lifespan), //604800,
    5001,
    0,
    0,
    name,
    description,
    currentMember?.tokenId, // member tokenId
    data,
  ];

  console.log('-----description------', JSON.parse(description));
  console.log('------extra-----', extra);
  console.log('-----params------', params);

  return contractSend(contract, address, 'create2', params);
}

// 首页加入DAO，创建提案
export async function createDAOVote({
  name,
  description,
  extra,
}: {
  name: string;
  description: string;
  extra?: any;
}) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;
  console.log('currentDAO', currentDAO);

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  const lifespan = await contract.methods.lifespan().call();

  const data: any = []; // 提案通过后自动执行

  (extra || []).forEach((item: any) => {
    const abi = abiList[item?.abi] as any;

    if (abi) {
      data.push(
        web3.eth.abi.encodeFunctionCall(
          abi.abi.find((e: any) => e.name == item.method),
          item.params,
        ),
      );
    }
  });

  const params = [
    '0x' + rng(32).toString('hex'),
    data.length > 0 ? [currentDAO.address] : [],
    Math.max(currentDAO.defaultVoteTime || 0, lifespan), //604800,
    5001,
    0,
    0,
    name,
    description,
    currentDAO.executor, // member tokenId
    data,
  ];

  console.log('-----description------', JSON.parse(description));
  console.log('------extra-----', extra);
  console.log('-----params------', params);

  return contractSend(contract, address, 'create2', params);
  // return contractSend(contract, currentDAO.createdBy, 'create2', params);
}

export function setVote({
  vote,
  proposal_id,
  type,
}: {
  vote: boolean;
  proposal_id: any;
  type: string | undefined;
}) {
  console.log('-----', vote, proposal_id, type);
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  const params = [
    proposal_id,
    currentMember.tokenId,
    vote ? currentMember.votes : -1,
    // type !== 'normal',
    // false,
    true,
  ];

  console.log('vote params:', params);

  return contractSend(contract, address, 'vote', params);
}
