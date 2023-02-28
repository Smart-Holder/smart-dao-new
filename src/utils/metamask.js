// import Web3 from 'web3';
// import { Message } from "element-ui";
// import store from "@/store/index";
// import router from "@/router";
import { connectType } from '@/config/enum';
// import i18n from "@/plugins/i18n";
import dynamic from 'next/dynamic';
// import store from '@/store';
// import { setProvider } from '@/store/features/walletSlice';

// const store = dynamic(() => import('@/store'), { ssr: false });

export async function connect(dispatch) {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // store.dispatch(setProvider(window.ethereum));
      // store.dispatch({ type: 'wallet/setProvider', payload: window.ethereum });
      // const dispatch = useAppDispatch();
      // store.commit("SET_PROVIDER", window.ethereum);

      const [accounts, chainId] = await Promise.all([
        window.ethereum.request({ method: 'eth_requestAccounts' }),
        window.ethereum.request({ method: 'eth_chainId' }),
      ]);

      console.log('---connect metamask---', chainId, accounts[0]);

      // 只清空 sessionStorage, 重新连接
      // window.ethereum.on('chainChanged', (res) => {
      //   console.log('-----chain changed-----', res);
      //   // store.dispatch({ type: 'wallet/disconnect', payload: null });
      // });

      // 清空所有登录信息，重新连接
      // window.ethereum.on('accountsChanged', (res) => {
      //   // console.log('store', store);
      //   console.log('-----accounts changed-----', res);
      //   // store.dispatch({ type: 'wallet/disconnect', payload: null });
      //   setCookie('address', res[0], 30);
      //   // store.dispatch({ type: 'wallet/setAddress', payload: res[0] });
      // });

      return {
        address: accounts[0],
        chainId: Number(chainId).toString(),
        provider: window.ethereum,
      };
    } catch (error) {
      console.error('Error connecting to MetaMask', error);
      // Message.error({ message: "Error connecting to MetaMask" });
      // Message.error({ message: i18n.t("message.metaMaskConnect") });
    }
  } else {
    console.error('message.noMetaMask');
    // Message.error({ message: i18n.t("message.noMetaMask") });
  }
}

// export async function getAddress() {
//   const account = await window.ethereum.request({
//     method: "eth_accounts",
//   });
//   return account.length > 0 ? account[0] : "";
// }

// export async function getChainId() {
//   const id = await window.ethereum.request({
//     method: "eth_chainId",
//   });
//   return id;
// }

// export async function getBalance(address) {
//   const balance = await window.ethereum.request({
//     method: "eth_getBalance",
//     params: [address, "latest"],
//   });

//   return Number(balance).toString(10);
// }

// export async function signMessage(address, str) {
//   const random = Web3.utils.toHex(str);
//   const signedMessage = await window.ethereum.request({
//     method: "personal_sign",
//     params: [random, address],
//   });
//   return { random: str, signedMessage };
// }

// export async function transfer(transactionParameters) {
//   const txHash = await window.ethereum.request({
//     method: "eth_sendTransaction",
//     params: [transactionParameters],
//   });
//   return txHash;
// }
