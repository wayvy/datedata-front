import { CSSProperties, memo, ReactNode } from 'react';

import s from './VirtualListItem.module.scss';

type VirtualItemProps = {
  index: number;
  style: CSSProperties;
  itemHeight: number;
  renderItem: (index: number, style: CSSProperties) => ReactNode;
};

const VirtualListItem = ({ index, style, itemHeight, renderItem }: VirtualItemProps) => {
  return (
    <div data-index={index} className={s.root} style={style}>
      {renderItem(index, {
        height: itemHeight,
        width: '100%',
      })}
    </div>
  );
};

export default memo(VirtualListItem, (prev, next) => {
  return prev.index === next.index && prev.itemHeight === next.itemHeight;
});
