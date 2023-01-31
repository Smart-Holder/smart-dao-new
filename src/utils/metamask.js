import Web3 from 'web3';
// import { Message } from "element-ui";
// import store from "@/store/index";
// import router from "@/router";
import { connectType } from '@/config/enum';
// import i18n from "@/plugins/i18n";
import store from '@/store';
import { setProvider } from '@/store/features/walletSlice';

export async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      store.dispatch(setProvider(window.ethereum));
      // const dispatch = useAppDispatch();
      // store.commit("SET_PROVIDER", window.ethereum);

      const [accounts, chainId] = await Promise.all([
        window.ethereum.request({ method: 'eth_requestAccounts' }),
        window.ethereum.request({ method: 'eth_chainId' }),
      ]);

      console.log('---connect metamask---', chainId, accounts[0]);

      // 只清空 sessionStorage, 重新连接
      window.ethereum.on('chainChanged', (res) => {
        console.log('-----chainChanged-----', res);
        // store.dispatch("disconnect");
        // store.dispatch("connect", connectType.MetaMask);
      });

      // 清空所有登录信息，重新连接
      window.ethereum.on('accountsChanged', (res) => {
        console.log('-----accountsChanged-----', res);
        // store.dispatch("disconnect");
        // store.dispatch("connect", connectType.MetaMask);
      });

      return {
        address: accounts[0],
        chainId: Number(chainId).toString(),
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
