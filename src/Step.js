import React, { useState, useMemo } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

const useRootMargin = offset => {
  return `-${offset * 100}% 0px -${100 - offset * 100}% 0px`;
}

const useProgressRootMargin = (direction, offset, node, innerHeight) => {
  if (!node) return '0px';
  const offsetHeight = (node.offsetHeight / innerHeight);
  if (direction === 'down') return `${(offsetHeight - offset) * 100}% 0px ${(offset * 100) - 100}% 0px`;
  return `-${offset * 100}% 0px ${(offsetHeight * 100) - (100 - (offset * 100))}% 0px`;
}

const Step = props => {
  const {
    children,
    data,
    handleSetLastScrollTop,
    lastScrollTop,
    onStepEnter,
    onStepExit,
    onStepProgress,
    offset,
    scrollamaId,
    progressThreshold,
    innerHeight,
  } = props;

  const scrollTop = document.documentElement.scrollTop;
  const direction = lastScrollTop < scrollTop ? 'down' : 'up';

  const rootMargin = useRootMargin(offset);

  const [node, setNode] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const [entry] = useIntersectionObserver({
    rootMargin,
    threshold: 0,
    nodeRef: node,
  });

  const progressRootMargin = useMemo(
    () => useProgressRootMargin(direction, offset, node, innerHeight),
    [direction, offset, node, innerHeight]
  );

  const [scrollProgressEntry] = useIntersectionObserver({
    rootMargin: progressRootMargin,
    threshold: progressThreshold,
    nodeRef: node,
  });


  React.useEffect(() => {
    if (isIntersecting) {
      const { height, top } = scrollProgressEntry.target.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * offset - top) / height));
      onStepProgress &&
      onStepProgress({
        progress,
        scrollamaId,
        data,
        element: scrollProgressEntry.target,
        entry: scrollProgressEntry,
      });
    }
  }, [scrollProgressEntry]);

  React.useEffect(() => {
    if (entry && !entry.isIntersecting && isIntersecting) {
      onStepExit({ element: entry.target, scrollamaId, data, entry, direction });
      setIsIntersecting(false);
      handleSetLastScrollTop(scrollTop)
    } else if (entry && entry.isIntersecting && !isIntersecting) {
      setIsIntersecting(true);
      onStepEnter({ element: entry.target, scrollamaId, data, entry, direction});
      handleSetLastScrollTop(scrollTop)
    }
  }, [entry]);

  return React.cloneElement(React.Children.only(children), {
    'data-react-scrollama-id': scrollamaId,
    ref: setNode,
    entry,
  });
};

Step.defaultProps = {
  onStepProgress: null,
  onStepEnter: () => {},
  onStepExit: () => {},
};

export default Step;
