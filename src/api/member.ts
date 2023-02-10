import { getContract, contractCall, contractSend } from '@/utils/contract';
import Member from '@/config/abi/Member.json';
import DAO from '@/config/abi/DAO.json';
import { rng } from 'somes/rng';
import { request } from '@/api';
import sdk from 'hcstore/sdk';
import { hexRandomNumber } from '@/utils';
import store from '@/store';

// 加入 DAO
export function join({ contractAddress }: { contractAddress: string }) {
  const { web3, address } = store.getState().wallet;
  const { userInfo } = store.getState().user;

  const contract = getContract(web3, Member.abi, contractAddress);

  const params = [
    address,
    {
      // id: hexRandomNumber(),
      id: '0x' + rng(32).toString('hex'),
      name: userInfo.nickname,
      description: userInfo.description || 'description',
      image: userInfo.image,
      votes: 1,
    },
    [0xdc6b0b72, 0x678ea396],
  ];

  return contractSend(contract, address, 'requestJoin', params);
}

export function setMissionAndDesc({
  web3,
  address,
  host,
  mission,
  description,
}: any) {
  const contract = getContract(web3, DAO.abi, host);

  return contractSend(contract, address, 'setMissionAndDesc', [
    mission,
    description,
  ]).then(() => {
    // dispatch("getDAOList", {
    //   chain: getters.chain,
    //   owner: getters.owner,
    // });
    // request({
    //   method: "getDAO",
    //   name: "utils",
    //   params: { chain: getters.chain, address: getters.currentDAO.address },
    // }).then((res) => {
    //   commit("SET_CURRENT_DAO", res);
    // });
  });
}
