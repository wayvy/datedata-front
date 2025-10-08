import { Text } from '@gravity-ui/uikit';
import { CalendarYear as CalendarYearModel, CalendarMonth as CalendarMonthModel } from '@repo/models';
import { ICalendarYear, YearID } from '@repo/types';
import { memo, useMemo } from 'react';

import CalendarMonth from './CalendarMonth';

import s from './CalendarYear.module.scss';

const MAX_YEARS_CACHE_SIZE = 100;
const MAX_MONTHS_CACHE_SIZE = MAX_YEARS_CACHE_SIZE * 12;

const yearModelCache = new Map<string, ICalendarYear>();
const monthModelCache = new Map<string, CalendarMonthModel>();

const getYearModel = (yearId: string): CalendarYearModel => {
  const existing = yearModelCache.get(yearId);

  if (existing) {
    return existing;
  }

  const model = new CalendarYearModel(yearId);

  yearModelCache.set(yearId, model);

  if (yearModelCache.size > MAX_YEARS_CACHE_SIZE) {
    const [oldestKey] = yearModelCache.keys();

    yearModelCache.delete(oldestKey);
  }

  return model;
};

const getMonthModel = (monthId: string): CalendarMonthModel => {
  const existing = monthModelCache.get(monthId);

  if (existing) {
    return existing;
  }

  const model = new CalendarMonthModel(monthId);

  monthModelCache.set(monthId, model);

  if (monthModelCache.size > MAX_MONTHS_CACHE_SIZE) {
    const [oldestKey] = monthModelCache.keys();

    monthModelCache.delete(oldestKey);
  }

  return model;
};

const CalendarYear: React.FC<{ yearId: YearID }> = ({ yearId }) => {
  const model = getYearModel(yearId);
  const monthsModels = useMemo(() => model.getMonthsKeys().map(getMonthModel), [model]);

  return (
    <div className={s.root}>
      <Text className={s.root__header} variant="header-2" color="complementary">
        {model.id}
      </Text>
      <div className={s.root__grid}>
        {monthsModels.map((monthModel) => (
          <CalendarMonth key={monthModel.id} monthModel={monthModel} />
        ))}
      </div>
    </div>
  );
};

export default memo(CalendarYear);
