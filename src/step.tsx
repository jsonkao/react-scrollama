import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Children,
  cloneElement,
  useContext,
  useLayoutEffect,
} from 'react';
import { useInView } from 'react-intersection-observer';

import { isBrowser, getRootMargin, getProgressRootMargin } from './utils';
import type { StepProps, ScrollamaCallbackData } from './types';
import { ScrollamaProvide } from './provide';

export const Step: React.FC<StepProps> = ({
  children,
  data,
}) => {
  const {
    handleSetLastScrollTop = () => { },
    lastScrollTop = 0,
    onStepEnter = () => { },
    onStepExit = () => { },
    onStepProgress = null,
    offset = 0.3,
    progressThreshold,
    innerHeight = 0,
    rootRef
  } = useContext(ScrollamaProvide);

  const [nodeOffsetHeight, setNodeOffsetHeight] = useState(0);
  const rootMargin = getRootMargin({ offset });
  const { ref: inViewRef, entry } = useInView({
    root: rootRef?.current,
    rootMargin,
    threshold: 0,
  });

  const scrollTop = isBrowser ? document.documentElement.scrollTop : 0;
  const direction = lastScrollTop > scrollTop ? 'up' : 'down';


  const ref = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);


  const progressRootMargin = useMemo(
    () => getProgressRootMargin({ offset, nodeOffsetHeight, innerHeight }),
    [offset, nodeOffsetHeight, innerHeight]
  );

  const { ref: scrollProgressRef, entry: scrollProgressEntry } = useInView({
    root: rootRef?.current,
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
      const progress = scrollProgressEntry.intersectionRatio;
      if (onStepProgress) {
        onStepProgress({
          progress: progress,
          data,
          element: scrollProgressEntry.target,
          entry: scrollProgressEntry,
          direction,
        });
      }
    }
  }, [scrollProgressEntry]);

  useEffect(() => {
    if (entry) {
      const currentIntersectionState = entry.isIntersecting;
      if (currentIntersectionState !== isIntersecting) {
        setIsIntersecting(currentIntersectionState);
        const eventData: ScrollamaCallbackData<unknown> = { element: entry.target, data, entry, direction };
        if (currentIntersectionState) {
          onStepEnter(eventData);
        } else {
          onStepExit(eventData);
        }
        handleSetLastScrollTop(scrollTop);
      }
    }
  }, [entry]);

  useLayoutEffect(() => {
    if (ref.current) {
      setNodeOffsetHeight(ref.current.offsetHeight);
    }
  }, [ref.current]);

  const childElement = Children.only(children);
  return cloneElement(childElement, { ref: setRefs });
};


