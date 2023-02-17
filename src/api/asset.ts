import { rng } from 'somes/rng';
import abi from 'web3-eth-abi';

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

// 发行资产
export function safeMint({ _tokenURI }: { _tokenURI: string }) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;

  const contract = getContract(web3, Asset.abi, currentDAO.asset);

  return contractSend(contract, address, 'safeMint', [
    currentDAO.first,
    '0x' + rng(32).toString('hex'),
    _tokenURI,
    // abi.encodeParameters(["address"], [address]),
    web3.eth.abi.encodeParameters(
      ['address', 'uint256'],
      [address, '10000000000000000' /*min price 0.01 eth*/],
    ),
  ]);
}
