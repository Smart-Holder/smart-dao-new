import { getContract, contractSend } from '@/utils/contract';
import Asset from '@/config/abi/Asset.json';

import store from '@/store';

// 转让
export function transfer({ to }: { to: string }) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO, currentMember } = store.getState().dao;

  const contract = getContract(web3, Asset.abi, currentDAO.asset);

  console.log(currentMember.tokenId);

  return contractSend(contract, address, 'safeTransferFrom', [
    address,
    to,
    currentMember.tokenId,
  ]);
}
