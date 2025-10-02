import clsx from 'clsx';
import { useRef, useState, UIEvent, useCallback, memo, useEffect, useMemo, CSSProperties, ReactNode } from 'react';

import s from './VirtualListVertical.module.scss';

type VirtualListVerticalProps = {
  className?: string;
  classNameInner?: string;
  itemCount: number;
  itemHeight: number;
  height: number;
  width?: string;
  overscan?: number;
  renderItem: (index: number, style: CSSProperties) => ReactNode;
  initialScrollOffset?: number;
};

const VirtualListVertical: React.FC<VirtualListVerticalProps> = ({
  className,
  classNameInner,
  itemCount,
  itemHeight,
  height,
  width = '100%',
  overscan = 2,
  renderItem,
  initialScrollOffset = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollTop = useRef(initialScrollOffset);
  const [scrollTop, setScrollTop] = useState(initialScrollOffset);
  const totalHeight = itemCount * itemHeight;

  const onScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const newScrollTop = target.scrollTop;

    prevScrollTop.current = newScrollTop;
    setScrollTop(newScrollTop);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(itemCount - 1, Math.ceil((scrollTop + height) / itemHeight) + overscan);

  const items = useMemo(() => {
    const items = [];

    for (let i = startIndex; i <= endIndex; i++) {
      items.push(
        <div
          key={i}
          data-index={i}
          className={s.item}
          style={{
            top: i * itemHeight,
            height: itemHeight,
            width: '100%',
          }}
        >
          {renderItem(i, {
            height: itemHeight,
            width: '100%',
          })}
        </div>,
      );
    }

    return items;
  }, [startIndex, endIndex, itemHeight, renderItem]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: initialScrollOffset,
      behavior: 'instant',
    });
  }, [initialScrollOffset]);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={clsx(s.root, className)}
      style={{
        height,
        width,
      }}
    >
      <div style={{ height: totalHeight }} className={clsx(s.root__inner, classNameInner)}>
        {items}
      </div>
    </div>
  );
};

export default memo(VirtualListVertical);
