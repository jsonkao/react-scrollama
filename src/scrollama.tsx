import { useMemo, useState, Fragment, Children, useEffect, cloneElement, isValidElement } from 'react';
import { DebugOffset } from './debug-offset';
import { isOffsetInPixels, createThreshold, isBrowser } from './utils';

import type { ScrollamaProps, StepProps } from './types';


export const Scrollama = <T = string>({
  debug,
  children,
  offset = 0.3,
  onStepEnter = () => { },
  onStepExit = () => { },
  onStepProgress = () => { },
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
      window.addEventListener('resize', handleWindowResize);
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }
  }, [isOffsetDefinedInPixels, handleWindowResize]);

  const innerHeight = isBrowser ? (windowInnerHeight || window.innerHeight) : 0;

  const offsetValue = isOffsetDefinedInPixels
    ? (+(offset as string).replace('px', '') / innerHeight)
    : offset;

  const progressThreshold = useMemo(() => createThreshold(threshold, innerHeight), [innerHeight]);

  return (
    <Fragment>
      {debug && <DebugOffset offset={offset} />}
      {Children.map(children, (child, i) => {
        /**
         * Clone a React element.If the value is
         * not a valid React element, return child.
         */
        if (!isValidElement(child)) {
          return child;
        }
        return cloneElement(child, {
          scrollamaId: `react-scrollama-${i}`,
          offset: offsetValue,
          onStepEnter,
          onStepExit,
          onStepProgress,
          lastScrollTop,
          handleSetLastScrollTop,
          progressThreshold,
          innerHeight
        } as unknown as StepProps);
      })}
    </Fragment>
  );
};
