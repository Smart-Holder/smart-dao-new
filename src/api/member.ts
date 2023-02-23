import { getContract, contractSend, contractCall } from '@/utils/contract';
import Member from '@/config/abi/Member.json';
import DAO from '@/config/abi/DAO.json';
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
export async function join({ votePool, module }: { votePool: string, module: string }) {
  const { web3, address } = store.getState().wallet;

  const contract = getContract(web3, Member.abi, module);

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

export async function isPermission(action: number, owner?: string, module?: string) {
  const { web3, address } = store.getState().wallet;
  const contract = getContract(web3, Member.abi, module || store.getState().dao.currentDAO.member);

  owner = (owner || address).toLowerCase();

  let _operator = await contract.methods.operator().call() as string;
  if (owner != _operator.toLowerCase()) {
    let host = await contract.methods.host().call();
    let dao = getContract(web3, DAO.abi, host);
    let operator = await dao.methods.operator().call() as string;
    if (owner != operator.toLowerCase()) {
      let root = await dao.methods.root().call();
      if (owner != root.toLowerCase()) {
        if (!await contract.methods.isPermission(owner, action).call()) {
          return false;
        }
      }
    }
  }

  return true;
}

export function isCanAddNFTP(owner?: string, member?: string) {
  return isPermission(0x22a25870, owner, member);
}

// 加入 DAO
export async function addNFTP({
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

  await contractSend(contract, owner, 'create', params);

  return true;
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
