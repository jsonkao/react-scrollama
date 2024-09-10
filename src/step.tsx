import { useState, useEffect, useMemo, useCallback, useRef, Children, cloneElement } from 'react';
import { useInView } from 'react-intersection-observer';

import { isBrowser, getRootMargin, getProgressRootMargin } from './utils';
import type { StepProps } from './types';

export const Step: React.FC<StepProps> = ({
  children,
  data,
  handleSetLastScrollTop = () => { },
  lastScrollTop = 0,
  onStepEnter = () => { },
  onStepExit = () => { },
  onStepProgress = null,
  offset = 0.3,
  scrollamaId = '',
  progressThreshold,
  innerHeight = 0,
}) => {
  const rootMargin = getRootMargin({ offset });
  const { ref: inViewRef, entry } = useInView({
    rootMargin,
    threshold: 0,
  });

  const scrollTop = isBrowser ? document.documentElement.scrollTop : 0;
  const direction = lastScrollTop > scrollTop ? 'up' : 'down';


  const ref = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const progressRootMargin = useMemo(
    () => getProgressRootMargin({ direction, offset, node: ref, innerHeight }),
    [direction, offset, ref, innerHeight]
  );

  const { ref: scrollProgressRef, entry: scrollProgressEntry } = useInView({
    rootMargin: progressRootMargin,
    threshold: progressThreshold,
  });

  const setRefs = useCallback(
    (node: HTMLElement) => {
      ref.current = node;
      inViewRef(node);
      scrollProgressRef(node)
    },
    [inViewRef, scrollProgressRef],
  );


  useEffect(() => {
    if (isIntersecting && scrollProgressEntry) {
      const { height, top } = scrollProgressEntry.target.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * offset - top) / height));
      if (onStepProgress) {
        onStepProgress({
          progress,
          scrollamaId,
          data,
          element: scrollProgressEntry.target,
          entry: scrollProgressEntry,
          direction,
        });
      }
    }
  }, [scrollProgressEntry]);

  useEffect(() => {
    if (entry && !entry.isIntersecting && isIntersecting) {
      setIsIntersecting(false);
      onStepExit({ element: entry.target, scrollamaId, data, entry, direction });
      handleSetLastScrollTop(scrollTop)
    } else if (entry && entry.isIntersecting && !isIntersecting) {
      setIsIntersecting(true);
      onStepEnter({ element: entry.target, scrollamaId, data, entry, direction });
      handleSetLastScrollTop(scrollTop)
    }
  }, [entry]);

  const childElement = Children.only(children);
  return cloneElement(childElement, {
    'data-react-scrollama-id': scrollamaId,
    ref: setRefs,
    entry,
  });
};


