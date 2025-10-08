import { useRef, useState, useCallback, useEffect, UIEvent } from 'react';

type UseVirtualListParams = {
  itemCount: number;
  itemHeight: number;
  height: number;
  overscan?: number;
  initialScrollOffset?: number;
};

export function useVirtualList({
  itemCount,
  itemHeight,
  height,
  overscan = 5,
  initialScrollOffset = 0,
}: UseVirtualListParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(initialScrollOffset);
  const visibleRangeRef = useRef({ start: 0, end: 0 });

  const totalHeight = itemCount * itemHeight;

  const onScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(itemCount - 1, Math.ceil((scrollTop + height) / itemHeight) + overscan);

  visibleRangeRef.current = { start: startIndex, end: endIndex };

  useEffect(() => {
    if (containerRef.current && initialScrollOffset > 0) {
      containerRef.current.scrollTop = initialScrollOffset;
    }
  }, [initialScrollOffset]);

  return {
    containerRef,
    onScroll,
    startIndex,
    endIndex,
    totalHeight,
    visibleRangeRef,
  };
}
