import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import store from '@/store/index';
// import { setCookie, clearCookie } from "@/utils/cookie";
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
      store.commit('SET_PROVIDER', new WalletConnectPROVIDER(connector));
      // store.commit("SET_ADDRESS", accounts[0]);
      // store.commit("SET_CHAINID", chainId);
      // store.dispatch("getDAO", { chain: chainId, address: accounts[0] });
      // store.dispatch("getDAOList", { chain: chainId, owner: accounts[0] });
      resolve({ chainId, address: accounts[0] });
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
      // clearCookie("address");
      // clearCookie("connectType");
      // setCookie("address", accounts[0], 30);
      // setCookie("connectType", connectType.WalletConnect, 30);

      // store.commit("SET_ADDRESS", accounts[0]);
      // store.commit("SET_CHAINID", chainId);
      // store.dispatch("getDAO", { chain: chainId, address: accounts[0] });
      // store.dispatch("getDAOList", { chain: chainId, owner: accounts[0] });
      // resolve(connector);

      console.log('---WalletConnect success---', payload);
      store.commit('SET_PROVIDER', new WalletConnectPROVIDER(connector));
      resolve({ chainId, address: accounts[0] });
    });

    connector.on('session_update', (error, payload) => {
      if (error) {
        console.log('connect error', error);
        reject(error);
        throw error;
      }
      console.log('---session_update---', payload);
      // Get updated accounts and chainId
      // const { accounts, chainId } = payload.params[0];

      store.dispatch('disconnect');
      // store.commit("SET_ADDRESS", accounts[0]);
      // store.commit("SET_CHAINID", chainId);
      store.dispatch('connect', connectType.WalletConnect);
      // store.dispatch("getDAO", { chain: chainId, address: accounts[0] });
      // store.dispatch("getDAOList", { chain: chainId, owner: accounts[0] });
    });

    connector.on('disconnect', (error, payload) => {
      console.log('---disconnect payload---', payload);
      if (error) {
        reject(error);
        throw error;
      }
      // store.dispatch("disconnect");
    });
  });
};
