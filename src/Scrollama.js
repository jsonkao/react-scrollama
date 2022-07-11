import React, { useMemo, useState } from 'react';
import DebugOffset from './DebugOffset';
import { isOffsetInPixels } from './utils';

const createThreshold = (theta, height) => {
  const count = Math.ceil(height / theta);
  const t = [];
  const ratio = 1 / count;
  for (let i = 0; i <= count; i += 1) {
    t.push(i * ratio);
  }
  return t;
};

const Scrollama = props => {
  const {
    debug,
    children,
    offset,
    onStepEnter,
    onStepExit,
    onStepProgress,
    threshold,
  } = props;
  const isOffsetDefinedInPixels = isOffsetInPixels(offset)
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [windowInnerHeight, setWindowInnerHeight] = useState(null);

  const handleSetLastScrollTop = (scrollTop) => {
    setLastScrollTop(scrollTop);
  };

  const handleWindowResize = (e) => {
    setWindowInnerHeight(window.innerHeight)
  }

  React.useEffect(() => {
    if(isOffsetDefinedInPixels) {
      window.addEventListener('resize', handleWindowResize);
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }
  }, []);

  const isBrowser = typeof window !== "undefined";
  const innerHeight = isBrowser ? (windowInnerHeight || window.innerHeight) : 0;

  const offsetValue = isOffsetDefinedInPixels
    ? (+offset.replace('px', '') / innerHeight)
    : offset;

  const progressThreshold = useMemo(() => createThreshold(threshold, innerHeight), [innerHeight]);

  return (
    <React.Fragment>
      {debug && <DebugOffset offset={offset} />}
      {React.Children.map(children, (child, i) => {
        return React.cloneElement(child, {
          scrollamaId: `react-scrollama-${i}`,
          offset: offsetValue,
          onStepEnter,
          onStepExit,
          onStepProgress,
          lastScrollTop,
          handleSetLastScrollTop,
          progressThreshold,
          innerHeight
        });
      })}
    </React.Fragment>
  );
};

Scrollama.defaultProps = {
  onStepProgress: null,
  onStepEnter: () => {},
  onStepExit: () => {},
  threshold: 4,
};

export default Scrollama;
