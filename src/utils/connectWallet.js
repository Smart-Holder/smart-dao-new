import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
// import store from '@/store';
import { clearCookie, getCookie, setCookie } from '@/utils/cookie';
import { connectType } from '@/config/enum';
import Router from 'next/router';
import { ETH_CHAINS_INFO } from '@/config/chains';
// import { initialize as initApi } from "@/api";

import {
  setChainId,
  setConnectType,
  setSupportChain,
  disconnect,
} from '@/store/features/walletSlice';

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
export const connect = async (type, dispatch) => {
  return new Promise((resolve, reject) => {
    console.log('walletconnect');
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
      console.log('connection is already established');
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

      console.log('walletconnect success', payload);
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
      console.log('walletconnect session_update', payload);

      const { accounts, chainId: chain } = payload.params[0];

      const address = accounts[0];
      const chainId = Number(chain);

      const address_cookie = getCookie('address');
      const chainId_cookie = getCookie('chainId');

      if (chainId !== Number(chainId_cookie)) {
        console.log('walletconnect: chain changed');

        const isSupport = Object.keys(ETH_CHAINS_INFO).includes(
          chainId.toString(),
        );

        setCookie('chainId', chainId, 30);
        setCookie('connectType', type, 30);
        dispatch(setChainId(chainId));
        dispatch(setConnectType(type));

        if (!isSupport) {
          dispatch(setSupportChain(false));
        }
      } else if (address !== address_cookie) {
        console.log('walletconnect: address changed');

        setCookie('address', res[0], 30);
        setCookie('connectType', type, 30);
        dispatch({ type: 'wallet/setAddress', payload: res[0] });
        dispatch(setConnectType(type));
      }

      // clearCookie('address');
      // clearCookie('chainId');
      // clearCookie('connectType');
      // localStorage.removeItem('walletconnect');
      // localStorage.removeItem('step');
      // sessionStorage.clear();
      // window.location.reload();
    });

    connector.on('disconnect', (error, payload) => {
      console.log('walletconnect disconnect', payload);

      if (error) {
        reject(error);
        throw error;
      }

      dispatch(disconnect());
      // clearCookie('address');
      // clearCookie('chainId');
      // clearCookie('connectType');
      // localStorage.removeItem('walletconnect');
      // localStorage.removeItem('step');
      // sessionStorage.clear();
      // window.location.reload();
    });
  });
};
