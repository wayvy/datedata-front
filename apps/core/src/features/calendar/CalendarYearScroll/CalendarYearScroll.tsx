import { VirtualListVertical } from '@repo/ui';
import { yearID } from '@repo/utils/calendar';
import React, { CSSProperties, useCallback } from 'react';
import { Temporal } from 'temporal-polyfill';

import CalendarYear from './CalendarYear';
import { useContainerHeight } from './hooks/useContainerHeight';

import s from './CalendarYearScroll.module.scss';

const NOW = Temporal.Now.plainDateTimeISO();
const START_YEAR = NOW.year;
const TOTAL_YEARS = 500;
const MIDDLE_INDEX = Math.floor(TOTAL_YEARS / 2);

const getYearFromIndex = (index: number) => {
  return START_YEAR + (index - MIDDLE_INDEX);
};

const CalendarYearScroll: React.FC = () => {
  const { containerRef, containerHeight } = useContainerHeight();

  const renderItem = useCallback((index: number, style: CSSProperties) => {
    return (
      <div style={style} data-index={index}>
        <CalendarYear yearId={yearID(getYearFromIndex(index))} />
      </div>
    );
  }, []);

  return (
    <div ref={containerRef} className={s.root}>
      {containerHeight > 0 && (
        <VirtualListVertical
          itemCount={TOTAL_YEARS}
          itemHeight={containerHeight}
          height={containerHeight}
          initialScrollOffset={MIDDLE_INDEX * containerHeight}
          classNameInner={s.root__inner}
          renderItem={renderItem}
        />
      )}
    </div>
  );
};

export default CalendarYearScroll;
