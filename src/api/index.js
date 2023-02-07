import sdk, {
  store as storeSdk,
  initialize as initSdk,
  setPrivateKey,
} from 'hcstore/sdk';
import hash from 'somes/hash';
import somes from 'somes';
// import { Message } from "element-ui";
// import store from "@/store";
import { errorCode } from '@/utils/errorCode';
import { beforeUnload, stopClick } from '@/utils';

export default sdk;

export function initialize(address) {
  return somes.scopeLock(initialize, async function () {
    var key = hash
      .sha256((address || '').toLowerCase() + '__as1ahaasr_')
      .toString('hex');
    if (storeSdk.isLoaded) {
      await setPrivateKey(key, address);
    } else {
      await initSdk(
        process.env.NEXT_PUBLIC_HCSTORE_URL ||
          'https://smart-dao-rel-v2.stars-mine.com/service-api',
        key,
        address,
      );
      storeSdk.conv.autoReconnect = 1e3;
      storeSdk.conv.keepAliveTime = 1e4; // 10s
    }
  });
}

export function request({ name, method, params, listen = false }) {
  // clearTimeout(store.getters.loadingTimer);
  // store.commit("SET_LOADING", true);

  if (listen) {
    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('click', stopClick, true);
  }

  return new Promise((resolve, reject) => {
    sdk[name].methods[method](params)
      .then((res) => {
        console.log('res', res);
        // store.commit(
        //   "SET_LOADING_TIMER",
        //   setTimeout(() => {
        //     store.commit("SET_LOADING", false);
        //   }, 100)
        // );
        resolve(res);
      })
      .catch((e) => {
        console.log('catch', e);
        if (e?.message) {
          const errorCodeMessage = e.errno !== 0 ? errorCode[e.errno + ''] : '';
          // Message.error({ message: errorCodeMessage || e.message });
          console.error(errorCodeMessage || e.message);
        }

        // store.commit(
        //   "SET_LOADING_TIMER",
        //   setTimeout(() => {
        //     store.commit("SET_LOADING", false);
        //   }, 100)
        // );

        if (listen) {
          window.removeEventListener('beforeunload', beforeUnload);
          window.removeEventListener('click', stopClick, true);
        }

        reject(e);
      });
  });
}

export async function waitBlockNumber(blockNumber, dao, chain, retry = 1) {
  do {
    try {
      await sdk.chain.methods.waitBlockNumber({ dao, chain, blockNumber });
      break;
    } catch (err) {
      if (retry <= 0) throw err;
    }
    await somes.sleep(1e3); // 1s
  } while (retry-- > 0);
}
