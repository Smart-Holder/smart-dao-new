import { debounce } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

const useResize = ({ target = 'body' }: { target: string }) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onResize = useCallback(() => {
    const el = document.querySelector(target) as any;

    if (el) {
      setSize({
        width: el?.offsetWidth,
        height: el?.offsetHeight,
      });
    }
  }, [target]);

  useEffect(() => {
    onResize();
  }, []);

  useEffect(() => {
    const resize = debounce(onResize, 200);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return size;
};

export default useResize;
