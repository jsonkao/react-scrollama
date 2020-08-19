import React from 'react';
import useIntersectionObserver from './useIntersectionObserver';

const useRootMargin = offset => {
  return `${offset * 100}% 0px -${100 - offset * 100}% 0px`;
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
  } = props;
  const rootMargin = useRootMargin(offset);
  const [ref, entry] = useIntersectionObserver({
    rootMargin,
    threshold: 0,
  });
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  const handleScroll = () => {
    const { height, top } = entry.target.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight * offset - top) / height));

    onStepProgress &&
      onStepProgress({
        progress,
        scrollamaId,
        data,
        element: entry.target,
        entry,
      });
  };

  React.useEffect(() => {
    const scrollTop = document.documentElement.scrollTop;
    const direction = lastScrollTop < scrollTop ? 'down' : 'up';
    if (entry && !entry.isIntersecting && isIntersecting) {
      onStepExit({ element: entry.target, scrollamaId, data, entry, direction });
      setIsIntersecting(false);
      handleSetLastScrollTop(scrollTop)
    } else if (entry && entry.isIntersecting && !isIntersecting) {
      setIsIntersecting(true);
      onStepEnter({ element: entry.target, scrollamaId, data, entry, direction});
      handleSetLastScrollTop(scrollTop)
    }
    if (entry && entry.isIntersecting && onStepProgress) {
      document.addEventListener('scroll', handleScroll);
      return () => {
        document.removeEventListener('scroll', handleScroll);
      };
    }
  }, [entry, rootMargin]);

  return React.cloneElement(React.Children.only(children), {
    'data-react-scrollama-id': scrollamaId,
    ref,
    entry,
  });
};

Step.defaultProps = {
  onStepProgress: null,
  onStepEnter: () => {},
  onStepExit: () => {},
};

export default Step;
