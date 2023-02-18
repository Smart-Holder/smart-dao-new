import { rng } from 'somes/rng';

import { getContract, contractSend, contractCall } from '@/utils/contract';
import Asset from '@/config/abi/Asset.json';
import Ledger from '@/config/abi/Ledger.json';
import ERC721 from '@/config/abi/ERC721.json';

import { connectType as type } from '@/config/enum';

import store from '@/store';
import { request } from '@/api';

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

export function setApprovalForAll({
  contractAddress,
  operator,
}: {
  contractAddress: string;
  operator: string;
}) {
  const { web3, address } = store.getState().wallet;

  return new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(ERC721.abi, contractAddress);

    contract.methods
      .setApprovalForAll(operator, true)
      .send({ from: address })
      .then((receipt: any) => {
        resolve(receipt);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export async function signTypedData(res: any) {
  const { provider, address, connectType } = store.getState().wallet;

  const msgParams = [
    address,
    JSON.stringify({
      primaryType: res.primaryType,
      domain: res.domain,
      types: res.types,
      message: res.value,
    }),
  ];

  // Sign Typed Data
  let signature;

  if (connectType === type.MetaMask) {
    signature = await provider.request({
      method: 'eth_signTypedData_v4',
      params: msgParams,
    });
  } else {
    signature = await provider.signTypedData(msgParams);
  }

  return { parameters: res.value, signature };
}

// 上架资产
export async function shelves({
  token,
  tokenId,
  amount,
}: {
  token: string;
  tokenId: string;
  amount: string;
}) {
  const { chainId } = store.getState().wallet;

  console.log('shelves params:', token, tokenId, amount);

  const res = await request({
    name: 'opensea',
    method: 'getOrderParameters',
    params: { chain: chainId, token, tokenId, amount },
  });

  console.log('getOrderParameters', res);

  if (!res.isApprovedForAll) {
    // 调用合约授权资产权限给opensea
    // token, OPENSEA_CONDUIT_ADDRESS, true
    await setApprovalForAll({
      contractAddress: token,
      operator: res.OPENSEA_CONDUIT_ADDRESS,
    });
  }

  let { parameters, signature } = await signTypedData(res);

  const data = await request({
    name: 'opensea',
    method: 'createOrder',
    params: { chain: chainId, order: parameters, signature },
  });

  console.log('createOrder', data);

  return data;
}

// 收入分配
export function release({
  amount,
  description,
}: {
  amount: number;
  description: string;
}) {
  const { web3, address } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;

  const contract = getContract(web3, Ledger.abi, currentDAO.ledger);

  return contractSend(contract, address, 'release', [amount, description]);
}

// 未分配收入
export function getBalance() {
  const { web3, address } = store.getState().wallet;
  const { currentDAO } = store.getState().dao;

  const contract = getContract(web3, Ledger.abi, currentDAO.ledger);

  return contractCall(contract, 'getBalance');
}
