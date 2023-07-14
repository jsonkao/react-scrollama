import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const useRootMargin = offset => {
  return `-${offset * 100}% 0px -${100 - offset * 100}% 0px`;
}

const useProgressRootMargin = (direction, offset, node, innerHeight) => {
  if (!node.current) return '0px';
  const offsetHeight = (node.current.offsetHeight / innerHeight);
  if (direction === 'down') return `${(offsetHeight - offset) * 100}% 0px ${(offset * 100) - 100}% 0px`;
  return `-${offset * 100}% 0px ${(offsetHeight * 100) - (100 - (offset * 100))}% 0px`;
}

const Step = props => {
  const {
    children,
    data,
    handleSetLastScrollTop,
    lastScrollTop,
    onStepEnter = () => {},
    onStepExit = () => {},
    onStepProgress = null,
    offset,
    scrollamaId,
    progressThreshold,
    innerHeight,
  } = props;

  const isBrowser = typeof window !== "undefined";
  const scrollTop = isBrowser ? document.documentElement.scrollTop : 0;
  const direction = lastScrollTop < scrollTop ? 'down' : 'up';

  const rootMargin = useRootMargin(offset);

  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const {ref: inViewRef, entry} = useInView({
    rootMargin,
    threshold: 0,
  });

  const progressRootMargin = useMemo(
    () => useProgressRootMargin(direction, offset, ref, innerHeight),
    [direction, offset, ref, innerHeight]
  );

  const {ref: scrollProgressRef, entry: scrollProgressEntry} = useInView({
    rootMargin: progressRootMargin,
    threshold: progressThreshold,
  });

  const setRefs = useCallback(
    (node) => {
      ref.current = node;
      inViewRef(node);
      scrollProgressRef(node)
    },
    [inViewRef, scrollProgressRef],
  );


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
        direction,
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
    ref: setRefs,
    entry,
  });
};

export default Step;
