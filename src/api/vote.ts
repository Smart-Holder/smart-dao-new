import { getContract, contractSend } from '@/utils/contract';
import Vote from '@/config/abi/VotePool.json';
import DAO from '@/config/abi/DAO.json';
import { rng } from 'somes/rng';
import store from '@/store';

export function createVote({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Vote.abi, currentDAO.root);

  const data = web3.eth.abi.encodeFunctionCall(
    DAO.abi.find((e) => e.name == 'setDescription'),
    ['DAO Description vote 2'],
  );

  const params = [
    '0x' + rng(32).toString('hex'),
    [currentDAO.address],
    0, //604800,
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
