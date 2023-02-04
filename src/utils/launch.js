import store from '@/store';
import router from 'next/router';
import { getCookie } from '@/utils/cookie';
// import i18n from '@/plugins/i18n';

// const stepList = {
//   DAC: [
//     {
//       path: '/create',
//       key: 'template',
//       title: i18n.t('launch.steps.template'),
//     },
//     {
//       path: '/create/information',
//       key: 'information',
//       title: i18n.t('launch.steps.information'),
//     },
//     { path: '/create/nftp', key: 'nftp', title: i18n.t('launch.steps.nftp') },
//     {
//       path: '/create/company',
//       key: 'company',
//       title: i18n.t('launch.steps.company'),
//     },
//     {
//       path: '/create/voting-rules',
//       key: 'votingRules',
//       title: i18n.t('launch.steps.votingRules'),
//     },
//     {
//       path: '/create/review',
//       key: 'review',
//       title: i18n.t('launch.steps.review'),
//     },
//     { path: '/create/launch' },
//   ],
//   DAO: [
//     { path: '/create', key: 'template', title: 'Select Template' },
//     {
//       path: '/create/information',
//       key: 'information',
//       title: i18n.t('launch.steps.information'),
//     },
//     { path: '/create/nftp', key: 'nftp', title: i18n.t('launch.steps.nftp') },
//     {
//       path: '/create/asset-rules',
//       key: 'assetRules',
//       title: i18n.t('launch.steps.assetRules'),
//     },
//     {
//       path: '/create/voting-rules',
//       key: 'votingRules',
//       title: i18n.t('launch.steps.votingRules'),
//     },
//     {
//       path: '/create/review',
//       key: 'review',
//       title: i18n.t('launch.steps.review'),
//     },
//     { path: '/create/launch' },
//   ],
// };

export function setMakeDAOStorage(key, value) {
  if (!key) {
    return;
  }

  const id = `${getCookie('address')}-${getCookie('connectType')}`;

  const data = JSON.parse(localStorage.getItem('makeDAO') || '{}');

  // reset data
  if (key === 'template' && data[id]?.template?.type !== value.type) {
    data[id] = {};
  }

  data[id][key] = value;

  localStorage.setItem('makeDAO', JSON.stringify(data));
}

export function getMakeDAOStorage(key) {
  const id = `${getCookie('address')}-${getCookie('connectType')}`;

  const data = JSON.parse(localStorage.getItem('makeDAO') || '{}');

  if (data[id]) {
    return key ? data[id][key] : data[id];
  }

  return undefined;
}

export function clearMakeDAOStorage() {
  const id = `${getCookie('address')}-${getCookie('connectType')}`;
  const data = JSON.parse(localStorage.getItem('makeDAO') || '{}');

  delete data[id];

  localStorage.setItem('makeDAO', JSON.stringify(data));
}

// export function getSteps(path) {
//   let step;
//   const steps = stepList[getMakeDAOStorage('template')?.type || 'DAC'];

//   if (steps) {
//     const index = steps.findIndex(
//       (s) => s.path === (path || router.currentRoute.path),
//     );
//     step = index >= 0 ? index + 1 : step;
//   }

//   return { step, steps };
// }

// export function back() {
//   const { step, steps } = getSteps();

//   store.commit('SET_STEP', step - 1);
//   router.replace(steps[step - 2].path);
// }

// export function next() {
//   const { step, steps } = getSteps();

//   store.commit('SET_STEP', step + 1);
//   router.replace(steps[step].path);
// }
