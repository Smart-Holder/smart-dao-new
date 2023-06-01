import { createRoot } from 'react-dom/client';
import { Spin } from 'antd';

/**
 * 刷新或关闭页面前，浏览器默认的弹窗提示
 * @param {*} e
 * @returns
 */
export const beforeUnload = (e) => {
  e.returnValue = 'loading';
  e.preventDefault();
  return 'loading';
};

/**
 * 禁止页面的 click 事件
 * @param {*} e
 */
export const stopClick = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

/**
 * 全局 Loading
 */
export const setLoading = () => {
  var dom = document.createElement('div');
  dom.setAttribute('id', 'globalLoading');
  const root = createRoot(dom);
  root.render(<Spin />);
  document.body.appendChild(dom);
  window.addEventListener('beforeunload', beforeUnload);
  window.addEventListener('click', stopClick, true);
};

export const closeLoading = () => {
  document.body.removeChild(document.getElementById('globalLoading'));
  window.removeEventListener('beforeunload', beforeUnload);
  window.removeEventListener('click', stopClick, true);
};
