import { getContract, contractSend, contractCall } from '@/utils/contract';
import Member from '@/config/abi/Member.json';
import DAO from '@/config/abi/DAO.json';
import { rng } from 'somes/rng';
import store from '@/store';
import { createVote } from './vote';
import { getMessage } from '../utils/language';

import Modal from '@/components/modal';
import { message } from 'antd';
import { proposalType } from '@/config/enum';

export function getMemberId() {
  const { web3, address } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;

  console.log('currentDAO', currentDAO);

  const contract = getContract(web3, Member.abi, currentDAO.member);

  return contractCall(contract, 'executor').then((res) => {
    console.log('eeeee', res);
  });
}

// 首页加入一个 DAO
export async function join({
  votePool,
  member,
}: {
  votePool: string;
  member: string;
}) {
  const { web3, address } = store.getState().wallet;
  const { nickname, image, description } = store.getState().user.userInfo;

  const contract = getContract(web3, Member.abi, member);

  const params = [
    address,
    {
      id: '0x' + rng(32).toString('hex'),
      name: nickname,
      description,
      image,
      votes: 1,
    },
    [0xdc6b0b72, 0x678ea396],
  ];

  try {
    await contract.methods.create(...params).call({ from: votePool }); //try call
  } catch (error) {
    console.error(error);
    throw error;
  }

  return contractSend(contract, address, 'requestJoin', params);
}

export async function isPermission(
  action: number,
  owner?: string,
  module?: string,
) {
  const { web3, address } = store.getState().wallet;
  const contract = getContract(
    web3,
    Member.abi,
    module || store.getState().dao.currentDAO.member,
  );

  owner = (owner || address).toLowerCase();

  let _operator = (await contract.methods.operator().call()) as string;
  if (owner != _operator.toLowerCase()) {
    let host = await contract.methods.host().call();
    let dao = getContract(web3, DAO.abi, host);
    let operator = (await dao.methods.operator().call()) as string;
    if (owner != operator.toLowerCase()) {
      let root = await dao.methods.root().call();
      if (owner != root.toLowerCase()) {
        if (
          !action ||
          !(await contract.methods.isPermission(owner, action).call())
        ) {
          return false;
        }
      }
    }
  }

  return true;
}

export function isCanAddNFTP(owner?: string) {
  return isPermission(0x22a25870, owner);
}

// 加入 DAO
export async function addNFTP(params: any) {
  const { web3, address: owner } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;

  const contract = getContract(web3, Member.abi, currentDAO.member);

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
  const { web3, address } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;

  const contract = getContract(web3, Member.abi, currentDAO.member);

  return contractSend(contract, address, 'setExecutor', [id]);
}

// 转让成员
export function transfer({ to }: { to: string }) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Member.abi, currentDAO.member);

  return contractSend(contract, address, 'safeTransferFrom', [
    address,
    to,
    currentMember.tokenId,
  ]);
}

export async function setPermissions(
  tokenId: string,
  addActions: number[],
  removeActions: number[],
  permissions: number[],
  PermissionMap: any,
  owner?: string,
) {
  const { lang } = store.getState().common;
  const { web3, address } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;
  const contract = getContract(web3, Member.abi, currentDAO.member);
  if (await isPermission(0, address)) {
    // match OnlyDAO
    await contractSend(contract, address, 'setPermissions', [
      tokenId,
      addActions,
      removeActions,
    ]);
    message.success('Success');
  } else {
    const labels = permissions.map((v: number) => PermissionMap[v]);
    await createVote({
      name: getMessage('proposal.member.rights'),
      description: JSON.stringify({
        type: 'member',
        proposalType: proposalType.Member_Rights,
        values: { address: owner, permissions },
      }),
      extra: [
        {
          abi: 'member',
          target: currentDAO.member,
          method: 'setPermissions',
          params: [tokenId, addActions, removeActions],
        },
      ],
    });

    Modal.success({ title: getMessage('proposal.create.message') });
  }
}

export async function addVotesOfBatch(votesParams: any, extraData: any) {
  console.log('votesParams', votesParams);
  const { currentDAO } = store.getState().dao;

  await createVote({
    name: getMessage('proposal.member.copies'),
    description: JSON.stringify({
      type: 'member',
      proposalType: proposalType.Member_Votes,
      values: { data: extraData },
    }),
    extra: [
      {
        abi: 'member',
        target: currentDAO.member,
        method: 'addVotesOfBatch',
        params: votesParams,
      },
    ],
  });

  Modal.success({ title: getMessage('proposal.create.message') });
}
