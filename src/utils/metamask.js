import Router from 'next/router';
import { Modal } from 'antd';
// import { connectType } from '@/config/enum';
import { setChainId } from '@/store/features/walletSlice';
import { ETH_CHAINS_INFO } from '@/config/chains';
import { setCookie } from '@/utils/cookie';

export async function connect(dispatch) {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const [accounts, chainId] = await Promise.all([
        window.ethereum.request({ method: 'eth_requestAccounts' }),
        window.ethereum.request({ method: 'eth_chainId' }),
      ]);

      console.log('connect metamask', chainId, accounts[0]);

      window.ethereum.on('chainChanged', (res) => {
        console.log('chain changed', res);

        const chainId = Number(res);
        const isSupport = Object.keys(ETH_CHAINS_INFO).includes(
          chainId.toString(),
        );

        if (isSupport) {
          setCookie('chainId', chainId, 30);
          dispatch(setChainId(chainId));
          // window.location.reload();
          // router.push('/');

          // dispatch(connectWallet(types.MetaMask));

          // if (router.pathname === '/') {
          //   router.reload();
          // } else {
          //   router.push('/');
          // }
        } else {
          Modal.warning({
            title: `Supported networks: Ethereum, Goerli`,
            className: 'modal-small',
            onOk: () => {
              dispatch({ type: 'wallet/disconnect', payload: null });
            },
          });
        }
        // store.dispatch({ type: 'wallet/disconnect', payload: null });
      });

      window.ethereum.on('accountsChanged', (res) => {
        console.log('address changed', res);
        setCookie('address', res[0], 30);
        dispatch({ type: 'wallet/setAddress', payload: res[0] });
      });

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
