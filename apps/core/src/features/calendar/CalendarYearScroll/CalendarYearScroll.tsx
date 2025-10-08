import { CalendarYear as CalendarYearModel } from '@repo/models';
import { VirtualListVertical } from '@repo/ui';
import { yearID } from '@repo/utils/calendar';
import React, { CSSProperties, memo, useCallback, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';

import CalendarYear from './CalendarYear';
import { useContainerHeight } from './hooks/useContainerHeight';

import s from './CalendarYearScroll.module.scss';

const TOTAL_YEARS = 500;
const MIDDLE_INDEX = Math.floor(TOTAL_YEARS / 2);

const CalendarYearScroll: React.FC = () => {
  const { containerRef, containerHeight } = useContainerHeight();

  const startYear = useMemo(() => Temporal.Now.plainDateTimeISO().year, []);

  const yearModelCache = useMemo(() => new Map<number, CalendarYearModel>(), []);

  const getYearFromIndex = useCallback((index: number) => startYear + (index - MIDDLE_INDEX), [startYear]);

  const getYearModel = useCallback(
    (year: number) => {
      if (!yearModelCache.has(year)) {
        const model = new CalendarYearModel(yearID(year));

        yearModelCache.set(year, model);
      }

      return yearModelCache.get(year)!;
    },
    [yearModelCache],
  );

  const renderItem = useCallback(
    (index: number, style: CSSProperties) => {
      const year = getYearFromIndex(index);
      const model = getYearModel(year);

      return (
        <div style={style} data-index={index}>
          <CalendarYear model={model} />
        </div>
      );
    },
    [getYearFromIndex, getYearModel],
  );

  return (
    <div ref={containerRef} className={s.root}>
      {containerHeight > 0 && (
        <VirtualListVertical
          itemCount={TOTAL_YEARS}
          itemHeight={containerHeight}
          height={containerHeight}
          overscan={3}
          initialScrollOffset={MIDDLE_INDEX * containerHeight}
          classNameInner={s.root__inner}
          renderItem={renderItem}
        />
      )}
    </div>
  );
};

export default memo(CalendarYearScroll);
