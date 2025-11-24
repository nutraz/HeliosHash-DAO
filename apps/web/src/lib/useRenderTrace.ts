import { useRef, useEffect } from 'react';

// Lightweight render trace hook. Call `useRenderTrace('ComponentName')`
// at the top of a component to log render counts and last props snapshot.
export function useRenderTrace(name: string, props?: any) {
  const count = useRef(0);
  useEffect(() => {
    count.current += 1;
    // keep logs concise in production
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`${name} render #${count.current}`, props);
    }
  });
}
