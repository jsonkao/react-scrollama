import { useEffect, useRef, useState } from 'react';

/* 
 * Thanks to Justin Travis Waith-Mair
 * https://medium.com/the-non-traditional-developer/how-to-use-an-intersectionobserver-in-a-react-hook-9fb061ac6cb5
 */

export default ({ root = null, rootMargin, threshold = 0 }) => {
  const [entry, updateEntry] = useState({});
  const [node, setNode] = useState(null);
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

      if (node) currentObserver.observe(node);

      return () => currentObserver.disconnect();
    },
    [node, root, rootMargin, threshold]
  );
  return [setNode, entry];
};
