import { useMemo, useState, useEffect } from 'react';

import { DebugOffset } from './debug-offset';
import { isOffsetInPixels, createThreshold, isBrowser } from './utils';
import { ScrollamaProvide } from './provide';

import type { ScrollamaProps } from './types';


export const Scrollama = <T = unknown>({
  debug,
  children,
  offset = 0.3,
  onStepEnter,
  onStepExit,
  onStepProgress,
  threshold = 4,
}: ScrollamaProps<T>) => {
  const isOffsetDefinedInPixels = isOffsetInPixels(offset);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [windowInnerHeight, setWindowInnerHeight] = useState(0);

  const handleSetLastScrollTop = (scrollTop: number) => {
    setLastScrollTop(scrollTop);
  };

  const handleWindowResize = () => {
    setWindowInnerHeight(window.innerHeight);
  };

  useEffect(() => {
    if (isOffsetDefinedInPixels) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === document.documentElement) {
            handleWindowResize();
          }
        }
      });
      resizeObserver.observe(document.documentElement);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  const innerHeight = isBrowser ? (windowInnerHeight || window.innerHeight) : 0;

  const offsetValue = isOffsetDefinedInPixels
    ? (+(offset as string).replace('px', '') / innerHeight)
    : +offset;

  const progressThreshold = useMemo(() => createThreshold(threshold, innerHeight), [innerHeight]);

  return (
    <ScrollamaProvide.Provider value={{
      offset: offsetValue,
      lastScrollTop,
      handleSetLastScrollTop,
      progressThreshold,
      innerHeight,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      onStepEnter, onStepExit, onStepProgress,
    }}>
      {debug && <DebugOffset offset={offset} />}
      {children}
    </ScrollamaProvide.Provider>
  );
};
