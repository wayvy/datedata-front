import clsx from 'clsx';
import { memo, CSSProperties, ReactNode, useCallback, useRef, useState, useEffect } from 'react';

import { VirtualListItem } from './VirtualListItem';

import s from './VirtualListVertical.module.scss';

type VirtualListVerticalProps = {
  className?: string;
  classNameInner?: string;
  itemCount: number;
  itemHeight: number;
  height: number;
  width?: string;
  overscan: number;
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
  overscan,
  renderItem,
  initialScrollOffset = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(initialScrollOffset);
  const ticking = useRef(false);

  const totalHeight = itemCount * itemHeight;

  const handleScroll = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const scroll = containerRef.current.scrollTop;

    if (!ticking.current) {
      requestAnimationFrame(() => {
        setScrollTop(scroll);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(itemCount - 1, Math.ceil((scrollTop + height) / itemHeight) + overscan);

  useEffect(() => {
    if (containerRef.current && initialScrollOffset > 0) {
      containerRef.current.scrollTop = initialScrollOffset;
    }
  }, [initialScrollOffset]);

  const items = [];

  for (let i = startIndex; i <= endIndex; i++) {
    const style: CSSProperties = {
      height: itemHeight,
      width: '100%',
      position: 'absolute',
      top: i * itemHeight,
      left: 0,
    };

    items.push(<VirtualListItem key={i} index={i} style={style} itemHeight={itemHeight} renderItem={renderItem} />);
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={clsx(s.root, className)}
      style={{ height, width, position: 'relative', overflow: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }} className={clsx(s.root__inner, classNameInner)}>
        {items}
      </div>
    </div>
  );
};

export default memo(VirtualListVertical);
