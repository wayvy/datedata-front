import { debounce } from '@repo/utils/debounce';
import { useEffect, useState, useRef } from 'react';

export const useContainerHeight = (debounceDelay = 100) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const debouncedSetHeight = debounce((height: number) => {
      setContainerHeight((prev) => {
        if (height > 0 && height !== prev) {
          return height;
        }

        return prev;
      });
    }, debounceDelay);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        debouncedSetHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(containerRef.current);

    const initialHeight = containerRef.current.clientHeight;

    if (initialHeight > 0) {
      setContainerHeight(initialHeight);
    }

    return () => {
      resizeObserver.disconnect();
      debouncedSetHeight.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef, containerHeight };
};
