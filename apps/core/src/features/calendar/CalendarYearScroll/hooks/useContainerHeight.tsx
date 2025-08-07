import { debounce } from '@repo/utils/debounce';
import { useEffect, useState, useRef, useMemo } from 'react';

export const useContainerHeight = (debounceDelay = 100) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleResize = useMemo(
    () =>
      debounce((height: number) => {
        if (height > 0 && height !== containerHeight) {
          setContainerHeight(height);
        }
      }, debounceDelay),
    [debounceDelay, containerHeight],
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;

        handleResize(newHeight);
      }
    });

    resizeObserver.observe(containerRef.current);

    const initialHeight = containerRef.current.clientHeight;

    if (initialHeight > 0) {
      setContainerHeight(initialHeight);
    }

    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef, containerHeight };
};
