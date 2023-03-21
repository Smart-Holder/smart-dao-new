import { getContract, contractSend } from '@/utils/contract';
import DAO from '@/config/abi/DAO.json';
import DAOs from '@/config/abi/DAOs.json';
import store from '@/store';
import sdk from 'hcstore/sdk';
import buffer from 'somes/buffer';
import { waitBlockNumber } from '@/api';

export const createDAO = async (params: any) => {
  const { web3, address, chainId: chain } = store.getState().wallet;

  const {
    name,
    mission,
    description,
    memberBaseName,
    members,
    image,
    extend,
    assetIssuanceTax,
    assetCirculationTax,
    // defaultVoteRate,
    // defaultVotePassRate,
    executor,
    hours,
  } = params;

  const contract = getContract(
    web3,
    DAOs.abi,
    process.env.NEXT_PUBLIC_DAOS_PROXY_ADDRESS,
  );

  const baseURI = `${process.env.NEXT_PUBLIC_BASE_URL}/service-api/utils/printJSON`;
  let addr = '';

  const param = [
    {
      name,
      mission,
      description,
      image,
      extend: '0x' + buffer.from(JSON.stringify(extend)).toString('hex'),
    },
    address,
    {
      // InitMemberArgs
      name: memberBaseName,
      description: memberBaseName,
      baseURI: baseURI,
      members: members.map((e: any) => {
        return {
          owner: e.owner,
          info: { ...e },
          permissions: [0xdc6b0b72, 0x678ea396],
        };
      }),
      executor,
    },
    {
      //InitVotePoolArgs
      description: 'VotePool description',
      lifespan: Math.max(hours, 7 * 24 /*7 days*/) * 60 * 60,
    },
    {
      // InitLedgerArgs
      description: 'Ledger description',
    },
    {
      // InitAssetArgs
      name: name, // string  name;
      description: 'Asset description',
      image: image,
      external_link: process.env.NEXT_PUBLIC_BASE_URL,
      seller_fee_basis_points_first: assetIssuanceTax * 100, // 30%
      seller_fee_basis_points_second: assetCirculationTax * 100, // 10%
      fee_recipient: '0x0000000000000000000000000000000000000000', // auto set
      contractURIPrefix: baseURI,
    },
  ];

  await contractSend(
    contract,
    address,
    'deployAssetSalesDAO',
    param,
    async (receipt) => {
      addr = await contract.methods.get(name).call();
      await waitBlockNumber(receipt.blockNumber, addr, chain, 2);
    },
  );

  console.log('create DAO success');

  return sdk.utils.methods.getDAO({ chain, address: addr });
};

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
  ]);
}
