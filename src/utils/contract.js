import { createRoot } from 'react-dom/client';
import { beforeUnload, stopClick } from '@/utils/tool';
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
  store.dispatch({ type: 'common/setLoading', payload: true });
  window.addEventListener('beforeunload', beforeUnload);
  window.addEventListener('click', stopClick, true);
};

const closeLoading = () => {
  document.body.removeChild(document.getElementById('globalLoading'));
  store.dispatch({ type: 'common/setLoading', payload: false });
  window.removeEventListener('beforeunload', beforeUnload);
  window.removeEventListener('click', stopClick, true);
};

const setGasPrice = async () => {
  const chainId = store.getState().wallet.chainId;

  if (Number(chainId) === 137) {
    const res = await fetch(
      'https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle',
    );
    const data = await res.json();
    const { ProposeGasPrice } = data.result;
    return ProposeGasPrice * 1000000000 + '';
  }
  return 0;
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
    getContractMessage(error, method);
    closeLoading();
    throw error;
  }
  const gasPrice = await setGasPrice();

  return await new Promise((resolve, reject) => {
    contract.methods[method](...params)
      .send(gasPrice ? { from, gasPrice } : { from })
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
        getContractMessage(error, method);
        closeLoading();
        reject(error);
      });
  });
}
