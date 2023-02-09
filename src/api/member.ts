import { getContract, contractCall, contractSend } from '@/utils/contract';
import { abi as MemberABI } from '@/config/abi/Member.json';
import DAO from '@/config/abi/DAO.json';
import { rng } from 'somes/rng';
import { request } from '@/api';
import sdk from 'hcstore/sdk';
import { hexRandomNumber } from '@/utils';

// 加入 DAO
export function join({ web3, address, currentDAO, user }: any) {
  const contract = getContract(web3, MemberABI, currentDAO.member);

  return contractSend(contract, address, 'requestJoin', [
    address,
    {
      // id: hexRandomNumber(),
      // id: currentDAO.id,
      id: '0x' + rng(32).toString('hex'),
      name: user.nickname,
      description: user.description,
      image: user.image,
      votes: 1,
    },
    [0xdc6b0b72, 0x678ea396],
  ])
    .then((res) => {
      console.log('join', res);
    })
    .catch((err) => {
      console.error(err);
    });
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
