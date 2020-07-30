import React from 'react';
import DebugOffset from './DebugOffset';

const TinyScrollama = props => {
  const {
    debug,
    children,
    offset,
    onStepEnter,
    onStepExit,
    onStepProgress,
  } = props;

  const [lastScrollTop, setLastScrollTop] = React.useState(0);
  const handleSetLastScrollTop = (scrollTop) => {
    setLastScrollTop(scrollTop);
  };

  return (
    <React.Fragment>
      {debug && <DebugOffset offset={offset} />}
      {React.Children.map(children, (child, i) => {
        return React.cloneElement(child, {
          scrollamaId: `react-scrollama-${i}`,
          offset,
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
