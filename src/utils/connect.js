import { connect as connectMetaMask } from '@/utils/metamask';
import { connect as walletConnect } from '@/utils/connectWallet';
import { connectType } from '@/config/enum';

const connect = (type, dispatch) => {
  if (type === connectType.MetaMask) {
    return connectMetaMask(type, dispatch);
  } else if (type === connectType.WalletConnect) {
    return walletConnect(type, dispatch);
  }
};

export default connect;
