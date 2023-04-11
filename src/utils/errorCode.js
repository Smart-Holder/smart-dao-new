import { message } from 'antd';

export const errorCode = {
  100307: 'Name already exists, please try again',
  100311: 'Upload error',
  100312: 'Upload exceeded maximum limit',
  100317: '404 Error',
  100322: 'Asset metadata image is empty',
  100325: 'Block sync timeout',
  100324: 'Asset metadata URI error',
  100326: 'Task execution timed out',
  100327: 'Task already exists',
  100328: 'Task does not exist',
  100329: 'Task has been closed',
  100330: 'Duplicate DAO name',
  100331: 'DAO address does not exist',
  100332: 'There are unfinished tasks in progress, please try again later',
  100333: 'Could not find DAO by address',
  100334: 'Task type does not match',
  100335: 'DAO does not exist',
  100336: 'The asset may already be listed on Opensea',
  100337: 'Order does not exist in Opensea',
  100338: 'Resource data does not exist',
  100339: 'Error calling Opensea API',

  '0xf4d678b8': 'payable insufficient balance',
  '0x5bdb36f8': 'payable insufficient amount',
  '0x41a5bd5c': 'payable amount zero',
  '0x9993a422': 'send amount value fail',
  '0x1e092104': 'permission denied',
  '0xda002518': 'permission denied for only dao',
  '0x7832bbc1': 'specific member no match',
  '0x2aae78ef': 'check interface or module no match',
  '0x5bb7a723': 'address cannot be empty zero',
  '0x94e69af8': 'token Id cannot be empty zero',
  '0xd3a32745': 'erc721 action permission denied',
  '0x11307032': 'transfer of token id that is not own in ERC721',
  '0x5449cd45': 'nonexistent token id for ERC721',
  '0x082c3a4f': 'token id already minted in ERC721',
  '0x65f090f7': 'Cannot approve to owner',
  '0x19095a8c': 'cannot approve all to caller or owner in ERC721',
  '0x85d5821e': 'non ERC721 Receiver implementer',
  '0x399c7579': 'Only available to the owner',
  '0x4aa4cf51': 'non contract address',
  '0x54ac7492': 'asset non exists',
  '0xf31df50e': 'You need to unlock the asset first',
  '0x21c67f49': 'Lock cannot be empty in asset shell',
  '0x252f4a32': 'not votes power enough in member',
  '0x7f5c5df9': 'member non exists',
  '0xe0150952': 'member already exists',
  '0xa1ee8585': 'already exists member join request',
  '0xf0f63e9e': 'proposal non exists',
  '0xec297468': 'proposal already exists',
  '0x420e832e': 'proposal lifespan not less than 12 hours',
  '0xeda2bb99': 'proposal vote pass rate not less than 50%',
  '0xc0c4b93d': 'proposal lifespan not less than current setting lifespan days',
  '0x0d67e9dd': 'Loop time must be greater than 1 minute',
  '0xdd3b8d8f': 'votes cannot be zero',
  '0x1446e503': 'proposal closed',
  '0x22dd3c54': 'Voting Membership Mismatch',
  '0x29a56ece': 'Cannot vote repeatedly',
  '0xaccf9793': 'vote insufficient votes',
  '0x1182db35': '',
  '0xc8c93ba3': 'Proposal was not passed',
};

export const getContractMessage = (error, method) => {
  console.error('error', error);

  // 用户取消操作
  if (error?.code === 4001) {
    return '';
  }

  // const defaultMessage = `call contract method error, ${method}`;
  const defaultMessage = `Call contract method error`;

  try {
    let msg = '';

    if (error?.message.includes('{')) {
      const errorObj = JSON.parse(error.message.split('\n').slice(1).join(''));
      const data = errorObj?.originalError?.data;
      const code = data?.slice(0, 10);
      msg = code ? errorCode[code] : defaultMessage;
    } else {
      msg = error?.message || defaultMessage;
    }

    msg = msg.slice(0, 1).toUpperCase() + msg.slice(1);

    console.error(msg);
    message.error(msg);
    return msg;
  } catch (error) {
    console.error(error);
    message.error(defaultMessage);
    return defaultMessage;
  }
};
