import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
// import store from '@/store/index';
import { clearCookie } from '@/utils/cookie';
import { connectType } from '@/config/enum';
// import { initialize as initApi } from "@/api";

class WalletConnectPROVIDER {
  constructor(connect) {
    this.connect = connect;
  }
  async request(args) {
    let res = await this.connect.sendCustomRequest(args);
    return res;
  }
}

let connector = null;
export const connect = async () => {
  return new Promise((resolve, reject) => {
    console.log('------WalletConnect-------');
    // Create a connector
    connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      // qrcodeModal: QRCodeModal,
    });

    // console.log("connector", connector, connector.connected);

    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession().then(() => {
        // get uri for QR Code modal
        const uri = connector.uri;
        // display QR Code modal
        QRCodeModal.open(
          uri,
          () => {
            console.log('QR Code Modal closed');
          },
          true, // isNode = true
        );
        // disconnect success
        localStorage.clear();
      });
    } else {
      const { accounts, chainId } = connector;
      console.log('----connection is already established----');
      // store.commit('SET_PROVIDER', new WalletConnectPROVIDER(connector));
      resolve({
        address: accounts[0],
        chainId: Number(chainId).toString(),
        provider: new WalletConnectPROVIDER(connector),
      });
    }

    // Subscribe to connection events
    connector.on('connect', (error, payload) => {
      if (error) {
        console.log('connect error', error);
        reject(error);
        throw error;
      }

      // Close QR Code Modal
      QRCodeModal.close();

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];

      console.log('---WalletConnect success---', payload);
      // store.commit('SET_PROVIDER', new WalletConnectPROVIDER(connector));
      // resolve({ chainId, address: accounts[0] });
      resolve({
        address: accounts[0],
        chainId: Number(chainId).toString(),
        provider: new WalletConnectPROVIDER(connector),
      });
    });

    connector.on('session_update', (error, payload) => {
      if (error) {
        console.log('connect error', error);
        reject(error);
        throw error;
      }
      console.log('---session_update---', payload);

      // store.dispatch('disconnect');
      // store.dispatch('connect', connectType.WalletConnect);
      clearCookie('address');
      clearCookie('chainId');
      clearCookie('connectType');
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('step');
      sessionStorage.clear();
      window.location.reload();
    });

    connector.on('disconnect', (error, payload) => {
      console.log('---disconnect payload---', payload);
      if (error) {
        reject(error);
        throw error;
      }
      // store.dispatch("disconnect");
      clearCookie('address');
      clearCookie('chainId');
      clearCookie('connectType');
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('step');
      sessionStorage.clear();
      window.location.reload();
    });
  });
};
