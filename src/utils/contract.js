// import api from '../api';
// import wallet from '../store/modules/wallet';
// import store from '@/store';
// import { Message } from 'element-ui';
import sdk from 'hcstore/sdk';
import { beforeUnload, stopClick } from '@/utils';
import store from '@/store';

export function getContract(web3, abi, contractAddress) {
  return new web3.eth.Contract(abi, contractAddress);
}

export async function contractCall(contract, method, params = []) {
  return await contract.methods[method](...params).call();
}

const waitBlockNumber = async (receipt) => {
  if (store.getState().dao.currentDAO) {
    return await sdk.chain.methods.waitBlockNumber({
      dao: store.getState().dao.currentDAO.address,
      chain: store.getState().wallet.chainId,
      blockNumber: receipt.blockNumber,
    });
  }
};

export async function contractSend(
  contract,
  from,
  method,
  params = [],
  next = waitBlockNumber,
) {
  // clearTimeout(store.getters.loadingTimer);
  // store.commit('SET_LOADING', true);
  store.dispatch({ type: 'common/setLoading', payload: true });
  window.addEventListener('beforeunload', beforeUnload);
  window.addEventListener('click', stopClick, true);

  function closeLoading() {
    // store.commit(
    //   'SET_LOADING_TIMER',
    //   setTimeout(() => {
    //     store.commit('SET_LOADING', false);
    //   }, 100),
    // );
    store.dispatch({ type: 'common/setLoading', payload: false });
    window.removeEventListener('beforeunload', beforeUnload);
    window.removeEventListener('click', stopClick, true);
  }

  try {
    await contract.methods[method](...params).call({ from }); //try call
  } catch (error) {
    let msg = error.message || `call contract method error, ${method}`;
    let msg_0 = msg.split('\n')[0];
    // execution reverted: #Department#OnlyDAO caller does not have permission
    // if (msg.indexOf('#Department#OnlyDAO') != -1) {
    //   msg_0 = `Caller does not have permission, only DAO call`;
    // } else
    if (msg.indexOf('not have permission') != -1) {
      msg_0 = `Caller does not have permission`;
    }
    // Message.error({ message: msg_0 });
    console.error(msg_0);
    closeLoading();
    throw error;
  }

  return await new Promise((resolve, reject) => {
    contract.methods[method](...params)
      .send({ from })
      .then((receipt) => {
        next(receipt)
          .then(() => resolve(receipt))
          .catch(reject)
          .finally(() => {
            closeLoading();
          });
      })
      .catch((error) => {
        // Message.error({
        //   message: error?.message || `send contract method error, ${method}`,
        // });
        console.error(
          error?.message || `send contract method error, ${method}`,
        );
        closeLoading();
        reject(error);
      });
  });
}
