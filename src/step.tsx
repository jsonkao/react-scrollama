import {
  Children,
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';

import { ScrollamaProvide } from './provide';
import type { ScrollamaCallbackData, StepProps } from './types';
import { getProgressRootMargin, getRootMargin, isBrowser, isHorizontal } from './utils';

export const Step: React.FC<StepProps> = ({ children, data }) => {
  const {
    handleSetLastScrollPosition = () => {},
    lastScrollPosition = 0,
    onStepEnter = () => {},
    onStepExit = () => {},
    onStepProgress = null,
    offset = 0.3,
    progressThreshold,
    containerSize = 0,
    rootRef,
    direction = 'horizontal',
  } = useContext(ScrollamaProvide);

  const [nodeSize, setNodeSize] = useState(0);
  const rootMargin = getRootMargin({ offset, direction });
  const { ref: inViewRef, entry } = useInView({
    root: rootRef?.current,
    rootMargin,
    threshold: 0,
  });

  const getScrollPosition = () => {
    if (!isBrowser) return 0;
    if (rootRef?.current) {
      return isHorizontal(direction) ? rootRef.current.scrollTop : rootRef.current.scrollLeft;
    }
    return isHorizontal(direction) ? window.scrollY : window.scrollX;
  };

  const getScrollDirection = () => {
    if (isHorizontal(direction)) {
      return lastScrollPosition > getScrollPosition() ? 'up' : 'down';
    }
    return lastScrollPosition > getScrollPosition() ? 'left' : 'right';
  };

  const ref = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const progressRootMargin = useMemo(
    () => getProgressRootMargin({ offset, nodeSize, containerSize, direction }),
    [offset, nodeSize, containerSize, direction],
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
      scrollProgressRef(node);
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
          direction: getScrollDirection(),
        });
      }
    }
  }, [scrollProgressEntry]);

  useEffect(() => {
    if (entry) {
      const currentIntersectionState = entry.isIntersecting;
      if (currentIntersectionState !== isIntersecting) {
        setIsIntersecting(currentIntersectionState);
        const eventData: ScrollamaCallbackData<unknown> = {
          element: entry.target,
          data,
          entry,
          direction: getScrollDirection(),
        };
        if (currentIntersectionState) {
          onStepEnter(eventData);
        } else {
          onStepExit(eventData);
        }
        handleSetLastScrollPosition(getScrollPosition());
      }
    }
  }, [entry]);

  useLayoutEffect(() => {
    if (ref.current) {
      setNodeSize(isHorizontal(direction) ? ref.current.offsetHeight : ref.current.offsetWidth);
    }
  }, [ref.current]);

  const childElement = Children.only(children);
  const extraProps = {
    ref: setRefs,
  };
  return cloneElement(childElement, extraProps);
};
