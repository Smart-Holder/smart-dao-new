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

export function initialize(address, chain) {
  return somes.scopeLock(initialize, async function () {
    var key = hash
      .sha256((address || '').toLowerCase() + '__as1ahaasr_')
      .toString('hex');
    if (storeSdk.isLoaded) {
      await setPrivateKey(key, address);
    } else {
      await initSdk(
        process.env.NEXT_PUBLIC_HCSTORE_URL ||
          'https://smart-dao-rel.stars-mine.com/service-api',
        key,
        address,
      );
      storeSdk.conv.autoReconnect = 1e3;
      storeSdk.conv.keepAliveTime = 1e4; // 10s
    }
    if (chain) {
      addEventListenerMakeDAOComplete(chain);
    }
  });
}

export function request({
  name,
  method,
  params,
  listen = false,
  listenName = '',
}) {
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
        if (listen && listenName === 'makeDAO') {
          addEventListenerMakeDAOComplete(res.args.chain, resolve);
          makeDAOListener(res.id, resolve, reject);
        } else {
          // store.commit(
          //   "SET_LOADING_TIMER",
          //   setTimeout(() => {
          //     store.commit("SET_LOADING", false);
          //   }, 100)
          // );
          resolve(res);
        }
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

let timer;

export function addEventListenerMakeDAOComplete(chain, resolve) {
  console.log('addEventListenerMakeDAOComplete');

  sdk.msg.addEventListener(
    'MakeDAOComplete',
    async function ({ data: { /*state, task,*/ data, ok } }) {
      if (ok) {
        console.log('MakeDAO success', data.data);
        // let dao = await sdk.utils.methods.getDAO({ chain, address: data.data });
        // store.commit("SET_CURRENT_DAO", dao);

        if (resolve) {
          resolve();
        }
      } else {
        console.log('MakeDAO fail', data.error);
        // Message.error({ message: data?.error?.message });
      }

      clearInterval(timer);

      // store.commit("SET_LOADING", false);
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('click', stopClick, true);
    },
    'MakeDAO',
  );
}

function makeDAOListener(id, resolve, reject) {
  timer = setInterval(async () => {
    const res = await sdk.tasks.methods.getTaskData({ id });
    // console.log("makeDAOListener", res);

    if (res.state === 1) {
      resolve();
    }

    if (res.state === 2) {
      reject();
    }

    if (res.state === 1 || res.state === 2) {
      clearInterval(timer);
      // store.commit("SET_LOADING", false);
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('click', stopClick, true);
    }
  }, 20000);
}
