import { getContract, contractSend, contractCall } from '@/utils/contract';
import Vote from '@/config/abi/VotePool.json';
import DAO from '@/config/abi/DAO.json';
import { rng } from 'somes/rng';
import store from '@/store';

export function getLifespan() {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  return contractCall(contract, 'lifespan');
}

export async function createVote({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  const lifespan = await contract.methods.lifespan().call();

  const data = web3.eth.abi.encodeFunctionCall(
    DAO.abi.find((e) => e.name == 'setDescription'),
    ['DAO Description vote 2'],
  );

  const params = [
    '0x' + rng(32).toString('hex'),
    [currentDAO.address],
    Math.max(currentDAO.defaultVoteTime || 0, lifespan), //604800,
    5001,
    0,
    0,
    name,
    description,
    currentMember.tokenId, // member id
    [data],
  ];

  return contractSend(contract, address, 'create2', params);
}

export function setVote({
  vote,
  proposal_id,
}: {
  vote: boolean;
  proposal_id: any;
}) {
  console.log('-----', vote, proposal_id);
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  const params = [
    proposal_id,
    currentMember.tokenId,
    vote ? currentMember.votes : -1,
    true,
  ];

  return contractSend(contract, address, 'vote', params);
}
