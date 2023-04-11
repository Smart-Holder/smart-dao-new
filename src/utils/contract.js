import { createRoot } from 'react-dom/client';
import { beforeUnload, stopClick } from '@/utils';
import { message, Spin } from 'antd';
import { waitBlockNumber } from '../api';
import store from '@/store';
import { getContractMessage } from './errorCode';

export function getContract(web3, abi, contractAddress) {
  return new web3.eth.Contract(abi, contractAddress);
}

export async function contractCall(contract, method, params = []) {
  return await contract.methods[method](...params).call();
}

const waitBlockNumber_ = (receipt) => {
  return waitBlockNumber(
    receipt.blockNumber,
    store.getState().dao.currentDAO.address,
    store.getState().wallet.chainId,
    2,
  );
};

const setLoading = () => {
  var dom = document.createElement('div');
  dom.setAttribute('id', 'globalLoading');
  const root = createRoot(dom);
  root.render(<Spin />);
  document.body.appendChild(dom);
  // clearTimeout(store.getters.loadingTimer);
  // store.commit('SET_LOADING', true);
  store.dispatch({ type: 'common/setLoading', payload: true });
  window.addEventListener('beforeunload', beforeUnload);
  window.addEventListener('click', stopClick, true);
};

const closeLoading = () => {
  document.body.removeChild(document.getElementById('globalLoading'));
  // store.commit(
  //   'SET_LOADING_TIMER',
  //   setTimeout(() => {
  //     store.commit('SET_LOADING', false);
  //   }, 100),
  // );
  store.dispatch({ type: 'common/setLoading', payload: false });
  window.removeEventListener('beforeunload', beforeUnload);
  window.removeEventListener('click', stopClick, true);
};

export async function contractSend(
  contract,
  from,
  method,
  params = [],
  next = waitBlockNumber_,
) {
  try {
    setLoading();
    await contract.methods[method](...params).call({ from }); //try call
  } catch (error) {
    // let msg = error.message || `call contract method error, ${method}`;
    // let msg_0 = msg.split('\n')[0];
    // // execution reverted: #Department#OnlyDAO caller does not have permission
    // // if (msg.indexOf('#Department#OnlyDAO') != -1) {
    // //   msg_0 = `Caller does not have permission, only DAO call`;
    // // } else
    // if (msg.indexOf('not have permission') != -1) {
    //   msg_0 = `Caller does not have permission`;
    // }

    getContractMessage(error, method);
    closeLoading();
    throw error;
  }

  return await new Promise((resolve, reject) => {
    contract.methods[method](...params)
      .send({ from })
      .then((receipt) => {
        next(receipt)
          .then(() => {
            closeLoading();
            resolve(receipt);
          })
          .catch((reject) => {
            closeLoading();
          });
      })
      .catch((error) => {
        // console.error(
        //   error?.message || `send contract method error, ${method}`,
        // );
        // message.error(
        //   error?.message || `send contract method error, ${method}`,
        // );
        getContractMessage(error, method);
        closeLoading();
        reject(error);
      });
  });
}
