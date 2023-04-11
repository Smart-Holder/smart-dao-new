import { getContract, contractSend, contractCall } from '@/utils/contract';
import Vote from '@/config/abi/VotePool.json';
import DAO from '@/config/abi/DAO.json';
import Member from '@/config/abi/Member.json';
import Ledger from '@/config/abi/Ledger.json';
import Asset from '@/config/abi/Asset.json';
import { rng } from 'somes/rng';
import store from '@/store';
import somes from 'somes';
import { message } from 'antd';

import { getContractMessage } from '@/utils/errorCode';

const abiList: any = {
  member: Member,
  dao: DAO,
  ledger: Ledger,
  asset: Asset,
};

export function getLifespan() {
  const { web3 } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  return contractCall(contract, 'lifespan');
}

// 创建提案
export async function createVote({
  name,
  description,
  extra = [],
}: {
  name: string;
  description: string;
  extra?: {
    abi: string;
    target: string;
    method: string;
    params: any[];
  }[];
}) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;
  const contract = getContract(web3, Vote.abi, currentDAO.root);
  const lifespan = await contract.methods.lifespan().call();
  const data = [] as string[];

  try {
    for (let { abi, target, method, params } of extra) {
      const C = abiList[abi];
      const contract = getContract(web3, C.abi, target);
      somes.assert(C, '#vote.createVote, no match abi');
      await contract.methods[method](...params).call({ from: currentDAO.root }); // try call
      data.push(
        web3.eth.abi.encodeFunctionCall(
          C.abi.find((e: any) => e.name == method),
          params,
        ),
      );
    }
  } catch (error) {
    getContractMessage(error);
    throw error;
  }

  const params = [
    '0x' + rng(32).toString('hex'),
    extra.map((e) => e.target),
    Math.max(currentDAO.defaultVoteTime || 0, lifespan), //604800,
    5001,
    0,
    0,
    name,
    description,
    currentMember.tokenId || 0,
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
  const { currentDAO } = store.getState().dao;
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
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  const params = [
    proposal_id,
    currentMember.tokenId,
    vote ? Number(currentMember.votes) : -1,
    true,
  ];

  console.log('vote params:', params);

  return contractSend(contract, address, 'vote', params);
}
