import { useEffect, useRef, useState } from 'react';

/* 
 * Thanks to Justin Travis Waith-Mair
 * https://medium.com/the-non-traditional-developer/how-to-use-an-intersectionobserver-in-a-react-hook-9fb061ac6cb5
 */

export default ({ root = null, rootMargin, threshold = 0, nodeRef }) => {
  const [entry, updateEntry] = useState({});
  const observer = useRef(null);
  useEffect(
    () => {
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(
        ([entry]) => updateEntry(entry),
        {
          root,
          rootMargin,
          threshold
        }
      );

      const { current: currentObserver } = observer;

      if (nodeRef) currentObserver.observe(nodeRef);

      return () => currentObserver.disconnect();
    },
    [nodeRef, root, rootMargin, threshold]
  );
  return [entry];
};
