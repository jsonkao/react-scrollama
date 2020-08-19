import React from 'react';
import DebugOffset from './DebugOffset';
import { isOffsetInPixels } from './utils';

const TinyScrollama = props => {
  const {
    debug,
    children,
    offset,
    onStepEnter,
    onStepExit,
    onStepProgress,
  } = props;
  const isOffsetDefinedInPixels = isOffsetInPixels(offset)
  const [lastScrollTop, setLastScrollTop] = React.useState(0);
  const [windowInnerHeight, setWindowInnerHeight] = React.useState(null);
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


  const offsetValue = isOffsetDefinedInPixels 
    ? (+offset.replace('px', '') / (windowInnerHeight || window.innerHeight))
    : offset;

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
        });
      })}
    </React.Fragment>
  );
};

TinyScrollama.defaultProps = {
  onStepProgress: null,
  onStepEnter: () => {},
  onStepExit: () => {},
};

export default TinyScrollama;
