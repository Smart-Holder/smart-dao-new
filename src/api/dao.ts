import { getContract, contractSend } from '@/utils/contract';
import DAO from '@/config/abi/DAO.json';

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
