import clsx from 'clsx';
import { memo, CSSProperties, ReactNode } from 'react';

import { VirtualListItem } from './VirtualListItem';
import { useVirtualList } from './hooks/useVirtualList';

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
  const { containerRef, onScroll, startIndex, endIndex, totalHeight } = useVirtualList({
    itemCount,
    itemHeight,
    height,
    overscan,
    initialScrollOffset,
  });

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
      onScroll={onScroll}
      className={clsx(s.root, className)}
      style={{
        height,
        width,
        position: 'relative',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
        className={clsx(s.root__inner, classNameInner)}
      >
        {items}
      </div>
    </div>
  );
};

export default memo(VirtualListVertical);
