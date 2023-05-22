import { proposalType } from '@/config/enum';
import store from '@/store';

export const decodeParameters = (data: string) => {
  const { web3 } = store.getState().wallet;

  const code = data.slice(0, 10);

  try {
    // requestJoin
    if (code === '0x1fc599e5') {
      const obj = web3.eth.abi.decodeParameters(
        [
          {
            type: 'address',
            name: 'address',
          },
          {
            ParentStruct: {
              id: 'uint256',
              name: 'string',
              description: 'string',
              image: 'string',
              votes: 'uint32',
            },
          },
          {
            type: 'uint256[]',
            name: 'permissions',
          },
        ],
        '0x' + data.slice(10),
      );

      return {
        type: 'member',
        proposalType: proposalType.Member_Join,
        values: {
          address: obj.address,
          name: obj['1'][1],
          image: obj['1'][3],
          votes: obj['1'][4],
          permissions: obj.permissions.map(
            // (item: string) => `0x${Number(item).toString(16)}`,
            (item: string) => Number(item),
          ),
        },
      };
    }
  } catch (error) {
    return null;
  }

  return null;
};
