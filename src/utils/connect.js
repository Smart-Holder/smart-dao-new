import { connect as connectMetaMask } from '@/utils/metamask';
// import { connect as walletConnect } from '@/utils/connectWallet';
import { connectType } from '@/config/enum';

const connect = (type) => {
  if (type === connectType.MetaMask) {
    return connectMetaMask();
  } else if (type === connectType.WalletConnect) {
    // return walletConnect();
  }
};

export default connect;
