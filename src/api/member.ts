import { getContract, contractSend, contractCall } from '@/utils/contract';
import Member from '@/config/abi/Member.json';
import { rng } from 'somes/rng';
import store from '@/store';

export function getMemberId() {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  console.log('currentDAO', currentDAO);

  const contract = getContract(web3, Member.abi, currentDAO.member);

  return contractCall(contract, 'executor').then((res) => {
    console.log('eeeee', res);
  });
}

// 首页加入一个 DAO
export async function join({ votePool, member }: { votePool: string, member: string }) {
  const { web3, address } = store.getState().wallet;

  const contract = getContract(web3, Member.abi, member);

  const params = [
    address,
    {
      id: '0x' + rng(32).toString('hex'),
      name: '',
      description: '',
      image: '',
      votes: 1,
    },
    [0xdc6b0b72, 0x678ea396],
  ];

  await contract.methods.create(...params).call({ from: votePool }); //try call

  return await contractSend(contract, address, 'requestJoin', params);
}

// 加入 DAO
export function addNFTP({
  address,
  votes,
  permissions,
  name,
  description,
  image,
}: {
  address: string;
  votes: number;
  permissions: number[];
  name?: string;
  description?: string;
  image?: string;
}) {
  const { web3, address: owner } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;

  const contract = getContract(web3, Member.abi, currentDAO.member);

  const params = [
    address,
    {
      id: '0x' + rng(32).toString('hex'),
      name: name || '',
      description: description || '',
      image: image || '',
      votes,
    },
    permissions,
  ];

  return contractSend(contract, owner, 'create', params);
}

export function setMemberInfo({
  name,
  image,
}: {
  name: string;
  image: string;
}) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Member.abi, currentDAO.member);

  return contractSend(contract, address, 'setMemberInfo', [
    currentMember.tokenId,
    name,
    '',
    image,
  ]);
}

export function setExecutor({ id }: { id: string }) {
  console.log('id', id);
  const { web3, address } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;

  const contract = getContract(web3, Member.abi, currentDAO.member);

  return contractSend(contract, address, 'setExecutor', [id]);
}
